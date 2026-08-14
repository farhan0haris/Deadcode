"use client";

import { useState } from "react";
import { Search, GitCommit } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-8 p-8 pl-72">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-[#EBEBEB]">
          Instant Search
        </h1>
        <p className="text-xs text-[#EBEBEB]/70 font-medium">
          Full-text search across all your indexed commits, repositories, and authors.
        </p>
      </div>

      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#74B4D9]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type keywords (e.g. auth, refactor, postgres, initial)..."
          className="h-12 w-full rounded-2xl border border-[#74B4D9]/25 bg-[#091836]/70 pl-12 pr-4 text-sm text-[#EBEBEB] placeholder-[#EBEBEB]/40 focus:border-[#74B4D9] focus:outline-none font-bold"
        />
      </div>

      {query && (
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#74B4D9]">
            Search Results for "{query}"
          </h2>
          <div className="glass-panel rounded-2xl p-4 text-xs text-[#EBEBEB]">
            <div className="flex items-center gap-2 font-bold text-[#EBEBEB]">
              <GitCommit className="h-4 w-4 text-[#74B4D9]" />
              <span>feat: implement GitHub OAuth provider & JWT session refresh</span>
            </div>
            <p className="mt-1 text-[11px] text-[#74B4D9]/70 font-medium">Repo: deadcode/auth-service • Nov 14, 2023</p>
          </div>
        </div>
      )}
    </div>
  );
}
