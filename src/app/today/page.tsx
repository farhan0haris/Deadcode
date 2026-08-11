"use client";

import { useState } from "react";
import { Calendar, GitCommit, Plus, Minus, Filter, Sparkles } from "lucide-react";

const mockMemories = [
  {
    id: "1",
    yearAgo: 1,
    date: "November 14, 2023",
    repo: "deadcode/auth-service",
    commitMsg: "feat: implement GitHub OAuth provider & JWT session refresh",
    author: "Farhan Haris",
    additions: 184,
    deletions: 42,
    files: 6,
    diff: `--- a/src/lib/auth.ts
+++ b/src/lib/auth.ts
@@ -10,4 +10,12 @@ export const authOptions = {
+  providers: [
+    GithubProvider({
+      clientId: process.env.GITHUB_ID,
+      clientSecret: process.env.GITHUB_SECRET,
+    })
+  ]`,
  },
  {
    id: "2",
    yearAgo: 2,
    date: "November 14, 2022",
    repo: "clever-planck/git-engine",
    commitMsg: "perf: optimize subprocess git log parser speed by 400%",
    author: "Farhan Haris",
    additions: 92,
    deletions: 110,
    files: 4,
    diff: `--- a/backend/scanner.py
+++ b/backend/scanner.py
@@ -45,3 +45,5 @@ def scan_repo(path):
-    process = subprocess.Popen(["git", "log"], stdout=subprocess.PIPE)
+    process = subprocess.Popen(["git", "log", "--numstat", "--pretty=format:%H|%an|%ad|%s"], stdout=subprocess.PIPE)`,
  },
];

export default function OnThisDayPage() {
  const [openDiffId, setOpenDiffId] = useState<string | null>("1");

  return (
    <div className="space-y-8 p-8 pl-72">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-violet-400 mb-1">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Time Machine
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            On This Day
          </h1>
          <p className="text-xs text-zinc-400">
            Commits pushed on this exact day in previous years of your coding journey.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800">
          <Filter className="h-3.5 w-3.5" />
          <span>Filter Years</span>
        </button>
      </div>

      {/* Memory Feed Cards */}
      <div className="space-y-6">
        {mockMemories.map((memory) => (
          <div
            key={memory.id}
            className="glass-panel glass-panel-hover rounded-2xl p-6 transition-all"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-violet-950 px-3 py-1 text-xs font-bold text-violet-300 border border-violet-800/40">
                  {memory.yearAgo} Year{memory.yearAgo > 1 ? "s" : ""} Ago
                </span>
                <span className="text-xs font-medium text-zinc-400">
                  {memory.date}
                </span>
              </div>
              <span className="font-mono text-xs text-zinc-400">
                Repo: <strong className="text-zinc-200">{memory.repo}</strong>
              </span>
            </div>

            <h3 className="mt-4 text-base font-bold text-white">
              {memory.commitMsg}
            </h3>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-zinc-800/60">
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <Plus className="h-3.5 w-3.5" /> +{memory.additions}
                </span>
                <span className="flex items-center gap-1 text-rose-400 font-semibold">
                  <Minus className="h-3.5 w-3.5" /> -{memory.deletions}
                </span>
                <span className="text-zinc-500">{memory.files} files changed</span>
              </div>
              <button
                onClick={() =>
                  setOpenDiffId(openDiffId === memory.id ? null : memory.id)
                }
                className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
              >
                {openDiffId === memory.id ? "Close Diff" : "Inspect Diff"}
              </button>
            </div>

            {/* Diff Viewer */}
            {openDiffId === memory.id && (
              <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-300 overflow-x-auto">
                <pre>{memory.diff}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
