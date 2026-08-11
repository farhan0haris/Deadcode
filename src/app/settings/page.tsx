"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Settings, Download, Database, Sun, Moon, Laptop, Key, CheckCircle2 } from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExport = (format: string) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ app: "DeadCode v2 SaaS", format, exportedAt: new Date().toISOString() }));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `deadcode_export.${format.toLowerCase()}`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 p-8 pl-72 transition-colors">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Settings & Preferences
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Configure application themes, database engines, GitHub OAuth, and data exports.
        </p>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* Theme Settings Panel */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Sun className="h-5 w-5 text-violet-500" />
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Appearance & Theme</h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Switch between Dark mode (default), Light mode, or follow your operating system settings.
          </p>

          {mounted && (
            <div className="grid grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => setTheme("dark")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
                  theme === "dark"
                    ? "border-violet-500 bg-violet-600/10 text-violet-600 dark:text-violet-400"
                    : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300"
                }`}
              >
                <Moon className="h-4 w-4" />
                <span>Dark Mode</span>
              </button>

              <button
                onClick={() => setTheme("light")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
                  theme === "light"
                    ? "border-violet-500 bg-violet-600/10 text-violet-600 dark:text-violet-400"
                    : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300"
                }`}
              >
                <Sun className="h-4 w-4" />
                <span>Light Mode</span>
              </button>

              <button
                onClick={() => setTheme("system")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
                  theme === "system"
                    ? "border-violet-500 bg-violet-600/10 text-violet-600 dark:text-violet-400"
                    : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300"
                }`}
              >
                <Laptop className="h-4 w-4" />
                <span>System</span>
              </button>
            </div>
          )}
        </div>

        {/* GitHub OAuth Setup Guide Panel */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Key className="h-5 w-5 text-indigo-500" />
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">GitHub OAuth Setup Guide</h2>
          </div>
          <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>To enable real GitHub login, set up a GitHub OAuth App:</p>
            <ol className="list-decimal list-inside space-y-1 font-mono text-[11px] text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <li>Go to GitHub Developer Settings: github.com/settings/developers</li>
              <li>Click "New OAuth App"</li>
              <li>Set Homepage URL to: http://localhost:3000</li>
              <li>Set Callback URL to: http://localhost:3000/api/auth/callback/github</li>
              <li>Copy Client ID & Client Secret into your .env.local file</li>
            </ol>
          </div>
        </div>

        {/* Export Data Panel */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Download className="h-5 w-5 text-emerald-500" />
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Export Developer Report</h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Export all your commit statistics and timeline memories into portable formats.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => handleExport("JSON")}
              className="rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Export JSON
            </button>
            <button
              onClick={() => handleExport("CSV")}
              className="rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleExport("MD")}
              className="rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Export Markdown (README)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
