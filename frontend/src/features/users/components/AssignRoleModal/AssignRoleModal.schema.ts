import { z } from "zod";

export const assignRoleSchema = z.object({
  roleIds: z.array(z.number()),
});

export type AssignRoleInput = z.input<typeof assignRoleSchema>;
export type AssignRoleOutput = z.output<typeof assignRoleSchema>;
