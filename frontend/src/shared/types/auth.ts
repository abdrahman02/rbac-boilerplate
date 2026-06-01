import { z } from "zod";

export const authenticatedUserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
});

export type AuthenticatedUser = z.infer<typeof authenticatedUserSchema>;

export const registerResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

export type RegisterResponse = z.infer<typeof registerResponseSchema>;
