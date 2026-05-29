import { z } from "zod";

export const roleModalSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
});

export type RoleModalInput = z.infer<typeof roleModalSchema>;
