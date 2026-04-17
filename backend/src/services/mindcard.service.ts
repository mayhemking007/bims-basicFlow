import { ApiError } from "../errors/api-error.js";
import { prisma } from "../lib/prisma.js";
import type { CreateMindCardInput } from "../validators/mindcard.validator.js";

export async function createOrUpdateMindCard(userId: string, input: CreateMindCardInput) {
  // #region agent log
  fetch("http://127.0.0.1:7392/ingest/b9c9ffe7-2f95-4b3d-b6b2-9a76535be8af", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "27ac35",
    },
    body: JSON.stringify({
      sessionId: "27ac35",
      runId: "user-not-found",
      hypothesisId: "H2",
      location: "backend/src/services/mindcard.service.ts:6",
      message: "createOrUpdateMindCard entered",
      data: {
        userId,
        titleLength: input.title.trim().length,
        introLength: input.intro.trim().length,
        stepCount: input.steps.length,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  const resolvedUser = await prisma.user.upsert({
    where: { username: userId },
    update: {},
    create: { username: userId },
    select: { id: true, username: true },
  });

  // #region agent log
  fetch("http://127.0.0.1:7392/ingest/b9c9ffe7-2f95-4b3d-b6b2-9a76535be8af", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "27ac35",
    },
    body: JSON.stringify({
      sessionId: "27ac35",
      runId: "user-not-found",
      hypothesisId: "H3",
      location: "backend/src/services/mindcard.service.ts:29",
      message: "user resolved for mindcard write",
      data: {
        stubUserId: userId,
        resolvedUserId: resolvedUser.id,
        resolvedUsername: resolvedUser.username,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  const mindCard = await prisma.$transaction(async (tx) => {
    const upsertedMindCard = await tx.mindCard.upsert({
      where: { userId: resolvedUser.id },
      create: {
        userId: resolvedUser.id,
        title: input.title,
        intro: input.intro,
      },
      update: {
        title: input.title,
        intro: input.intro,
      },
      select: { id: true, title: true, intro: true, userId: true, createdAt: true },
    });

    await tx.step.deleteMany({
      where: { mindCardId: upsertedMindCard.id },
    });

    for (let index = 0; index < input.steps.length; index += 1) {
      const stepInput = input.steps[index];
      const createdStep = await tx.step.create({
        data: {
          mindCardId: upsertedMindCard.id,
          order: index + 1,
          text: stepInput.text,
          responseType: stepInput.responseType,
          options: stepInput.options?.length
            ? {
                create: stepInput.options.map((option, optionIndex) => ({
                  text: option.text,
                  order: optionIndex + 1,
                })),
              }
            : undefined,
        },
        include: {
          options: { orderBy: { order: "asc" } },
        },
      });

      if (stepInput.authorAnswer) {
        const optionId =
          stepInput.authorAnswer.optionIndex !== undefined
            ? createdStep.options[stepInput.authorAnswer.optionIndex]?.id
            : undefined;

        await tx.authorAnswer.create({
          data: {
            stepId: createdStep.id,
            optionId,
            textAnswer: stepInput.authorAnswer.textAnswer,
          },
        });
      }
    }

    return tx.mindCard.findUnique({
      where: { id: upsertedMindCard.id },
      include: {
        steps: {
          orderBy: { order: "asc" },
          include: {
            options: { orderBy: { order: "asc" } },
            authorAnswer: true,
          },
        },
      },
    });
  });

  return mindCard;
}

export async function listMindCards() {
  const cards = await prisma.mindCard.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, username: true },
      },
      _count: {
        select: { steps: true },
      },
    },
  });

  return cards.map((card) => ({
    id: card.id,
    title: card.title,
    intro: card.intro,
    createdAt: card.createdAt,
    user: card.user,
    stepsCount: card._count.steps,
  }));
}

export async function getMindCardById(mindCardId: string) {
  const card = await prisma.mindCard.findUnique({
    where: { id: mindCardId },
    include: {
      user: { select: { id: true, username: true } },
      steps: {
        orderBy: { order: "asc" },
        include: {
          options: { orderBy: { order: "asc" } },
          authorAnswer: true,
        },
      },
    },
  });

  if (!card) {
    throw new ApiError(404, "MINDCARD_NOT_FOUND", "MindCard not found");
  }

  return card;
}
