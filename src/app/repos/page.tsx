"use client";

import { useState, useEffect } from "react";
import {
  FolderGit2,
  Star,
  GitFork,
  Lock,
  Globe,
  Search,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import {
  SyncedRepo,
  getStoredSyncData,
  triggerGitHubSync,
} from "@/lib/githubSync";

export default function RepositoriesPage() {
  const [repos, setRepos] = useState<SyncedRepo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncUser, setSyncUser] = useState("");
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    const data = getStoredSyncData();
    if (data) {
      setRepos(data.repos);
      setSyncUser(data.user.login);
    } else {
      const savedProfile = localStorage.getItem("deadcode_user_profile");
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed.github || parsed.username) {
            setSyncUser(parsed.github || parsed.username);
            handleSync(parsed.github || parsed.username);
          }
        } catch {
          // ignore
        }
      }
    }

    const handleUpdate = () => {
      const updated = getStoredSyncData();
      if (updated) {
        setRepos(updated.repos);
        setSyncUser(updated.user.login);
      }
    };
    window.addEventListener("deadcode_sync_updated", handleUpdate);
    return () => window.removeEventListener("deadcode_sync_updated", handleUpdate);
  }, []);

  const handleSync = async (usernameToSync?: string) => {
    const target = usernameToSync || syncUser.trim();
    if (!target) return;
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await triggerGitHubSync(target);
      setRepos(res.repos);
      setSyncUser(res.user.login);
      setSyncMessage(`Synchronized ${res.repos.length} repositories for @${res.user.login}!`);
      setTimeout(() => setSyncMessage(null), 4000);
    } catch (err: any) {
      setSyncMessage(err?.message || "Sync failed.");
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredRepos = repos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#EBEBEB]">
            Repository Explorer
          </h1>
          <p className="text-xs text-[#EBEBEB]/70 font-medium">
            Browse, inspect, and search your live connected GitHub repositories.
          </p>
        </div>

        {/* Sync & Search Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSync();
            }}
            className="flex items-center gap-1.5"
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#74B4D9]">@</span>
              <input
                type="text"
                value={syncUser}
                onChange={(e) => setSyncUser(e.target.value)}
                placeholder="github_username"
                className="h-9 w-40 rounded-xl border border-[#74B4D9]/25 bg-[#091836]/70 pl-7 pr-3 text-xs font-bold text-[#EBEBEB] placeholder-[#EBEBEB]/30 focus:border-[#74B4D9] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSyncing || !syncUser.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#10367D] to-[#1a4a9c] px-3.5 py-2 text-xs font-black text-[#EBEBEB] border border-[#74B4D9]/30 hover:scale-105 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Syncing..." : "Sync"}</span>
            </button>
          </form>

          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#74B4D9]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search repos..."
              className="h-9 w-full rounded-xl border border-[#74B4D9]/25 bg-[#091836]/70 pl-9 pr-3 text-xs text-[#EBEBEB] focus:border-[#74B4D9] focus:outline-none font-bold"
            />
          </div>
        </div>
      </div>

      {/* Sync Message Alert */}
      {syncMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-[#74B4D9]/30 bg-[#0d2452] p-3 text-xs font-bold text-[#EBEBEB]">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Repositories Grid */}
      {filteredRepos.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRepos.map((repo) => (
            <div
              key={repo.id}
              className="glass-panel glass-panel-hover flex flex-col justify-between rounded-2xl p-6 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <FolderGit2 className="h-5 w-5 text-[#74B4D9] shrink-0" />
                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-extrabold text-[#EBEBEB] text-base hover:text-[#74B4D9] transition-colors truncate flex items-center gap-1"
                    >
                      <span className="truncate">{repo.name}</span>
                      <ExternalLink className="h-3 w-3 text-[#74B4D9]/70 shrink-0" />
                    </a>
                  </div>
                  {repo.isPrivate ? (
                    <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md font-bold shrink-0">
                      <Lock className="h-3 w-3" /> Private
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold shrink-0">
                      <Globe className="h-3 w-3" /> Public
                    </span>
                  )}
                </div>

                <p className="mt-3 text-xs text-[#EBEBEB]/70 line-clamp-2 leading-relaxed font-medium">
                  {repo.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#74B4D9]/15 flex items-center justify-between text-xs text-[#EBEBEB]/70">
                <span className="font-extrabold text-[#74B4D9]">{repo.language}</span>
                <div className="flex items-center gap-3 font-bold">
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-400" /> {repo.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="h-3.5 w-3.5 text-[#EBEBEB]/50" /> {repo.forks}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel flex flex-col items-center justify-center p-12 text-center rounded-3xl space-y-4">
          <FolderGit2 className="h-12 w-12 text-[#74B4D9]/40" />
          <div>
            <h3 className="text-base font-black text-[#EBEBEB]">No Repositories Found</h3>
            <p className="text-xs text-[#EBEBEB]/60 max-w-md mt-1">
              Enter your GitHub username in the input bar above and click "Sync" to index all your real GitHub repositories.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
