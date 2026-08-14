"use client";

import { useEffect, useState } from "react";
import { Code2, Sparkles, FolderGit2 } from "lucide-react";
import { getStoredSyncData, FullSyncData } from "@/lib/githubSync";

export default function LanguageEvolutionPage() {
  const [syncData, setSyncData] = useState<FullSyncData | null>(null);

  useEffect(() => {
    const data = getStoredSyncData();
    if (data) setSyncData(data);

    const handleUpdate = () => setSyncData(getStoredSyncData());
    window.addEventListener("deadcode_sync_updated", handleUpdate);
    return () => window.removeEventListener("deadcode_sync_updated", handleUpdate);
  }, []);

  const fallbackLanguages = [
    { name: "TypeScript", value: 67, count: 4, color: "bg-[#74B4D9]" },
    { name: "JavaScript", value: 17, count: 1, color: "bg-[#1d52b5]" },
    { name: "Other", value: 17, count: 1, color: "bg-[#10367D]" },
  ];

  const languages =
    syncData && syncData.languages.length > 0
      ? syncData.languages.map((l, i) => {
          const colors = ["bg-[#74B4D9]", "bg-[#10367D]", "bg-[#1d52b5]", "bg-[#8ec7e8]", "bg-[#5a9fc2]"];
          return {
            name: l.name,
            value: l.value,
            count: l.count,
            color: colors[i % colors.length],
          };
        })
      : fallbackLanguages;

  return (
    <div className="space-y-8 p-8 pl-72">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-[#EBEBEB]">
          Language Evolution & Stack Analytics
        </h1>
        <p className="text-xs text-[#EBEBEB]/70 font-medium">
          Live breakdown of programming languages used across your {syncData?.stats.reposCount || 6} synced repositories.
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-[#74B4D9]" />
            <h2 className="text-base font-extrabold text-[#EBEBEB]">Tech Stack Breakdown</h2>
          </div>
          <span className="text-xs font-bold text-[#74B4D9]">
            Primary: {syncData?.stats.primaryTech || "TypeScript"} ({syncData?.stats.primaryPercent || 67}%)
          </span>
        </div>

        <div className="space-y-5">
          {languages.map((lang) => (
            <div key={lang.name} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#EBEBEB]">{lang.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[#EBEBEB]/60 font-medium">{lang.count} {lang.count === 1 ? "repository" : "repositories"}</span>
                  <span className="font-mono font-bold text-[#74B4D9]">
                    {lang.value}%
                  </span>
                </div>
              </div>
              <div className="h-3 w-full rounded-full bg-[#061229] overflow-hidden border border-[#74B4D9]/20">
                <div
                  className={`h-full rounded-full ${lang.color} transition-all duration-500`}
                  style={{ width: `${lang.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
