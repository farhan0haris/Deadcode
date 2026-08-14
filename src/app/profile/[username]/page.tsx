"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);

  return (
    <div className="space-y-8 p-8 pl-72">
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
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10367D] to-[#1d52b5] text-3xl font-black text-[#EBEBEB] shadow-xl border border-[#74B4D9]/30">
              {username[0]?.toUpperCase() || "D"}
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#EBEBEB] tracking-tight">
                @{username}
              </h1>
              <p className="text-xs text-[#EBEBEB]/70 font-medium">
                Verified Open Source Contributor & DeadCode Cloud Developer
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs font-bold text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>100% Privacy-Verified & Git Journey Synced</span>
              </div>
            </div>
          </div>

          <a
            href={`https://github.com/${username}`}
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
            <div className="text-xl font-black text-[#EBEBEB]">87 Repos</div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-[#74B4D9] font-bold">Total Commits</span>
            <div className="text-xl font-black text-[#EBEBEB]">14,291</div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-[#74B4D9] font-bold">Streak Record</span>
            <div className="text-xl font-black text-amber-400">19 Days 🔥</div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-[#74B4D9] font-bold">Primary Tech</span>
            <div className="text-xl font-black text-[#EBEBEB]">TypeScript</div>
          </div>
        </div>
      </div>
    </div>
  );
}
