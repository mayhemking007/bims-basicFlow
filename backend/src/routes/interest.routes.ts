import { Router } from "express";

import { expressInterestController } from "../controllers/interest.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const interestRouter = Router();

interestRouter.post("/interest", asyncHandler(expressInterestController));

export { interestRouter };
