"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PrivacyToggle } from "@/components/PrivacyToggle";
import { getStoredSyncData, FullSyncData } from "@/lib/githubSync";
import { 
  Bot, 
  ShieldCheck, 
  FileText, 
  Clock, 
  Code2, 
  GitBranch, 
  Sparkles,
  ArrowRight,
  Terminal,
  AlertTriangle,
  FolderGit2,
  Inbox
} from "lucide-react";

export default function DashboardPage() {
  const [syncData, setSyncData] = useState<FullSyncData | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<string>("");

  useEffect(() => {
    const data = getStoredSyncData();
    if (data) {
      setSyncData(data);
      if (data.repos && data.repos.length > 0) {
        setSelectedRepo(data.repos[0].fullName);
      }
    }

    const handleUpdate = () => {
      const updated = getStoredSyncData();
      setSyncData(updated);
      if (updated?.repos && updated.repos.length > 0 && !selectedRepo) {
        setSelectedRepo(updated.repos[0].fullName);
      }
    };

    window.addEventListener("deadcode_sync_updated", handleUpdate);
    return () => window.removeEventListener("deadcode_sync_updated", handleUpdate);
  }, [selectedRepo]);

  const repos = syncData?.repos || [];
  const user = syncData?.user;
  const stats = syncData?.stats;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8 font-sans">
      {/* Top Header & Privacy Bar */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#10367D]/40 backdrop-blur-xl p-6 rounded-2xl border border-[#74B4D9]/20 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <Terminal className="w-7 h-7 text-[#74B4D9]" />
              DeadCode <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#74B4D9]/20 text-[#74B4D9] border border-[#74B4D9]/30">v3.0 Intelligence</span>
            </h1>
          </div>
          <p className="text-sm text-[#EBEBEB]/70">
            {user ? `Connected to GitHub as @${user.login}` : "Developer Memory Stream + AI Codebase Intelligence"}
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {repos.length > 0 ? (
            <select 
              value={selectedRepo} 
              onChange={(e) => setSelectedRepo(e.target.value)}
              className="bg-[#071330] border border-[#74B4D9]/40 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#74B4D9]"
            >
              {repos.map((r) => (
                <option key={r.id} value={r.fullName}>
                  {r.fullName}
                </option>
              ))}
            </select>
          ) : (
            <Link
              href="/settings"
              className="text-xs font-bold text-[#74B4D9] bg-[#74B4D9]/10 px-3 py-2 rounded-xl border border-[#74B4D9]/30 hover:bg-[#74B4D9]/20 transition-all flex items-center gap-1.5"
            >
              <FolderGit2 className="w-3.5 h-3.5" /> Connect GitHub Account
            </Link>
          )}
          <PrivacyToggle />
        </div>
      </header>

      {/* Main Core Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link href="/chat" className="group bg-gradient-to-br from-[#10367D]/60 to-[#0A1A3F]/80 p-6 rounded-2xl border border-[#74B4D9]/30 hover:border-[#74B4D9] transition-all hover:shadow-2xl hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#74B4D9]/20 rounded-xl text-[#74B4D9] group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-[#EBEBEB]/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">AI Codebase Chat</h3>
          <p className="text-xs text-[#EBEBEB]/70">Ask questions, explain functions, and query connected repository context.</p>
        </Link>

        <Link href="/audit" className="group bg-gradient-to-br from-[#10367D]/60 to-[#0A1A3F]/80 p-6 rounded-2xl border border-[#74B4D9]/30 hover:border-emerald-400 transition-all hover:shadow-2xl hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">Code Audit</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Code Health Audit</h3>
          <p className="text-xs text-[#EBEBEB]/70">Scan repositories for potential security risks, bugs, and performance bottlenecks.</p>
        </Link>

        <Link href="/docs-gen" className="group bg-gradient-to-br from-[#10367D]/60 to-[#0A1A3F]/80 p-6 rounded-2xl border border-[#74B4D9]/30 hover:border-amber-400 transition-all hover:shadow-2xl hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-400/20 rounded-xl text-amber-400 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Documentation Gen</h3>
          <p className="text-xs text-[#EBEBEB]/70">Auto-generate READMEs, API specifications, and architecture explanations.</p>
        </Link>

        <Link href="/today" className="group bg-gradient-to-br from-[#10367D]/60 to-[#0A1A3F]/80 p-6 rounded-2xl border border-[#74B4D9]/30 hover:border-purple-400 transition-all hover:shadow-2xl hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-300 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">AI Memory</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">On This Day</h3>
          <p className="text-xs text-[#EBEBEB]/70">Search historical commit activity using natural language developer memory.</p>
        </Link>
      </div>

      {/* Repository Stats & Health Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#10367D]/30 border border-[#74B4D9]/20 rounded-2xl p-6 backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#74B4D9]" />
              Repository Intelligence Stream
            </h2>
            <Link href="/repos" className="text-xs text-[#74B4D9] hover:underline flex items-center gap-1 font-semibold">
              Manage Repos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats ? (
            <div className="grid grid-cols-3 gap-4 bg-[#071330]/80 p-4 rounded-xl border border-white/5">
              <div>
                <p className="text-xs text-[#EBEBEB]/60">Connected Repositories</p>
                <p className="text-2xl font-black text-white mt-1">{stats.reposCount}</p>
              </div>
              <div>
                <p className="text-xs text-[#EBEBEB]/60">Total Stars Earned</p>
                <p className="text-2xl font-black text-[#74B4D9] mt-1">{stats.totalStars}</p>
              </div>
              <div>
                <p className="text-xs text-[#EBEBEB]/60">Primary Language</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">{stats.primaryTech}</p>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#071330]/60 rounded-xl text-center space-y-2 border border-white/5">
              <Inbox className="w-8 h-8 text-[#74B4D9]/50 mx-auto" />
              <p className="text-xs text-[#EBEBEB]/70">No synchronized GitHub repository data available.</p>
              <Link href="/settings" className="inline-block text-xs font-bold text-[#74B4D9] hover:underline">
                Sync GitHub Account in Settings →
              </Link>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/90">Synchronized GitHub Repositories</h3>
            {repos.length > 0 ? (
              <div className="space-y-2">
                {repos.slice(0, 4).map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 text-xs hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <GitBranch className="w-4 h-4 text-[#74B4D9]" />
                      <div>
                        <p className="font-semibold text-white">{r.fullName}</p>
                        <p className="text-[#EBEBEB]/50 text-[11px]">{r.description || "No description."}</p>
                      </div>
                    </div>
                    <span className="text-[#74B4D9] font-mono">{r.language || "Other"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#EBEBEB]/50 py-4 text-center">No repositories connected yet.</p>
            )}
          </div>
        </div>

        {/* Code Health Widget */}
        <div className="bg-[#10367D]/30 border border-[#74B4D9]/20 rounded-2xl p-6 backdrop-blur-md space-y-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Code Health Overview
          </h2>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#071330]/60 rounded-xl border border-white/5 space-y-2">
              <p className="text-white/80 font-medium leading-relaxed">
                Run an automated audit on your connected repositories to analyze security posture, detect bug risks, and generate GitHub issues.
              </p>
            </div>

            <div>
              <Link href="/audit" className="w-full py-2.5 bg-[#74B4D9] text-[#0A1A3F] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-all shadow-md">
                Launch Code Health Audit <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

