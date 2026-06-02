import { z } from "zod";

export const broadcastSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
  role_ids: z.array(z.number()).min(1, "Pilih minimal satu role"),
});

export type BroadcastInput = z.infer<typeof broadcastSchema>;
