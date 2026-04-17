import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { interestRouter } from "./routes/interest.routes.js";
import { mindCardRouter } from "./routes/mindcard.routes.js";
import { responseRouter } from "./routes/response.routes.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);
const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

app.use(
  cors({
    origin: frontendOrigin,
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/api", authMiddleware, mindCardRouter, responseRouter, interestRouter);
app.use(errorMiddleware);

app.listen(port, () => {
  // Keep startup logs simple for local development.
  console.log(`Backend running on http://localhost:${port}`);
});
