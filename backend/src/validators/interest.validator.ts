import { z } from "zod";

export const createInterestSchema = z.object({
  mindCardId: z.string().trim().min(1, "mindCardId is required"),
});

export type CreateInterestInput = z.infer<typeof createInterestSchema>;
