# rbac-boilerplate

A production-ready Role-Based Access Control starter template for dashboard applications. Ships with authentication, user management, fine-grained permissions, audit logging, and an admin UI — ready to customize.

## Usage

```bash
npx rbac-boilerplate my-dashboard
cd my-dashboard
```

Then follow the setup steps:

```bash
cp backend/.env.example backend/.env
# Fill in: DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET

npm install
npm run migrate
npm run seed
npm run create-admin

npm run dev:backend   # http://localhost:3001
npm run dev:frontend  # http://localhost:3000
```

## What's Included

| Layer    | Technology                                        |
|----------|---------------------------------------------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Backend  | Node.js, Express.js 5, TypeScript                 |
| Database | MySQL 8+, Prisma ORM                              |
| Auth     | JWT (httpOnly cookies, auto-refresh)              |
| Testing  | Vitest (280+ tests)                               |

**Features:**
- Register, login, logout, forgot/reset password, email verification
- Fine-grained `resource:action` permissions (e.g. `users:read`, `roles:update`)
- User, Role, Permission CRUD with admin dashboard
- Audit logging and real-time notifications (SSE)

## Prerequisites

- Node.js 20+
- MySQL 8+
- npm 10+

## Documentation

Full documentation is available after scaffolding inside your project:

- `docs/SETUP.md` — Step-by-step setup with troubleshooting
- `docs/API.md` — All API endpoints with request/response examples
- `docs/INTEGRATION.md` — How to add features and extend the boilerplate
- `docs/ARCHITECTURE.md` — System design, data flow, folder structure

## License

MIT
