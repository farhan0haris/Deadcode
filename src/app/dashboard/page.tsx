"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FolderGit2,
  GitCommit,
  Flame,
  Code2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Plus,
  Minus,
  CheckCircle2,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const languageData = [
  { name: "TypeScript", value: 65, color: "#7C5CFC" },
  { name: "Python", value: 20, color: "#10B981" },
  { name: "React / TSX", value: 10, color: "#3B82F6" },
  { name: "CSS / SCSS", value: 5, color: "#F59E0B" },
];

export default function DashboardPage() {
  const [selectedDiff, setSelectedDiff] = useState<boolean>(false);

  return (
    <div className="space-y-8 p-8 pl-72 transition-colors">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Command Center
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Overview of your local & synced developer journey across all repositories.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/today"
            className="flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-600/10 px-4 py-2 text-xs font-semibold text-violet-600 hover:bg-violet-600/20 dark:text-violet-300 dark:hover:bg-violet-600/30 transition-colors shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>View On This Day</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Repositories</span>
            <FolderGit2 className="h-4 w-4 text-violet-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-zinc-900 dark:text-white">87</span>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" /> Active Sync
            </span>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Total Commits</span>
            <GitCommit className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-zinc-900 dark:text-white">14,291</span>
            <span className="text-[10px] text-zinc-500">+12 this week</span>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Longest Streak</span>
            <Flame className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-zinc-900 dark:text-white">19 Days</span>
            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
              🔥 Fire
            </span>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Primary Tech</span>
            <Code2 className="h-4 w-4 text-cyan-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">TypeScript</span>
            <span className="text-[10px] font-semibold text-violet-500">78%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: On This Day & Language Pie */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* On This Day Memories */}
        <div className="glass-panel rounded-2xl p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-violet-500" />
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                On This Day Memories
              </h2>
            </div>
            <Link
              href="/today"
              className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
            >
              <span>See all</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {/* Memory Card 1 */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 transition-all hover:border-zinc-300 dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:hover:border-zinc-700">
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span className="rounded-md bg-violet-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-violet-700 dark:bg-violet-950 dark:text-violet-300 dark:border dark:border-violet-800/40">
                  1 Year Ago Today
                </span>
                <span>Nov 14, 2023</span>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">
                Refactor user authentication module & NextAuth integration
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Repository: <span className="font-mono text-zinc-800 dark:text-zinc-300">deadcode/auth</span>
              </p>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800/60">
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <Plus className="h-3 w-3" /> 142
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                    <Minus className="h-3 w-3" /> 38
                  </span>
                </div>
                <button
                  onClick={() => setSelectedDiff(!selectedDiff)}
                  className="text-xs font-medium text-violet-600 hover:underline dark:text-violet-400"
                >
                  {selectedDiff ? "Hide Diff" : "Inspect Diff"}
                </button>
              </div>

              {/* Inline Diff Viewer */}
              {selectedDiff && (
                <div className="mt-3 rounded-lg border border-zinc-200 bg-zinc-900 p-3 font-mono text-xs text-zinc-300 dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="text-zinc-500 mb-1">--- a/src/lib/auth.ts</div>
                  <div className="text-zinc-500 mb-2">+++ b/src/lib/auth.ts</div>
                  <div className="text-emerald-400 bg-emerald-950/40 px-1 py-0.5 rounded">
                    + export const authOptions: NextAuthOptions = &#123; providers: [GithubProvider] &#125;;
                  </div>
                  <div className="text-rose-400 bg-rose-950/40 px-1 py-0.5 rounded mt-1">
                    - const legacyAuth = require('./old_auth');
                  </div>
                </div>
              )}
            </div>

            {/* Memory Card 2 */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 transition-all hover:border-zinc-300 dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:hover:border-zinc-700">
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span className="rounded-md bg-indigo-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 dark:border dark:border-indigo-800/40">
                  2 Years Ago Today
                </span>
                <span>Nov 14, 2022</span>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">
                Initial Commit: DeadCode Analytics Engine & SQLite Parser
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Repository: <span className="font-mono text-zinc-800 dark:text-zinc-300">deadcode/core</span>
              </p>
            </div>
          </div>
        </div>

        {/* Language Breakdown */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Language Breakdown</h2>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderColor: "#27272a",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800/60">
            {languageData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-zinc-700 dark:text-zinc-300">{item.name}</span>
                </div>
                <span className="font-semibold text-zinc-500 dark:text-zinc-400">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
