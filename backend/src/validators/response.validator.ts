import { z } from "zod";

export const saveResponseSchema = z
  .object({
    mindCardId: z.string().trim().min(1, "mindCardId is required"),
    stepId: z.string().trim().min(1, "stepId is required"),
    optionId: z.string().trim().min(1).optional(),
    textAnswer: z.string().trim().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.optionId && !data.textAnswer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either optionId or textAnswer is required",
      });
    }
  });

export type SaveResponseInput = z.infer<typeof saveResponseSchema>;
