"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PrivacyToggle } from "@/components/PrivacyToggle";
import { 
  ShieldCheck, 
  AlertTriangle, 
  Bug, 
  Code2, 
  Github, 
  ArrowLeft, 
  RefreshCw, 
  CheckCircle,
  ExternalLink,
  ShieldAlert
} from "lucide-react";

interface AuditIssue {
  id: string;
  title: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  category: string;
  file: string;
  line: number;
  description: string;
  codeSnippet: string;
  recommendation: string;
}

export default function AuditPage() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<{
    score: number;
    summary: string;
    issues: AuditIssue[];
  }>({
    score: 88,
    summary: "AI Audit scanned 14 core files and detected 3 potential optimization points (1 Bug Risk, 1 Security Flaw, 1 Code Smell).",
    issues: [
      {
        id: "AUDIT-01",
        title: "Potential Unhandled Promise Rejection in Stream Pipeline",
        severity: "HIGH",
        category: "Bug Risk",
        file: "src/app/api/ai/chat/route.ts",
        line: 22,
        description: "Missing timeout abort signal on fetch call to remote API service.",
        codeSnippet: "const fastapiRes = await fetch('http://127.0.0.1:8000/api/ai/query', { method: 'POST' });",
        recommendation: "Wrap fetch with AbortController signal set to 15s timeout."
      },
      {
        id: "AUDIT-02",
        title: "Unbound Database URL Connection String",
        severity: "MEDIUM",
        category: "Security",
        file: "prisma/schema.prisma",
        line: 7,
        description: "Ensure DATABASE_URL environment fallback is strictly validated before deployment.",
        codeSnippet: 'url = env("DATABASE_URL")',
        recommendation: "Check env string format in lib/env.ts initialization step."
      },
      {
        id: "AUDIT-03",
        title: "Redundant CSS Class Declarations",
        severity: "LOW",
        category: "Code Smell",
        file: "src/app/globals.css",
        line: 48,
        description: "Duplicate utility class declarations detected in stylesheet.",
        codeSnippet: ".glass-card { background: rgba(16, 54, 125, 0.4); }",
        recommendation: "Consolidate glassmorphism styling into single root variable."
      }
    ]
  });

  const [issueStatus, setIssueStatus] = useState<Record<string, string>>({});

  const runScan = async () => {
    setLoading(true);
    try {
      const savedPrivacyMode = localStorage.getItem("deadcode_privacy_mode") || "LOCAL";
      const res = await fetch("/api/ai/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repositoryId: "deadcode-active",
          repoName: "DeadCode",
          privacyMode: savedPrivacyMode,
        })
      });

      if (res.ok) {
        const data = await res.json();
        setReport({
          score: data.score,
          summary: data.summary,
          issues: data.issues,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const createGithubIssue = async (issue: AuditIssue) => {
    setIssueStatus(prev => ({ ...prev, [issue.id]: "creating" }));

    try {
      const res = await fetch("/api/github/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoFullName: "farhan0haris/Deadcode",
          title: issue.title,
          body: `## AI Detected Code Issue\n\n**File**: \`${issue.file}:${issue.line}\`\n**Severity**: ${issue.severity}\n**Category**: ${issue.category}\n\n### Description\n${issue.description}\n\n### Code Snippet\n\`\`\`typescript\n${issue.codeSnippet}\n\`\`\`\n\n### Recommendation\n${issue.recommendation}\n\n*Generated automatically by DeadCode v3.0 AI Audit Engine*`,
        })
      });

      const data = await res.json();
      if (data.success) {
        setIssueStatus(prev => ({ ...prev, [issue.id]: "done" }));
      } else {
        setIssueStatus(prev => ({ ...prev, [issue.id]: "error" }));
      }
    } catch (e) {
      setIssueStatus(prev => ({ ...prev, [issue.id]: "error" }));
    }
  };

  return (
    <div className="min-h-screen bg-[#071330] text-[#EBEBEB] p-6 lg:p-10 space-y-8 font-sans">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#10367D]/40 backdrop-blur-xl p-6 rounded-2xl border border-[#74B4D9]/20 shadow-xl">
        <div className="space-y-1">
          <Link href="/dashboard" className="text-xs font-bold text-[#74B4D9] hover:underline flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            AI Code Health & Vulnerability Auditor
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <PrivacyToggle />
          <button
            onClick={runScan}
            disabled={loading}
            className="px-4 py-2.5 bg-[#74B4D9] text-[#0A1A3F] font-bold rounded-xl flex items-center gap-2 hover:bg-white transition-all shadow-lg disabled:opacity-50 text-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Scanning AST..." : "Run AI Health Audit"}
          </button>
        </div>
      </header>

      {/* Score Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#10367D]/30 border border-[#74B4D9]/20 rounded-2xl p-6 flex items-center gap-6 backdrop-blur-md">
          <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/20 border-4 border-emerald-400 text-3xl font-black text-emerald-400">
            {report.score}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Repository Health Score</h2>
            <p className="text-xs text-[#EBEBEB]/70 mt-1">Grade: A (Very Strong)</p>
          </div>
        </div>

        <div className="md:col-span-2 bg-[#10367D]/30 border border-[#74B4D9]/20 rounded-2xl p-6 flex flex-col justify-center backdrop-blur-md space-y-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bug className="w-4 h-4 text-[#74B4D9]" /> Executive AI Summary
          </h3>
          <p className="text-sm text-[#EBEBEB]/80 leading-relaxed">{report.summary}</p>
        </div>
      </div>

      {/* Detected Issues List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          Detected Code Issues & Recommendations ({report.issues.length})
        </h2>

        <div className="space-y-4">
          {report.issues.map((issue) => (
            <div
              key={issue.id}
              className="bg-[#0A1A3F]/80 border border-[#74B4D9]/20 rounded-2xl p-6 space-y-4 shadow-lg hover:border-[#74B4D9]/50 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    issue.severity === "HIGH" 
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" 
                      : issue.severity === "MEDIUM" 
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" 
                      : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  }`}>
                    {issue.severity}
                  </span>
                  <h3 className="text-base font-bold text-white">{issue.title}</h3>
                </div>

                <button
                  onClick={() => createGithubIssue(issue)}
                  disabled={issueStatus[issue.id] === "creating" || issueStatus[issue.id] === "done"}
                  className="px-3.5 py-1.5 bg-[#10367D] hover:bg-[#74B4D9] hover:text-[#0A1A3F] border border-[#74B4D9]/40 text-xs font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Github className="w-3.5 h-3.5" />
                  {issueStatus[issue.id] === "creating" ? "Generating Issue..." : issueStatus[issue.id] === "done" ? "GitHub Issue Created ✓" : "Create GitHub Issue"}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <p className="text-white/60">Location: <span className="text-[#74B4D9] font-mono">{issue.file}:{issue.line}</span></p>
                  <p className="text-white/90 leading-relaxed">{issue.description}</p>
                  <div className="p-3 bg-black/40 border border-white/10 rounded-xl font-mono text-emerald-300 overflow-x-auto">
                    {issue.codeSnippet}
                  </div>
                </div>

                <div className="bg-[#10367D]/30 border border-[#74B4D9]/20 p-4 rounded-xl space-y-2">
                  <p className="font-bold text-[#74B4D9]">AI Recommendation:</p>
                  <p className="text-white/80 leading-relaxed">{issue.recommendation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
