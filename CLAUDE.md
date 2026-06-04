# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This repo is **two things at once**:

1. A working **RBAC dashboard application** — `backend/` (Express 5 + Prisma + MySQL) and `frontend/` (Next.js 16 App Router) — that runs locally.
2. The **`rbac-boilerplate` npm package** (`packages/cli/`) that scaffolds that application into a new project via `npx rbac-boilerplate <name>`. The CLI bundles `backend/`, `frontend/`, and `docs/` as templates at publish time.

So `backend/` and `frontend/` are *both* the live app *and* the source for the published templates. A change to the app is also a change to what end users scaffold.

## Repository layout

```
rbac-boilerplate/
├── backend/                    # Express 5 API (ESM, "type": "module")
│   ├── prisma/                 # schema.prisma + migrations/
│   ├── seeders/                # seed.ts (permissions + roles)
│   ├── scripts/                # create-admin.ts (interactive)
│   └── src/
│       ├── config/             # env.ts (Zod, fail-fast), swagger.ts
│       ├── routes/             # Express routers + Swagger JSDoc
│       ├── controllers/        # request parse + response shaping
│       ├── services/           # business logic, throws typed errors
│       ├── repositories/       # Prisma queries only
│       ├── middleware/         # auth, permission, validate, audit-log, rate-limit
│       ├── schemas/            # Zod request schemas
│       ├── lib/                # prisma.ts, http-response.ts, handle-error.ts, exporters/
│       ├── generated/prisma/   # generated client (gitignored) — import from here
│       ├── constants/  types/  utils/
│       ├── app.ts              # express app factory (mounts /api/* routers)
│       └── index.ts            # bootstrap / listen
│
├── frontend/                   # Next.js 16 App Router
│   └── src/
│       ├── app/
│       │   ├── (auth)/         # login, register, forgot/reset-password, verify-email[-sent]
│       │   └── (dashboard)/    # dashboard, users, roles, permissions, audit-logs, notifications, profile
│       ├── features/<domain>/  # auth, users, roles, permissions, audit-logs, dashboard, notifications, profile
│       │                       #   each: components/ hooks/ types.ts *.schema.ts <Name>Page.tsx index.ts
│       └── shared/             # components/{common,guard,layout,ui}, hooks, lib, providers, stores, types
│
├── packages/cli/               # the published `rbac-boilerplate` npm package
│   ├── bin/rbac-boilerplate.js # executable entry (the `npx` target)
│   ├── src/                    # index, prompts, scaffold, post-install
│   ├── scripts/copy-templates.js  # publish-time: builds templates/ from ../../{backend,frontend,docs}
│   ├── templates/              # generated, gitignored — bundled into the package
│   └── dist/                   # tsc output, gitignored
│
└── docs/                       # SETUP, API, INTEGRATION, ARCHITECTURE (shipped into scaffolds)
```

Backend and frontend mirror each other by **layer vs. feature**: the backend is split by technical layer (`routes → controllers → services → repositories`), the frontend by domain (`features/<name>/` with co-located components, hooks, schemas).

## Commands

All commands run from the repo root (npm workspaces). The root package is `rbac-boilerplate-root` (private); the publishable package is `packages/cli` (`name: rbac-boilerplate`).

```bash
# Dev servers (two terminals)
npm run dev:backend          # tsx watch → http://localhost:3001 (Swagger at /api/docs)
npm run dev:frontend         # next dev --turbopack → http://localhost:3000

# Database (Prisma) — prisma:generate is REQUIRED before seed/run and after any schema change
npm run prisma:generate
npm run migrate              # prisma migrate deploy
npm run migrate:dev          # create + apply a new migration
npm run migrate:reset
npm run seed                 # 14 permissions + 2 roles (admin gets all, user gets none)
npm run create-admin         # interactive admin creation

# Tests / types / lint (each delegates to both workspaces)
npm test                     # vitest run in backend + frontend
npm run typecheck            # tsc --noEmit in both
npm run lint                 # biome lint in both
```

Single test / targeted runs (run inside the workspace, not root):

```bash
npm test --workspace=backend -- src/services/__tests__/auth.service.test.ts
npm test --workspace=frontend -- -t "renders login form"
npm run test:watch --workspace=backend
npm run coverage --workspace=backend
```

Formatting/linting is **Biome** (not ESLint/Prettier). Lint scripts are scoped to `--diagnostic-level=error`; `*:fix` variants write changes. There is no root `format` script — use `--workspace=backend|frontend`.

## CLI package (`packages/cli`)

```bash
npm run build --workspace=packages/cli          # tsc → dist/
npm test --workspace=packages/cli               # scaffold + prompts tests
node packages/cli/scripts/copy-templates.js     # regenerate templates/ from backend|frontend|docs
```

