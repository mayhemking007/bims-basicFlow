import type { Request, Response } from "express";

import { expressInterest } from "../services/interest.service.js";
import { createInterestSchema } from "../validators/interest.validator.js";

export async function expressInterestController(req: Request, res: Response): Promise<void> {
  const userId = req.userId!;
  const payload = createInterestSchema.parse(req.body);
  const interest = await expressInterest(userId, payload.mindCardId);
  res.status(201).json(interest);
}
