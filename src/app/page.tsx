"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Ghost,
  ShieldCheck,
  Sparkles,
  FolderGit2,
  ArrowRight,
  User,
  LayoutDashboard,
  LogOut,
  Settings,
  GitCommit,
} from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import { getStoredSyncData, FullSyncData } from "@/lib/githubSync";
import Hero3DCanvas from "@/components/canvas/Hero3DCanvas";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const [syncedData, setSyncedData] = useState<FullSyncData | null>(null);
  const [localUser, setLocalUser] = useState<{ name?: string; username?: string; email?: string } | null>(null);

  useEffect(() => {
    // Check stored sync data
    const sync = getStoredSyncData();
    if (sync) setSyncedData(sync);

    // Check stored user profile
    const saved = localStorage.getItem("deadcode_user_profile");
    if (saved) {
      try {
        setLocalUser(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const isAuthenticated = status === "authenticated" || !!localUser || !!syncedData;
  const displayName = syncedData?.user?.name || session?.user?.name || localUser?.name || "Farhan Haris";
  const displayHandle = syncedData?.user?.login || localUser?.username || (session?.user?.email ? session.user.email.split("@")[0] : "developer");

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden px-6 py-8">
      {/* 3D Animated Hero Background Canvas */}
      <Hero3DCanvas />

      {/* Top Navbar */}
      <header className="flex w-full max-w-6xl items-center justify-between py-4 relative z-20">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#10367D] to-[#1d52b5] text-[#EBEBEB] shadow-lg shadow-[#10367D]/50 border border-[#74B4D9]/30">
            <Ghost className="h-5 w-5 text-[#74B4D9]" />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-[#EBEBEB]">DeadCode</span>
            <span className="block text-[10px] font-bold text-[#74B4D9]">v2.0 Cloud & Offline</span>
          </div>
        </Link>

        {/* Dynamic Auth State Navbar Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl border border-[#74B4D9]/30 bg-[#74B4D9]/10 px-4 py-2 text-xs font-bold text-[#74B4D9] hover:bg-[#74B4D9]/20 transition-all backdrop-blur-md"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-2 rounded-xl border border-[#74B4D9]/20 bg-[#0d2452]/70 px-3 py-2 text-xs font-bold text-[#EBEBEB] hover:bg-[#0d2452] transition-all"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#10367D] text-[10px] font-bold text-[#74B4D9]">
                  {displayName[0]?.toUpperCase()}
                </div>
                <span>@{displayHandle}</span>
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("deadcode_user_profile");
                  localStorage.removeItem("deadcode_github_synced_data");
                  signOut();
                }}
                title="Sign out"
                className="rounded-xl border border-rose-500/20 bg-rose-950/40 p-2 text-rose-300 hover:bg-rose-900/60 transition-all"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-xl border border-[#74B4D9]/20 bg-[#74B4D9]/5 px-4 py-2 text-xs font-bold text-[#EBEBEB] hover:bg-[#74B4D9]/15 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#10367D] via-[#1647a3] to-[#74B4D9] px-4 py-2 text-xs font-black text-[#EBEBEB] border border-[#74B4D9]/40 shadow-md shadow-[#10367D]/40 hover:scale-105 transition-all"
              >
                <span>Register</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="my-auto flex flex-col items-center justify-center text-center max-w-4xl py-12 relative z-10">
        {/* Ambient gradient aura */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#10367D]/50 via-[#1d52b5]/30 to-[#74B4D9]/25 blur-[140px]" />

        {/* Hero Badge */}
        <div className="mb-6 flex items-center gap-2 rounded-full border border-[#74B4D9]/30 bg-[#74B4D9]/10 px-4 py-1.5 text-xs font-bold text-[#74B4D9] backdrop-blur-md shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
          <span>
            {isAuthenticated
              ? `Welcome back, ${displayName} (@${displayHandle})`
              : "DeadCode v2.0 Cloud & Offline Edition"}
          </span>
        </div>

        {/* Hero Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10367D] to-[#1d52b5] text-[#EBEBEB] shadow-2xl shadow-[#10367D]/60 border border-[#74B4D9]/30 mb-6">
          <Ghost className="h-8 w-8 text-[#74B4D9]" />
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl font-black tracking-tight text-[#EBEBEB] sm:text-7xl">
          Every commit has a{" "}
          <span className="bg-gradient-to-r from-[#74B4D9] via-[#ffffff] to-[#74B4D9] bg-clip-text text-transparent underline decoration-[#74B4D9]/40">
            ghost.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base text-[#EBEBEB]/80 sm:text-lg font-medium leading-relaxed">
          A privacy-first developer time machine. Rediscover what you built years ago today through interactive timelines, memory cards, and real repository synchronization.
        </p>

        {/* Hero Dynamic Action Buttons */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#10367D] via-[#1647a3] to-[#74B4D9] text-[#EBEBEB] border border-[#74B4D9]/40 px-6 py-3.5 text-sm font-bold shadow-xl shadow-[#10367D]/40 transition-all hover:scale-105 hover:border-[#74B4D9]"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Launch Command Center</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-2 rounded-xl border border-[#74B4D9]/25 bg-[#0d2452]/80 text-[#EBEBEB] hover:bg-[#0d2452] px-6 py-3.5 text-sm font-bold backdrop-blur-xl transition-all"
              >
                <Settings className="h-4 w-4 text-[#74B4D9]" />
                <span>Account Settings</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#10367D] via-[#1647a3] to-[#74B4D9] text-[#EBEBEB] border border-[#74B4D9]/40 px-6 py-3.5 text-sm font-bold shadow-xl shadow-[#10367D]/40 transition-all hover:scale-105 hover:border-[#74B4D9]"
              >
                <span>Get Started (Sign In / Register)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl border border-[#74B4D9]/25 bg-[#0d2452]/80 text-[#EBEBEB] hover:bg-[#0d2452] px-6 py-3.5 text-sm font-bold backdrop-blur-xl transition-all"
              >
                <GithubIcon className="h-4 w-4" />
                <span>Continue with GitHub</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 gap-6 sm:grid-cols-3 pt-12 pb-6 relative z-10">
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
