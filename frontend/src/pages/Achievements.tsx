import React from 'react';
import { useAchievements } from '../api/client';
import { AchievementCard } from '../components/cards/AchievementCard';
import { Trophy } from 'lucide-react';

export function Achievements() {
  const { data: achievements } = useAchievements();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-400" /> Trophies & Badges
        </h1>
        <p className="text-xs text-zinc-400">Automated achievements unlocked by your real local coding habits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements?.map((ach) => (
          <AchievementCard key={ach.id} achievement={ach} />
        ))}
      </div>
    </div>
  );
}
