import { NextResponse } from "next/server";
import { exportQuerySchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/apiResponse";

/**
 * Sanitizes values for CSV output to prevent CSV Formula Injection / DDE vulnerabilities.
 * Prefixes cells starting with '=', '+', '-', '@', '\t', '\r' with an apostrophe.
 */
function sanitizeCsvCell(value: any): string {
  const str = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str.replace(/"/g, '""')}`;
  }
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const rawFormat = url.searchParams.get("format") || "json";

    const validation = exportQuerySchema.safeParse({ format: rawFormat });
    if (!validation.success) {
      return errorResponse(validation.error);
    }

    const { format } = validation.data;

    const exportData = {
      app: "DeadCode v2.0 Cloud & Offline Edition",
      exportedAt: new Date().toISOString(),
      stats: {
        repositories: 6,
        primaryLanguage: "TypeScript",
        streakDays: 13,
      },
    };

    if (format === "csv") {
      const rows = [
        ["Metric", "Value"],
        ["Application", exportData.app],
        ["Exported At", exportData.exportedAt],
        ["Repositories Count", String(exportData.stats.repositories)],
        ["Primary Language", exportData.stats.primaryLanguage],
        ["Streak Days", String(exportData.stats.streakDays)],
      ];

      const csvContent = rows
        .map((row) => row.map(sanitizeCsvCell).join(","))
        .join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="deadcode_developer_export.csv"',
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }

    if (format === "md") {
      const mdContent = `# 💀 DeadCode Developer Export
- **Exported At:** ${exportData.exportedAt}
- **Repositories Count:** ${exportData.stats.repositories}
- **Primary Language:** ${exportData.stats.primaryLanguage}
- **Streak Days:** ${exportData.stats.streakDays}
`;
      return new NextResponse(mdContent, {
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": 'attachment; filename="deadcode_developer_export.md"',
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }

    return successResponse(exportData);
  } catch (error: any) {
    return errorResponse(error, "Failed to generate developer export.");
  }
}
