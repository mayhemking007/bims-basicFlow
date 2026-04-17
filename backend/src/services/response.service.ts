import { ApiError } from "../errors/api-error.js";
import { prisma } from "../lib/prisma.js";
import type { SaveResponseInput } from "../validators/response.validator.js";

export async function saveResponse(userId: string, input: SaveResponseInput) {
  const [mindCard, step] = await Promise.all([
    prisma.mindCard.findUnique({
      where: { id: input.mindCardId },
      select: { id: true },
    }),
    prisma.step.findUnique({
      where: { id: input.stepId },
      select: { id: true, mindCardId: true, responseType: true },
    }),
  ]);

  if (!mindCard) {
    throw new ApiError(404, "MINDCARD_NOT_FOUND", "MindCard not found");
  }

  if (!step || step.mindCardId !== input.mindCardId) {
    throw new ApiError(400, "STEP_MISMATCH", "Step does not belong to the provided MindCard");
  }

  if (step.responseType === "TEXT") {
    if (!input.textAnswer) {
      throw new ApiError(400, "INVALID_RESPONSE", "textAnswer is required for TEXT steps");
    }
    if (input.optionId) {
      throw new ApiError(400, "INVALID_RESPONSE", "optionId is not allowed for TEXT steps");
    }
  } else {
    if (!input.optionId) {
      throw new ApiError(400, "INVALID_RESPONSE", "optionId is required for choice-based steps");
    }
    if (input.textAnswer) {
      throw new ApiError(400, "INVALID_RESPONSE", "textAnswer is not allowed for choice-based steps");
    }

    const option = await prisma.option.findUnique({
      where: { id: input.optionId },
      select: { id: true, stepId: true },
    });

    if (!option || option.stepId !== input.stepId) {
      throw new ApiError(400, "INVALID_OPTION", "optionId does not belong to the step");
    }
  }

  const response = await prisma.userResponse.upsert({
    where: {
      userId_mindCardId_stepId: {
        userId,
        mindCardId: input.mindCardId,
        stepId: input.stepId,
      },
    },
    create: {
      userId,
      mindCardId: input.mindCardId,
      stepId: input.stepId,
      optionId: input.optionId,
      textAnswer: input.textAnswer,
    },
    update: {
      optionId: input.optionId,
      textAnswer: input.textAnswer,
    },
  });

  return response;
}

export async function getResponsesForMindCard(userId: string, mindCardId: string) {
  const mindCard = await prisma.mindCard.findUnique({
    where: { id: mindCardId },
    select: { id: true },
  });

  if (!mindCard) {
    throw new ApiError(404, "MINDCARD_NOT_FOUND", "MindCard not found");
  }

  return prisma.userResponse.findMany({
    where: {
      userId,
      mindCardId,
    },
    orderBy: { createdAt: "asc" },
  });
}
