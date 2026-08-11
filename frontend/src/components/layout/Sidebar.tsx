import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  FolderGit2, 
  GitBranch, 
  BarChart3, 
  Code2, 
  Compass, 
  Trophy, 
  Search, 
  Download,
  Flame,
  ShieldCheck
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/today', label: 'On This Day', icon: Calendar },
  { path: '/repositories', label: 'Repositories', icon: FolderGit2 },
  { path: '/timeline', label: 'Timeline', icon: GitBranch },
  { path: '/statistics', label: 'Statistics', icon: BarChart3 },
  { path: '/languages', label: 'Language Evolution', icon: Code2 },
  { path: '/journey', label: 'Developer Journey', icon: Compass },
  { path: '/achievements', label: 'Achievements', icon: Trophy },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/export', label: 'Export', icon: Download },
];

export function Sidebar() {
  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-surface/80 border-r border-surfaceBorder backdrop-blur-xl z-20 flex flex-col justify-between p-4">
      <div>
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-surfaceBorder/60">
          <div className="p-2 rounded-xl bg-primary/20 text-primary border border-primary/30">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
              DeadCode <span className="text-xs px-1.5 py-0.5 rounded bg-primary/30 text-primary font-mono">v1.0</span>
            </h1>
            <p className="text-xs text-zinc-400">Git Time Machine</p>
          </div>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/25 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-400">
        <div className="flex items-center gap-2 text-emerald-400 font-medium mb-1">
          <ShieldCheck className="w-4 h-4" /> 100% Offline Mode
        </div>
        <p className="leading-relaxed">All Git logs & metrics computed locally. No cloud sync.</p>
      </div>
    </aside>
  );
}
