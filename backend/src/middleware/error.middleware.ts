import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { ApiError } from "../errors/api-error.js";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      details: err.details,
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      code: "VALIDATION_ERROR",
      message: "Invalid request payload",
      details: err.issues,
    });
    return;
  }

  console.error("Unhandled error", err);
  res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Unexpected server error",
  });
}
