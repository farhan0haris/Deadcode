"use client";

import { Flame } from "lucide-react";

export default function HeatmapPage() {
  // Generate 52 weeks x 7 days grid
  const weeks = Array.from({ length: 52 }, (_, i) => i);
  const days = Array.from({ length: 7 }, (_, i) => i);

  const getIntensityClass = (wIndex: number, dIndex: number) => {
    const seed = (wIndex * 7 + dIndex) % 6;
    switch (seed) {
      case 1:
        return "bg-[#10367D]/40 border-[#74B4D9]/15";
      case 2:
        return "bg-[#10367D] border-[#74B4D9]/30";
      case 3:
        return "bg-[#1d52b5] border-[#74B4D9]/50";
      case 4:
        return "bg-[#74B4D9] border-white shadow-sm shadow-[#74B4D9]/50";
      case 5:
        return "bg-[#EBEBEB] border-white shadow-md shadow-[#74B4D9]";
      default:
        return "bg-[#061229] border-[#74B4D9]/10";
    }
  };

  return (
    <div className="space-y-8 p-8 pl-72">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-[#EBEBEB]">
          Contribution Calendar
        </h1>
        <p className="text-xs text-[#EBEBEB]/70 font-medium">
          GitHub-style 365-day commit heatmap generated from your synced Git activity logs.
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-6 overflow-x-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400">
            <Flame className="h-4 w-4" />
            <span className="text-xs font-black text-[#EBEBEB]">
              1,420 Commits in the last 12 months
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#EBEBEB]/70 font-bold">
            <span>Less</span>
            <div className="h-3 w-3 rounded-sm bg-[#061229] border border-[#74B4D9]/15" />
            <div className="h-3 w-3 rounded-sm bg-[#10367D]/60" />
            <div className="h-3 w-3 rounded-sm bg-[#10367D]" />
            <div className="h-3 w-3 rounded-sm bg-[#1d52b5]" />
            <div className="h-3 w-3 rounded-sm bg-[#74B4D9]" />
            <span>More</span>
          </div>
        </div>

        <div className="flex gap-1.5 pt-4 pb-2">
          {weeks.map((w) => (
            <div key={w} className="flex flex-col gap-1.5">
              {days.map((d) => (
                <div
                  key={`${w}-${d}`}
                  className={`h-3 w-3 rounded-sm border transition-colors ${getIntensityClass(
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
