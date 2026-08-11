"use client";

import { GitCommit, Activity, Flame } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const timelineData = [
  { day: "Nov 1", commits: 12 },
  { day: "Nov 3", commits: 24 },
  { day: "Nov 5", commits: 8 },
  { day: "Nov 7", commits: 35 },
  { day: "Nov 9", commits: 19 },
  { day: "Nov 11", commits: 42 },
  { day: "Nov 14", commits: 28 },
];

export default function TimelinePage() {
  return (
    <div className="space-y-8 p-8 pl-72">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Commit Activity Timeline
        </h1>
        <p className="text-xs text-zinc-400">
          30-day activity intensity graph and commit distribution over time.
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Activity Graph</h2>
          <span className="text-xs text-violet-400 font-mono">Last 30 Days</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C5CFC" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7C5CFC" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#52525b" fontSize={12} />
              <YAxis stroke="#52525b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  borderColor: "#27272a",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="commits"
                stroke="#7C5CFC"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCommits)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
