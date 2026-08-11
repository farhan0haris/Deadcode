import React from 'react';
import { useTodayCommits } from '../api/client';
import { CommitCard } from '../components/cards/CommitCard';
import { Calendar, Sparkles, Loader2 } from 'lucide-react';

export function OnThisDay() {
  const { data: commits, isLoading } = useTodayCommits();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary/20 text-primary border border-primary/30">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            On This Day <Sparkles className="w-4 h-4 text-amber-400" />
          </h1>
          <p className="text-xs text-zinc-400">Discover what code you pushed on this exact day in previous years</p>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-zinc-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-primary" /> Loading time machine memories...
        </div>
      ) : commits && commits.length > 0 ? (
        <div className="space-y-4">
          {commits.map((commit) => (
            <CommitCard key={commit.hash} commit={commit} />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-12 text-center space-y-3 border border-zinc-800">
          <Calendar className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-base font-medium text-zinc-200">No Historical Commits Found Today</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
            You didn't push any commits on this specific day/month in indexed repositories, or you haven't scanned your full project folder yet.
          </p>
        </div>
      )}
    </div>
  );
}
