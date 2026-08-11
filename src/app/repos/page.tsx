"use client";

import { useState } from "react";
import { FolderGit2, Star, GitFork, Lock, Globe, Search, RefreshCw } from "lucide-react";

const mockRepos = [
  {
    id: "1",
    name: "deadcode",
    fullName: "farhan0haris/deadcode",
    description: "A privacy-first Git time machine and developer journey visualizer.",
    language: "TypeScript",
    stars: 128,
    forks: 14,
    isPrivate: false,
    commitsCount: 342,
  },
  {
    id: "2",
    name: "clever-planck",
    fullName: "farhan0haris/clever-planck",
    description: "Full-stack SaaS engine built with Next.js App Router and Prisma.",
    language: "TypeScript",
    stars: 45,
    forks: 6,
    isPrivate: false,
    commitsCount: 198,
  },
  {
    id: "3",
    name: "ai-assistant-core",
    fullName: "farhan0haris/ai-assistant-core",
    description: "Python backend LLM tool orchestration and subprocess execution engine.",
    language: "Python",
    stars: 89,
    forks: 12,
    isPrivate: true,
    commitsCount: 412,
  },
];

export default function RepositoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRepos = mockRepos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-8 pl-72">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Repository Explorer
          </h1>
          <p className="text-xs text-zinc-400">
            Browse and search all indexed local and synced GitHub repositories.
          </p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter repos..."
            className="h-9 w-full rounded-xl border border-zinc-800 bg-zinc-900/60 pl-9 pr-4 text-xs text-zinc-200 focus:border-violet-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRepos.map((repo) => (
          <div
            key={repo.id}
            className="glass-panel glass-panel-hover flex flex-col justify-between rounded-2xl p-6 transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="h-5 w-5 text-violet-400" />
                  <h3 className="font-bold text-white text-base">{repo.name}</h3>
                </div>
                {repo.isPrivate ? (
                  <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded-md">
                    <Lock className="h-3 w-3" /> Private
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                    <Globe className="h-3 w-3" /> Public
                  </span>
                )}
              </div>

              <p className="mt-3 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {repo.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold text-zinc-200">{repo.language}</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-400" /> {repo.stars}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="h-3.5 w-3.5 text-zinc-500" /> {repo.forks}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
