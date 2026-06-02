# Setup Guide

Step-by-step instructions for running RBAC Boilerplate locally.

## Prerequisites

| Requirement | Version | Check |
|-------------|---------|-------|
| Node.js | 20+ | `node --version` |
| npm | 10+ | `npm --version` |
| MySQL | 8+ | `mysql --version` |

## 1. Create the Project

```bash
npx rbac-boilerplate my-dashboard
cd my-dashboard
```

## 2. Configure Environment

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and set these required values:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=rbac_db
DB_USER=rbac_user
DB_PASSWORD=rbac_password

# JWT Secrets — generate with:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_ACCESS_SECRET=<your-random-secret-min-32-chars>
JWT_REFRESH_SECRET=<your-different-random-secret-min-32-chars>
```

**Frontend environment** (`frontend/.env.local`) is already configured to point to `http://localhost:3001`.

## 3. Create MySQL Database

Run these commands in your MySQL client (TablePlus, MySQL Workbench, or terminal):

```sql
CREATE DATABASE IF NOT EXISTS rbac_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'rbac_user'@'localhost' IDENTIFIED BY 'rbac_password';
GRANT ALL PRIVILEGES ON rbac_db.* TO 'rbac_user'@'localhost';
FLUSH PRIVILEGES;
```

Replace `rbac_password` with the value you set in `backend/.env`.

## 4. Install Dependencies

```bash
npm install
```

This installs dependencies for both `backend/` and `frontend/` workspaces.

## 5. Run Migrations

```bash
npm run migrate
```

Creates all tables: `users`, `roles`, `permissions`, `user_roles`, `role_permissions`,
`refresh_tokens`, `audit_logs`, `email_verification_tokens`, `password_reset_tokens`,
`notifications`, `notification_roles`, `notification_reads`.

To reset and re-run all migrations:
```bash
npm run migrate:reset
```

## 6. Seed Default Data

```bash
npm run seed
```

Creates 14 permissions + 2 roles (\`admin\` gets all 14, \`user\` gets no permissions by default).

## 7. Generate Prisma Client

```bash
npm run prisma:generate --workspace=backend
```

Generates the type-safe Prisma client to `backend/src/generated/prisma/`.
Run this after any change to `backend/prisma/schema.prisma`.

## 8. Create Admin User

```bash
npm run create-admin
```

Interactive prompt asks for name, email, and password. The user is created with the `admin` role and email pre-verified.

## 9. Start Development Servers

```bash
# Terminal 1
npm run dev:backend   # Express API → http://localhost:3001

# Terminal 2
npm run dev:frontend  # Next.js app → http://localhost:3000
```

Visit `http://localhost:3000/login` and log in with the admin credentials.

API documentation (Swagger UI): `http://localhost:3001/api/docs`

## Useful Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:backend` | Start backend with hot reload |
| `npm run dev:frontend` | Start frontend with Turbopack |
| `npm run build:backend` | Compile backend TypeScript |
| `npm run build:frontend` | Build Next.js production bundle |
| `npm test` | Run all tests (backend + frontend) |
| `npm run typecheck` | TypeScript type check (both workspaces) |
| `npm run migrate` | Apply pending migrations |
| `npm run migrate:dev` | Create and apply a new migration |
| `npm run seed` | Seed default roles and permissions |
| `npm run create-admin` | Create admin user interactively |
| `npm run prisma:generate --workspace=backend` | Regenerate Prisma client after schema changes |

## Troubleshooting

**`Error: connect ECONNREFUSED 127.0.0.1:3306`**
MySQL is not running. Start it with `brew services start mysql` (macOS) or `sudo systemctl start mysql` (Linux).

**`Access denied for user 'rbac_user'@'localhost'`**
The MySQL user or database was not created. Re-run the SQL commands in Step 3.

**`PrismaClientKnownRequestError: does not provide an export named 'PrismaClient'`**
Run `npm run prisma:generate --workspace=backend` to regenerate the client.

**`Error: JWT_ACCESS_SECRET must be at least 32 characters`**
Your `backend/.env` has a placeholder value. Generate real secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Frontend shows blank page or API errors**
Confirm `frontend/.env.local` contains `NEXT_PUBLIC_API_URL=http://localhost:3001`
and that the backend server is running.
