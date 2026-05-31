import { z } from "zod";

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z
      .string()
      .min(8, "At least 8 characters")
      .refine(
        (val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val),
        "Must contain uppercase, lowercase, and a number",
      ),
    confirm_password: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
