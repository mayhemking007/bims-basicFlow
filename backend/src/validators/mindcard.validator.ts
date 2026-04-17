import { z } from "zod";

const responseTypeSchema = z.enum(["MULTIPLE_CHOICE", "BINARY", "TEXT"]);

const optionSchema = z.object({
  text: z.string().trim().min(1, "Option text is required"),
});

const authorAnswerSchema = z.object({
  optionIndex: z.number().int().min(0).optional(),
  textAnswer: z.string().trim().min(1).optional(),
});

const stepSchema = z
  .object({
    text: z.string().trim().min(1, "Step text is required"),
    responseType: responseTypeSchema,
    options: z.array(optionSchema).optional(),
    authorAnswer: authorAnswerSchema.optional(),
  })
  .superRefine((step, ctx) => {
    const optionsCount = step.options?.length ?? 0;

    if (step.responseType === "MULTIPLE_CHOICE" && (optionsCount < 2 || optionsCount > 4)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "MULTIPLE_CHOICE steps must have 2 to 4 options",
        path: ["options"],
      });
    }

    if (step.responseType === "BINARY" && optionsCount !== 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "BINARY steps must have exactly 2 options",
        path: ["options"],
      });
    }

    if (step.responseType === "TEXT" && optionsCount > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "TEXT steps must not include options",
        path: ["options"],
      });
    }

    if (step.authorAnswer?.optionIndex !== undefined) {
      if (step.responseType === "TEXT") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "TEXT steps cannot use authorAnswer.optionIndex",
          path: ["authorAnswer", "optionIndex"],
        });
      } else if (step.options && step.authorAnswer.optionIndex >= step.options.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "authorAnswer.optionIndex must refer to an existing option",
          path: ["authorAnswer", "optionIndex"],
        });
      }
    }
  });

export const createMindCardSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  intro: z.string().trim().min(1, "Intro is required"),
  steps: z.array(stepSchema).min(3, "At least 3 steps are required").max(5, "At most 5 steps are allowed"),
});

export type CreateMindCardInput = z.infer<typeof createMindCardSchema>;
