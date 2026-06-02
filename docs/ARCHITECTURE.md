# Architecture

System design, data flow, and folder structure for RBAC Boilerplate.

## Overview

```
┌─────────────────────┐         ┌─────────────────────────┐
│   Next.js Frontend  │◄──────►│   Express.js Backend     │
│   (port 3000)       │  HTTP   │   (port 3001)            │
│                     │ Cookies │                          │
│  - App Router pages │         │  - REST API              │
│  - Zustand store    │         │  - JWT auth middleware   │
│  - React Query      │         │  - Permission middleware │
│  - Axios + auto-    │         │  - Audit log middleware  │
│    refresh          │         │  - Prisma ORM            │
└─────────────────────┘         └──────────┬──────────────┘
                                            │
                                            ▼
                                 ┌─────────────────────┐
                                 │   MySQL 8+ Database  │
                                 │   (Prisma ORM)       │
                                 └─────────────────────┘
```

## Backend Folder Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema (single source of truth)
│   └── migrations/            # SQL migration files (Prisma-managed)
├── seeders/
│   └── seed.ts                # Seeds 13 permissions + 2 roles (upsert — safe to re-run)
├── scripts/
│   └── create-admin.ts        # Interactive admin user creation
└── src/
    ├── config/
    │   ├── env.ts             # Zod env validation — fails fast if vars missing
    │   ├── database.ts        # MySQL2 connection pool (used by legacy scripts)
    │   └── swagger.ts         # OpenAPI 3.0 spec setup
    ├── constants/             # Shared string constants
    ├── controllers/           # HTTP layer: parse request, call service, format response
    ├── generated/
    │   └── prisma/            # Auto-generated Prisma client (git-ignored, run prisma:generate)
    ├── lib/
    │   ├── prisma.ts          # PrismaClient singleton with MariaDB adapter
    │   ├── handle-error.ts    # Centralized error → HTTP response mapping
    │   └── http-response.ts   # Typed response helpers (ok, created, notFound, etc.)
    ├── middleware/
    │   ├── auth.middleware.ts        # Verify accessToken cookie, attach req.user
    │   ├── permission.middleware.ts  # requirePermission(perm) guard
    │   ├── rate-limit.middleware.ts  # 20 req/15min on auth endpoints
    │   ├── validate.middleware.ts    # Zod schema validation for req.body
    │   └── audit-log.middleware.ts   # Log action + resourceType after response
    ├── repositories/          # Prisma queries — no business logic
    ├── routes/                # Express routers with Swagger JSDoc comments
    ├── schemas/               # Zod validation schemas for request bodies
    ├── services/              # Business logic — calls repositories, throws typed errors
    ├── types/
    │   └── index.ts           # Global types (AuthenticatedUser, Express Request augment)
    └── utils/
        └── hash.ts            # bcrypt helpers (hashPassword, comparePassword)
```

## Frontend Folder Structure

```
frontend/src/
├── app/
│   ├── (auth)/                # Auth layout group (no navbar, centered form)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   ├── verify-email/page.tsx
│   │   └── verify-email-sent/page.tsx
│   └── (dashboard)/           # Dashboard layout group (navbar + ProtectedRoute)
│       ├── page.tsx           # Dashboard home (stats, charts)
│       ├── profile/page.tsx
│       ├── users/page.tsx
│       ├── roles/page.tsx
│       ├── permissions/page.tsx
│       ├── audit-logs/page.tsx
│       └── notifications/page.tsx
├── features/                  # Feature modules (co-located components, hooks, types)
│   ├── auth/                  # Login, register, forgot-password forms
│   ├── users/                 # User CRUD modals + hooks
│   ├── roles/                 # Role CRUD + permission assignment
│   ├── permissions/           # Permission CRUD
│   ├── audit-logs/            # Audit log table + filters
│   ├── dashboard/             # Stats cards + charts
│   └── notifications/         # Notification list + SSE stream
└── shared/                    # Cross-feature utilities
    ├── components/
    │   ├── common/            # BrandMark, NavMenu
    │   ├── guard/             # ProtectedRoute, PermissionGate
    │   └── ui/                # Button, Input, Modal, Badge, Alert, Spinner, etc.
    ├── hooks/                 # useAuth, usePermission, useLogout
    ├── lib/
    │   ├── api-client.ts      # Axios instance with auto-refresh interceptor
    │   └── api-error.ts       # Error message parser
    ├── stores/
    │   └── authStore.ts       # Zustand auth store (persisted to localStorage)
    └── types/                 # Shared TypeScript types
