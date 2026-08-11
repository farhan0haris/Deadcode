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
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Achievements & Badges
        </h1>
        <p className="text-xs text-zinc-400">
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
                item.unlocked ? "border-violet-500/30" : "opacity-60"
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  item.unlocked
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-white">{item.title}</h3>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                {item.description}
              </p>
              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                <span
                  className={
                    item.unlocked ? "text-emerald-400 font-semibold" : "text-zinc-500"
                  }
                >
                  {item.unlocked ? "Unlocked" : "In Progress"}
                </span>
                <span className="font-mono text-zinc-400">{item.progress}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
