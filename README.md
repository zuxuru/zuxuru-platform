# Zuxuru Platform

Zuxuru Platform is a Vite/React frontend with a Bun/Hono API server and a
Prisma-backed data layer. The repository also contains the Fukulisane product
vision in [`docs/FUKULISANE_VISION.md`](docs/FUKULISANE_VISION.md).

## Current checkout status

This checkout is an incomplete application skeleton, not a runnable end-to-end
app. The tracked files currently omit `src/App.tsx` and
`src/ShogoErrorBoundary.tsx`, which `src/main.tsx` imports; they also omit
`prisma/schema.prisma`, `custom-routes.ts`, and the generated `src/generated`
module used by `server.tsx` and `src/lib/db.ts`. Restore or implement those
project files before expecting the app or server to build and run. The frontend
build also requires dependencies to be installed.

## Stack and layout

- `src/main.tsx` is the React entry point; `src/index.css` defines Tailwind
  styling and theme variables.
- `src/components/IntelligenceHub.tsx` provides the five-tab intelligence hub.
  Deep Scan and Market Intel currently render the same `FukulisaneOne`
  component.
- `src/lib/api.ts` contains fetch helpers and CRUD clients for the listed API
  resources. Requests use the `/api` prefix.
- `src/lib/db.ts` configures the Prisma client with the LibSQL adapter. The
  default database URL is `file:./dev.db`; set `DATABASE_URL` to use another
  database.
- `server.tsx` serves the Hono API, health and tools endpoints, and built
  frontend assets. It expects generated routes and custom routes as described
  above.
- `shogo.config.json` describes the generated route, hook, type, API-client,
  and server outputs.

## Commands

Install JavaScript dependencies with `npm install`. Bun is additionally
required for the server and the Shogo generation script.

```sh
npm run dev       # Vite development server on port 3000
npm run build     # Build frontend assets into dist/
npm run generate  # Generate Shogo outputs from prisma/schema.prisma
npm start         # Run server.tsx with Bun on port 3001 by default
```

Vite proxies `/api` requests to `http://localhost:3001`. Build the frontend
before starting the server so its static files are available in `dist/`.
Generation requires the Prisma schema and the Shogo SDK dependency.

## Server endpoints

- `GET /health` returns an `ok` flag and an ISO timestamp.
- `GET /api/tools/schemas` lists tool schemas.
- `POST /api/tools/execute` executes a tool request.
- Generated and custom application routes are mounted under `/api`.

The repository does not currently define test, lint, or type-check scripts in
`package.json`.
