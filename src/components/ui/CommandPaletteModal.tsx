"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, GitCommit, FolderGit2, Calendar, Sparkles, X } from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  category: string;
  href: string;
  icon: any;
}

const commands: CommandItem[] = [
  { id: "1", title: "Go to Command Center Dashboard", category: "Navigation", href: "/dashboard", icon: Sparkles },
  { id: "2", title: "View On This Day Memories", category: "Navigation", href: "/today", icon: Calendar },
  { id: "3", title: "Explore Repositories", category: "Navigation", href: "/repos", icon: FolderGit2 },
  { id: "4", title: "Yearly Retrospective (Wrapped)", category: "Navigation", href: "/wrapped", icon: Sparkles },
  { id: "5", title: "deadcode — Privacy-first Git time machine", category: "Repositories", href: "/repos", icon: FolderGit2 },
  { id: "6", title: "clever-planck — Full-stack Next.js SaaS engine", category: "Repositories", href: "/repos", icon: FolderGit2 },
  { id: "7", title: "feat: implement GitHub OAuth provider & JWT session", category: "Commits", href: "/today", icon: GitCommit },
  { id: "8", title: "perf: optimize subprocess git log parser speed by 400%", category: "Commits", href: "/today", icon: GitCommit },
];

export default function CommandPaletteModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const filteredCommands: CommandItem[] = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
        e.preventDefault();
        router.push(filteredCommands[selectedIndex].href);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-[#091836]/80 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-2xl border border-[#74B4D9]/30 bg-[#0d2452] p-4 shadow-2xl">
        {/* Search Bar */}
        <div className="relative flex items-center border-b border-[#74B4D9]/20 pb-3">
          <Search className="h-5 w-5 text-[#74B4D9]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="ml-3 flex-1 bg-transparent text-sm font-medium text-[#EBEBEB] placeholder-[#EBEBEB]/40 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#74B4D9] hover:bg-[#74B4D9]/15"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="mt-3 max-h-80 overflow-y-auto space-y-1">
          {filteredCommands.length === 0 ? (
            <p className="p-4 text-center text-xs text-[#EBEBEB]/60">No results found.</p>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    router.push(cmd.href);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs transition-colors ${
                    isSelected
                      ? "bg-gradient-to-r from-[#10367D] via-[#1647a3] to-[#74B4D9] text-[#EBEBEB] font-bold border border-[#74B4D9]/40 shadow-md shadow-[#10367D]/30"
                      : "text-[#EBEBEB]/80 hover:bg-[#74B4D9]/10 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={isSelected ? "h-4 w-4 shrink-0 text-[#EBEBEB]" : "h-4 w-4 shrink-0 text-[#74B4D9]"} />
                    <span className="truncate">{cmd.title}</span>
                  </div>
                  <span className="text-[10px] text-[#74B4D9] font-mono">{cmd.category}</span>
                </button>
              );
            })
          )}
        </div>

        {/* Hints */}
        <div className="mt-3 flex items-center justify-between border-t border-[#74B4D9]/20 pt-2.5 text-[10px] text-[#EBEBEB]/60 font-medium">
          <div className="flex items-center gap-3">
            <span><kbd className="rounded border border-[#74B4D9]/30 bg-[#74B4D9]/15 px-1 text-[#74B4D9]">↑↓</kbd> navigate</span>
            <span><kbd className="rounded border border-[#74B4D9]/30 bg-[#74B4D9]/15 px-1 text-[#74B4D9]">↵</kbd> select</span>
            <span><kbd className="rounded border border-[#74B4D9]/30 bg-[#74B4D9]/15 px-1 text-[#74B4D9]">esc</kbd> close</span>
          </div>
          <span className="text-[#74B4D9] font-bold">DeadCode Cmd+K</span>
        </div>
      </div>
    </div>
  );
}
