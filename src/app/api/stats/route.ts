import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    totalRepositories: 87,
    totalCommits: 14291,
    totalAdditions: 284120,
    totalDeletions: 94100,
    currentStreak: 19,
    longestStreak: 19,
    primaryLanguage: "TypeScript",
    nightOwlPercentage: 42,
    mostProductiveDay: "Tuesday",
    languages: [
      { name: "TypeScript", percentage: 65, color: "#7C5CFC", count: 89420 },
      { name: "Python", percentage: 20, color: "#10B981", count: 34110 },
      { name: "React / TSX", percentage: 10, color: "#3B82F6", count: 14900 },
      { name: "CSS / SCSS", percentage: 5, color: "#F59E0B", count: 6200 },
    ],
  });
}
