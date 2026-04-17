import { Router } from "express";

import { getResponsesController, saveResponseController } from "../controllers/response.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const responseRouter = Router();

responseRouter.post("/response", asyncHandler(saveResponseController));
responseRouter.get("/responses/:mindCardId", asyncHandler(getResponsesController));

export { responseRouter };
