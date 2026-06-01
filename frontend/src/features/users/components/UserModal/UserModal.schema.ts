import z from "zod";

export const userModalSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email({ message: "Invalid email" }),
});

export type UserModalInput = z.infer<typeof userModalSchema>;
export type UserModalOutput = z.infer<typeof userModalSchema>;
