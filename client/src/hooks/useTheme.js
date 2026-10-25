import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("ff-theme");
      if (saved) return saved;
    } catch {}
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("ff-theme", theme);
    } catch {}
  }, [theme]);

  return [theme, () => setTheme((t) => (t === "dark" ? "light" : "dark"))];
}
