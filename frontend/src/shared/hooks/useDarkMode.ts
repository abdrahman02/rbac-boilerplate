import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "theme";

function getInitialDark(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

interface DarkModeState {
  isDark: boolean;
  toggle: () => void;
}

export function useDarkMode(): DarkModeState {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const initial = getInitialDark();
    setIsDark(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, []);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
      return next;
    });
  }, []);

  return { isDark, toggle };
}
