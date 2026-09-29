// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Shogo Technologies, Inc.
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { createCustomRoutes } from './custom-routes'
import { createToolsHandlers } from '@shogo-ai/sdk/tools/server'

const app = new Hono()

app.use('*', async (c, next) => {
  c.res.headers.set('Access-Control-Allow-Origin', '*')
  c.res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (c.req.method === 'OPTIONS') return c.text('', 204)
  await next()
})

app.get('/health', (c) => c.json({ ok: true, timestamp: new Date().toISOString() }))

const { prisma } = await import('./src/lib/db')
try {
  const { createAllRoutes } = await import('./src/generated')
  app.route('/api', createAllRoutes(prisma))
} catch (error) {
  console.warn('Generated API routes are unavailable; serving custom routes only.', error)
}

app.route('/api', createCustomRoutes(prisma))

const tools = createToolsHandlers({})
app.post('/api/tools/execute', (c) => tools.execute(c.req.raw))
app.get('/api/tools/schemas', (c) => tools.list(c.req.raw))

app.use('/*', serveStatic({ root: './dist' }))
app.get('*', serveStatic({ path: './dist/index.html' }))

const port = Number(process.env.PORT) || 3001
console.log(`Server running on http://localhost:${port}`)
Bun.serve({ port, fetch: app.fetch })
