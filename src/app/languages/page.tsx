"use client";

import { Code2 } from "lucide-react";

const languages = [
  { name: "TypeScript", percent: 65, color: "bg-[#74B4D9]", count: "89,420 lines" },
  { name: "Python", percent: 20, color: "bg-[#1d52b5]", count: "34,110 lines" },
  { name: "React (TSX)", percent: 10, color: "bg-[#10367D]", count: "14,900 lines" },
  { name: "CSS / SCSS", percent: 5, color: "bg-[#a5d5f2]", count: "6,200 lines" },
];

export default function LanguageEvolutionPage() {
  return (
    <div className="space-y-8 p-8 pl-72">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-[#EBEBEB]">
          Language Evolution & Stack Adoption
        </h1>
        <p className="text-xs text-[#EBEBEB]/70 font-medium">
          Historical distribution of programming languages used across all your repositories.
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-[#74B4D9]" />
          <h2 className="text-base font-extrabold text-[#EBEBEB]">Primary Tech Breakdown</h2>
        </div>

        <div className="space-y-5">
          {languages.map((lang) => (
            <div key={lang.name} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#EBEBEB]">{lang.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[#EBEBEB]/60 font-medium">{lang.count}</span>
                  <span className="font-mono font-bold text-[#74B4D9]">
                    {lang.percent}%
                  </span>
                </div>
              </div>
              <div className="h-3 w-full rounded-full bg-[#061229] overflow-hidden border border-[#74B4D9]/20">
                <div
                  className={`h-full rounded-full ${lang.color} transition-all duration-500`}
                  style={{ width: `${lang.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
