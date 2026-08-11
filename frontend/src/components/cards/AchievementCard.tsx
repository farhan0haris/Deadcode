import React from 'react';
import { Achievement } from '../../types';
import { Trophy, Award, Flame, Moon, Zap, Scissors, Globe, FolderGit2, Sparkles, GitCommit } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
}

const ICON_MAP: Record<string, any> = {
  GitCommit,
  FolderPlus: FolderGit2,
  Award,
  Flame,
  Moon,
  Zap,
  Scissors,
  Globe,
  FolderGit2,
  Sparkles,
  Trophy,
};

export function AchievementCard({ achievement }: AchievementCardProps) {
  const Icon = ICON_MAP[achievement.icon] || Trophy;
  const isUnlocked = Boolean(achievement.unlocked_at);

  return (
    <div className={`glass-card rounded-xl p-5 border space-y-3 relative overflow-hidden transition-all ${
      isUnlocked ? 'border-amber-500/40 bg-amber-500/5' : 'border-zinc-800 opacity-60'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl border ${
          isUnlocked 
            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-lg shadow-amber-500/10' 
            : 'bg-zinc-900 text-zinc-600 border-zinc-800'
        }`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-zinc-100 text-base">{achievement.title}</h3>
            {isUnlocked && (
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                Unlocked
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">{achievement.description}</p>
        </div>
      </div>

      <div className="space-y-1 pt-1">
        <div className="flex justify-between text-[11px] font-mono text-zinc-400">
          <span>Progress</span>
          <span>{achievement.progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
          <div 
            className={`h-full transition-all duration-500 ${isUnlocked ? 'bg-amber-400' : 'bg-primary/50'}`} 
            style={{ width: `${achievement.progress}%` }} 
          />
        </div>
      </div>
    </div>
  );
}
