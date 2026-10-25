const PALETTE = ["#6d5bd0", "#2f6fdb", "#0f8f84", "#c2410c", "#be185d", "#4d7c0f"];

export function avatarColor(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
}
export const initials = (name) =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
