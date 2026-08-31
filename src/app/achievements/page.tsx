"use client";

import { useEffect, useState } from "react";
import { Award, Flame, Moon, Code2, Trophy, FolderGit2 } from "lucide-react";
import { getStoredSyncData, FullSyncData } from "@/lib/githubSync";

export default function AchievementsPage() {
  const [syncData, setSyncData] = useState<FullSyncData | null>(null);

  useEffect(() => {
    const data = getStoredSyncData();
    if (data) setSyncData(data);

    const handleUpdate = () => setSyncData(getStoredSyncData());
    window.addEventListener("deadcode_sync_updated", handleUpdate);
    return () => window.removeEventListener("deadcode_sync_updated", handleUpdate);
  }, []);

  const reposCount = syncData?.stats.reposCount || 6;
  const langCount = syncData?.languages.length || 3;
  const streak = syncData?.stats.streakDays || 13;

  const achievements = [
    {
      id: "1",
      title: "First Repository",
      description: "Pushed your first public project to GitHub.",
      icon: Trophy,
      unlocked: reposCount >= 1,
      progress: Math.min(reposCount * 100, 100),
    },
    {
      id: "2",
      title: "Multi-Project Builder",
      description: `Created and indexed 5+ distinct code repositories (${reposCount}/5).`,
      icon: FolderGit2,
      unlocked: reposCount >= 5,
      progress: Math.min(Math.round((reposCount / 5) * 100), 100),
    },
    {
      id: "3",
      title: "Active Momentum Streak",
      description: `Maintained continuous coding and commit streak (${streak}/14 days).`,
      icon: Flame,
      unlocked: streak >= 7,
      progress: Math.min(Math.round((streak / 14) * 100), 100),
    },
    {
      id: "4",
      title: "Polyglot Developer",
      description: `Wrote projects across 3+ programming languages (${langCount}/3).`,
      icon: Code2,
      unlocked: langCount >= 3,
      progress: Math.min(Math.round((langCount / 3) * 100), 100),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-[#EBEBEB]">
          Achievements & Badges
        </h1>
        <p className="text-xs text-[#EBEBEB]/70 font-medium">
          Automated trophies and milestone badges unlocked by your real GitHub activity{syncData?.user.login ? ` (@${syncData.user.login})` : ""}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {achievements.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`glass-panel rounded-2xl p-6 transition-all ${
                item.unlocked ? "border-[#74B4D9]/40" : "opacity-70"
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  item.unlocked
                    ? "bg-gradient-to-br from-[#10367D] to-[#1d52b5] text-[#74B4D9] shadow-lg shadow-[#10367D]/50 border border-[#74B4D9]/30"
                    : "bg-[#091836]/60 text-[#EBEBEB]/40"
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-extrabold text-[#EBEBEB]">{item.title}</h3>
              <p className="mt-1 text-xs text-[#EBEBEB]/70 leading-relaxed font-medium">
                {item.description}
              </p>
              <div className="mt-4 pt-3 border-t border-[#74B4D9]/15 flex items-center justify-between text-xs">
                <span
                  className={
                    item.unlocked ? "text-emerald-400 font-bold" : "text-[#EBEBEB]/50"
                  }
                >
                  {item.unlocked ? "Unlocked" : "In Progress"}
                </span>
                <span className="font-mono text-[#74B4D9] font-bold">{item.progress}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
