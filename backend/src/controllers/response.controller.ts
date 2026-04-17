import type { Request, Response } from "express";

import { getResponsesForMindCard, saveResponse } from "../services/response.service.js";
import { saveResponseSchema } from "../validators/response.validator.js";

export async function saveResponseController(req: Request, res: Response): Promise<void> {
  const userId = req.userId!;
  const payload = saveResponseSchema.parse(req.body);
  const response = await saveResponse(userId, payload);
  res.status(200).json(response);
}

export async function getResponsesController(req: Request, res: Response): Promise<void> {
  const userId = req.userId!;
  const mindCardId = Array.isArray(req.params.mindCardId)
    ? req.params.mindCardId[0]
    : req.params.mindCardId;
  const responses = await getResponsesForMindCard(userId, mindCardId);
  res.status(200).json(responses);
}
