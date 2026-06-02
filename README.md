# RBAC Boilerplate

A production-ready Role-Based Access Control starter template for building
dashboard applications. Ships with authentication, user management, fine-grained
permissions, audit logging, and an admin UI — ready to clone and customize.

![Tests](https://img.shields.io/badge/tests-274%20passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Authentication** — Register, login, logout, forgot/reset password, email verification
- **JWT Tokens** — Access token (15 min) + refresh token (7 days) stored in httpOnly cookies
- **RBAC** — Fine-grained `resource:action` permissions (e.g. `users:read`, `roles:update`)
- **User Management** — CRUD users, assign multiple roles, soft delete
- **Role Management** — CRUD roles, assign permissions
- **Permission Management** — CRUD permissions in `resource:action` format
- **Audit Logging** — Every key action is logged with user, IP, and timestamp
- **Admin Dashboard** — Full management UI for users, roles, permissions, and audit logs
- **Notifications** — Real-time notifications via Server-Sent Events (SSE)

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Backend  | Node.js, Express.js 5, TypeScript       |
| Database | MySQL 8+, Prisma ORM                    |
| Auth     | JWT (jsonwebtoken), bcryptjs            |
| Testing  | Vitest (274 tests)                      |

## Quick Start

**Prerequisites:** Node.js 20+, MySQL 8+, npm

```bash
npx create-rbac-app my-dashboard
cd my-dashboard
```

### Setup

```bash
# 1. Configure environment
cp backend/.env.example backend/.env
# Open backend/.env and fill in: DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET

# 2. Install dependencies, migrate database, seed defaults, create admin
npm install
npm run migrate
npm run seed
npm run create-admin

# 3. Start development servers
npm run dev:backend   # http://localhost:3001
npm run dev:frontend  # http://localhost:3000
```

Login at `http://localhost:3000/login` with the admin credentials you just created.

## Documentation

| Doc | Description |
|-----|-------------|
| [SETUP.md](docs/SETUP.md) | Step-by-step local setup with troubleshooting |
| [API.md](docs/API.md) | All API endpoints with request/response examples |
| [INTEGRATION.md](docs/INTEGRATION.md) | How to add features, protect routes, extend schema |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, data flow, folder structure |

Interactive API docs available at `http://localhost:3001/api/docs` (Swagger UI) once the backend is running.

## Project Structure

```
rbac-boilerplate/
├── backend/          # Express.js API (TypeScript)
│   ├── src/
│   │   ├── controllers/   # HTTP layer
│   │   ├── services/      # Business logic
│   │   ├── repositories/  # Database queries (Prisma)
│   │   ├── middleware/    # Auth, permission, rate-limit, audit-log
│   │   ├── routes/        # Route definitions + Swagger JSDoc
│   │   └── schemas/       # Zod validation schemas
│   ├── prisma/            # Schema + migrations
│   └── seeders/           # Default roles + permissions
└── frontend/         # Next.js app (TypeScript)
    └── src/
        ├── app/           # Pages (Next.js App Router)
        ├── features/      # Feature modules (auth, users, roles, etc.)
        └── shared/        # Hooks, components, types, utils
```

## Default Roles & Permissions

After running `npm run seed`, the database contains:

**Roles:** `admin`, `user`

**Permissions (14):**
`users:read`, `users:create`, `users:update`, `users:delete`,
`roles:read`, `roles:create`, `roles:update`, `roles:delete`,
`permissions:read`, `permissions:create`, `permissions:update`, `permissions:delete`,
`audit_logs:read`, `notifications:create`

The `admin` role has all 14 permissions. The `user` role has no permissions by default.

## License

MIT
