import { Hono } from 'hono'
import type { Context } from 'hono'
import type {
  AICoach,
  ContentProject,
  Course,
  CustomerDashboard,
  Order,
  Product,
  SocialAccount,
  TrainerPackage,
  WhatsAppContact,
  Prisma,
  PrismaClient,
} from './src/generated/prisma/client'

type FieldType = 'string' | 'number' | 'boolean' | 'json'
type FieldRules = Record<string, { type: FieldType; nullable?: boolean }>
type CrudHandlers<T> = {
  list: (skip: number, take: number) => Promise<T[]>
  count: () => Promise<number>
  get: (id: string) => Promise<T | null>
  create: (data: Record<string, unknown>) => Promise<T>
  update: (id: string, data: Record<string, unknown>) => Promise<T>
  delete: (id: string) => Promise<unknown>
}

const customRoutes = new Hono()

customRoutes.get('/status', (c) =>
  c.json({
    ok: true,
    message: 'Custom API routes are ready.',
  }),
)

function parsePageValue(value: string | undefined, fallback: number, max?: number): number | null {
  if (value === undefined) return fallback
  if (!/^\d+$/.test(value)) return null

  const parsed = Number(value)
  if (!Number.isSafeInteger(parsed) || (max !== undefined && parsed > max)) return null
  return parsed
}

function parseData(body: unknown, fields: FieldRules, required: string[] = []): Record<string, unknown> | null {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return null

  const input = body as Record<string, unknown>
  const data: Record<string, unknown> = {}

  for (const key of Object.keys(input)) {
    const rule = fields[key]
    if (!rule) return null

    const value = input[key]
    if (value === null && rule.nullable) {
      data[key] = value
      continue
    }

    const valid =
      rule.type === 'string'
        ? typeof value === 'string'
        : rule.type === 'number'
          ? typeof value === 'number' && Number.isFinite(value)
          : rule.type === 'boolean'
            ? typeof value === 'boolean'
            : value !== undefined

    if (!valid) return null
    data[key] = value
  }

  if (required.some((key) => !(key in data))) return null
  return data
}

function prismaErrorCode(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null || !('code' in error)) return undefined
  return typeof error.code === 'string' ? error.code : undefined
}

function extractOpenAIOutputText(response: unknown): string | null {
  if (typeof response !== 'object' || response === null) return null

  if ('output_text' in response && typeof response.output_text === 'string') {
    return response.output_text
  }
  if (!('output' in response) || !Array.isArray(response.output)) return null

  const text: string[] = []
  for (const item of response.output) {
    if (typeof item !== 'object' || item === null || !('content' in item) || !Array.isArray(item.content)) continue
    for (const block of item.content) {
      if (
        typeof block === 'object' &&
        block !== null &&
        'type' in block &&
        block.type === 'output_text' &&
        'text' in block &&
        typeof block.text === 'string'
      ) {
        text.push(block.text)
      }
    }
  }
  return text.length > 0 ? text.join('\n') : null
}

function databaseError(c: Context, error: unknown) {
  const code = prismaErrorCode(error)
  if (code === 'P2025') return c.json({ error: 'Resource not found.' }, 404)
  if (code === 'P2002') return c.json({ error: 'A resource with these unique values already exists.' }, 409)
  if (['P2000', 'P2003', 'P2011', 'P2012', 'P2023'].includes(code ?? '')) {
    return c.json({ error: 'The resource data is invalid.' }, 400)
  }
  throw error
}

function registerCrudRoutes<T>(
  app: Hono,
  path: string,
  fields: FieldRules,
  requiredOnCreate: string[],
  handlers: CrudHandlers<T>,
) {
  app.get(path, async (c) => {
    const take = parsePageValue(c.req.query('limit'), 50, 100)
    const skip = parsePageValue(c.req.query('offset'), 0)
    if (take === null || skip === null) {
      return c.json({ error: 'limit must be 0-100 and offset must be a non-negative integer.' }, 400)
    }

    const [items, total] = await Promise.all([handlers.list(skip, take), handlers.count()])
    return c.json({ items, total })
  })

  app.get(`${path}/:id`, async (c) => {
    const item = await handlers.get(c.req.param('id'))
    if (!item) return c.json({ error: 'Resource not found.' }, 404)
    return c.json(item)
  })

  app.post(path, async (c) => {
    let body: unknown
    try {
      body = await c.req.json()
    } catch {
      return c.json({ error: 'Request body must be valid JSON.' }, 400)
    }

    const data = parseData(body, fields, requiredOnCreate)
    if (!data) return c.json({ error: 'Request body contains missing or invalid fields.' }, 400)

    try {
      return c.json(await handlers.create(data), 201)
    } catch (error) {
      return databaseError(c, error)
    }
  })

  app.patch(`${path}/:id`, async (c) => {
    let body: unknown
    try {
      body = await c.req.json()
    } catch {
      return c.json({ error: 'Request body must be valid JSON.' }, 400)
    }

    const data = parseData(body, fields)
    if (!data || Object.keys(data).length === 0) {
      return c.json({ error: 'Request body must contain valid fields to update.' }, 400)
    }

    try {
      return c.json(await handlers.update(c.req.param('id'), data))
    } catch (error) {
      return databaseError(c, error)
    }
  })

  app.delete(`${path}/:id`, async (c) => {
    try {
      await handlers.delete(c.req.param('id'))
      return c.body(null, 204)
    } catch (error) {
      return databaseError(c, error)
    }
  })
}

