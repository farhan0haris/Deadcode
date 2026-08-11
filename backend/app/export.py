import json
import csv
import io
from typing import Dict, Any
from app.analytics import get_global_statistics, get_on_this_day_commits, get_developer_journey_milestones

def generate_markdown_report() -> str:
    stats = get_global_statistics()
    otd = get_on_this_day_commits()
    milestones = get_developer_journey_milestones()

    md = []
    md.append("# 💀 DeadCode Developer Report")
    md.append("*Generated locally by DeadCode - Every commit has a ghost.*\n")
    md.append("## 📊 Summary Statistics")
    md.append(f"- **Total Repositories Indexed:** {stats['total_repositories']}")
    md.append(f"- **Total Commits:** {stats['total_commits']}")
    md.append(f"- **Lines Added:** +{stats['total_lines_added']:,}")
    md.append(f"- **Lines Removed:** -{stats['total_lines_removed']:,}")
    md.append(f"- **Primary Language:** {stats['primary_language']}")
    md.append(f"- **Longest Streak:** {stats['longest_streak']} days")
    md.append(f"- **Night Owl Coding:** {stats['night_coding_percentage']}%\n")

    md.append("## 🕰️ On This Day Memories")
    if otd:
        for c in otd:
            md.append(f"- **{c['repo_name']}** ({c['years_ago']} year(s) ago): `{c['hash'][:7]}` - {c['message']} (+{c['insertions']}/-{c['deletions']})")
    else:
        md.append("No historical commits recorded on this day.\n")

    md.append("\n## 🏆 Key Milestones")
    for m in milestones:
        md.append(f"- **{m['title']}** ({m['date'][:10]}): {m['description']}")

    return "\n".join(md)

def generate_html_report() -> str:
    md_content = generate_markdown_report()
    # Simple self-contained HTML page
    html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>DeadCode Developer Report</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #09090B; color: #F4F4F5; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; }}
        h1 {{ color: #7C5CFC; border-bottom: 1px solid #27272A; padding-bottom: 10px; }}
        h2 {{ color: #5EEAD4; margin-top: 30px; }}
        ul {{ background: #111113; border: 1px solid #27272A; border-radius: 8px; padding: 20px 40px; list-style-type: square; }}
        li {{ margin-bottom: 8px; }}
        code {{ background: #27272A; color: #A1A1AA; padding: 2px 6px; border-radius: 4px; font-family: monospace; }}
    </style>
</head>
<body>
    <pre style="white-space: pre-wrap; font-family: inherit;">{md_content}</pre>
</body>
</html>"""
    return html

def generate_json_export() -> str:
    data = {
        "stats": get_global_statistics(),
        "on_this_day": get_on_this_day_commits(),
        "milestones": get_developer_journey_milestones()
    }
    return json.dumps(data, indent=2)

def generate_csv_stats() -> str:
    stats = get_global_statistics()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Metric", "Value"])
    writer.writerow(["Total Repositories", stats["total_repositories"]])
    writer.writerow(["Total Commits", stats["total_commits"]])
    writer.writerow(["Total Insertions", stats["total_lines_added"]])
    writer.writerow(["Total Deletions", stats["total_lines_removed"]])
    writer.writerow(["Primary Language", stats["primary_language"]])
    writer.writerow(["Active Streak", stats["active_streak"]])
    writer.writerow(["Longest Streak", stats["longest_streak"]])
    writer.writerow(["Night Coding %", stats["night_coding_percentage"]])
    writer.writerow(["Weekend Coding %", stats["weekend_coding_percentage"]])
    return output.getvalue()
