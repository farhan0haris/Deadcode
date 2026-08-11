import React from 'react';
import { Download, FileText, Code, Table, Globe } from 'lucide-react';

export function Export() {
  const triggerDownload = (format: string) => {
    window.open(`/api/export/${format}`, '_blank');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Download className="w-6 h-6 text-primary" /> Report & Data Exporter
        </h1>
        <p className="text-xs text-zinc-400">Export your local developer memory & statistics into standard formats</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-6 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Markdown Summary</h3>
              <p className="text-xs text-zinc-400">Perfect for GitHub profile README or personal blogs</p>
            </div>
          </div>
          <button
            onClick={() => triggerDownload('md')}
            className="w-full py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white"
          >
            Download Markdown (.md)
          </button>
        </div>

        <div className="glass-card rounded-xl p-6 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Standalone HTML Report</h3>
              <p className="text-xs text-zinc-400">Beautiful styled HTML document printable to PDF</p>
            </div>
          </div>
          <button
            onClick={() => triggerDownload('html')}
            className="w-full py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white"
          >
            Download HTML (.html)
          </button>
        </div>

        <div className="glass-card rounded-xl p-6 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Raw JSON Dataset</h3>
              <p className="text-xs text-zinc-400">Complete raw JSON payload of stats and commits</p>
            </div>
          </div>
          <button
            onClick={() => triggerDownload('json')}
            className="w-full py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white"
          >
            Download JSON (.json)
          </button>
        </div>

        <div className="glass-card rounded-xl p-6 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">CSV Metrics Table</h3>
              <p className="text-xs text-zinc-400">Tabular statistics suitable for Excel or Numbers</p>
            </div>
          </div>
          <button
            onClick={() => triggerDownload('csv')}
            className="w-full py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white"
          >
            Download CSV (.csv)
          </button>
        </div>
      </div>
    </div>
  );
}
