import React from 'react';
import { useStats } from '../api/client';
import { BarChart3, Moon, Sun, Plus, Minus, Calendar, Trophy } from 'lucide-react';

export function Statistics() {
  const { data: stats } = useStats();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" /> Comprehensive Analytics
        </h1>
        <p className="text-xs text-zinc-400">Calculated locally from your raw Git commit history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel rounded-xl p-5 border border-zinc-800 space-y-3">
          <h3 className="font-semibold text-white text-sm flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" /> Line Count Dynamics
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-zinc-400">Total Insertions:</span>
              <span className="text-emerald-400">+{stats?.total_lines_added?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Total Deletions:</span>
              <span className="text-rose-400">-{stats?.total_lines_removed?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-5 border border-zinc-800 space-y-3">
          <h3 className="font-semibold text-white text-sm flex items-center gap-2">
            <Moon className="w-4 h-4 text-purple-400" /> Coding Habits
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-zinc-400">Night Coding (10PM - 5AM):</span>
              <span className="text-purple-300">{stats?.night_coding_percentage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Weekend Coding:</span>
              <span className="text-cyan-300">{stats?.weekend_coding_percentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
