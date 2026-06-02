# API Reference

Base URL: `http://localhost:3001/api`

Interactive documentation (Swagger UI): `http://localhost:3001/api/docs`

## Authentication

All protected endpoints require a valid access token sent automatically via httpOnly cookie.
Tokens are set by `/api/auth/login` and rotated by `/api/auth/refresh`.

| Cookie | Value | Lifetime |
|--------|-------|----------|
| `accessToken` | JWT | 15 minutes |
| `refreshToken` | JWT | 7 days |

When the access token expires, the frontend axios interceptor automatically calls
`POST /api/auth/refresh` and retries the original request.

---

## Auth Endpoints

### POST /api/auth/register

Register a new user account. Account is inactive until email is verified.

**Request:**
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass123!"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": null
}
```

**Errors:** `400` validation error, `409` email already registered

---

### POST /api/auth/login

Authenticate and receive access + refresh token cookies.

**Request:**
```json
{
  "email": "jane@example.com",
  "password": "SecurePass123!"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "jane@example.com",
      "fullName": "Jane Doe",
      "isActive": true,
      "roles": ["admin"]
    }
  }
}
```

Sets `accessToken` and `refreshToken` httpOnly cookies.

**Errors:** `401` invalid credentials, `403` account inactive/unverified, `429` rate limited

---

### POST /api/auth/logout

Revoke the current refresh token and clear cookies.

**Auth required:** Yes

**Response 200:**
```json
{ "success": true, "message": "Logged out successfully", "data": null }
```

---

### POST /api/auth/refresh

Rotate the refresh token and issue a new access token.

**Auth required:** refreshToken cookie

**Response 200:**
```json
{ "success": true, "message": "Token refreshed", "data": null }
```

Sets new `accessToken` cookie.

**Errors:** `401` invalid or expired refresh token

---

### GET /api/auth/me

Get the currently authenticated user's profile with roles and permissions.

**Auth required:** Yes

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "jane@example.com",
    "fullName": "Jane Doe",
    "isActive": true,
    "emailVerifiedAt": "2026-06-01T10:00:00.000Z",
    "roles": [
      {
        "id": 1,
        "name": "admin",
        "permissions": ["users:read", "users:create", "roles:read"]
      }
    ]
  }
}
```

---

### PATCH /api/auth/me

Update the authenticated user's profile.

**Auth required:** Yes

**Request:**
```json
{ "fullName": "Jane Smith" }
```

**Response 200:**
```json
{ "success": true, "message": "Profile updated", "data": { "fullName": "Jane Smith" } }
```

---

### POST /api/auth/change-password

Change password for the authenticated user.

**Auth required:** Yes

**Request:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!",
  "confirmPassword": "NewPass456!"
}
```

**Response 200:**
```json
{ "success": true, "message": "Password changed successfully", "data": null }
```

---

### POST /api/auth/forgot-password

Request a password reset email.

**Request:**
```json
{ "email": "jane@example.com" }
```

**Response 200:** Always returns success (prevents email enumeration)
```json
{ "success": true, "message": "If that email exists, a reset link has been sent.", "data": null }
```

---

### POST /api/auth/reset-password

Reset password using the token from the email link.

**Request:**
```json
{
  "token": "abc123...",
  "password": "NewPass456!",
  "confirmPassword": "NewPass456!"
}
```

**Response 200:**
```json
{ "success": true, "message": "Password reset successful", "data": null }
```

**Errors:** `400` invalid or expired token

---

### POST /api/auth/verify-email

Verify email address using the token from the verification email.

**Request:**
```json
{ "token": "abc123..." }
```

**Response 200:**
```json
{ "success": true, "message": "Email verified successfully", "data": null }
```

---

### POST /api/auth/resend-verification

Resend the email verification link.

**Request:**
```json
{ "email": "jane@example.com" }
```

**Response 200:** Always returns success
```json
{ "success": true, "message": "Verification email sent if account exists", "data": null }
```

---

## User Endpoints

### GET /api/users

List all users with pagination.

**Auth required:** Yes | **Permission:** `users:read`

**Query params:** `page` (default: 1), `limit` (default: 10), `search` (filter by name or email)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "email": "admin@example.com",
        "fullName": "Admin User",
        "isActive": true,
        "roles": ["admin"],
        "createdAt": "2026-06-01T00:00:00.000Z",
        "updatedAt": "2026-06-01T00:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10
  }
}
```

---

### GET /api/users/export

