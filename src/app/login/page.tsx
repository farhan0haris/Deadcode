"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { Ghost, ArrowRight, ShieldCheck } from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6">
      {/* Background Glow */}
      <div className="pointer-events-none absolute h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[100px]" />

      <div className="glass-panel w-full max-w-md rounded-2xl p-8 border border-zinc-800 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30 mb-4">
            <Ghost className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome to DeadCode</h2>
          <p className="mt-1 text-xs text-zinc-400">
            Sign in with GitHub to sync your developer history
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-900 shadow-lg transition-all hover:bg-zinc-100 hover:scale-[1.02]"
          >
            <GithubIcon className="h-5 w-5" />
            <span>Sign in with GitHub</span>
          </button>

          <div className="relative my-4 flex items-center justify-center">
            <div className="w-full border-t border-zinc-800" />
            <span className="absolute bg-zinc-900 px-3 text-[10px] uppercase tracking-wider text-zinc-500">
              or explore offline
            </span>
          </div>

          <Link
            href="/dashboard"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <span>Continue as Guest / Demo Mode</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Zero telemetry. 100% local database storage.</span>
        </div>
      </div>
    </div>
  );
}
