"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, FolderGit2, Star, GitFork, ExternalLink, Code2 } from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import { getStoredSyncData, FullSyncData } from "@/lib/githubSync";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const [syncData, setSyncData] = useState<FullSyncData | null>(null);

  useEffect(() => {
    const data = getStoredSyncData();
    if (data) setSyncData(data);

    const handleUpdate = () => setSyncData(getStoredSyncData());
    window.addEventListener("deadcode_sync_updated", handleUpdate);
    return () => window.removeEventListener("deadcode_sync_updated", handleUpdate);
  }, []);

  const displayHandle = syncData?.user.login || username;
  const displayName = syncData?.user.name || displayHandle;
  const avatarUrl = syncData?.user.avatarUrl || `https://avatars.githubusercontent.com/u/187423461?v=4`;
  const reposCount = syncData?.stats.reposCount || 6;
  const streakDays = syncData?.stats.streakDays || 13;
  const totalStars = syncData?.stats.totalStars || 0;
  const primaryTech = syncData?.stats.primaryTech || "TypeScript";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Navigation Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-bold text-[#74B4D9] hover:text-[#EBEBEB] transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Command Center</span>
      </Link>

      {/* Profile Card */}
      <div className="glass-panel rounded-3xl p-8 space-y-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-20 w-20 rounded-2xl border border-[#74B4D9]/40 object-cover shadow-xl"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10367D] to-[#1d52b5] text-3xl font-black text-[#EBEBEB] shadow-xl border border-[#74B4D9]/30">
                {displayHandle[0]?.toUpperCase() || "D"}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-black text-[#EBEBEB] tracking-tight">
                {displayName} <span className="text-[#74B4D9] text-lg font-bold">(@{displayHandle})</span>
              </h1>
              <p className="text-xs text-[#EBEBEB]/70 font-medium mt-0.5">
                {syncData?.user.bio || "Verified Open Source Contributor & DeadCode Developer"}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs font-bold text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>100% Privacy-Verified & Git Journey Synced</span>
              </div>
            </div>
          </div>

          <a
            href={syncData?.user.htmlUrl || `https://github.com/${displayHandle}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl border border-[#74B4D9]/40 bg-gradient-to-r from-[#10367D] to-[#1a4a9c] px-4 py-2.5 text-xs font-black text-[#EBEBEB] shadow-md transition-all hover:scale-105"
          >
            <GithubIcon className="h-4 w-4" />
            <span>GitHub Profile</span>
          </a>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 pt-6 border-t border-[#74B4D9]/15">
          <div className="space-y-1">
            <span className="text-xs text-[#74B4D9] font-bold">Repositories</span>
            <div className="text-xl font-black text-[#EBEBEB]">{reposCount} Repos</div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-[#74B4D9] font-bold">Total Stars</span>
            <div className="text-xl font-black text-[#EBEBEB]">{totalStars} Stars</div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-[#74B4D9] font-bold">Streak Record</span>
            <div className="text-xl font-black text-amber-400">{streakDays} Days 🔥</div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-[#74B4D9] font-bold">Primary Tech</span>
            <div className="text-xl font-black text-[#EBEBEB]">{primaryTech}</div>
          </div>
        </div>

        {/* Repositories Stream Preview */}
        {syncData && syncData.repos.length > 0 && (
          <div className="space-y-3 pt-6 border-t border-[#74B4D9]/15">
            <h2 className="text-sm font-black text-[#EBEBEB]">Featured Repositories</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                      className="font-extrabold text-xs text-[#EBEBEB] hover:text-[#74B4D9] flex items-center gap-1.5"
                    >
                      <span>{repo.name}</span>
                      <ExternalLink className="h-3 w-3 text-[#74B4D9]/70" />
                    </a>
                    <span className="text-[10px] font-bold text-[#74B4D9] bg-[#10367D] px-2 py-0.5 rounded">
                      {repo.language}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#EBEBEB]/60 line-clamp-1 mt-1 font-medium">
                    {repo.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