/**
 * Creates the custom API router, including the resource CRUD endpoints.
 *
 * @param prisma - Generated Prisma client used by the application data routes.
 * @returns Hono router mounted below `/api`.
 */
export function createCustomRoutes(prisma: PrismaClient) {
  const app = new Hono()
  app.route('/', customRoutes)

  app.post('/ai/chatgpt', async (c) => {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return c.json({ error: 'ChatGPT is not configured. Set OPENAI_API_KEY in the server environment.' }, 503)
    }

    let body: unknown
    try {
      body = await c.req.json()
    } catch {
      return c.json({ error: 'Request body must be valid JSON.' }, 400)
    }

    if (
      typeof body !== 'object' ||
      body === null ||
      Array.isArray(body) ||
      !('prompt' in body) ||
      typeof body.prompt !== 'string' ||
      body.prompt.trim().length === 0 ||
      body.prompt.length > 10_000
    ) {
      return c.json({ error: 'prompt must be a non-empty string of at most 10000 characters.' }, 400)
    }

    const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini'
    let response: Response
    try {
      response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          input: body.prompt.trim(),
          max_output_tokens: 1200,
          store: false,
        }),
        signal: AbortSignal.timeout(45_000),
      })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        return c.json({ error: 'ChatGPT did not respond before the request timed out.' }, 504)
      }
      console.error('Unable to reach the OpenAI API.', error)
      return c.json({ error: 'Unable to reach the OpenAI API.' }, 502)
    }

    if (!response.ok) {
      if (response.status === 429) return c.json({ error: 'OpenAI API rate limit or quota reached.' }, 429)
      if (response.status === 401) return c.json({ error: 'OpenAI API rejected the configured server key.' }, 503)
      console.error(`OpenAI API returned HTTP ${response.status}.`)
      return c.json({ error: 'The OpenAI API request failed.' }, 502)
    }

    let result: unknown
    try {
      result = await response.json()
    } catch {
      return c.json({ error: 'OpenAI API returned an invalid response.' }, 502)
    }

    const text = extractOpenAIOutputText(result)
    if (text === null) {
      return c.json({ error: 'OpenAI API response did not contain generated text.' }, 502)
    }

    return c.json({ text, model })
  })

  registerCrudRoutes<Product>(app, '/products', {
    name: { type: 'string' }, description: { type: 'string', nullable: true },
    price: { type: 'number' }, active: { type: 'boolean' },
  }, ['name'], {
    list: (skip, take) => prisma.product.findMany({ skip, take }),
    count: () => prisma.product.count(),
    get: (id) => prisma.product.findUnique({ where: { id } }),
    create: (data) => prisma.product.create({ data: data as Prisma.ProductUncheckedCreateInput }),
    update: (id, data) => prisma.product.update({ where: { id }, data: data as Prisma.ProductUncheckedUpdateInput }),
    delete: (id) => prisma.product.delete({ where: { id } }),
  })

  registerCrudRoutes<Order>(app, '/orders', {
    customerName: { type: 'string', nullable: true }, customerEmail: { type: 'string', nullable: true },
    status: { type: 'string' }, total: { type: 'number' },
  }, [], {
    list: (skip, take) => prisma.order.findMany({ skip, take }),
    count: () => prisma.order.count(),
    get: (id) => prisma.order.findUnique({ where: { id } }),
    create: (data) => prisma.order.create({ data: data as Prisma.OrderUncheckedCreateInput }),
    update: (id, data) => prisma.order.update({ where: { id }, data: data as Prisma.OrderUncheckedUpdateInput }),
    delete: (id) => prisma.order.delete({ where: { id } }),
  })

  registerCrudRoutes<AICoach>(app, '/aicoaches', {
    name: { type: 'string' }, description: { type: 'string', nullable: true }, active: { type: 'boolean' },
  }, ['name'], {
    list: (skip, take) => prisma.aICoach.findMany({ skip, take }),
    count: () => prisma.aICoach.count(),
    get: (id) => prisma.aICoach.findUnique({ where: { id } }),
    create: (data) => prisma.aICoach.create({ data: data as Prisma.AICoachUncheckedCreateInput }),
    update: (id, data) => prisma.aICoach.update({ where: { id }, data: data as Prisma.AICoachUncheckedUpdateInput }),
    delete: (id) => prisma.aICoach.delete({ where: { id } }),
  })

  registerCrudRoutes<TrainerPackage>(app, '/trainer-packages', {
    name: { type: 'string' }, description: { type: 'string', nullable: true }, price: { type: 'number' },
  }, ['name'], {
    list: (skip, take) => prisma.trainerPackage.findMany({ skip, take }),
    count: () => prisma.trainerPackage.count(),
    get: (id) => prisma.trainerPackage.findUnique({ where: { id } }),
    create: (data) => prisma.trainerPackage.create({ data: data as Prisma.TrainerPackageUncheckedCreateInput }),
    update: (id, data) => prisma.trainerPackage.update({ where: { id }, data: data as Prisma.TrainerPackageUncheckedUpdateInput }),
    delete: (id) => prisma.trainerPackage.delete({ where: { id } }),
  })

  registerCrudRoutes<ContentProject>(app, '/content-projects', {
    name: { type: 'string' }, description: { type: 'string', nullable: true }, status: { type: 'string' },
  }, ['name'], {
    list: (skip, take) => prisma.contentProject.findMany({ skip, take }),
    count: () => prisma.contentProject.count(),
    get: (id) => prisma.contentProject.findUnique({ where: { id } }),
    create: (data) => prisma.contentProject.create({ data: data as Prisma.ContentProjectUncheckedCreateInput }),
    update: (id, data) => prisma.contentProject.update({ where: { id }, data: data as Prisma.ContentProjectUncheckedUpdateInput }),
    delete: (id) => prisma.contentProject.delete({ where: { id } }),
  })

  registerCrudRoutes<Course>(app, '/courses', {
    name: { type: 'string' }, description: { type: 'string', nullable: true }, published: { type: 'boolean' },
  }, ['name'], {
    list: (skip, take) => prisma.course.findMany({ skip, take }),
    count: () => prisma.course.count(),
    get: (id) => prisma.course.findUnique({ where: { id } }),
    create: (data) => prisma.course.create({ data: data as Prisma.CourseUncheckedCreateInput }),
    update: (id, data) => prisma.course.update({ where: { id }, data: data as Prisma.CourseUncheckedUpdateInput }),
    delete: (id) => prisma.course.delete({ where: { id } }),
  })

  registerCrudRoutes<SocialAccount>(app, '/social-accounts', {
    platform: { type: 'string' }, handle: { type: 'string', nullable: true }, connected: { type: 'boolean' },
  }, ['platform'], {
    list: (skip, take) => prisma.socialAccount.findMany({ skip, take }),
    count: () => prisma.socialAccount.count(),
    get: (id) => prisma.socialAccount.findUnique({ where: { id } }),
    create: (data) => prisma.socialAccount.create({ data: data as Prisma.SocialAccountUncheckedCreateInput }),
    update: (id, data) => prisma.socialAccount.update({ where: { id }, data: data as Prisma.SocialAccountUncheckedUpdateInput }),
    delete: (id) => prisma.socialAccount.delete({ where: { id } }),
  })

  registerCrudRoutes<WhatsAppContact>(app, '/whats-app-contacts', {
    name: { type: 'string' }, phone: { type: 'string' },
  }, ['name', 'phone'], {
    list: (skip, take) => prisma.whatsAppContact.findMany({ skip, take }),
    count: () => prisma.whatsAppContact.count(),
    get: (id) => prisma.whatsAppContact.findUnique({ where: { id } }),
    create: (data) => prisma.whatsAppContact.create({ data: data as Prisma.WhatsAppContactUncheckedCreateInput }),
    update: (id, data) => prisma.whatsAppContact.update({ where: { id }, data: data as Prisma.WhatsAppContactUncheckedUpdateInput }),
    delete: (id) => prisma.whatsAppContact.delete({ where: { id } }),
  })

  registerCrudRoutes<CustomerDashboard>(app, '/customer-dashboards', {
    name: { type: 'string' }, data: { type: 'json' },
  }, ['name'], {
    list: (skip, take) => prisma.customerDashboard.findMany({ skip, take }),
    count: () => prisma.customerDashboard.count(),
    get: (id) => prisma.customerDashboard.findUnique({ where: { id } }),
    create: (data) => prisma.customerDashboard.create({ data: data as Prisma.CustomerDashboardUncheckedCreateInput }),
    update: (id, data) => prisma.customerDashboard.update({ where: { id }, data: data as Prisma.CustomerDashboardUncheckedUpdateInput }),
    delete: (id) => prisma.customerDashboard.delete({ where: { id } }),
  })

  return app
}

export default createCustomRoutes
