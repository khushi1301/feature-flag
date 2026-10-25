import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import flagsRouter from "./routes/flags.js";
import auditRouter from "./routes/audit.js";
import { errorHandler, notFound } from "./middleware/errors.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/flags", flagsRouter);
app.use("/api/audit-logs", auditRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

try {
  await connectDB();
  app.listen(port, () => console.log(`API running on http://localhost:${port}`));
} catch (err) {
  console.error(`Could not start: ${err.message}`);
  process.exit(1);
}
