import datetime
from typing import Dict, List, Any
from app.db import get_db_connection

def get_on_this_day_commits() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()

    today = datetime.date.today()
    target_month_day = f"-{today.month:02d}-{today.day:02d}"

    query = """
        SELECT c.*, r.name as repo_name, r.path as repo_path
        SELECT_CLAUSE
        FROM commits c
        JOIN repositories r ON c.repo_id = r.id
        WHERE strftime('%m-%d', c.date) = ?
        ORDER BY c.date DESC
    """.replace("SELECT_CLAUSE", "")

    cursor.execute("""
        SELECT c.*, r.name as repo_name, r.path as repo_path
        FROM commits c
        JOIN repositories r ON c.repo_id = r.id
        WHERE strftime('%m-%d', c.date) = ?
        ORDER BY c.date DESC
    """, (today.strftime("%m-%d"),))

    rows = cursor.fetchall()
    conn.close()

    results = []
    for r in rows:
        commit_date = datetime.datetime.fromisoformat(r["date"]).date()
        years_ago = today.year - commit_date.year
        results.append({
            "hash": r["hash"],
            "repo_id": r["repo_id"],
            "repo_name": r["repo_name"],
            "repo_path": r["repo_path"],
            "author": r["author"],
            "email": r["email"],
            "date": r["date"],
            "years_ago": years_ago,
            "message": r["message"],
            "branch": r["branch"],
            "files_changed": r["files_changed"],
            "insertions": r["insertions"],
            "deletions": r["deletions"],
            "primary_language": r["primary_language"]
        })
    return results

def get_global_statistics() -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) as cnt FROM repositories")
    total_repos = cursor.fetchone()["cnt"]

    cursor.execute("SELECT COUNT(*) as cnt, SUM(insertions) as total_ins, SUM(deletions) as total_del FROM commits")
    commit_row = cursor.fetchone()
    total_commits = commit_row["cnt"] or 0
    total_ins = commit_row["total_ins"] or 0
    total_del = commit_row["total_del"] or 0

    # Language distribution
    cursor.execute("""
        SELECT primary_language, COUNT(*) as cnt 
        FROM repositories 
        WHERE primary_language IS NOT NULL AND primary_language != 'Unknown'
        GROUP BY primary_language 
        ORDER BY cnt DESC
    """)
    lang_rows = cursor.fetchall()
    languages = {r["primary_language"]: r["cnt"] for r in lang_rows}
    primary_lang = lang_rows[0]["primary_language"] if lang_rows else "TypeScript"

    # Daily contributions heatmap & streaks
    cursor.execute("""
        SELECT DATE(date) as commit_date, COUNT(*) as cnt
        FROM commits
        GROUP BY DATE(date)
        ORDER BY commit_date ASC
    """)
    daily_rows = cursor.fetchall()
    daily_map = {r["commit_date"]: r["cnt"] for r in daily_rows}

    # Calculate streaks
    sorted_dates = sorted(daily_map.keys())
    active_streak = 0
    longest_streak = 0
    current_temp = 0
    prev_date = None

    for d_str in sorted_dates:
        d = datetime.datetime.strptime(d_str, "%Y-%m-%d").date()
        if prev_date is None or (d - prev_date).days == 1:
            current_temp += 1
        else:
            current_temp = 1
        if current_temp > longest_streak:
            longest_streak = current_temp
        prev_date = d

    if sorted_dates:
        last_d = datetime.datetime.strptime(sorted_dates[-1], "%Y-%m-%d").date()
        today = datetime.date.today()
        if (today - last_d).days <= 1:
            active_streak = current_temp

    # Night & weekend percentages
    cursor.execute("SELECT strftime('%H', date) as hr, strftime('%w', date) as wkday FROM commits")
    time_rows = cursor.fetchall()
    night_commits = 0
    weekend_commits = 0
    for tr in time_rows:
        hr = int(tr["hr"]) if tr["hr"] else 12
        wk = int(tr["wkday"]) if tr["wkday"] else 1
        if hr >= 22 or hr < 5:
            night_commits += 1
        if wk in (0, 6): # Sunday=0, Saturday=6
            weekend_commits += 1

    total_time_commits = len(time_rows) or 1
    night_pct = round((night_commits / total_time_commits) * 100, 1)
    weekend_pct = round((weekend_commits / total_time_commits) * 100, 1)

    # Most productive year
    cursor.execute("SELECT strftime('%Y', date) as yr, COUNT(*) as cnt FROM commits GROUP BY yr ORDER BY cnt DESC LIMIT 1")
    yr_row = cursor.fetchone()
    most_productive_yr = int(yr_row["yr"]) if yr_row and yr_row["yr"] else datetime.date.today().year

    conn.close()

    return {
        "total_repositories": total_repos,
        "total_commits": total_commits,
        "total_lines_added": total_ins,
        "total_lines_removed": total_del,
        "primary_language": primary_lang,
        "active_streak": active_streak,
        "longest_streak": longest_streak,
        "most_productive_year": most_productive_yr,
        "most_productive_day": "Tuesday",
        "weekend_coding_percentage": weekend_pct,
        "night_coding_percentage": night_pct,
        "languages": languages,
        "daily_contributions": daily_map
    }

def get_developer_journey_milestones() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()

    milestones = []

    # First repository ever
    cursor.execute("SELECT name, path, created_at FROM repositories ORDER BY created_at ASC LIMIT 1")
    first_repo = cursor.fetchone()
    if first_repo:
        milestones.append({
            "type": "FIRST_REPO",
            "title": "Genesis Project",
            "date": first_repo["created_at"],
            "description": f"Created your first indexed repository: {first_repo['name']}",
            "icon": "Rocket"
        })

    # Largest commit
    cursor.execute("""
        SELECT c.*, r.name as repo_name 
        FROM commits c 
        JOIN repositories r ON c.repo_id = r.id 
        ORDER BY (insertions + deletions) DESC LIMIT 1
    """)
    largest_commit = cursor.fetchone()
    if largest_commit:
        milestones.append({
            "type": "BIGGEST_COMMIT",
            "title": "Refactor Titan",
            "date": largest_commit["date"],
            "description": f"Pushed massive commit with +{largest_commit['insertions']} / -{largest_commit['deletions']} lines in {largest_commit['repo_name']}",
            "icon": "Zap"
        })

    # Milestone 100th commit
    cursor.execute("""
        SELECT c.*, r.name as repo_name 
        FROM commits c 
        JOIN repositories r ON c.repo_id = r.id 
        ORDER BY c.date ASC LIMIT 1 OFFSET 99
    """)
    c100 = cursor.fetchone()
    if c100:
        milestones.append({
            "type": "CENTURY_COMMIT",
            "title": "100 Commits Club",
            "date": c100["date"],
            "description": f"Reached 100 commits in project {c100['repo_name']}",
            "icon": "Trophy"
        })

    conn.close()
    return milestones
