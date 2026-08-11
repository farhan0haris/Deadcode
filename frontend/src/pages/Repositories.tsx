import React, { useState } from 'react';
import { useRepositories, api } from '../api/client';
import { RepoCard } from '../components/cards/RepoCard';
import { FolderGit2, Plus, Search, FolderPlus, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function Repositories() {
  const [searchTerm, setSearchTerm] = useState('');
  const [newFolderPath, setNewFolderPath] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: repos, isLoading } = useRepositories(searchTerm);
  const queryClient = useQueryClient();

  const addFolderMutation = useMutation({
    mutationFn: (path: string) => api.addFolder(path),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      setShowAddModal(false);
      setNewFolderPath('');
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Repository Explorer</h1>
          <p className="text-xs text-zinc-400">Manage and explore indexed Git projects on your local machine</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-lg shadow-primary/20 transition-all"
        >
          <FolderPlus className="w-4 h-4" /> Add Directory to Index
        </button>
      </div>

      {/* Search & Filters */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter repositories by name, path, or language..."
          className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-primary"
        />
      </div>

      {/* Repository Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-zinc-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-primary" /> Scanning indexed repositories...
        </div>
      ) : repos && repos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-12 text-center space-y-3 border border-zinc-800">
          <FolderGit2 className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-base font-medium text-zinc-200">No Repositories Indexed Yet</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Click "Add Directory to Index" to point DeadCode at your projects or code directory.
          </p>
        </div>
      )}

      {/* Add Folder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-zinc-800 space-y-4">
            <h3 className="font-semibold text-lg text-white">Add Local Directory</h3>
            <p className="text-xs text-zinc-400">
              Enter the absolute path to a local directory containing Git repositories.
            </p>
            <input
              type="text"
              value={newFolderPath}
              onChange={(e) => setNewFolderPath(e.target.value)}
              placeholder="e.g. C:\Users\YourName\Documents\GitHub"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-primary font-mono"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => addFolderMutation.mutate(newFolderPath)}
                disabled={!newFolderPath || addFolderMutation.isPending}
                className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold disabled:opacity-50 flex items-center gap-1.5"
              >
                {addFolderMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Start Scanning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
