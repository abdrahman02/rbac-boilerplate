# Integration Guide

How to customize and extend RBAC Boilerplate for your project.

## Adding a New Permission

### 1. Define the permission name

Use `resource:action` format: `reports:read`, `billing:update`, `settings:delete`.

### 2. Add it to the seeder (for default permissions)

Open `backend/seeders/seed.ts` and add to the `permissions` array:

```typescript
{ name: "reports:read", description: "View reports" },
```

Re-run: `npm run seed` (uses upsert — safe to re-run on existing data).

### 3. Or create it via API

```bash
POST /api/permissions
{ "name": "reports:read", "description": "View reports" }
```

### 4. Assign it to a role via API

```bash
PUT /api/roles/1/permissions
{ "permissionIds": [1, 2, 3, 14] }
```

---

## Protecting a Backend Route

Use `requirePermission()` middleware from `backend/src/middleware/permission.middleware.ts`.

**Single permission:**
```typescript
import { requirePermission } from "../middleware/permission.middleware.js";

router.get("/reports", authMiddleware, requirePermission("reports:read"), ctrl.listReports);
```

**Multiple permissions (user must have at least one):**
```typescript
router.get("/", authMiddleware, requirePermission(["reports:read", "admin:all"]), ctrl.list);
```

---

## Adding a New Backend Module

Follow the repository → service → controller → route pattern used throughout the codebase.

### 1. Create repository (`src/repositories/report.repository.ts`)

```typescript
import prisma from "../lib/prisma.js";

export async function findAllReports() {
  return prisma.report.findMany({ orderBy: { createdAt: "desc" } });
}

export async function findReportById(id: number) {
  return prisma.report.findUnique({ where: { id } });
}
```

### 2. Create service (`src/services/report.service.ts`)

```typescript
import * as reportRepo from "../repositories/report.repository.js";

export async function listReports() {
  return reportRepo.findAllReports();
}

export async function getReport(id: number) {
  const report = await reportRepo.findReportById(id);
  if (!report) throw new Error("NOT_FOUND");
  return report;
}
```

### 3. Create controller (`src/controllers/report.controller.ts`)

```typescript
import type { Request, Response } from "express";
import * as reportService from "../services/report.service.js";
import { handleError } from "../lib/handle-error.js";
import { HttpResponse } from "../lib/http-response.js";

export const list = async (req: Request, res: Response) => {
  try {
    const reports = await reportService.listReports();
    HttpResponse.ok(res, reports);
  } catch (err) {
    handleError(res, err);
  }
};

export const get = async (req: Request, res: Response) => {
  try {
    const report = await reportService.getReport(Number(req.params.id));
    HttpResponse.ok(res, report);
  } catch (err) {
    handleError(res, err);
  }
};
```

### 4. Create route (`src/routes/reports.ts`)

```typescript
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import * as ctrl from "../controllers/report.controller.js";

const router = Router();

router.get("/", authMiddleware, requirePermission("reports:read"), ctrl.list);
router.get("/:id", authMiddleware, requirePermission("reports:read"), ctrl.get);

export default router;
```

### 5. Mount in `src/app.ts`

```typescript
import reportsRouter from "./routes/reports.js";
// ...
app.use("/api/reports", reportsRouter);
```

### 6. Extend Prisma schema (`prisma/schema.prisma`)

```prisma
model Report {
  id        Int      @id @default(autoincrement()) @db.UnsignedInt
  title     String   @db.VarChar(255)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("reports")
}
```

Run migration: `npm run migrate:dev --workspace=backend`
Regenerate client: `npm run prisma:generate --workspace=backend`

---

## Protecting a Frontend Page

Wrap your page with `ProtectedRoute` from `frontend/src/shared/components/guard/`:

```tsx
// app/(dashboard)/reports/page.tsx
import { ProtectedRoute } from "@/shared/components/guard";

export default function ReportsPage() {
  return (
    <ProtectedRoute requiredPermission="reports:read">
      <div>Reports content here</div>
    </ProtectedRoute>
  );
}
```

`ProtectedRoute` redirects to `/login` if unauthenticated, or shows a 403 message if the permission is missing.

---

## Conditional UI Based on Permission

Use `PermissionGate` to show or hide elements:

```tsx
import { PermissionGate } from "@/shared/components/guard";

<PermissionGate permission="reports:read">
  <button>View Reports</button>
</PermissionGate>

<PermissionGate permission="reports:read" fallback={<span>Access denied</span>}>
  <ReportsTable />
</PermissionGate>
```

Use the `usePermission` hook for imperative checks:

```tsx
import { usePermission } from "@/shared/hooks";

const canExport = usePermission("reports:read");

return canExport ? <ExportButton /> : null;
```

---

## Adding a New Frontend Feature Module

Follow the structure in `frontend/src/features/`:

```
features/reports/
  components/
    ReportModal.tsx       # Create/edit modal
  hooks/
    useReports.ts         # CRUD hooks with TanStack Query
  types/
    report.ts             # TypeScript types
```

**Example hook (`useReports.ts`):**

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/api-client";

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: () => apiClient.get("/reports").then((r) => r.data.data),
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string }) => apiClient.post("/reports", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reports"] }),
  });
}
```

---

## Customizing Token Expiry

In `backend/.env`:
```env
JWT_ACCESS_EXPIRES_IN=30m    # default: 15m
JWT_REFRESH_EXPIRES_IN=30d   # default: 7d
```

---

## Disabling Email Verification

To allow users to log in immediately after registration without email verification:

In `backend/src/services/auth.service.ts`, in the `register` method, set:
```typescript
isActive: true,
emailVerifiedAt: new Date(),
```

And remove the email-sending call in the registration handler.
