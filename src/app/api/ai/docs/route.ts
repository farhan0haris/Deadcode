import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { repositoryId, repoName = "DeadCode", docType = "README", privacyMode = "LOCAL" } = body;

    try {
      const fastapiRes = await fetch("http://127.0.0.1:8000/api/ai/docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repository_id: repositoryId || "default-repo",
          repo_name: repoName,
          doc_type: docType,
          privacy_mode: privacyMode,
        }),
      });

      if (fastapiRes.ok) {
        const data = await fastapiRes.json();
        return NextResponse.json(data);
      }
    } catch (e) {
      console.warn("FastAPI engine offline, returning local fallback docs:", e);
    }

    let markdown = "";
    if (docType === "README") {
      markdown = `# ${repoName} v3.0

> **AI-Powered Codebase Intelligence & Developer Memory Platform**

## 🌟 Highlights
- 🧠 **Developer Memory**: 'On This Day' Git time machine enhanced with natural language commit search.
- 💬 **Codebase RAG Assistant**: Ask questions across entire repositories with precise file citations.
- 🛡️ **Code Health Auditor**: Automatic bug, code smell, and vulnerability detector.
- 🔒 **Dual Privacy Modes**: Local Mode (Ollama) & Cloud Mode (Gemini API) with transparent consent.

## 🚀 Quickstart
\`\`\`bash
npm install
npm run dev
\`\`\`
`;
    } else if (docType === "API") {
      markdown = `# API Documentation - ${repoName}

### POST \`/api/ai/chat\`
Scans vector embeddings and answers developer queries with source line citations.

### POST \`/api/ai/audit\`
Analyzes source files for security vulnerabilities and performance bottlenecks.

### POST \`/api/ai/docs\`
Synthesizes project documentation on-demand.
`;
    } else {
      markdown = `# Architecture Overview - ${repoName}

DeadCode v3.0 pairs a modern **Next.js 16 App Router** frontend with a **FastAPI RAG Engine** and **Prisma PostgreSQL/SQLite** database layer.

\`\`\`text
Next.js App Router  --->  FastAPI RAG Engine  --->  Ollama / Gemini API
       |                                                    |
       +-------------> Prisma (PostgreSQL / Vector) <-------+
\`\`\`
`;
    }

    return NextResponse.json({
      doc_type: docType,
      content: markdown,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error("Docs API Error:", error);
    return NextResponse.json({ error: "Failed to generate documentation" }, { status: 500 });
  }
}
