import { Router } from "express";
import AuditLog from "../models/AuditLog.js";

const router = Router();

// GET /api/audit-logs?flagKey=new-checkout
router.get("/", async (req, res) => {
  const filter = req.query.flagKey ? { flagKey: String(req.query.flagKey) } : {};
  res.json(await AuditLog.find(filter).sort({ at: -1 }).limit(200));
});

export default router;
