import AuditLog from "../models/AuditLog.js";
import { CURRENT_USER, ENVIRONMENTS } from "../constants.js";

export function logAudit(flag, entries) {
  return AuditLog.insertMany(
    entries.map((e) => ({ user: CURRENT_USER, flagKey: flag.key, flagName: flag.name, ...e }))
  );
}

// Compare two plain flag objects and describe what changed.
export function diffFlag(before, after) {
  const entries = [];
  if (before.name !== after.name || before.description !== after.description || before.type !== after.type) {
    entries.push({ action: "UPDATED", change: "Details edited" });
  }
  for (const env of ENVIRONMENTS) {
    const a = before.environments[env];
    const b = after.environments[env];
    if (a.enabled !== b.enabled) {
      entries.push({ action: b.enabled ? "ENABLED" : "DISABLED", env, change: b.enabled ? "off → on" : "on → off" });
    }
    if (a.rollout !== b.rollout) {
      entries.push({ action: "ROLLOUT", env, change: `${a.rollout}% → ${b.rollout}%` });
    }
  }
  return entries;
}
