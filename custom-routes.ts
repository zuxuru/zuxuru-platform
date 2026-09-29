import { Hono } from 'hono'

const customRoutes = new Hono()

customRoutes.get('/status', (c) =>
  c.json({
    ok: true,
    message: 'Custom API routes are ready.',
  }),
)

export default customRoutes
