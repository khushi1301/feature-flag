// off: disabled or 0% | live: 100% | rolling: somewhere in between
export function flagState({ enabled, rollout }) {
  if (!enabled || rollout === 0) return "off";
  return rollout === 100 ? "live" : "rolling";
}
export const effectiveRollout = (s) => (s.enabled ? s.rollout : 0);
