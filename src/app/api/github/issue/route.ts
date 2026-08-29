import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { repoFullName, title, body: issueBody, accessToken } = body;

    if (!repoFullName || !title) {
      return NextResponse.json({ error: "Repository name and title are required" }, { status: 400 });
    }

    if (!accessToken) {
      // Simulate success for local demo/testing mode
      return NextResponse.json({
        success: true,
        isSimulated: true,
        issueUrl: `https://github.com/${repoFullName}/issues/mock-1`,
        message: "GitHub issue generated in Demo Mode! Connect GitHub OAuth for live repository sync."
      });
    }

    // Call official GitHub REST API
    const response = await fetch(`https://api.github.com/repos/${repoFullName}/issues`, {
      method: "POST",
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `[DeadCode Audit] ${title}`,
        body: issueBody,
        labels: ["bug", "deadcode-v3"],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message || "Failed to create issue on GitHub" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      issueUrl: data.html_url,
      issueNumber: data.number,
    });
  } catch (error) {
    console.error("GitHub Issue Creation Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
