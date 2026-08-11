"use client";

import { useState } from "react";
import { Sparkles, ArrowLeft, ArrowRight, Ghost, Award, Flame, Code2 } from "lucide-react";

const slides = [
  {
    title: "Your 2026 Developer Wrapped",
    subtitle: "Let's take a look back at everything you built this year.",
    stat: "14,291 Commits",
    highlight: "Top 1% Global Activity",
    icon: Ghost,
    color: "from-violet-600 to-indigo-600",
  },
  {
    title: "Your Weapon of Choice",
    subtitle: "You wrote more TypeScript this year than anything else.",
    stat: "89,420 Lines of TS",
    highlight: "TypeScript Wizard",
    icon: Code2,
    color: "from-blue-600 to-cyan-600",
  },
  {
    title: "Unstoppable Momentum",
    subtitle: "You didn't break your commit streak for 19 days straight.",
    stat: "19-Day Fire Streak",
    highlight: "Flame Keeper",
    icon: Flame,
    color: "from-amber-600 to-rose-600",
  },
  {
    title: "Night Owl Persona",
    subtitle: "42% of your total commits were pushed between 10 PM and 4 AM.",
    stat: "Night Owl Developer",
    highlight: "Code Ghost 💀",
    icon: Award,
    color: "from-purple-600 to-pink-600",
  },
];

export default function WrappedPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = slides[currentSlide];
  const Icon = slide.icon;

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-8 pl-72">
      <div className="glass-panel relative flex w-full max-w-xl flex-col items-center justify-between rounded-3xl p-10 border border-zinc-800 text-center shadow-2xl overflow-hidden min-h-[480px]">
        {/* Background Ambient Glow */}
        <div
          className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${slide.color} opacity-20 blur-3xl`}
        />

        {/* Top Slide Indicator Bar */}
        <div className="flex w-full gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white" : "bg-zinc-800"
              }`}
            />
          ))}
        </div>

        {/* Slide Content */}
        <div className="my-auto space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
            <Icon className="h-8 w-8 text-white" />
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              {slide.title}
            </h2>
            <p className="mt-2 text-xs text-zinc-300 leading-relaxed max-w-sm mx-auto">
              {slide.subtitle}
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-4xl font-extrabold text-white tracking-tight">
              {slide.stat}
            </div>
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-violet-300 backdrop-blur-md border border-white/10">
              {slide.highlight}
            </span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex w-full items-center justify-between pt-6 border-t border-zinc-800/80">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-zinc-500 font-mono">
            {currentSlide + 1} / {slides.length}
          </span>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-violet-500 disabled:opacity-30"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
