"use client";

import { Flame } from "lucide-react";

export default function HeatmapPage() {
  // Generate 52 weeks x 7 days grid
  const weeks = Array.from({ length: 52 }, (_, i) => i);
  const days = Array.from({ length: 7 }, (_, i) => i);

  const getIntensityClass = (wIndex: number, dIndex: number) => {
    const seed = (wIndex * 7 + dIndex) % 5;
    switch (seed) {
      case 1:
        return "bg-violet-900/60";
      case 2:
        return "bg-violet-700/80";
      case 3:
        return "bg-violet-500";
      case 4:
        return "bg-emerald-400 shadow-sm shadow-emerald-400/50";
      default:
        return "bg-zinc-900/80";
    }
  };

  return (
    <div className="space-y-8 p-8 pl-72">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Contribution Calendar
        </h1>
        <p className="text-xs text-zinc-400">
          GitHub-style 365-day commit heatmap generated from your local Git logs.
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-6 overflow-x-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400">
            <Flame className="h-4 w-4" />
            <span className="text-xs font-semibold text-white">
              1,420 Commits in the last year
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <span>Less</span>
            <div className="h-3 w-3 rounded-sm bg-zinc-900" />
            <div className="h-3 w-3 rounded-sm bg-violet-900/60" />
            <div className="h-3 w-3 rounded-sm bg-violet-700/80" />
            <div className="h-3 w-3 rounded-sm bg-violet-500" />
            <div className="h-3 w-3 rounded-sm bg-emerald-400" />
            <span>More</span>
          </div>
        </div>

        <div className="flex gap-1.5 pt-4">
          {weeks.map((w) => (
            <div key={w} className="flex flex-col gap-1.5">
              {days.map((d) => (
                <div
                  key={`${w}-${d}`}
                  className={`h-3 w-3 rounded-sm border border-zinc-800/40 transition-colors ${getIntensityClass(
                    w,
                    d
                  )}`}
                  title={`Week ${w + 1}, Day ${d + 1}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
