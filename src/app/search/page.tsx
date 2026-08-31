"use client";

import { useState, useEffect } from "react";
import { Search, FolderGit2, ExternalLink, Star, GitFork, Lock, Globe } from "lucide-react";
import { getStoredSyncData, SyncedRepo } from "@/lib/githubSync";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [repos, setRepos] = useState<SyncedRepo[]>([]);

  useEffect(() => {
    const data = getStoredSyncData();
    if (data) setRepos(data.repos);

    const handleUpdate = () => {
      const updated = getStoredSyncData();
      if (updated) setRepos(updated.repos);
    };
    window.addEventListener("deadcode_sync_updated", handleUpdate);
    return () => window.removeEventListener("deadcode_sync_updated", handleUpdate);
  }, []);

  const results = repos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(query.toLowerCase()) ||
      repo.description.toLowerCase().includes(query.toLowerCase()) ||
      repo.language.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-[#EBEBEB]">
          Instant Search
        </h1>
        <p className="text-xs text-[#EBEBEB]/70 font-medium">
          Full-text instant filter across your {repos.length} synchronized repositories, languages, and files.
        </p>
      </div>

      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#74B4D9]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search repositories, technologies, or keywords..."
          className="h-12 w-full rounded-2xl border border-[#74B4D9]/25 bg-[#091836]/70 pl-12 pr-4 text-sm text-[#EBEBEB] placeholder-[#EBEBEB]/40 focus:border-[#74B4D9] focus:outline-none font-bold"
        />
      </div>

      {query && (
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#74B4D9]">
            Search Results for "{query}" ({results.length} found)
          </h2>
          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map((repo) => (
                <div key={repo.id} className="glass-panel rounded-2xl p-4 text-xs text-[#EBEBEB]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-[#EBEBEB]">
                      <FolderGit2 className="h-4 w-4 text-[#74B4D9]" />
                      <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-[#74B4D9] transition-colors flex items-center gap-1"
                      >
                        <span>{repo.name}</span>
                        <ExternalLink className="h-3 w-3 text-[#74B4D9]/60" />
                      </a>
                    </div>
                    <span className="text-[10px] font-bold text-[#74B4D9] bg-[#10367D] px-2 py-0.5 rounded">
                      {repo.language}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-[#EBEBEB]/70 font-medium">
                    {repo.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#EBEBEB]/60">No repositories matching "{query}".</p>
          )}
        </div>
      )}
    </div>
  );
}