- `templates/` and `dist/` are gitignored; they are regenerated by `prepack` (`build && copy-templates.js`) on `npm publish`.
- **Bump `packages/cli/package.json` version before publishing** — npm rejects republishing the same version. Publish: `npm publish --workspace=packages/cli --access public --otp=XXXXXX` (the npm account uses 2FA).
- `copy-templates.js` (publish-time) and `scaffold.ts` (install-time) share the same exclusion list: `node_modules`, `.next`, `dist`, `generated`, `coverage`, `.git`, `.claude`, `superpowers`, and `.env*` (but **not** `.env.example`). Exclusions are matched by **path segment relative to the source root** — never by absolute-path substring, because at `npx` time the package lives under `node_modules/` and a substring match would exclude everything. Preserve this when editing either file.

## Backend architecture

Strict layered flow, one direction only:

```
routes/ → controllers/ → services/ → repositories/ → Prisma (lib/prisma.ts)
```

- **routes/** compose middleware per endpoint: `authMiddleware` → `requirePermission(...)` → `validate(zodSchema)` → controller → `auditLog(action, resourceType)`. Swagger JSDoc lives in route files.
- **controllers/** parse the request, call a service, and format the response via `lib/http-response.ts`. Errors go through `lib/handle-error.ts` (a centralized code→message/status map) — don't hand-roll error responses.
- **services/** hold business logic and throw typed errors (e.g. `throw new Error("NOT_FOUND")`); **repositories/** are Prisma queries only, no business logic.
- All responses use the `ApiResponse<T>` envelope: `{ success, message, data }`.

### Auth & RBAC model

- JWT access token (15m) + refresh token (7d), both in **httpOnly cookies** (`access_token`, `refresh_token`). Refresh tokens are hashed in the DB and **rotated** on every refresh.
- **Permissions are embedded in the access-token JWT payload** (`{ userId, email, roles, permissions }`). `authMiddleware` decodes the token and attaches `req.user`; `requirePermission` checks `req.user.permissions` with **no DB query per request**. Consequence: permission changes only take effect after the access token expires and the client refreshes (~15m).
- `requirePermission(perm | perm[])` grants access if the user has **at least one** of the listed permissions.
- Permissions use `resource:action` format (e.g. `users:read`, `roles:update`).

### Prisma specifics (important, non-obvious)

- The client is generated to **`backend/src/generated/prisma/`** (not `node_modules`). Import from `../generated/prisma/index.js`, not `@prisma/client`. This is an ESM/Node-compat workaround; `src/generated/` is gitignored, so `npm run prisma:generate` is mandatory after install or schema changes.
- Uses the **driver adapter** `@prisma/adapter-mariadb` (`lib/prisma.ts`) with `allowPublicKeyRetrieval: true` for MySQL 8/9 auth. The datasource URL is built in `prisma.config.ts` from `DB_*` env vars (the schema's `datasource` block has no `url`).
- `config/env.ts` validates all env vars with Zod at startup and **exits the process** if any are missing/invalid. `JWT_*_SECRET` must be ≥32 chars; SMTP vars are required.

## Frontend architecture

Next.js App Router with route groups: `app/(auth)/` (no nav shell) and `app/(dashboard)/` (nav + `ProtectedRoute`).

- **Feature-first**: each domain lives under `features/<name>/` with co-located `components/`, `hooks/`, `types.ts`, schemas, and a `*Page.tsx`. Components are folders with `Component.tsx`, `Component.variants.ts` (tailwind-variants), `index.ts` barrel, and optional `.test.tsx`. Cross-feature primitives live in `shared/`.
- **Auth state**: Zustand store (`shared/stores/authStore.ts`) persisted to `localStorage` under key `rbac-auth`. Permission checks read from it via `usePermission` / `<PermissionGate>`; route protection via `<ProtectedRoute requiredPermission="...">`.
- **API layer**: `shared/lib/api-client.ts` is an axios instance with `withCredentials: true` and a response interceptor that, on 401, calls `/auth/refresh` once and replays queued requests (a single-flight refresh queue). It skips refresh for `/auth/login|register|refresh`. `baseURL` comes from `NEXT_PUBLIC_API_URL` (must include `/api`) and has **no fallback** — `frontend/.env.local` is required.
- Data fetching uses **TanStack Query**; forms use **react-hook-form + Zod**; styling is **Tailwind v4 + tailwind-variants** (no plain CSS); toasts via **sonner**.

## Environment files

- `backend/.env` (from `backend/.env.example`) — DB, JWT secrets, SMTP.
- `frontend/.env.local` (from `frontend/.env.example`) — `NEXT_PUBLIC_API_URL`.
- There is **no root `.env.example`**; `copy-templates.js` warns and skips it — expected.

## Conventions

- Commit format: `type(scope): subject` (conventional commits — `feat`, `fix`, `chore`, `docs`, `refactor`, `style`, `test`), imperative, ≤50 chars.
