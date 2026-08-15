import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET() {
  try {
    const statsData = {
      totalRepositories: 6,
      currentStreak: 13,
      longestStreak: 19,
      primaryLanguage: "TypeScript",
      nightOwlPercentage: 42,
      mostProductiveDay: "Wednesday",
      languages: [
        { name: "TypeScript", percentage: 67, color: "#74B4D9", count: 4 },
        { name: "JavaScript", percentage: 17, color: "#1d52b5", count: 1 },
        { name: "Other", percentage: 17, color: "#10367D", count: 1 },
      ],
    };

    return successResponse(statsData);
  } catch (error: any) {
    return errorResponse(error, "Failed to retrieve developer statistics.");
  }
}