Export users as Excel (.xlsx) file.

**Auth required:** Yes | **Permission:** `users:read`

**Response:** `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

---

### GET /api/users/:id

Get a single user by ID.

**Auth required:** Yes | **Permission:** `users:read`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@example.com",
    "fullName": "Admin User",
    "isActive": true,
    "roles": [{ "id": 1, "name": "admin" }],
    "createdAt": "2026-06-01T00:00:00.000Z"
  }
}
```

**Errors:** `404` user not found

---

### POST /api/users

Create a new user.

**Auth required:** Yes | **Permission:** `users:create`

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "roleIds": [1]
}
```

**Response 201:**
```json
{ "success": true, "message": "User created", "data": { "id": 2, "email": "john@example.com" } }
```

**Errors:** `409` email already exists

---

### PATCH /api/users/:id

Update a user's details.

**Auth required:** Yes | **Permission:** `users:update`

**Request (partial):**
```json
{ "fullName": "John Smith", "isActive": false }
```

**Response 200:**
```json
{ "success": true, "message": "User updated", "data": { "id": 2, "fullName": "John Smith" } }
```

---

### DELETE /api/users/:id

Soft-delete a user (sets `deletedAt`, anonymizes email).

**Auth required:** Yes | **Permission:** `users:delete`

**Response 200:**
```json
{ "success": true, "message": "User deleted", "data": null }
```

---

### PUT /api/users/:id/roles

Replace all roles for a user.

**Auth required:** Yes | **Permission:** `users:update`

**Request:**
```json
{ "roleIds": [1, 2] }
```

**Response 200:**
```json
{ "success": true, "message": "Roles assigned", "data": null }
```

---

### DELETE /api/users/:id/roles/:roleId

Remove a specific role from a user.

**Auth required:** Yes | **Permission:** `users:update`

**Response 200:**
```json
{ "success": true, "message": "Role removed", "data": null }
```

---

## Role Endpoints

### GET /api/roles

List all roles.

**Auth required:** Yes | **Permission:** `roles:read` (or `users:read`, `users:update`)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "roles": [
      { "id": 1, "name": "admin", "description": "Full access", "permissionCount": 13 }
    ],
    "total": 2
  }
}
```

---

### GET /api/roles/export

Export roles as Excel (.xlsx) file.

**Auth required:** Yes | **Permission:** `roles:read`

---

### GET /api/roles/:id

Get role with its permissions.

**Auth required:** Yes | **Permission:** `roles:read`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "admin",
    "description": "Full access",
    "permissions": [{ "id": 1, "name": "users:read" }]
  }
}
```

---

### POST /api/roles

Create a new role.

**Auth required:** Yes | **Permission:** `roles:create`

**Request:**
```json
{ "name": "moderator", "description": "Can read and update users" }
```

**Response 201:**
```json
{ "success": true, "data": { "id": 3, "name": "moderator" } }
```

---

### PATCH /api/roles/:id

Update a role's name or description.

**Auth required:** Yes | **Permission:** `roles:update`

**Request:**
```json
{ "description": "Can read, update, and delete users" }
```

**Response 200:**
```json
{ "success": true, "message": "Role updated", "data": null }
```

---

### DELETE /api/roles/:id

Delete a role.

**Auth required:** Yes | **Permission:** `roles:delete`

**Response 200:**
```json
{ "success": true, "message": "Role deleted", "data": null }
```

---

### POST /api/roles/:id/permissions

Add a single permission to a role.

**Auth required:** Yes | **Permission:** `roles:update`

**Request:**
```json
{ "permissionId": 5 }
```

**Response 200:**
```json
{ "success": true, "message": "Permission added", "data": null }
```

---

### PUT /api/roles/:id/permissions

Replace all permissions for a role.

**Auth required:** Yes | **Permission:** `roles:update`

**Request:**
```json
{ "permissionIds": [1, 2, 3] }
```

**Response 200:**
```json
{ "success": true, "message": "Permissions updated", "data": null }
```

---

### DELETE /api/roles/:id/permissions/:permissionId

Remove a specific permission from a role.

**Auth required:** Yes | **Permission:** `roles:update`

**Response 200:**
```json
{ "success": true, "message": "Permission removed", "data": null }
```

---

## Permission Endpoints

### GET /api/permissions

List all permissions.

**Auth required:** Yes | **Permission:** `permissions:read`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "permissions": [
      { "id": 1, "name": "users:read", "description": "View user list" }
    ],
    "total": 13
  }
}
```

