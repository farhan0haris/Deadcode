"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
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
  RefreshCw,
  Star,
  GitFork,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import GithubIcon from "@/components/icons/GithubIcon";
import {
  FullSyncData,
  getStoredSyncData,
  triggerGitHubSync,
} from "@/lib/githubSync";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [syncData, setSyncData] = useState<FullSyncData | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);
  const [githubInput, setGithubInput] = useState("");
  const [selectedDiff, setSelectedDiff] = useState<boolean>(false);

  // Load stored sync data or auto-trigger sync if session / user profile exists
  useEffect(() => {
    const existing = getStoredSyncData();
    if (existing) {
      setSyncData(existing);
      setGithubInput(existing.user?.login || "");
    } else {
      // Check if user has a profile saved in localStorage
      const savedProfile = localStorage.getItem("deadcode_user_profile");
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed.github || parsed.username) {
            setGithubInput(parsed.github || parsed.username);
            handleSync(parsed.github || parsed.username);
          }
        } catch {
          // ignore
        }
      } else if (session?.user?.name) {
        setGithubInput(session.user.name);
      }
    }

    const handleUpdate = () => {
      setSyncData(getStoredSyncData());
    };
    window.addEventListener("deadcode_sync_updated", handleUpdate);
    return () => window.removeEventListener("deadcode_sync_updated", handleUpdate);
  }, [session]);

  const handleSync = async (usernameToSync?: string) => {
    const target = usernameToSync || githubInput.trim();
    if (!target) {
      setSyncError("Please enter your GitHub username.");
      return;
    }

    setIsSyncing(true);
    setSyncError(null);
    setSyncSuccess(null);

    try {
      const data = await triggerGitHubSync(target);
      setSyncData(data);
      setSyncSuccess(`Connected & synchronized ${data.repos.length} repositories for @${data.user.login}!`);
      setTimeout(() => setSyncSuccess(null), 4000);
    } catch (err: any) {
      setSyncError(err?.message || "Failed to synchronize GitHub account.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Default fallback language chart data if not yet synced
  const fallbackLanguages = [
    { name: "TypeScript", value: 65, color: "#74B4D9" },
    { name: "Python", value: 20, color: "#10367D" },
    { name: "React / TSX", value: 10, color: "#1d52b5" },
    { name: "CSS / HTML", value: 5, color: "#a5d5f2" },
  ];

  const languagesToDisplay =
    syncData && syncData.languages.length > 0
      ? syncData.languages
      : fallbackLanguages;

  return (
    <div className="space-y-8 p-8 pl-72 transition-colors">
      {/* Welcome Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#EBEBEB]">
            Command Center
          </h1>
          <p className="text-xs text-[#EBEBEB]/70 font-medium">
            Overview of your connected GitHub journey and real-time repository stream.
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

      {/* GitHub Real Sync Connection Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-[#74B4D9]/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10367D] text-[#74B4D9] border border-[#74B4D9]/40">
              <GithubIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-[#EBEBEB]">
                {syncData ? `Connected to GitHub: @${syncData.user.login}` : "Connect & Synchronize Your GitHub Account"}
              </h2>
              <p className="text-xs text-[#EBEBEB]/70 font-medium">
                {syncData
                  ? `Last synchronized: ${new Date(syncData.syncedAt).toLocaleTimeString()} (${syncData.repos.length} repos indexed)`
                  : "Enter your GitHub username to index all your real repositories and activity metrics."}
              </p>
            </div>
          </div>

          {/* Sync Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSync();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#74B4D9]">@</span>
              <input
                type="text"
                value={githubInput}
                onChange={(e) => setGithubInput(e.target.value)}
                placeholder="github_username"
                className="h-10 w-48 rounded-xl border border-[#74B4D9]/30 bg-[#061229] pl-7 pr-3 text-xs font-bold text-[#EBEBEB] placeholder-[#EBEBEB]/30 focus:border-[#74B4D9] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSyncing || !githubInput.trim()}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#10367D] via-[#1647a3] to-[#74B4D9] px-4 py-2 text-xs font-black text-[#EBEBEB] border border-[#74B4D9]/40 shadow-md transition-all hover:scale-105 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Syncing..." : syncData ? "Re-sync" : "Connect GitHub"}</span>
            </button>
          </form>
        </div>

        {/* Feedback Messages */}
        {syncError && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/50 p-3 text-xs font-bold text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{syncError}</span>
          </div>
        )}
        {syncSuccess && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/50 p-3 text-xs font-bold text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{syncSuccess}</span>
          </div>
        )}
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between text-[#EBEBEB]/70">
            <span className="text-xs font-bold">Repositories</span>
            <FolderGit2 className="h-4 w-4 text-[#74B4D9]" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#EBEBEB]">
              {syncData ? syncData.stats.reposCount : "0"}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-emerald-600/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              <CheckCircle2 className="h-3 w-3" /> {syncData ? "Synced" : "Awaiting Sync"}
            </span>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between text-[#EBEBEB]/70">
            <span className="text-xs font-bold">Total Stars</span>
            <Star className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#EBEBEB]">
              {syncData ? syncData.stats.totalStars : "0"}
            </span>
            <span className="text-[10px] text-[#74B4D9] font-semibold">
              {syncData ? `${syncData.stats.totalForks} forks` : "Public activity"}
            </span>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between text-[#EBEBEB]/70">
            <span className="text-xs font-bold">Activity Streak</span>
            <Flame className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#EBEBEB]">
              {syncData ? `${syncData.stats.streakDays} Days` : "0 Days"}
            </span>
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
            <span className="text-2xl font-black text-[#EBEBEB] truncate max-w-[130px]">
              {syncData ? syncData.stats.primaryTech : "TypeScript"}
            </span>
            <span className="text-[10px] font-bold text-[#74B4D9]">
              {syncData ? `${syncData.stats.primaryPercent}%` : "0%"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Synced Repositories & Language Breakdown */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Real Synced Repositories List */}
        <div className="glass-panel rounded-2xl p-6 lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderGit2 className="h-5 w-5 text-[#74B4D9]" />
              <h2 className="text-base font-extrabold text-[#EBEBEB]">
                {syncData ? `Indexed Repositories (${syncData.repos.length})` : "Repositories"}
              </h2>
            </div>
            <Link
              href="/repos"
              className="flex items-center gap-1 text-xs font-bold text-[#74B4D9] underline hover:opacity-80"
            >
              <span>Explore All</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Repositories Stream */}
          {syncData && syncData.repos.length > 0 ? (
            <div className="space-y-3">
              {syncData.repos.slice(0, 4).map((repo) => (
                <div
                  key={repo.id}
                  className="rounded-xl border border-[#74B4D9]/15 bg-[#091836]/60 p-4 transition-all hover:border-[#74B4D9]/30"
                >
                  <div className="flex items-center justify-between">
                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-extrabold text-sm text-[#EBEBEB] hover:text-[#74B4D9] transition-colors flex items-center gap-1.5"
                    >
                      <span>{repo.name}</span>
                      <ExternalLink className="h-3 w-3 text-[#74B4D9]/70" />
                    </a>
                    <span className="rounded-md bg-[#10367D] border border-[#74B4D9]/30 px-2 py-0.5 font-mono text-[10px] font-bold text-[#EBEBEB]">
                      {repo.language}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-[#EBEBEB]/70 line-clamp-1 font-medium">
                    {repo.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#74B4D9]/15 text-[11px] text-[#EBEBEB]/60">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-bold text-amber-400">
                        <Star className="h-3 w-3" /> {repo.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" /> {repo.forks}
                      </span>
                    </div>
                    <span>Updated {new Date(repo.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-[#74B4D9]/15 bg-[#091836]/40">
              <FolderGit2 className="h-10 w-10 text-[#74B4D9]/40 mb-2" />
              <h3 className="text-sm font-bold text-[#EBEBEB]">No Repositories Synced Yet</h3>
              <p className="mt-1 text-xs text-[#EBEBEB]/60 max-w-sm">
                Enter your GitHub username above or go to Settings to connect your repositories.
              </p>
            </div>
          )}
        </div>

        {/* Language Breakdown */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-extrabold text-[#EBEBEB]">Language Breakdown</h2>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languagesToDisplay}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {languagesToDisplay.map((entry, index) => (
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

          <div className="space-y-2 pt-2 border-t border-[#74B4D9]/15 max-h-48 overflow-y-auto pr-1">
            {languagesToDisplay.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[#EBEBEB] font-semibold truncate">{item.name}</span>
                </div>
                <span className="font-extrabold text-[#74B4D9] shrink-0">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
