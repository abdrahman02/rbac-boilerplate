import type { VariantProps } from "tailwind-variants";
import type { badgeVariants } from "@/shared/components/ui";

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

// Maps every backend action string to a badge variant.
// danger=destroy, warning=unlink, info=modify/assign, primary=create, success=auth ok, default=neutral
export const ACTION_VARIANT_MAP: Record<string, BadgeVariant> = {
  // auth
  login: "success",
  logout: "default",
  register: "primary",
  // users
  create_user: "primary",
  update_user: "info",
  delete_user: "danger",
  assign_role: "info",
  remove_role: "warning",
  // roles
  create_role: "primary",
  update_role: "info",
  delete_role: "danger",
  assign_permission: "info",
  remove_permission: "warning",
  // permissions
  create_permission: "primary",
  update_permission: "info",
  delete_permission: "danger",
};
