import Link from "next/link";
import { Ghost, ShieldCheck, Sparkles, FolderGit2, ArrowRight } from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-20">
      {/* Ambient gradient aura */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[550px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#10367D]/50 via-[#1d52b5]/30 to-[#74B4D9]/30 blur-[130px]" />

      {/* Hero Badge */}
      <div className="mb-6 flex items-center gap-2 rounded-full border border-[#74B4D9]/30 bg-[#74B4D9]/10 px-4 py-1.5 text-xs font-bold text-[#74B4D9] backdrop-blur-md shadow-sm">
        <Sparkles className="h-3.5 w-3.5" />
        <span>DeadCode v2.0 Cloud Edition is Live</span>
      </div>

      {/* Hero Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10367D] to-[#1d52b5] text-[#EBEBEB] shadow-2xl shadow-[#10367D]/60 border border-[#74B4D9]/30 mb-6">
        <Ghost className="h-8 w-8" />
      </div>

      {/* Main Headline */}
      <h1 className="max-w-4xl text-center text-5xl font-black tracking-tight text-[#EBEBEB] sm:text-7xl">
        Every commit has a{" "}
        <span className="bg-gradient-to-r from-[#74B4D9] via-[#ffffff] to-[#74B4D9] bg-clip-text text-transparent underline decoration-[#74B4D9]/40">
          ghost.
        </span>
      </h1>

      <p className="mt-6 max-w-2xl text-center text-base text-[#EBEBEB]/80 sm:text-lg font-medium leading-relaxed">
        A privacy-first developer time machine. Rediscover what you built years ago today through interactive timelines, memory cards, and yearly retrospectives.
      </p>

      {/* Hero Action Buttons */}
      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#10367D] via-[#1647a3] to-[#74B4D9] text-[#EBEBEB] border border-[#74B4D9]/40 px-6 py-3.5 text-sm font-bold shadow-xl shadow-[#10367D]/40 transition-all hover:scale-105 hover:border-[#74B4D9]"
        >
          <span>Explore Dashboard</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-2 rounded-xl border border-[#74B4D9]/25 bg-[#0d2452]/80 text-[#EBEBEB] hover:bg-[#0d2452] px-6 py-3.5 text-sm font-bold backdrop-blur-xl transition-all"
        >
          <GithubIcon className="h-4 w-4" />
          <span>Sign in with GitHub</span>
        </Link>
      </div>

      {/* Feature Highlights Grid */}
      <div className="mt-20 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="glass-panel glass-panel-hover rounded-2xl p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#10367D] to-[#1d52b5] text-[#74B4D9] mb-4 shadow-md border border-[#74B4D9]/25">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-base font-extrabold text-[#EBEBEB]">On This Day</h3>
          <p className="mt-2 text-xs text-[#EBEBEB]/70 leading-relaxed font-medium">
            Rediscover code pushed on this exact day 1, 2, or 5 years ago with line-by-line diff inspectors.
          </p>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#10367D] to-[#1d52b5] text-[#74B4D9] mb-4 shadow-md border border-[#74B4D9]/25">
            <FolderGit2 className="h-5 w-5" />
          </div>
          <h3 className="text-base font-extrabold text-[#EBEBEB]">Multi-Repo Sync</h3>
          <p className="mt-2 text-xs text-[#EBEBEB]/70 leading-relaxed font-medium">
            Seamlessly index all your public and private repositories across GitHub with zero configuration.
          </p>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#10367D] to-[#1d52b5] text-[#74B4D9] mb-4 shadow-md border border-[#74B4D9]/25">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-base font-extrabold text-[#EBEBEB]">100% Offline & Private</h3>
          <p className="mt-2 text-xs text-[#EBEBEB]/70 leading-relaxed font-medium">
            Zero telemetry, zero external tracking. Your code stats remain strictly on your device.
          </p>
        </div>
      </div>
    </div>
  );
}
