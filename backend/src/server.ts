import cors from "cors";
import dotenv from "dotenv";
import express from "express";

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

app.use("/api", (_req, res) => {
  res.status(200).json({
    message: "API scaffold ready",
  });
});

app.listen(port, () => {
  // Keep startup logs simple for local development.
  console.log(`Backend running on http://localhost:${port}`);
});
