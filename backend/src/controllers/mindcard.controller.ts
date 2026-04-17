import type { Request, Response } from "express";

import { createOrUpdateMindCard, getMindCardById, listMindCards } from "../services/mindcard.service.js";
import { createMindCardSchema } from "../validators/mindcard.validator.js";

export async function createOrUpdateMindCardController(req: Request, res: Response): Promise<void> {
  const userId = req.userId!;
  const payload = createMindCardSchema.parse(req.body);
  const mindCard = await createOrUpdateMindCard(userId, payload);
  res.status(200).json(mindCard);
}

export async function listMindCardsController(_req: Request, res: Response): Promise<void> {
  const cards = await listMindCards();
  res.status(200).json(cards);
}

export async function getMindCardByIdController(req: Request, res: Response): Promise<void> {
  const mindCardId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const card = await getMindCardById(mindCardId);
  res.status(200).json(card);
}
