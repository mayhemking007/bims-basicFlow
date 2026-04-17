import type { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api-error.js";

export async function authMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const rawUserId = req.header("x-user-id");
  const stubIdentity = rawUserId?.trim();

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
      hypothesisId: "H1",
      location: "backend/src/middleware/auth.middleware.ts:8",
      message: "auth header parsed",
      data: {
        hasRawUserId: rawUserId !== undefined,
        trimmedUserId: stubIdentity ?? null,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  if (!stubIdentity) {
    throw new ApiError(401, "UNAUTHORIZED", "Missing x-user-id header");
  }

  req.userId = stubIdentity;
  next();
}
