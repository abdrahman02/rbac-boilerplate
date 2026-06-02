import { z } from "zod";

export const broadcastNotificationSchema = z.object({
  title: z.string().min(3).max(255).trim(),
  message: z.string().min(10).trim(),
  role_ids: z.array(z.number().int().positive()).min(1, "At least one role must be selected"),
});

export type BroadcastNotificationInput = z.infer<typeof broadcastNotificationSchema>;
