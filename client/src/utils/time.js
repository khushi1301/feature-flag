export function timeAgo(iso) {
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  const units = [
    ["d", 86400],
    ["h", 3600],
    ["m", 60],
  ];
  for (const [label, size] of units) {
    if (seconds >= size) return `${Math.floor(seconds / size)}${label} ago`;
  }
  return "just now";
}
