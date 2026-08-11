import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { Commit } from '../types';
import { CommitCard } from '../components/cards/CommitCard';
import { Search as SearchIcon, Loader2 } from 'lucide-react';

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const data = await api.searchCommits(q);
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Instant Search</h1>
        <p className="text-xs text-zinc-400">Search across all indexed commit messages, repositories, authors, and hashes</p>
      </div>

      <div className="relative">
        <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setSearchParams({ q: query });
              handleSearch(query);
            }
          }}
          placeholder="Search e.g. 'fix bug', 'initial commit', 'refactor', 'React'..."
          className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-9 pr-4 py-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-primary"
        />
      </div>

      {loading ? (
        <div className="p-12 text-center text-zinc-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-primary" /> Searching commits...
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          {results.map((commit) => (
            <CommitCard key={commit.hash} commit={commit} />
          ))}
        </div>
      ) : query ? (
        <div className="glass-card rounded-xl p-8 text-center text-zinc-400 border border-zinc-800 text-xs">
          No matching commits found for "{query}".
        </div>
      ) : null}
    </div>
  );
}
