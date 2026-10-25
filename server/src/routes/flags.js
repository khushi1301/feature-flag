import { Router } from "express";
import mongoose from "mongoose";
import Flag from "../models/Flag.js";
import { ENVIRONMENTS } from "../constants.js";
import { HttpError } from "../middleware/errors.js";
import { diffFlag, logAudit } from "../utils/audit.js";

const router = Router();

// Only ever trust the three known environments and the two known fields.
function sanitizeEnvironments(input = {}) {
  return Object.fromEntries(
    ENVIRONMENTS.map((env) => {
      const s = input?.[env] ?? {};
      return [env, { enabled: Boolean(s.enabled), rollout: Number(s.rollout ?? 0) }];
    })
  );
}

async function findFlag(id) {
  const flag = await Flag.findById(id);
  if (!flag) throw new HttpError(404, "Flag not found.");
  return flag;
}

// GET /api/flags
router.get("/", async (req, res) => {
  res.json(await Flag.find().sort({ updatedAt: -1 }));
});

// POST /api/flags
router.post("/", async (req, res) => {
  const { name, key, description, type, environments } = req.body;
  const flag = await Flag.create({ name, key, description, type, environments: sanitizeEnvironments(environments) });
  await logAudit(flag, [{ action: "CREATED", change: "Flag created" }]);
  res.status(201).json(flag);
});

// POST /api/flags/restore  (undo a delete: re-creates the flag with its original id)
router.post("/restore", async (req, res) => {
  const { id, name, key, description, type, environments } = req.body;
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, "Invalid id.");
  const flag = await Flag.create({ _id: id, name, key, description, type, environments: sanitizeEnvironments(environments) });
  await logAudit(flag, [{ action: "RESTORED", change: "Flag restored" }]);
  res.status(201).json(flag);
});

// PATCH /api/flags/:id  (edit details and per-environment settings)
router.patch("/:id", async (req, res) => {
  const flag = await findFlag(req.params.id);
  const updates = {};
  for (const field of ["name", "description", "type"]) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }
  if (req.body.environments) updates.environments = sanitizeEnvironments(req.body.environments);

  const before = flag.toObject();
  flag.set(updates);
  const entries = diffFlag(before, flag.toObject());
  await flag.save();
  if (entries.length) await logAudit(flag, entries);
  res.json(flag);
});

// PATCH /api/flags/:id/environments/:env  (the on/off switch; idempotent so Undo is safe)
router.patch("/:id/environments/:env", async (req, res) => {
  const { id, env } = req.params;
  const { enabled } = req.body;
  if (!ENVIRONMENTS.includes(env)) throw new HttpError(400, "Unknown environment.");
  if (typeof enabled !== "boolean") throw new HttpError(400, "`enabled` must be true or false.");

  const flag = await findFlag(id);
  if (flag.environments[env].enabled !== enabled) {
    flag.environments[env].enabled = enabled;
    await flag.save();
    await logAudit(flag, [{ action: enabled ? "ENABLED" : "DISABLED", env, change: enabled ? "off → on" : "on → off" }]);
  }
  res.json(flag);
});

// DELETE /api/flags/:id  (returns the deleted flag so the client can offer Undo)
router.delete("/:id", async (req, res) => {
  const flag = await Flag.findByIdAndDelete(req.params.id);
  if (!flag) throw new HttpError(404, "Flag not found.");
  await logAudit(flag, [{ action: "DELETED", change: "Flag deleted" }]);
  res.json(flag);
});

export default router;
