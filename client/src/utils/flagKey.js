export const KEY_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
