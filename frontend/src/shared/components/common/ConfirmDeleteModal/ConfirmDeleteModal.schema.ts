import { z } from "zod";

export const confirmModalSchema = z.object({
  confirm: z.string().min(1),
});

export type ConfirmModalInput = z.infer<typeof confirmModalSchema>;
