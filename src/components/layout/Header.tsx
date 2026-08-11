"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { RefreshCw, Search, Bell, ShieldCheck, Command } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import CommandPaletteModal from "@/components/ui/CommandPaletteModal";

export default function Header() {
  const pathname = usePathname();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Hide header on landing and login pages
  if (pathname === "/" || pathname === "/login") {
    return null;
  }

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await fetch("/api/sync", { method: "POST" });
    } catch {
      // Graceful catch for offline mode
    } finally {
      setTimeout(() => setIsSyncing(false), 1200);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-xl transition-colors dark:border-zinc-800/80 dark:bg-zinc-950/60 pl-72">
        {/* Search Input Bar (Triggers Cmd+K Modal) */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex h-9 w-80 items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-xs text-zinc-500 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:border-zinc-700"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-zinc-400" />
            <span>Search repositories, commits...</span>
          </div>
          <kbd className="flex items-center gap-0.5 rounded border border-zinc-200 bg-zinc-100 px-1.5 text-[10px] font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
            <Command className="h-2.5 w-2.5" /> K
          </kbd>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 sm:flex">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>100% Offline Guard</span>
          </div>

          <ThemeToggle />

          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:bg-violet-500 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Rescan Git"}</span>
          </button>

          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-900 transition-colors dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:text-white">
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </>
  );
}
