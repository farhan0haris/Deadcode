"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PrivacyToggle } from "@/components/PrivacyToggle";
import { 
  FileText, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  ArrowLeft, 
  BookOpen, 
  Code, 
  Layers 
} from "lucide-react";

export default function DocsGenPage() {
  const [docType, setDocType] = useState<"README" | "API" | "ARCHITECTURE">("README");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [content, setContent] = useState<string>(`# Deadcode v3.0

> **AI-Powered Codebase Intelligence & Developer Memory Platform**

## Overview
DeadCode is a developer workspace combining GitHub repository management, vector search intelligence, and natural language developer memory.

## Key Modules
- **AI Codebase Assistant**: Ask questions across entire repositories with RAG citations.
- **Code Health Auditor**: Detect bugs, code smells, and security risks with 1-click GitHub Issue generation.
- **Developer Memory**: Natural language search over historical commits.

## Quickstart
\`\`\`bash
npm install
npm run dev
\`\`\`
`);

  const generateDocs = async (selectedType: "README" | "API" | "ARCHITECTURE") => {
    setDocType(selectedType);
    setLoading(true);

    try {
      const savedPrivacyMode = localStorage.getItem("deadcode_privacy_mode") || "LOCAL";
      const res = await fetch("/api/ai/docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repositoryId: "deadcode-active",
          repoName: "DeadCode",
          docType: selectedType,
          privacyMode: savedPrivacyMode,
        })
      });

      if (res.ok) {
        const data = await res.json();
        setContent(data.content);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${docType.toLowerCase()}_documentation.md`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#071330] text-[#EBEBEB] p-6 lg:p-10 space-y-8 font-sans">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#10367D]/40 backdrop-blur-xl p-6 rounded-2xl border border-[#74B4D9]/20 shadow-xl">
        <div className="space-y-1">
          <Link href="/dashboard" className="text-xs font-bold text-[#74B4D9] hover:underline flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-amber-400" />
            AI Documentation Generator
          </h1>
        </div>

        <PrivacyToggle />
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[#74B4D9]/20 pb-4 overflow-x-auto">
        <button
          onClick={() => generateDocs("README")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            docType === "README"
              ? "bg-[#74B4D9] text-[#0A1A3F] shadow-lg"
              : "bg-[#10367D]/40 text-[#EBEBEB]/70 hover:bg-[#10367D]"
          }`}
        >
          <BookOpen className="w-4 h-4" /> Project README.md
        </button>

        <button
          onClick={() => generateDocs("API")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            docType === "API"
              ? "bg-[#74B4D9] text-[#0A1A3F] shadow-lg"
              : "bg-[#10367D]/40 text-[#EBEBEB]/70 hover:bg-[#10367D]"
          }`}
        >
          <Code className="w-4 h-4" /> API Reference
        </button>

        <button
          onClick={() => generateDocs("ARCHITECTURE")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            docType === "ARCHITECTURE"
              ? "bg-[#74B4D9] text-[#0A1A3F] shadow-lg"
              : "bg-[#10367D]/40 text-[#EBEBEB]/70 hover:bg-[#10367D]"
          }`}
        >
          <Layers className="w-4 h-4" /> System Architecture
        </button>
      </div>

      {/* Main Documentation Editor Preview */}
      <div className="bg-[#0A1A3F]/80 border border-[#74B4D9]/20 rounded-2xl p-6 backdrop-blur-md space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#74B4D9]">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Generated Documentation ({docType})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10367D] hover:bg-[#74B4D9] hover:text-[#0A1A3F] text-xs font-bold rounded-xl transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy Markdown"}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#74B4D9] text-[#0A1A3F] font-bold text-xs rounded-xl hover:bg-white transition-all shadow-md"
            >
              <Download className="w-3.5 h-3.5" /> Download .md
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3 text-xs text-[#74B4D9]">
            <Sparkles className="w-8 h-8 animate-spin mx-auto text-amber-400" />
            <p>Synthesizing repository structures into markdown documentation...</p>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-96 bg-[#071330] border border-[#74B4D9]/30 rounded-xl p-4 font-mono text-xs text-emerald-300 focus:outline-none focus:ring-2 focus:ring-[#74B4D9] leading-relaxed resize-y"
          />
        )}
      </div>
    </div>
  );
}
