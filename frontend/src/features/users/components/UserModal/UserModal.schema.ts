import z from "zod";

export const userModalSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email({ message: "Invalid email" }),
  // Optional at schema level (edit mode sends ""); refines only run when value is non-empty
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, "At least 8 characters")
    .refine(
      (val) => !val || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val),
      "Must contain uppercase, lowercase, and a number",
    ),
});

export type UserModalInput = z.input<typeof userModalSchema>;
export type UserModalOutput = z.output<typeof userModalSchema>;
