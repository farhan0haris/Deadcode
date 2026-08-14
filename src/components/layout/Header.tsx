"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { RefreshCw, Search, Bell, ShieldCheck, Command, Home, ChevronRight } from "lucide-react";
import CommandPaletteModal from "@/components/ui/CommandPaletteModal";
import { triggerGitHubSync, getStoredSyncData } from "@/lib/githubSync";

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

  // Hide header on landing and login/register pages
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return null;
  }

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const existing = getStoredSyncData();
      await triggerGitHubSync(existing?.user?.login);
    } catch {
      // Graceful fallback
    } finally {
      setTimeout(() => setIsSyncing(false), 800);
    }
  };

  const pageTitleMap: Record<string, string> = {
    "/dashboard": "Command Center",
    "/today": "On This Day",
    "/repos": "Repository Explorer",
    "/timeline": "Commit Timeline",
    "/languages": "Language Evolution",
    "/heatmap": "Contribution Calendar",
    "/achievements": "Achievements & Trophies",
    "/wrapped": "Yearly Retrospective",
    "/search": "Instant Search",
    "/settings": "User Settings & Preferences",
  };

  const currentTitle = pageTitleMap[pathname] || "Developer Workspace";

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#74B4D9]/15 bg-[#091836]/90 px-6 backdrop-blur-2xl transition-colors pl-72">
        {/* Left: Home Navigation & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            title="Go to Home Landing Page"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#74B4D9]/20 bg-[#74B4D9]/10 text-[#74B4D9] transition-all hover:bg-[#74B4D9]/20 hover:scale-105"
          >
            <Home className="h-4 w-4" />
          </Link>

          <div className="hidden items-center gap-2 text-xs font-bold text-[#EBEBEB]/60 sm:flex">
            <Link href="/" className="hover:text-[#74B4D9] transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-[#74B4D9]/50" />
            <span className="text-[#EBEBEB] font-black">{currentTitle}</span>
          </div>
        </div>

        {/* Center: Search Bar (Triggers Cmd+K Modal) */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex h-9 w-72 items-center justify-between rounded-xl border border-[#74B4D9]/20 bg-[#74B4D9]/5 px-3 text-xs text-[#EBEBEB]/70 transition-colors hover:border-[#74B4D9]/40"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-[#74B4D9]" />
            <span>Search repositories, commits...</span>
          </div>
          <kbd className="flex items-center gap-0.5 rounded border border-[#74B4D9]/30 bg-[#74B4D9]/15 px-1.5 text-[10px] font-bold text-[#74B4D9]">
            <Command className="h-2.5 w-2.5" /> K
          </kbd>
        </button>

        {/* Right: Action Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400 lg:flex">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>GitHub Sync Active</span>
          </div>

          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#10367D] via-[#1647a3] to-[#10367D] px-3.5 py-1.5 text-xs font-black text-[#EBEBEB] border border-[#74B4D9]/40 shadow-md shadow-[#10367D]/40 transition-all hover:scale-105 hover:border-[#74B4D9] disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Rescan Git"}</span>
          </button>

          <button
            title="Notification Center"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#74B4D9]/20 bg-[#74B4D9]/5 text-[#74B4D9] hover:bg-[#74B4D9]/15 transition-colors"
          >
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