---

### GET /api/permissions/export

Export permissions as Excel (.xlsx) file.

**Auth required:** Yes | **Permission:** `permissions:read`

---

### GET /api/permissions/:id

Get a single permission.

**Auth required:** Yes | **Permission:** `permissions:read`

**Response 200:**
```json
{
  "success": true,
  "data": { "id": 1, "name": "users:read", "description": "View user list" }
}
```

---

### POST /api/permissions

Create a permission. Use `resource:action` format.

**Auth required:** Yes | **Permission:** `permissions:create`

**Request:**
```json
{ "name": "reports:read", "description": "View reports" }
```

**Response 201:**
```json
{ "success": true, "data": { "id": 14, "name": "reports:read" } }
```

---

### PATCH /api/permissions/:id

Update a permission.

**Auth required:** Yes | **Permission:** `permissions:update`

**Request:**
```json
{ "description": "View and export reports" }
```

**Response 200:**
```json
{ "success": true, "message": "Permission updated", "data": null }
```

---

### DELETE /api/permissions/:id

Delete a permission.

**Auth required:** Yes | **Permission:** `permissions:delete`

**Response 200:**
```json
{ "success": true, "message": "Permission deleted", "data": null }
```

---

## Audit Log Endpoints

### GET /api/audit-logs

List audit logs with filters.

**Auth required:** Yes | **Permission:** `audit_logs:read`

**Query params:**
- `page` (default: 1)
- `limit` (default: 20)
- `userId` — filter by user ID
- `action` — filter by action string (e.g. `login`, `create_user`)
- `resourceType` — filter by resource (e.g. `user`, `role`)
- `startDate` — ISO 8601 date
- `endDate` — ISO 8601 date

**Response 200:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 1,
        "userId": 1,
        "userEmail": "admin@example.com",
        "action": "login",
        "resourceType": "auth",
        "resourceId": null,
        "details": {},
        "ipAddress": "127.0.0.1",
        "createdAt": "2026-06-01T10:00:00.000Z"
      }
    ],
    "total": 42,
    "page": 1,
    "limit": 20
  }
}
```

---

## Dashboard Endpoints

### GET /api/dashboard/stats

Get summary statistics.

**Auth required:** Yes

**Response 200:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 10,
    "activeUsers": 8,
    "totalRoles": 2,
    "totalPermissions": 13
  }
}
```

---

### GET /api/dashboard/role-distribution

Get user count per role.

**Auth required:** Yes

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "role": "admin", "count": 2 },
    { "role": "viewer", "count": 8 }
  ]
}
```

---

### GET /api/dashboard/export

Export dashboard data as Excel (.xlsx) file.

**Auth required:** Yes

---

## Notification Endpoints

### GET /api/notifications/stream

SSE stream for real-time notifications.

**Auth required:** Yes

**Response:** `text/event-stream`

Each event is a JSON-encoded notification object.

---

### GET /api/notifications

List notifications for the authenticated user.

**Auth required:** Yes

**Response 200:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": 1,
        "title": "Welcome",
        "message": "Your account has been created",
        "isRead": false,
        "createdAt": "2026-06-01T00:00:00.000Z"
      }
    ],
    "unreadCount": 1
  }
}
```

---

### POST /api/notifications

Create a notification (admin only).

**Auth required:** Yes

**Request:**
```json
{
  "title": "System Maintenance",
  "message": "Scheduled maintenance on Sunday 2am.",
  "roleIds": [1, 2]
}
```

**Response 201:**
```json
{ "success": true, "message": "Notification sent", "data": null }
```

---

### PATCH /api/notifications/read-all

Mark all notifications as read for the authenticated user.

**Auth required:** Yes

**Response 200:**
```json
{ "success": true, "message": "All notifications marked as read", "data": null }
```

---

### PATCH /api/notifications/:id/read

Mark a single notification as read.

**Auth required:** Yes

**Response 200:**
```json
{ "success": true, "message": "Notification marked as read", "data": null }
```

---

## Error Response Format

All errors follow this shape:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "data": null
}
```

Common HTTP status codes:
- `400` — Validation error (missing or invalid fields)
- `401` — Not authenticated (missing or expired access token)
- `403` — Forbidden (missing permission or inactive/unverified account)
- `404` — Resource not found
- `409` — Conflict (duplicate email, unique constraint violation)
- `429` — Rate limited (auth endpoints: 20 requests per 15 minutes)
- `500` — Internal server error
