import { successResponse, errorResponse } from "@/lib/apiResponse";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return successResponse({
        totalRepositories: 0,
        totalStars: 0,
        totalForks: 0,
        primaryLanguage: "None",
        languages: [],
      });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        repositories: {
          orderBy: { stars: "desc" },
        },
      },
    });

    const repos = dbUser?.repositories || [];
    const langCounts: Record<string, number> = {};

    repos.forEach((repo) => {
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
      }
    });

    const totalLangRepos = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1;
    const colors = ["#74B4D9", "#10367D", "#1d52b5", "#8ec7e8", "#5a9fc2", "#a5d5f2"];

    const languages = Object.entries(langCounts)
      .map(([name, count], index) => ({
        name,
        count,
        percentage: Math.round((count / totalLangRepos) * 100),
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.count - a.count);

    const statsData = {
      totalRepositories: repos.length,
      totalStars: repos.reduce((acc, r) => acc + r.stars, 0),
      totalForks: repos.reduce((acc, r) => acc + r.forks, 0),
      primaryLanguage: languages[0]?.name || "None",
      languages,
    };

    return successResponse(statsData);
  } catch (error: any) {
    return errorResponse(error, "Failed to retrieve developer statistics.");
  }
}
