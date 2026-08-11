import React from 'react';
import { useStats } from '../api/client';
import { GitBranch, Calendar, Flame, Layers } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function Timeline() {
  const { data: stats } = useStats();

  const chartData = React.useMemo(() => {
    if (!stats?.daily_contributions) return [];
    return Object.entries(stats.daily_contributions)
      .slice(-30)
      .map(([date, count]) => ({ date, count }));
  }, [stats]);

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <GitBranch className="w-6 h-6 text-primary" /> Visual Git Timeline
        </h1>
        <p className="text-xs text-zinc-400">Track your daily commit activity and development momentum over time</p>
      </div>

      <div className="glass-panel rounded-xl p-6 border border-zinc-800 space-y-4">
        <h3 className="font-semibold text-white text-sm">Recent 30-Day Activity Graph</h3>
        {chartData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                <XAxis dataKey="date" stroke="#71717A" fontSize={10} />
                <YAxis stroke="#71717A" fontSize={10} />
                <Tooltip contentStyle={{ background: '#111113', borderColor: '#27272A', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#7C5CFC" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-xs text-zinc-500 text-center py-8">Scan local repositories to populate timeline statistics.</p>
        )}
      </div>

      <div className="glass-card rounded-xl p-6 border border-zinc-800 space-y-4">
        <h3 className="font-semibold text-white text-sm flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" /> Continuous Commit Streaks
        </h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
            <p className="text-2xl font-bold text-white font-mono">{stats?.active_streak ?? 0}</p>
            <p className="text-xs text-zinc-500">Current Active Streak (Days)</p>
          </div>
          <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
            <p className="text-2xl font-bold text-amber-400 font-mono">{stats?.longest_streak ?? 0}</p>
            <p className="text-xs text-zinc-500">All-Time Longest Streak (Days)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
