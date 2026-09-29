# Zuxuru Platform

Zuxuru Platform is a Vite/React frontend with a Bun/Hono API server and a
Prisma-backed data layer. The repository also contains the Fukulisane product
vision in [`docs/FUKULISANE_VISION.md`](docs/FUKULISANE_VISION.md).

## Current checkout status

The frontend entry point, application shell, error boundary, intelligence
panels, and custom Hono router are checked in. The business panels are initial
workspace screens; they explain which data connections are needed and do not
claim to return live business insights.

The Prisma schema is checked in, but generated Shogo route modules are not.
Consequently, the server can start without generated application routes, but
the resource CRUD clients do not have generated data endpoints until those
routes are implemented and generated. `npm run generate` runs the Shogo CLI's
Prisma generation workflow; this checkout has no project-level
`scripts/generate.ts` to generate the application routes.

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
  frontend assets. It expects generated routes and custom routes as described
  above.
- `custom-routes.ts` provides the custom API router and `GET /api/status`.
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

## Server endpoints

- `GET /health` returns an `ok` flag and an ISO timestamp.
- `GET /api/status` confirms the custom API router is mounted.
- `GET /api/tools/schemas` lists tool schemas.
- `POST /api/tools/execute` executes a tool request.
- Generated application routes, when produced, and custom routes are mounted
  under `/api`.

The repository does not currently define test, lint, or type-check scripts in
`package.json`.
