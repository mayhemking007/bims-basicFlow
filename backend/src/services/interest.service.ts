import { ApiError } from "../errors/api-error.js";
import { prisma } from "../lib/prisma.js";

export async function expressInterest(userId: string, mindCardId: string) {
  const mindCard = await prisma.mindCard.findUnique({
    where: { id: mindCardId },
    select: { id: true },
  });

  if (!mindCard) {
    throw new ApiError(404, "MINDCARD_NOT_FOUND", "MindCard not found");
  }

  const [stepsCount, responsesCount] = await Promise.all([
    prisma.step.count({ where: { mindCardId } }),
    prisma.userResponse.count({
      where: { userId, mindCardId },
    }),
  ]);

  if (stepsCount === 0 || responsesCount < stepsCount) {
    throw new ApiError(400, "INCOMPLETE_RESPONSES", "Complete all steps before expressing interest");
  }

  try {
    return await prisma.interest.create({
      data: {
        fromUserId: userId,
        mindCardId,
      },
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      throw new ApiError(409, "INTEREST_ALREADY_EXISTS", "Interest has already been submitted");
    }
    throw error;
  }
}
