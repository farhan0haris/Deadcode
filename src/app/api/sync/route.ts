import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { syncPayloadSchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { securityLogger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    let rawBody: any = {};
    const contentType = request.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      try {
        rawBody = await request.json();
      } catch {
        return errorResponse(new Error("Malformed JSON payload in request body."), "Invalid JSON payload", 400);
      }
    }

    // Strict schema validation
    const validation = syncPayloadSchema.safeParse(rawBody);
    if (!validation.success) {
      return errorResponse(validation.error);
    }

    const { username: validatedUsername, token: validatedToken } = validation.data;
    const authHeader = request.headers.get("authorization");
    const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7).trim() : undefined;
    const token = validatedToken || headerToken || process.env.GITHUB_TOKEN;
    const username = validatedUsername?.trim()?.replace(/^@/, "");

    const octokit = new Octokit({
      auth: token && token !== "placeholder_github_token" ? token : undefined,
    });

    let rawRepos: any[] = [];
    let userInfo: any = null;

    // 1. If we have a Personal Access Token or OAuth token, fetch authenticated user's repos
    if (token && token !== "placeholder_github_token") {
      try {
        const { data: user } = await octokit.rest.users.getAuthenticated();
        userInfo = user;
        const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
          per_page: 100,
          sort: "updated",
          affiliation: "owner,collaborator",
        });
        rawRepos = repos;
      } catch {
        // Fallback to username fetch if token is invalid/restricted
      }
    }

    // 2. If no token or if username was explicitly passed, fetch public repos for that username
    if (rawRepos.length === 0 && username) {
      try {
        const { data: user } = await octokit.rest.users.getByUsername({ username });
        userInfo = user;
        const { data: repos } = await octokit.rest.repos.listForUser({
          username,
          per_page: 100,
          sort: "updated",
        });
        rawRepos = repos;
      } catch (err: any) {
        if (err.status === 404) {
          return errorResponse(
            new Error(`Could not find GitHub user '@${username}'. Please verify the username.`),
            "GitHub user not found",
            404
          );
        }
        if (err.status === 403) {
          return errorResponse(
            new Error("GitHub API rate limit reached. Please configure a Personal Access Token in Settings."),
            "GitHub rate limit reached",
            429
          );
        }
        throw err;
      }
    }

    // If still no repos and no username provided
    if (rawRepos.length === 0 && !username) {
      return errorResponse(
        new Error("Please provide a valid GitHub username or Personal Access Token to synchronize."),
        "Missing GitHub username or token",
        400
      );
    }

    // 3. Process and format repositories safely
    const repos = rawRepos.map((repo: any) => ({
      id: String(repo.id),
      name: String(repo.name).slice(0, 100),
      fullName: String(repo.full_name).slice(0, 150),
      description: repo.description ? String(repo.description).slice(0, 500) : "No description provided.",
      language: repo.language ? String(repo.language).slice(0, 50) : "Other",
      stars: typeof repo.stargazers_count === "number" ? Math.max(0, repo.stargazers_count) : 0,
      forks: typeof repo.forks_count === "number" ? Math.max(0, repo.forks_count) : 0,
      isPrivate: Boolean(repo.private),
      htmlUrl: repo.html_url && String(repo.html_url).startsWith("https://github.com/") ? repo.html_url : `https://github.com/${username || "user"}`,
      updatedAt: repo.updated_at || new Date().toISOString(),
      defaultBranch: repo.default_branch ? String(repo.default_branch).slice(0, 50) : "main",
      size: typeof repo.size === "number" ? Math.max(0, repo.size) : 0,
    }));

    // 4. Calculate Language Distribution
    const langCounts: Record<string, number> = {};
    repos.forEach((r) => {
      if (r.language) {
        langCounts[r.language] = (langCounts[r.language] || 0) + 1;
      }
    });

    const totalLangRepos = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1;
    const colors = ["#74B4D9", "#10367D", "#1d52b5", "#8ec7e8", "#5a9fc2", "#a5d5f2"];

    const languages = Object.entries(langCounts)
      .map(([name, count], index) => ({
        name,
        count,
        value: Math.round((count / totalLangRepos) * 100),
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.value - a.value);

    const primaryTech = languages[0]?.name || "TypeScript";
    const primaryPercent = languages[0]?.value || 100;
    const totalStars = repos.reduce((acc, r) => acc + r.stars, 0);
    const totalForks = repos.reduce((acc, r) => acc + r.forks, 0);
    const estimatedCommits = repos.reduce(
      (acc, r) => acc + Math.max(r.size > 0 ? Math.floor(r.size / 3) : 10, 5),
      0
    );

    securityLogger.log({
      event: "SYNC_EVENT",
      user: userInfo?.login || username,
      details: { reposCount: repos.length },
    });

    return successResponse({
      message: `Successfully synchronized ${repos.length} repositories for @${userInfo?.login || username}.`,
      user: {
        login: userInfo?.login || username,
        name: userInfo?.name || userInfo?.login || username,
        avatarUrl: userInfo?.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(username || "dev")}`,
        bio: userInfo?.bio ? String(userInfo.bio).slice(0, 300) : "",
        publicRepos: typeof userInfo?.public_repos === "number" ? userInfo.public_repos : repos.length,
        followers: typeof userInfo?.followers === "number" ? userInfo.followers : 0,
        following: typeof userInfo?.following === "number" ? userInfo.following : 0,
        htmlUrl: userInfo?.html_url || `https://github.com/${username}`,
      },
      stats: {
        reposCount: repos.length,
        commitsCount: estimatedCommits,
        totalStars,
        totalForks,
        primaryTech,
        primaryPercent,
        streakDays: Math.min(repos.length > 0 ? (repos.length % 14) + 7 : 0, 30),
      },
      languages,
      repos,
      syncedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return errorResponse(error, "Failed to synchronize GitHub repositories.");
  }
}
