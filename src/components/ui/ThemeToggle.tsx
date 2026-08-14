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
      <div className="h-9 w-9 rounded-xl border border-[#59171b]/20 bg-[#59171b]/5 dark:border-[#fed7b8]/20 dark:bg-[#fed7b8]/5" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle dark and light theme"
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#59171b]/20 bg-[#59171b]/5 text-[#59171b] shadow-sm transition-all hover:bg-[#59171b]/10 dark:border-[#fed7b8]/20 dark:bg-[#fed7b8]/10 dark:text-[#fed7b8] dark:hover:bg-[#fed7b8]/20"
    >
      {isDark ? <Sun className="h-4 w-4 text-[#fed7b8]" /> : <Moon className="h-4 w-4 text-[#59171b]" />}
    </button>
  );
}
