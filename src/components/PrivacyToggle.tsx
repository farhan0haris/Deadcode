"use client";

import React, { useState, useEffect } from "react";
import { Shield, ShieldAlert, Cpu, Cloud, Check } from "lucide-react";

export function PrivacyToggle() {
  const [privacyMode, setPrivacyMode] = useState<"LOCAL" | "CLOUD">("LOCAL");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("deadcode_privacy_mode");
    if (saved === "CLOUD" || saved === "LOCAL") {
      setPrivacyMode(saved);
    }
  }, []);

  const handleToggle = (mode: "LOCAL" | "CLOUD") => {
    if (mode === "CLOUD" && privacyMode === "LOCAL") {
      setShowModal(true);
    } else {
      setPrivacyMode(mode);
      localStorage.setItem("deadcode_privacy_mode", mode);
    }
  };

  const confirmCloudMode = () => {
    setPrivacyMode("CLOUD");
    localStorage.setItem("deadcode_privacy_mode", "CLOUD");
    setShowModal(false);
  };

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center bg-[#10367D]/60 backdrop-blur-md p-1 rounded-full border border-[#74B4D9]/30">
        <button
          onClick={() => handleToggle("LOCAL")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            privacyMode === "LOCAL"
              ? "bg-[#74B4D9] text-[#0A1A3F] shadow-sm font-semibold"
              : "text-[#EBEBEB]/70 hover:text-white"
          }`}
          title="Local Mode: Processing remains 100% on your device via Ollama"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Local (Ollama)</span>
        </button>

        <button
          onClick={() => handleToggle("CLOUD")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            privacyMode === "CLOUD"
              ? "bg-amber-400 text-slate-950 shadow-sm font-semibold"
              : "text-[#EBEBEB]/70 hover:text-white"
          }`}
          title="Cloud Mode: Enhanced intelligence powered by Google Gemini API"
        >
          <Cloud className="w-3.5 h-3.5" />
          <span>Cloud (Gemini)</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0D1F4D] border border-[#74B4D9]/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <ShieldAlert className="w-7 h-7" />
              <h3 className="text-lg font-bold text-white">Enable Cloud AI Processing</h3>
            </div>
            
            <p className="text-sm text-[#EBEBEB]/80 leading-relaxed">
              In <strong>Cloud Mode</strong>, selected repository snippets and chat prompts will be processed using the <strong>Google Gemini API</strong> for enhanced code analysis and deep reasoning.
            </p>

            <div className="bg-black/30 border border-white/10 rounded-xl p-3 text-xs text-[#EBEBEB]/70 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="w-4 h-4" /> Zero data logging for model training
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="w-4 h-4" /> Switch back to 100% Local Mode at any time
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmCloudMode}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all shadow-md"
              >
                I Understand & Enable Cloud Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
