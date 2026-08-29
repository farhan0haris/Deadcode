"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PrivacyToggle } from "@/components/PrivacyToggle";
import { getStoredSyncData, FullSyncData } from "@/lib/githubSync";
import { 
  Bot, 
  Send, 
  Sparkles, 
  FileCode, 
  PlusCircle, 
  MessageSquare, 
  ArrowLeft,
  BookOpen,
  FolderGit2
} from "lucide-react";

interface Citation {
  file: string;
  lines: string;
  relevance: number;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  timestamp: string;
}

export default function ChatPage() {
  const [syncData, setSyncData] = useState<FullSyncData | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<string>("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! Ask me anything about your connected GitHub repositories, functions, or commit history.",
      timestamp: "Just now"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = getStoredSyncData();
    if (data) {
      setSyncData(data);
      if (data.repos && data.repos.length > 0) {
        setSelectedRepo(data.repos[0].fullName);
      }
    }
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuery = input;
    setInput("");
    setLoading(true);

    try {
      const savedPrivacyMode = localStorage.getItem("deadcode_privacy_mode") || "LOCAL";

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: currentQuery,
          repositoryId: selectedRepo || "workspace",
          privacyMode: savedPrivacyMode,
        })
      });

      if (res.ok) {
        const data = await res.json();
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.answer,
          citations: data.citations,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error("Failed response");
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I encountered an issue connecting to the AI processing engine. Please verify your FastAPI engine connection or switch privacy modes.",
          timestamp: "Just now"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const repos = syncData?.repos || [];

  return (
    <div className="flex h-screen bg-[#071330] text-[#EBEBEB] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-[#0A1A3F]/90 border-r border-[#74B4D9]/20 flex flex-col p-4 space-y-4 hidden md:flex">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-xs font-bold text-[#74B4D9] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <button 
            onClick={() => setMessages([{ id: "1", role: "assistant", content: "New conversation started. What would you like to explore?", timestamp: "Just now" }])}
            className="p-1.5 bg-[#74B4D9]/20 hover:bg-[#74B4D9]/30 rounded-lg text-[#74B4D9] transition-all"
            title="New Chat Thread"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-[#EBEBEB]/50 uppercase tracking-wider">Select Repository Context</h2>
          {repos.length > 0 ? (
            <select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className="w-full bg-[#071330] border border-[#74B4D9]/40 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#74B4D9]"
            >
              {repos.map((r) => (
                <option key={r.id} value={r.fullName}>{r.fullName}</option>
              ))}
            </select>
          ) : (
            <div className="p-3 bg-white/5 rounded-xl text-xs text-[#EBEBEB]/60 space-y-1">
              <p>No connected repositories found.</p>
              <Link href="/settings" className="text-[#74B4D9] font-bold hover:underline">Connect GitHub →</Link>
            </div>
          )}
        </div>

        <div className="mt-auto p-3 bg-[#10367D]/30 border border-[#74B4D9]/20 rounded-xl space-y-2 text-xs text-[#EBEBEB]/70">
          <div className="flex items-center gap-2 font-bold text-[#74B4D9]">
            <BookOpen className="w-4 h-4" /> Real Codebase RAG Scope
          </div>
          <p className="text-[11px] leading-relaxed">
            {selectedRepo ? `Querying real AST & vector context for ${selectedRepo}.` : "Connect a GitHub repository to enable context analysis."}
          </p>
        </div>
      </aside>

      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col h-full bg-[#071330] relative">
        <header className="flex items-center justify-between p-4 lg:px-8 border-b border-[#74B4D9]/20 bg-[#10367D]/20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#74B4D9]/20 rounded-xl text-[#74B4D9]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                DeadCode AI Codebase Assistant
              </h1>
              <p className="text-xs text-[#EBEBEB]/60">
                Scope: {selectedRepo || "No Repository Selected"}
              </p>
            </div>
          </div>

          <PrivacyToggle />
        </header>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-4 max-w-4xl ${m.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                m.role === "user" ? "bg-[#74B4D9] text-[#0A1A3F] font-bold" : "bg-[#10367D] text-[#74B4D9] border border-[#74B4D9]/30"
              }`}>
                {m.role === "user" ? "U" : <Bot className="w-4 h-4" />}
              </div>

              <div className={`space-y-3 rounded-2xl p-4 text-sm ${
                m.role === "user" 
                  ? "bg-[#74B4D9]/20 border border-[#74B4D9]/30 text-white" 
                  : "bg-[#10367D]/40 border border-[#74B4D9]/20 text-[#EBEBEB]"
              }`}>
                <div className="whitespace-pre-wrap leading-relaxed font-sans">{m.content}</div>

                {m.citations && m.citations.length > 0 && (
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <p className="text-xs font-bold text-[#74B4D9] flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5" /> Source Code Citations:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {m.citations.map((c, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 bg-[#071330] border border-[#74B4D9]/30 px-2.5 py-1 rounded-lg text-xs font-mono text-[#74B4D9]">
                          <span>{c.file}</span>
                          <span className="text-white/40">:{c.lines}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[10px] text-white/40 text-right font-mono">{m.timestamp}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-4 max-w-4xl items-center text-xs text-[#74B4D9]">
              <div className="w-8 h-8 rounded-xl bg-[#10367D] flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <p className="animate-pulse font-medium">Analyzing repository AST & vector memory...</p>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 lg:p-6 border-t border-[#74B4D9]/20 bg-[#0A1A3F]/60 backdrop-blur-md">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about functions, components, or commits..."
              className="flex-1 bg-[#071330] border border-[#74B4D9]/40 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#74B4D9] placeholder:text-white/40"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-[#74B4D9] hover:bg-white text-[#0A1A3F] font-bold p-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

