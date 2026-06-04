# rbac-boilerplate

[![npm version](https://img.shields.io/npm/v/rbac-boilerplate.svg)](https://www.npmjs.com/package/rbac-boilerplate)
[![npm downloads](https://img.shields.io/npm/dm/rbac-boilerplate.svg)](https://www.npmjs.com/package/rbac-boilerplate)
[![license](https://img.shields.io/npm/l/rbac-boilerplate.svg)](https://github.com/abdrahman02/rbac-boilerplate/blob/main/LICENSE)
[![Node](https://img.shields.io/node/v/rbac-boilerplate.svg)](https://nodejs.org)

> **RBAC boilerplate & starter kit** — scaffold a production-ready, full-stack **Role-Based Access Control** dashboard with one command.

`rbac-boilerplate` is a free, open-source **RBAC starter template** for building secure dashboard applications. It ships with authentication, user management, fine-grained `resource:action` permissions, role management, audit logging, and an admin UI — all wired together and ready to customize.

```bash
npx rbac-boilerplate my-dashboard
```

## Why rbac-boilerplate?

Setting up **Role-Based Access Control (RBAC)** from scratch — JWT auth, refresh-token rotation, permission checks, an admin dashboard, and audit logging — takes days. This boilerplate gives you all of it in one command, with TypeScript end-to-end and 280+ tests already passing.

- ✅ **Authentication & authorization** out of the box (JWT in httpOnly cookies, auto-refresh)
- ✅ **Fine-grained permissions** in `resource:action` format (e.g. `users:read`, `roles:update`)
- ✅ **Users, Roles & Permissions CRUD** with a ready-made admin dashboard
- ✅ **Audit logging** and real-time notifications (SSE)
- ✅ **Production-ready** layered architecture (routes → controllers → services → repositories)

## Quick Start

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

npm run dev:backend   # http://localhost:3001  (Swagger at /api/docs)
npm run dev:frontend  # http://localhost:3000
```

## Tech Stack

| Layer    | Technology                                        |
|----------|---------------------------------------------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Backend  | Node.js, Express.js 5, TypeScript                 |
| Database | MySQL 8+, Prisma ORM                              |
| Auth     | JWT (httpOnly cookies, auto-refresh)              |
| Testing  | Vitest (280+ tests)                               |

## Features

- **Auth flows** — register, login, logout, forgot/reset password, email verification
- **RBAC core** — fine-grained `resource:action` permissions embedded in the JWT
- **Admin dashboard** — User, Role, and Permission management UI
- **Audit logging** — track every sensitive action
- **Real-time notifications** — Server-Sent Events (SSE)

## Prerequisites

- Node.js 20+
- MySQL 8+
- npm 10+

## Documentation

Full documentation ships inside your scaffolded project:

- `docs/SETUP.md` — Step-by-step setup with troubleshooting
- `docs/API.md` — All API endpoints with request/response examples
- `docs/INTEGRATION.md` — How to add features and extend the boilerplate
- `docs/ARCHITECTURE.md` — System design, data flow, folder structure

## Keywords

RBAC, RBAC boilerplate, role-based access control, authentication, authorization, permissions, ACL, access control, admin dashboard, full-stack starter kit, Express.js, Next.js, React, Node.js, TypeScript, Prisma, MySQL, JWT.

## License

[MIT](https://github.com/abdrahman02/rbac-boilerplate/blob/main/LICENSE) © M. Abdul Rahman
