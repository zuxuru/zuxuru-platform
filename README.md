# Zuxuru Platform

Zuxuru Platform is a Vite/React frontend with a Bun/Hono API server and a
Prisma-backed data layer. The repository also contains the Fukulisane product
vision in [`docs/FUKULISANE_VISION.md`](docs/FUKULISANE_VISION.md).

## Current checkout status

The frontend entry point, application shell, error boundary, intelligence
panels, and custom Hono router are checked in. The business panels are initial
workspace screens; they explain which data connections are needed and do not
claim to return live business insights.

The Prisma schema and explicit Hono CRUD endpoints for the checked-in resource
clients are available. Generated Shogo route modules are not checked in, so
other routes described by `shogo.config.json` are only available after those
modules are generated. `npm run generate` runs the Shogo CLI's Prisma
generation workflow; this checkout has no project-level `scripts/generate.ts`
to generate the application routes.

The ChatGPT assistant uses the OpenAI Responses API through the local server.
Floot is not wired yet: its API documentation URL is needed to implement that
integration against the correct service.

## Stack and layout

- `src/main.tsx` is the React entry point; `src/index.css` defines Tailwind
  styling and theme variables.
- `src/components/IntelligenceHub.tsx` provides the five-tab intelligence hub.
  Deep Scan and Market Intel currently render the same `FukulisaneOne`
  component.
- `src/App.tsx` is the application shell. Its feature screens are in
  `src/components/`.
- `prisma/schema.prisma` defines the initial SQLite data models for the CRUD
  resources. `prisma.config.ts` supplies the local database URL.
- `src/lib/api.ts` contains fetch helpers and CRUD clients for the listed API
  resources. Requests use the `/api` prefix.
- `src/lib/db.ts` configures the Prisma client with the LibSQL adapter. The
  default database URL is `file:./dev.db`; set `DATABASE_URL` to use another
  database.
- `server.tsx` serves the Hono API, health and tools endpoints, and built
  frontend assets. It mounts generated routes when available.
- `custom-routes.ts` provides `GET /api/status` and CRUD routes for the
  resources exposed by `src/lib/api.ts`, plus the ChatGPT proxy endpoint.
- `shogo.config.json` describes the generated route, hook, type, API-client,
  and server outputs.

## Commands

Install JavaScript dependencies with `npm install`. Bun is additionally
required to run the server and the Shogo generation script.

```sh
npm run dev       # Vite development server on port 3000
npm run build     # Build frontend assets into dist/
npm run generate  # Run the Shogo CLI generation workflow (requires Bun)
npm run db:generate # Generate the Prisma client
npm run db:push     # Create/update the local database schema
npm start         # Run server.tsx with Bun on port 3001 by default
```

Vite proxies `/api` requests to `http://localhost:3001`. Build the frontend
before starting the server so its static files are available in `dist/`.
Run `npm run db:generate` and `npm run db:push` before starting the server to
prepare the local database. Generated Prisma client files are ignored by Git.
Copy `.env.example` to `.env`, then set `OPENAI_API_KEY` to enable the ChatGPT
assistant; `OPENAI_MODEL` defaults to `gpt-4.1-mini`. The API key must be an
OpenAI API key (ChatGPT subscriptions do not include API usage).
Both the Vite development server and Hono API server bind to loopback, since
this endpoint uses a server-held key and the repository has no user
authentication. Do not expose these local servers to untrusted networks.

## Server endpoints

- `GET /health` returns an `ok` flag and an ISO timestamp.
- `GET /api/status` confirms the custom API router is mounted.
- `POST /api/ai/chatgpt` sends a prompt to the OpenAI Responses API. Its JSON
  body is `{ "prompt": "..." }`; prompts are limited to 10000 characters and
  responses are not stored by the OpenAI API.
- `/api/products`, `/api/orders`, `/api/aicoaches`, `/api/trainer-packages`,
  `/api/content-projects`, `/api/courses`, `/api/social-accounts`,
  `/api/whats-app-contacts`, and `/api/customer-dashboards` support list
  (`GET`), read (`GET /:id`), create (`POST`), update (`PATCH /:id`), and
  delete (`DELETE /:id`) operations. List responses contain `items` and
  `total`; `limit` defaults to 50 and is capped at 100, and `offset` defaults
  to 0.
- `GET /api/tools/schemas` lists tool schemas.
- `POST /api/tools/execute` executes a tool request.
- Generated application routes, when produced, and custom routes are mounted
  under `/api`.

The repository does not currently define test, lint, or type-check scripts in
`package.json`.
