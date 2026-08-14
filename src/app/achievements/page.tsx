"use client";

import { Award, Flame, Moon, Code2, Trophy } from "lucide-react";

const achievements = [
  {
    id: "1",
    title: "First Commit",
    description: "Pushed your very first repository to Git.",
    icon: Trophy,
    unlocked: true,
    progress: 100,
  },
  {
    id: "2",
    title: "Night Owl",
    description: "Pushed over 50 commits past midnight.",
    icon: Moon,
    unlocked: true,
    progress: 100,
  },
  {
    id: "3",
    title: "Refactor Titan",
    description: "Deleted more than 10,000 lines of legacy code.",
    icon: Flame,
    unlocked: true,
    progress: 100,
  },
  {
    id: "4",
    title: "Polyglot Master",
    description: "Wrote code in 5 or more different programming languages.",
    icon: Code2,
    unlocked: false,
    progress: 80,
  },
];

export default function AchievementsPage() {
  return (
    <div className="space-y-8 p-8 pl-72">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-[#EBEBEB]">
          Achievements & Badges
        </h1>
        <p className="text-xs text-[#EBEBEB]/70 font-medium">
          Automated trophies unlocked by your real coding habits and commit milestones.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {achievements.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`glass-panel rounded-2xl p-6 transition-all ${
                item.unlocked ? "border-[#74B4D9]/40" : "opacity-60"
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
