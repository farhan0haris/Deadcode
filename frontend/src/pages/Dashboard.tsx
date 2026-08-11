import React from 'react';
import { useStats, useTodayCommits, useAchievements } from '../api/client';
import { CommitCard } from '../components/cards/CommitCard';
import { AchievementCard } from '../components/cards/AchievementCard';
import { FolderGit2, GitCommit, Flame, Code2, Calendar, Trophy, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#7C5CFC', '#5EEAD4', '#22C55E', '#F59E0B', '#EF4444', '#EC4899'];

export function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: todayCommits } = useTodayCommits();
  const { data: achievements } = useAchievements();

  const langData = React.useMemo(() => {
    if (!stats?.languages) return [];
    return Object.entries(stats.languages).map(([name, count]) => ({ name, value: count }));
  }, [stats]);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Command Center</h1>
        <p className="text-xs text-zinc-400">Overview of your local developer memory & statistics</p>
      </div>

      {/* Key Metric Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel rounded-xl p-5 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Repositories</span>
            <FolderGit2 className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{stats?.total_repositories ?? 0}</p>
          <p className="text-[11px] text-zinc-500">Indexed local Git repos</p>
        </div>

        <div className="glass-panel rounded-xl p-5 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Total Commits</span>
            <GitCommit className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{stats?.total_commits?.toLocaleString() ?? 0}</p>
          <p className="text-[11px] text-emerald-400">+{stats?.total_lines_added?.toLocaleString()} lines added</p>
        </div>

        <div className="glass-panel rounded-xl p-5 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Longest Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{stats?.longest_streak ?? 0} days</p>
          <p className="text-[11px] text-zinc-500">Consecutive daily commits</p>
        </div>

        <div className="glass-panel rounded-xl p-5 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Primary Tech</span>
            <Code2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{stats?.primary_language ?? 'N/A'}</p>
          <p className="text-[11px] text-zinc-500">{stats?.night_coding_percentage}% night coding</p>
        </div>
      </div>

      {/* Main Grid: On This Day & Language Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-white">On This Day Memories</h2>
            </div>
            <Link to="/today" className="text-xs text-primary flex items-center gap-1 hover:underline">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {todayCommits && todayCommits.length > 0 ? (
            <div className="space-y-4">
              {todayCommits.slice(0, 3).map((commit) => (
                <CommitCard key={commit.hash} commit={commit} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-xl p-8 text-center text-zinc-400 space-y-2 border border-zinc-800">
              <Calendar className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-sm font-medium">No commits found on this day in past years.</p>
              <p className="text-xs text-zinc-500">Scan more repositories using the scanner tab!</p>
            </div>
          )}
        </div>

        {/* Sidebar Widgets: Languages & Achievements */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-5 border border-zinc-800 space-y-4">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" /> Language Distribution
            </h3>
            {langData.length > 0 ? (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={langData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={35}>
                      {langData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#111113', borderColor: '#27272A', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-xs text-zinc-500">No language data calculated yet.</p>
            )}
          </div>

          <div className="glass-panel rounded-xl p-5 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" /> Recent Trophies
              </h3>
              <Link to="/achievements" className="text-xs text-primary hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {achievements?.slice(0, 2).map((ach) => (
                <AchievementCard key={ach.id} achievement={ach} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
