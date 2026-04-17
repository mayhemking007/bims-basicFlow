import { Router } from "express";

import {
  createOrUpdateMindCardController,
  getMindCardByIdController,
  listMindCardsController,
} from "../controllers/mindcard.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const mindCardRouter = Router();

mindCardRouter.post("/mindcard", asyncHandler(createOrUpdateMindCardController));
mindCardRouter.get("/mindcards", asyncHandler(listMindCardsController));
mindCardRouter.get("/mindcard/:id", asyncHandler(getMindCardByIdController));

export { mindCardRouter };
