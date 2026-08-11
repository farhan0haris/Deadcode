import React, { useState } from 'react';
import { Commit } from '../../types';
import { GitCommit, Calendar, Folder, FileCode, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { DiffViewer } from '../diff/DiffViewer';

interface CommitCardProps {
  commit: Commit;
}

export function CommitCard({ commit }: CommitCardProps) {
  const [showDiff, setShowDiff] = useState(false);

  return (
    <div className="glass-card rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-primary/20 text-primary text-xs font-mono font-medium border border-primary/30">
              {commit.years_ago ? `${commit.years_ago} year(s) ago` : commit.date.substring(0, 10)}
            </span>
            <span className="text-xs text-zinc-400 font-mono">#{commit.hash.substring(0, 7)}</span>
          </div>
          <h3 className="font-semibold text-zinc-100 text-base leading-snug">{commit.message}</h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-800/40">
            <Plus className="w-3 h-3" /> {commit.insertions}
          </span>
          <span className="flex items-center gap-1 text-rose-400 bg-rose-950/40 px-2 py-1 rounded border border-rose-800/40">
            <Minus className="w-3 h-3" /> {commit.deletions}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-2 border-t border-zinc-800/60">
        <div className="flex items-center gap-1.5">
          <Folder className="w-3.5 h-3.5 text-primary" />
          <span className="font-medium text-zinc-300">{commit.repo_name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <GitCommit className="w-3.5 h-3.5 text-zinc-500" />
          <span>{commit.branch || 'main'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileCode className="w-3.5 h-3.5 text-cyan-400" />
          <span>{commit.primary_language || 'Code'}</span>
        </div>
      </div>

      <div className="pt-2 flex justify-between items-center">
        <button
          onClick={() => setShowDiff(!showDiff)}
          className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline focus:outline-none"
        >
          {showDiff ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {showDiff ? 'Hide Diff Preview' : 'Quick Diff Preview'}
        </button>
      </div>

      {showDiff && (
        <div className="mt-3">
          <DiffViewer repoPath={commit.repo_path} commitHash={commit.hash} />
        </div>
      )}
    </div>
  );
}
