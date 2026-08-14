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
  { name: "TypeScript", value: 65, color: "#10367D" },
  { name: "Python", value: 20, color: "#1d52b5" },
  { name: "React / TSX", value: 10, color: "#74B4D9" },
  { name: "CSS / SCSS", value: 5, color: "#a5d5f2" },
];

export default function DashboardPage() {
  const [selectedDiff, setSelectedDiff] = useState<boolean>(false);

  return (
    <div className="space-y-8 p-8 pl-72 transition-colors">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#EBEBEB]">
            Command Center
          </h1>
          <p className="text-xs text-[#EBEBEB]/70 font-medium">
            Overview of your local & synced developer journey across all repositories.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/today"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#10367D] via-[#1647a3] to-[#74B4D9] px-4 py-2 text-xs font-bold text-[#EBEBEB] border border-[#74B4D9]/40 shadow-md shadow-[#10367D]/30 transition-all hover:scale-105"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>View On This Day</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between text-[#EBEBEB]/70">
            <span className="text-xs font-bold">Repositories</span>
            <FolderGit2 className="h-4 w-4 text-[#74B4D9]" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#EBEBEB]">87</span>
            <span className="flex items-center gap-1 rounded-full bg-emerald-600/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              <CheckCircle2 className="h-3 w-3" /> Active Sync
            </span>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between text-[#EBEBEB]/70">
            <span className="text-xs font-bold">Total Commits</span>
            <GitCommit className="h-4 w-4 text-[#74B4D9]" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#EBEBEB]">14,291</span>
            <span className="text-[10px] text-[#74B4D9] font-semibold">+12 this week</span>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between text-[#EBEBEB]/70">
            <span className="text-xs font-bold">Longest Streak</span>
            <Flame className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#EBEBEB]">19 Days</span>
            <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
              🔥 Fire
            </span>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between text-[#EBEBEB]/70">
            <span className="text-xs font-bold">Primary Tech</span>
            <Code2 className="h-4 w-4 text-[#74B4D9]" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#EBEBEB]">TypeScript</span>
            <span className="text-[10px] font-bold text-[#74B4D9]">78%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: On This Day & Language Pie */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* On This Day Memories */}
        <div className="glass-panel rounded-2xl p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#74B4D9]" />
              <h2 className="text-base font-extrabold text-[#EBEBEB]">
                On This Day Memories
              </h2>
            </div>
            <Link
              href="/today"
              className="flex items-center gap-1 text-xs font-bold text-[#74B4D9] underline hover:opacity-80"
            >
              <span>See all</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {/* Memory Card 1 */}
            <div className="rounded-xl border border-[#74B4D9]/15 bg-[#091836]/60 p-4 transition-all hover:border-[#74B4D9]/30">
              <div className="flex items-center justify-between text-xs text-[#EBEBEB]/70">
                <span className="rounded-md bg-[#10367D] border border-[#74B4D9]/30 px-2 py-0.5 font-mono text-[11px] font-bold text-[#EBEBEB]">
                  1 Year Ago Today
                </span>
                <span className="font-semibold">Nov 14, 2023</span>
              </div>
              <h3 className="mt-2 text-sm font-extrabold text-[#EBEBEB]">
                Refactor user authentication module & NextAuth integration
              </h3>
              <p className="mt-1 text-xs text-[#EBEBEB]/70 font-medium">
                Repository: <span className="font-mono text-[#74B4D9] font-bold">deadcode/auth</span>
              </p>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#74B4D9]/15">
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 font-bold text-emerald-400">
                    <Plus className="h-3 w-3" /> 142
                  </span>
                  <span className="flex items-center gap-1 font-bold text-rose-400">
                    <Minus className="h-3 w-3" /> 38
                  </span>
                </div>
                <button
                  onClick={() => setSelectedDiff(!selectedDiff)}
                  className="text-xs font-bold text-[#74B4D9] underline hover:opacity-80"
                >
                  {selectedDiff ? "Hide Diff" : "Inspect Diff"}
                </button>
              </div>

              {/* Inline Diff Viewer */}
              {selectedDiff && (
                <div className="mt-3 rounded-lg border border-[#74B4D9]/30 bg-[#061229] p-3 font-mono text-xs text-[#EBEBEB]">
                  <div className="text-[#74B4D9]/70 mb-1">--- a/src/lib/auth.ts</div>
                  <div className="text-[#74B4D9]/70 mb-2">+++ b/src/lib/auth.ts</div>
                  <div className="text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded">
                    + export const authOptions: NextAuthOptions = &#123; providers: [GithubProvider] &#125;;
                  </div>
                  <div className="text-rose-300 bg-rose-950/60 px-1.5 py-0.5 rounded mt-1">
                    - const legacyAuth = require('./old_auth');
                  </div>
                </div>
              )}
            </div>

            {/* Memory Card 2 */}
            <div className="rounded-xl border border-[#74B4D9]/15 bg-[#091836]/60 p-4 transition-all hover:border-[#74B4D9]/30">
              <div className="flex items-center justify-between text-xs text-[#EBEBEB]/70">
                <span className="rounded-md bg-[#10367D] border border-[#74B4D9]/30 px-2 py-0.5 font-mono text-[11px] font-bold text-[#EBEBEB]">
                  2 Years Ago Today
                </span>
                <span className="font-semibold">Nov 14, 2022</span>
              </div>
              <h3 className="mt-2 text-sm font-extrabold text-[#EBEBEB]">
                Initial Commit: DeadCode Analytics Engine & SQLite Parser
              </h3>
              <p className="mt-1 text-xs text-[#EBEBEB]/70 font-medium">
                Repository: <span className="font-mono text-[#74B4D9] font-bold">deadcode/core</span>
              </p>
            </div>
          </div>
        </div>

        {/* Language Breakdown */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-extrabold text-[#EBEBEB]">Language Breakdown</h2>
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
                    backgroundColor: "#0d2452",
                    borderColor: "rgba(116, 180, 217, 0.3)",
                    borderRadius: "12px",
                    color: "#EBEBEB",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#74B4D9]/15">
            {languageData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[#EBEBEB] font-semibold">{item.name}</span>
                </div>
                <span className="font-extrabold text-[#74B4D9]">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
