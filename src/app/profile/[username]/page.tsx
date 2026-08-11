"use client";

import { use } from "react";
import { User, FolderGit2, GitCommit, Award, ShieldCheck } from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);

  return (
    <div className="space-y-8 p-8 pl-72">
      {/* Profile Banner */}
      <div className="glass-panel rounded-3xl p-8 space-y-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-3xl font-extrabold text-white shadow-xl shadow-violet-500/20">
              {username[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">
                @{username}
              </h1>
              <p className="text-xs text-zinc-400">
                Open Source Contributor & DeadCode Verified Developer
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>100% Offline Git Journey Synced</span>
              </div>
            </div>
          </div>

          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-800"
          >
            <GithubIcon className="h-4 w-4" />
            <span>GitHub Profile</span>
          </a>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-6 border-t border-zinc-800/60">
          <div className="space-y-1">
            <span className="text-xs text-zinc-500">Repositories</span>
            <div className="text-xl font-bold text-white">87 Repos</div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-zinc-500">Total Commits</span>
            <div className="text-xl font-bold text-white">14,291 Commits</div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-zinc-500">Primary Tech</span>
            <div className="text-xl font-bold text-violet-400">TypeScript</div>
          </div>
        </div>
      </div>
    </div>
  );
}
