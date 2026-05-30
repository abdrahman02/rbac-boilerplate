export const ACTION_OPTIONS = [
  { value: "create_user", label: "create_user" },
  { value: "update_user", label: "update_user" },
  { value: "delete_user", label: "delete_user" },
  { value: "sync_roles", label: "sync_roles" },
  { value: "remove_role", label: "remove_role" },
  { value: "create_role", label: "create_role" },
  { value: "update_role", label: "update_role" },
  { value: "delete_role", label: "delete_role" },
  { value: "assign_permission", label: "assign_permission" },
  { value: "sync_permissions", label: "sync_permissions" },
  { value: "remove_permission", label: "remove_permission" },
  { value: "create_permission", label: "create_permission" },
  { value: "update_permission", label: "update_permission" },
  { value: "delete_permission", label: "delete_permission" },
  { value: "login", label: "login" },
  { value: "logout", label: "logout" },
  { value: "register", label: "register" },
];

export const RESOURCE_TYPE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "role", label: "Role" },
  { value: "permission", label: "Permission" },
  { value: "auth", label: "Auth" },
];
