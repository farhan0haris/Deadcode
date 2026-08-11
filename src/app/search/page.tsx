"use client";

import { useState } from "react";
import { Search, GitCommit, FolderGit2 } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-8 p-8 pl-72">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Instant Search
        </h1>
        <p className="text-xs text-zinc-400">
          Full-text search across all your indexed commits, repositories, and authors.
        </p>
      </div>

      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type keywords (e.g. auth, refactor, postgres, initial)..."
          className="h-12 w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 pl-12 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-violet-500 focus:outline-none"
        />
      </div>

      {query && (
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Search Results for "{query}"
          </h2>
          <div className="glass-panel rounded-2xl p-4 text-xs text-zinc-300">
            <div className="flex items-center gap-2 font-semibold text-white">
              <GitCommit className="h-4 w-4 text-violet-400" />
              <span>feat: implement GitHub OAuth provider & JWT session refresh</span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">Repo: deadcode/auth-service • Nov 14, 2023</p>
          </div>
        </div>
      )}
    </div>
  );
}
