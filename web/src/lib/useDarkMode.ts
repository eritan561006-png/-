import { useEffect, useState } from "react";

const KEY = "xfjl-theme";

function getInitial(): boolean {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

export function useDarkMode() {
  const [dark, setDark] = useState(getInitial);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem(KEY, dark ? "dark" : "light");
    } catch {
      // ignore
    }
  }, [dark]);

  return { dark, toggle: () => setDark((v) => !v) };
}
