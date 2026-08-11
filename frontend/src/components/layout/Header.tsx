import React from 'react';
import { RefreshCw, Terminal, Search as SearchIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const rescanMutation = useMutation({
    mutationFn: api.rescan,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  return (
    <header className="h-16 border-b border-surfaceBorder/80 bg-surface/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative w-full">
          <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search commits, repositories, or languages..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate(`/search?q=${encodeURIComponent(e.currentTarget.value)}`);
              }
            }}
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => rescanMutation.mutate()}
          disabled={rescanMutation.isPending}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium hover:bg-zinc-800 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${rescanMutation.isPending ? 'animate-spin text-primary' : ''}`} />
          {rescanMutation.isPending ? 'Indexing Repos...' : 'Rescan Git'}
        </button>

        <div className="h-4 w-[1px] bg-zinc-800" />

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
          <Terminal className="w-3.5 h-3.5" />
          <span>CLI Active</span>
        </div>
      </div>
    </header>
  );
}
