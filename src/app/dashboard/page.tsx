"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PrivacyToggle } from "@/components/PrivacyToggle";
import { 
  Bot, 
  ShieldCheck, 
  FileText, 
  Clock, 
  Code2, 
  GitBranch, 
  Flame, 
  Sparkles,
  ArrowRight,
  Terminal,
  Search,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export default function DashboardPage() {
  const [selectedRepo, setSelectedRepo] = useState("Deadcode (Active Workspace)");

  return (
    <div className="min-h-screen bg-[#071330] text-[#EBEBEB] p-6 lg:p-10 space-y-8 font-sans">
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
            Developer Memory Stream + AI Codebase Intelligence
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <select 
            value={selectedRepo} 
            onChange={(e) => setSelectedRepo(e.target.value)}
            className="bg-[#071330] border border-[#74B4D9]/40 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#74B4D9]"
          >
            <option value="Deadcode (Active Workspace)">Deadcode (Active Workspace)</option>
            <option value="farhan0haris/next-auth-starter">farhan0haris/next-auth-starter</option>
            <option value="farhan0haris/fastapi-rag-core">farhan0haris/fastapi-rag-core</option>
          </select>
          <PrivacyToggle />
        </div>
      </header>

      {/* Main Core Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Quick Action 1: AI Chat */}
        <Link href="/chat" className="group bg-gradient-to-br from-[#10367D]/60 to-[#0A1A3F]/80 p-6 rounded-2xl border border-[#74B4D9]/30 hover:border-[#74B4D9] transition-all hover:shadow-2xl hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#74B4D9]/20 rounded-xl text-[#74B4D9] group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-[#EBEBEB]/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">AI Codebase Chat</h3>
          <p className="text-xs text-[#EBEBEB]/70">Ask questions, explain functions, and query entire repository RAG context.</p>
        </Link>

        {/* Quick Action 2: Code Health */}
        <Link href="/audit" className="group bg-gradient-to-br from-[#10367D]/60 to-[#0A1A3F]/80 p-6 rounded-2xl border border-[#74B4D9]/30 hover:border-emerald-400 transition-all hover:shadow-2xl hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">88 Score</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Code Health Audit</h3>
          <p className="text-xs text-[#EBEBEB]/70">Detect potential bugs, security flaws, code smells, & generate GitHub issues.</p>
        </Link>

        {/* Quick Action 3: Docs Synthesizer */}
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

        {/* Quick Action 4: On This Day */}
        <Link href="/today" className="group bg-gradient-to-br from-[#10367D]/60 to-[#0A1A3F]/80 p-6 rounded-2xl border border-[#74B4D9]/30 hover:border-purple-400 transition-all hover:shadow-2xl hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-300 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">AI Memory</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">On This Day</h3>
          <p className="text-xs text-[#EBEBEB]/70">Search past commit history using natural language developer memory.</p>
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

          <div className="grid grid-cols-3 gap-4 bg-[#071330]/80 p-4 rounded-xl border border-white/5">
            <div>
              <p className="text-xs text-[#EBEBEB]/60">Total Commits Index</p>
              <p className="text-2xl font-black text-white mt-1">1,248</p>
            </div>
            <div>
              <p className="text-xs text-[#EBEBEB]/60">Active Vector Files</p>
              <p className="text-2xl font-black text-[#74B4D9] mt-1">142</p>
            </div>
            <div>
              <p className="text-xs text-[#EBEBEB]/60">Audit Security Rating</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">A+</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/90">Recent Commit Activity Highlights</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 text-xs hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <GitBranch className="w-4 h-4 text-[#74B4D9]" />
                  <div>
                    <p className="font-semibold text-white">feat(v3): integrate FastAPI RAG engine and dual privacy modes</p>
                    <p className="text-[#EBEBEB]/50 text-[11px]">Farhan Haris • 15 minutes ago</p>
                  </div>
                </div>
                <span className="text-[#74B4D9] font-mono">#9e4f2b1</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 text-xs hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <GitBranch className="w-4 h-4 text-[#74B4D9]" />
                  <div>
                    <p className="font-semibold text-white">refactor(schema): extend Prisma models for AI chat threads and audit logs</p>
                    <p className="text-[#EBEBEB]/50 text-[11px]">Farhan Haris • 1 hour ago</p>
                  </div>
                </div>
                <span className="text-[#74B4D9] font-mono">#c87a1d3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Code Health Widget */}
        <div className="bg-[#10367D]/30 border border-[#74B4D9]/20 rounded-2xl p-6 backdrop-blur-md space-y-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Detected Code Health
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-rose-400 font-bold">
                <span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> HIGH SEVERITY</span>
                <span>BUG RISK</span>
              </div>
              <p className="text-white/90 font-medium">Unbound Global Dynamic Fetching in API Route</p>
              <p className="text-white/60 text-[11px]">src/app/api/ai/chat/route.ts:42</p>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-amber-400 font-bold">
                <span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> MEDIUM SEVERITY</span>
                <span>SECURITY</span>
              </div>
              <p className="text-white/90 font-medium">Hardcoded Fallback Environment Config</p>
              <p className="text-white/60 text-[11px]">prisma/schema.prisma:8</p>
            </div>

            <div className="pt-2">
              <Link href="/audit" className="w-full py-2.5 bg-[#74B4D9] text-[#0A1A3F] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-all shadow-md">
                Full Audit & Create GitHub Issues <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
