import Link from "next/link";
import { Ghost, ShieldCheck, Sparkles, FolderGit2, ArrowRight } from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-20">
      {/* Glow ambient background */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[120px]" />

      {/* Hero Badge */}
      <div className="mb-6 flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300 backdrop-blur-md">
        <Sparkles className="h-3.5 w-3.5" />
        <span>DeadCode v2.0 SaaS Edition is Live</span>
      </div>

      {/* Hero Title */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-2xl shadow-violet-500/30 mb-6">
        <Ghost className="h-8 w-8 text-white" />
      </div>

      <h1 className="max-w-4xl text-center text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
        Every commit has a{" "}
        <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
          ghost.
        </span>
      </h1>

      <p className="mt-6 max-w-2xl text-center text-base text-zinc-400 sm:text-lg">
        A privacy-first developer time machine. Rediscover what you built years ago today through interactive timelines, memory cards, and yearly retrospectives.
      </p>

      {/* Hero Actions */}
      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-600/30 transition-all hover:bg-violet-500 hover:scale-105"
        >
          <span>Explore Dashboard</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-6 py-3.5 text-sm font-semibold text-zinc-200 backdrop-blur-xl transition-all hover:border-zinc-700 hover:bg-zinc-800"
        >
          <GithubIcon className="h-4 w-4" />
          <span>Sign in with GitHub</span>
        </Link>
      </div>

      {/* Feature Highlights Grid */}
      <div className="mt-20 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="glass-panel glass-panel-hover rounded-2xl p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-950/80 text-violet-400 border border-violet-800/40 mb-4">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-white">On This Day</h3>
          <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
            Rediscover code pushed on this exact day 1, 2, or 5 years ago with line-by-line diff inspectors.
          </p>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/40 mb-4">
            <FolderGit2 className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Multi-Repo Sync</h3>
          <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
            Seamlessly index all your public and private repositories across GitHub with zero configuration.
          </p>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 mb-4">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-white">100% Offline & Private</h3>
          <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
            Zero telemetry, zero external tracking. Your code stats remain strictly on your device.
          </p>
        </div>
      </div>
    </div>
  );
}
