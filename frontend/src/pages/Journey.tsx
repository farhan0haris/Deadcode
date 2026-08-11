import React from 'react';
import { useJourney } from '../api/client';
import { Compass, Rocket, Zap, Trophy } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Rocket,
  Zap,
  Trophy,
};

export function Journey() {
  const { data: milestones } = useJourney();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Compass className="w-6 h-6 text-primary" /> Developer Journey & Milestones
        </h1>
        <p className="text-xs text-zinc-400">Key achievements and historic milestones automatically extracted from your Git logs</p>
      </div>

      <div className="relative border-l-2 border-zinc-800 ml-4 space-y-8 py-4">
        {milestones && milestones.length > 0 ? (
          milestones.map((m, idx) => {
            const Icon = ICON_MAP[m.icon] || Rocket;
            return (
              <div key={idx} className="relative pl-6">
                <div className="absolute -left-3 top-0 p-1.5 rounded-full bg-primary text-white border-4 border-background">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="glass-card rounded-xl p-5 border border-zinc-800 space-y-1">
                  <span className="text-[11px] text-primary font-mono">{m.date ? m.date.substring(0, 10) : ''}</span>
                  <h3 className="font-semibold text-white text-base">{m.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{m.description}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-zinc-500 pl-6">Scan your local projects to generate developer journey milestones.</p>
        )}
      </div>
    </div>
  );
}
