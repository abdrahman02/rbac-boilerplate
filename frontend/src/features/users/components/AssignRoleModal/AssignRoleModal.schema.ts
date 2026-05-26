import { z } from "zod";

export const assignRoleSchema = z.object({
  roleIds: z.array(z.number()),
});

export type AssignRoleInput = z.infer<typeof assignRoleSchema>;
