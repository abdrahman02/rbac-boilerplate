import { z } from "zod";

export const assignPermissionSchema = z.object({
  permissionIds: z.array(z.number()),
});

export type AssignPermissionInput = z.infer<typeof assignPermissionSchema>;
