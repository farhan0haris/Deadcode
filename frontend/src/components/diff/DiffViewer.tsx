import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import { Loader2 } from 'lucide-react';

interface DiffViewerProps {
  repoPath: string;
  commitHash: string;
}

export function DiffViewer({ repoPath, commitHash }: DiffViewerProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['diff', repoPath, commitHash],
    queryFn: () => api.getDiff(repoPath, commitHash),
    enabled: Boolean(repoPath && commitHash),
  });

  if (isLoading) {
    return (
      <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center gap-2 text-xs text-zinc-400">
        <Loader2 className="w-4 h-4 animate-spin text-primary" /> Loading commit diff...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-800/40 text-xs text-rose-300">
        Could not load diff for this commit. The repository might have moved or is inaccessible.
      </div>
    );
  }

  const lines = data.diff.split('\n');

  return (
    <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 font-mono text-xs overflow-x-auto max-h-80">
      {lines.map((line, idx) => {
        let lineStyle = 'text-zinc-400';
        if (line.startsWith('+') && !line.startsWith('+++')) {
          lineStyle = 'bg-emerald-950/30 text-emerald-300 px-1 border-l-2 border-emerald-500';
        } else if (line.startsWith('-') && !line.startsWith('---')) {
          lineStyle = 'bg-rose-950/30 text-rose-300 px-1 border-l-2 border-rose-500';
        } else if (line.startsWith('@@')) {
          lineStyle = 'text-purple-400 font-bold bg-purple-950/20 px-1';
        }

        return (
          <div key={idx} className={`whitespace-pre ${lineStyle}`}>
            {line}
          </div>
        );
      })}
    </div>
  );
}