```

## Database Schema

```
users
  id, email, passwordHash, fullName, isActive,
  emailVerifiedAt, createdAt, updatedAt, deletedAt

roles
  id, name (unique), description, createdAt, updatedAt

permissions
  id, name (unique, format: resource:action), description, createdAt, updatedAt

user_roles          (junction: userId → roleId)
role_permissions    (junction: roleId → permissionId)

refresh_tokens
  id, userId, tokenHash, expiresAt, createdAt, revokedAt

email_verification_tokens
  id, userId, token, expiresAt, createdAt, usedAt

password_reset_tokens
  id, userId, token, expiresAt, createdAt, usedAt

audit_logs
  id, userId, action, resourceType, resourceId,
  details (JSON), ipAddress, createdAt

notifications
  id, title, message, type, createdBy, createdAt
  + notification_roles  (junction: notificationId → roleId)
  + notification_reads  (junction: notificationId → userId, readAt)
```

## Auth Flow

```
Register:
  Client → POST /api/auth/register
         → Validate (Zod) → Hash password (bcrypt)
         → Create user (isActive: false)
         → Send verification email
         → 201 Created

Login:
  Client → POST /api/auth/login
         → Validate credentials → Check isActive + emailVerified
         → Create refresh token hash in DB
         → Sign accessToken (15m JWT) + refreshToken (7d JWT)
         → Set httpOnly cookies
         → Return user + roles

Token Refresh (automatic):
  Axios interceptor detects 401
         → POST /api/auth/refresh (sends refreshToken cookie)
         → Verify refreshToken hash in DB + not revoked
         → Rotate: revoke old, create new refresh token
         → Issue new accessToken cookie
         → Retry original request

Logout:
  Client → POST /api/auth/logout
         → Revoke refreshToken in DB (set revokedAt)
         → Clear both cookies
         → 200 OK
```

## Permission Inheritance

```
User
 └─► UserRole[] (many-to-many via user_roles)
       └─► Role
             └─► RolePermission[] (many-to-many via role_permissions)
                   └─► Permission { name: "users:read" }
```

When `GET /api/auth/me` is called:
1. Query: User → UserRoles → Roles → RolePermissions → Permissions
2. Flatten all permission names into a string array
3. Frontend stores result in Zustand `authStore` (persisted)

`requirePermission("users:read")` checks: `req.user.permissions.includes("users:read")`

## Request Lifecycle

```
Incoming HTTP Request
  │
  ├─► CORS middleware (origin whitelist, credentials: true)
  ├─► Morgan (HTTP request logging)
  ├─► express.json (body parsing, 10kb limit)
  ├─► cookie-parser (parse httpOnly cookies)
  │
  ├─► Auth middleware (authMiddleware)
  │     → Read accessToken cookie
  │     → Verify JWT signature + expiry
  │     → Load user permissions from DB
  │     → Attach to req.user
  │     → 401 if missing/invalid
  │
  ├─► Permission middleware (requirePermission)
  │     → req.user.permissions.includes(perm)
  │     → 403 if missing
  │
  ├─► Validate middleware (validate)
  │     → Zod schema.parse(req.body)
  │     → 400 if invalid, with field-level errors
  │
  ├─► Controller
  │     → Call service layer
  │     → Format HTTP response (HttpResponse.ok / .created / etc.)
  │
  └─► Audit log middleware (runs after response sent)
        → Insert row in audit_logs table
        → Records: userId, action, resourceType, resourceId, ip
```
