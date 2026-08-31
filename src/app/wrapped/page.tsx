"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Ghost, Award, Flame, Code2, FolderGit2, Star } from "lucide-react";
import { getStoredSyncData, FullSyncData } from "@/lib/githubSync";

export default function WrappedPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [syncData, setSyncData] = useState<FullSyncData | null>(null);

  useEffect(() => {
    const data = getStoredSyncData();
    if (data) setSyncData(data);

    const handleUpdate = () => setSyncData(getStoredSyncData());
    window.addEventListener("deadcode_sync_updated", handleUpdate);
    return () => window.removeEventListener("deadcode_sync_updated", handleUpdate);
  }, []);

  const totalRepos = syncData?.stats.reposCount || 6;
  const primaryTech = syncData?.stats.primaryTech || "TypeScript";
  const primaryPercent = syncData?.stats.primaryPercent || 67;
  const totalStars = syncData?.stats.totalStars || 0;
  const streakDays = syncData?.stats.streakDays || 13;
  const username = syncData?.user.name || syncData?.user.login || "Developer";

  const slides = [
    {
      title: `${username}'s 2026 Wrapped`,
      subtitle: "Let's take a look back at your active GitHub journey and codebase evolution.",
      stat: `${totalRepos} Active Repositories`,
      highlight: `${totalRepos >= 5 ? "Prolific Creator" : "Active Builder"} 🚀`,
      icon: FolderGit2,
      color: "from-[#10367D] to-[#1d52b5]",
    },
    {
      title: "Your Weapon of Choice",
      subtitle: `You built the majority of your projects with ${primaryTech}.`,
      stat: `${primaryPercent}% ${primaryTech}`,
      highlight: `${primaryTech} Architect ⚡`,
      icon: Code2,
      color: "from-[#10367D] to-[#74B4D9]",
    },
    {
      title: "Unstoppable Momentum",
      subtitle: "You maintained continuous coding activity and push velocity.",
      stat: `${streakDays}-Day Activity Streak`,
      highlight: "Flame Keeper 🔥",
      icon: Flame,
      color: "from-[#1d52b5] to-[#74B4D9]",
    },
    {
      title: "Developer Archetype",
      subtitle: `From repositories like ${syncData?.repos[0]?.name || "Deadcode"}, your open source presence is evolving.`,
      stat: `${totalStars} Stars Earned`,
      highlight: "Code Ghost 💀",
      icon: Award,
      color: "from-[#10367D] to-[#091836]",
    },
  ];

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="glass-panel relative flex w-full max-w-xl flex-col items-center justify-between rounded-3xl p-10 border border-[#74B4D9]/25 text-center shadow-2xl overflow-hidden min-h-[480px]">
        {/* Background Ambient Glow */}
        <div
          className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${slide.color} opacity-25 blur-3xl`}
        />

        {/* Top Slide Indicator Bar */}
        <div className="flex w-full gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-[#74B4D9]" : "bg-[#74B4D9]/20"
              }`}
            />
          ))}
        </div>

        {/* Slide Content */}
        <div className="my-auto space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10367D] to-[#1d52b5] text-[#74B4D9] backdrop-blur-md border border-[#74B4D9]/30 shadow-xl">
            <Icon className="h-8 w-8" />
          </div>

          <div>
            <h2 className="text-3xl font-black text-[#EBEBEB] tracking-tight">
              {slide.title}
            </h2>
            <p className="mt-2 text-xs text-[#EBEBEB]/80 leading-relaxed max-w-sm mx-auto font-medium">
              {slide.subtitle}
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-4xl font-black text-[#EBEBEB] tracking-tight">
              {slide.stat}
            </div>
            <span className="inline-block rounded-full bg-[#74B4D9]/15 text-[#74B4D9] px-3.5 py-1 text-xs font-bold backdrop-blur-md border border-[#74B4D9]/30">
              {slide.highlight}
            </span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex w-full items-center justify-between pt-6 border-t border-[#74B4D9]/15">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center gap-2 rounded-xl border border-[#74B4D9]/20 bg-[#74B4D9]/10 px-4 py-2 text-xs font-bold text-[#EBEBEB] hover:bg-[#74B4D9]/20 disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-[#74B4D9] font-mono font-bold">
            {currentSlide + 1} / {slides.length}
          </span>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#10367D] via-[#1647a3] to-[#74B4D9] px-4 py-2 text-xs font-bold text-[#EBEBEB] shadow-md border border-[#74B4D9]/30 hover:scale-105 disabled:opacity-30"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
