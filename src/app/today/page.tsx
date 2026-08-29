"use client";

import { useState, useEffect } from "react";
import { Plus, Minus, Filter, Sparkles, FolderGit2, Inbox } from "lucide-react";
import { getStoredSyncData, FullSyncData } from "@/lib/githubSync";
import Link from "next/link";

export default function OnThisDayPage() {
  const [openDiffId, setOpenDiffId] = useState<string | null>(null);
  const [syncData, setSyncData] = useState<FullSyncData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const data = getStoredSyncData();
    if (data) setSyncData(data);

    const handleUpdate = () => setSyncData(getStoredSyncData());
    window.addEventListener("deadcode_sync_updated", handleUpdate);
    return () => window.removeEventListener("deadcode_sync_updated", handleUpdate);
  }, []);

  const repos = syncData?.repos || [];
  const username = syncData?.user?.login;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
    }, 600);
  };

  return (
    <div className="space-y-8 p-8 pl-72">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#74B4D9] mb-1">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-black uppercase tracking-wider">
              Time Machine + AI Memory
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#EBEBEB]">
            On This Day & Developer Memory
          </h1>
          <p className="text-xs text-[#EBEBEB]/70 font-medium">
            {username ? `Commits and milestone memories across your connected repositories (@${username}).` : "Commits and milestone memories across your connected repositories."}
          </p>
        </div>
      </div>

      {/* AI Developer Memory Search Bar */}
      <div className="bg-[#10367D]/40 border border-[#74B4D9]/30 rounded-2xl p-4 backdrop-blur-md shadow-lg">
        <form onSubmit={handleSearch} className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ask AI memory: 'What was I working on last year around auth or state?'"
            className="flex-1 bg-[#071330] border border-[#74B4D9]/40 text-white text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#74B4D9] placeholder:text-white/40 font-medium"
          />
          <button
            type="submit"
            disabled={searching || !searchQuery.trim()}
            className="px-4 py-2.5 bg-[#74B4D9] text-[#0A1A3F] font-bold text-xs rounded-xl hover:bg-white transition-all shadow-md disabled:opacity-50"
          >
            {searching ? "Searching Memory..." : "Search Memory"}
          </button>
        </form>
      </div>

      {/* Memory Feed Cards / Real Data or Empty State */}
      {!syncData || repos.length === 0 ? (
        <div className="bg-[#10367D]/20 border border-[#74B4D9]/20 rounded-2xl p-12 text-center space-y-4 backdrop-blur-md">
          <Inbox className="w-12 h-12 text-[#74B4D9]/50 mx-auto" />
          <h2 className="text-lg font-bold text-white">No Commits Found for This Period</h2>
          <p className="text-xs text-[#EBEBEB]/70 max-w-md mx-auto">
            Connect your GitHub account to sync real commit activity and unlock developer memory milestones.
          </p>
          <Link
            href="/settings"
            className="inline-block px-5 py-2.5 bg-[#74B4D9] text-[#0A1A3F] font-bold text-xs rounded-xl hover:bg-white transition-all shadow-md"
          >
            Connect GitHub Account
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {repos.slice(0, 3).map((repo, idx) => (
            <div
              key={repo.id}
              className="glass-panel glass-panel-hover rounded-2xl p-6 transition-all space-y-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-[#10367D] border border-[#74B4D9]/30 px-3 py-1 text-xs font-bold text-[#EBEBEB] shadow-sm">
                    Repository Memory #{idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-[#EBEBEB]/70">
                    Updated {new Date(repo.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <span className="font-mono text-xs text-[#EBEBEB]/70">
                  Repo: <strong className="text-[#74B4D9] font-bold">{repo.fullName}</strong>
                </span>
              </div>

              <h3 className="text-base font-extrabold text-[#EBEBEB]">
                {repo.description || "Synchronized repository workspace memory"}
              </h3>

              <div className="flex items-center justify-between pt-3 border-t border-[#74B4D9]/15">
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-[#74B4D9] font-bold">Branch: {repo.defaultBranch}</span>
                  <span className="text-[#EBEBEB]/60 font-medium">Language: {repo.language}</span>
                </div>
                <a
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#74B4D9] hover:underline"
                >
                  View on GitHub →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

