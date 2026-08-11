"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-xl border border-zinc-800 bg-zinc-900/60 dark:bg-zinc-900/60 dark:border-zinc-800" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle dark and light theme"
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
    >
      {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-violet-600" />}
    </button>
  );
}
