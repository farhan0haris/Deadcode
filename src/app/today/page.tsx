"use client";

import { useState, useEffect } from "react";
import { Plus, Minus, Filter, Sparkles, FolderGit2, ExternalLink } from "lucide-react";
import { getStoredSyncData, FullSyncData } from "@/lib/githubSync";

export default function OnThisDayPage() {
  const [openDiffId, setOpenDiffId] = useState<string | null>("1");
  const [syncData, setSyncData] = useState<FullSyncData | null>(null);

  useEffect(() => {
    const data = getStoredSyncData();
    if (data) setSyncData(data);

    const handleUpdate = () => setSyncData(getStoredSyncData());
    window.addEventListener("deadcode_sync_updated", handleUpdate);
    return () => window.removeEventListener("deadcode_sync_updated", handleUpdate);
  }, []);

  const repos = syncData?.repos || [];
  const primaryRepo = repos[0]?.name || "Deadcode";
  const secondRepo = repos[1]?.name || "Aurashelf";
  const thirdRepo = repos[2]?.name || "prune";
  const username = syncData?.user.login || "farhan0haris";

  const memories = [
    {
      id: "1",
      yearAgo: 1,
      date: "August 14, 2025",
      repo: `${username}/${primaryRepo}`,
      commitMsg: `feat: implement ${repos[0]?.language || "TypeScript"} state architecture & cloud sync`,
      author: syncData?.user.name || "Farhan Haris",
      additions: 184,
      deletions: 42,
      files: 6,
      diff: `--- a/src/lib/sync.ts
+++ b/src/lib/sync.ts
@@ -10,4 +10,12 @@ export const syncOptions = {
+  repositories: [
+    "${username}/${primaryRepo}",
+    "${username}/${secondRepo}"
+  ]
+  mode: "offline-first-verified"`,
    },
    {
      id: "2",
      yearAgo: 2,
      date: "August 14, 2024",
      repo: `${username}/${secondRepo}`,
      commitMsg: `perf: optimize module bundling & initial repository indexing speed`,
      author: syncData?.user.name || "Farhan Haris",
      additions: 92,
      deletions: 34,
      files: 4,
      diff: `--- a/src/index.ts
+++ b/src/index.ts
@@ -45,3 +45,5 @@ export function initRepository() {
-  console.log("legacy scanner init");
+  return initializeEngine({ user: "${username}", mode: "real-time" });`,
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

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
            Commits and milestone memories across your connected repositories (@{username}).
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-[#74B4D9]/25 bg-[#74B4D9]/10 px-4 py-2 text-xs font-bold text-[#74B4D9] shadow-sm transition-all hover:bg-[#74B4D9]/20">
          <Filter className="h-3.5 w-3.5" />
          <span>Filter Years</span>
        </button>
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


      {/* Memory Feed Cards */}
      <div className="space-y-6">
        {memories.map((memory) => (
          <div
            key={memory.id}
            className="glass-panel glass-panel-hover rounded-2xl p-6 transition-all"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-[#10367D] border border-[#74B4D9]/30 px-3 py-1 text-xs font-bold text-[#EBEBEB] shadow-sm">
                  {memory.yearAgo} Year{memory.yearAgo > 1 ? "s" : ""} Ago
                </span>
                <span className="text-xs font-semibold text-[#EBEBEB]/70">
                  {memory.date}
                </span>
              </div>
              <span className="font-mono text-xs text-[#EBEBEB]/70">
                Repo: <strong className="text-[#74B4D9] font-bold">{memory.repo}</strong>
              </span>
            </div>

            <h3 className="mt-4 text-base font-extrabold text-[#EBEBEB]">
              {memory.commitMsg}
            </h3>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#74B4D9]/15">
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <Plus className="h-3.5 w-3.5" /> +{memory.additions}
                </span>
                <span className="flex items-center gap-1 text-rose-400 font-bold">
                  <Minus className="h-3.5 w-3.5" /> -{memory.deletions}
                </span>
                <span className="text-[#EBEBEB]/60 font-medium">{memory.files} files changed</span>
              </div>
              <button
                onClick={() =>
                  setOpenDiffId(openDiffId === memory.id ? null : memory.id)
                }
                className="text-xs font-bold text-[#74B4D9] underline hover:opacity-80 transition-opacity"
              >
                {openDiffId === memory.id ? "Close Diff" : "Inspect Diff"}
              </button>
            </div>

            {/* Diff Viewer */}
            {openDiffId === memory.id && (
              <div className="mt-4 rounded-xl border border-[#74B4D9]/30 bg-[#061229] p-4 font-mono text-xs leading-relaxed text-[#EBEBEB] overflow-x-auto shadow-inner">
                <pre>{memory.diff}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
