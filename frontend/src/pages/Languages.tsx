import React from 'react';
import { useStats } from '../api/client';
import { Code2, Globe } from 'lucide-react';

export function Languages() {
  const { data: stats } = useStats();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Code2 className="w-6 h-6 text-primary" /> Language & Stack Evolution
        </h1>
        <p className="text-xs text-zinc-400">Track how your technology stack has changed over time</p>
      </div>

      <div className="glass-panel rounded-xl p-6 border border-zinc-800 space-y-4">
        <h3 className="font-semibold text-white text-sm">Indexed Languages Breakdown</h3>
        <div className="space-y-3">
          {stats?.languages && Object.keys(stats.languages).length > 0 ? (
            Object.entries(stats.languages).map(([lang, count]) => (
              <div key={lang} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-zinc-200">{lang}</span>
                  <span className="text-zinc-500 font-mono">{count} repo(s)</span>
                </div>
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div className="h-full bg-primary" style={{ width: `${Math.min(100, count * 20)}%` }} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-zinc-500">No language data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
