import React from 'react';
import { Repository } from '../../types';
import { FolderGit2, Pin, GitCommit, Calendar, Code2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';

interface RepoCardProps {
  repo: Repository;
}

export function RepoCard({ repo }: RepoCardProps) {
  const queryClient = useQueryClient();

  const pinMutation = useMutation({
    mutationFn: () => api.togglePin(repo.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['repositories'] }),
  });

  return (
    <div className={`glass-card rounded-xl p-5 space-y-3 relative ${repo.is_pinned ? 'border-primary/50 bg-primary/5' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-zinc-800/80 text-primary border border-zinc-700/50">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-100 text-base">{repo.name}</h3>
            <p className="text-xs text-zinc-500 font-mono truncate max-w-xs">{repo.path}</p>
          </div>
        </div>

        <button
          onClick={() => pinMutation.mutate()}
          className={`p-1.5 rounded-lg border transition-colors ${
            repo.is_pinned
              ? 'bg-primary/20 text-primary border-primary/40'
              : 'text-zinc-500 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
          title={repo.is_pinned ? 'Unpin Repository' : 'Pin Repository'}
        >
          <Pin className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/60 text-xs">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <GitCommit className="w-3.5 h-3.5 text-zinc-500" />
          <span>{repo.total_commits.toLocaleString()} Commits</span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>{repo.primary_language || 'Unknown'}</span>
        </div>
      </div>

      {repo.last_commit_at && (
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
          <Calendar className="w-3 h-3 text-zinc-600" />
          <span>Last active: {repo.last_commit_at.substring(0, 10)}</span>
        </div>
      )}
    </div>
  );
}
