import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "json";

  const exportData = {
    app: "DeadCode v2 SaaS",
    exportedAt: new Date().toISOString(),
    stats: {
      repositories: 87,
      commits: 14291,
      primaryLanguage: "TypeScript",
      streak: 19,
    },
  };

  if (format === "csv") {
    const csvContent = "Metric,Value\nRepositories,87\nCommits,14291\nPrimary Language,TypeScript\nStreak,19";
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="deadcode_stats.csv"',
      },
    });
  }

  return NextResponse.json(exportData);
}
