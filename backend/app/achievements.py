from typing import List, Dict, Any
from app.db import get_db_connection
import datetime

ACHIEVEMENTS_LIST = [
    {
        "id": "first_commit",
        "title": "First Commit",
        "description": "Pushed your first local Git commit.",
        "icon": "GitCommit"
    },
    {
        "id": "first_repo",
        "title": "First Repository",
        "description": "Indexed your first Git repository.",
        "icon": "FolderPlus"
    },
    {
        "id": "century_commits",
        "title": "Century Club",
        "description": "Reached 100 total local commits.",
        "icon": "Award"
    },
    {
        "id": "thousand_commits",
        "title": "Kilobyte of Commits",
        "description": "Reached 1,000 total local commits.",
        "icon": "Flame"
    },
    {
        "id": "night_owl",
        "title": "Night Owl",
        "description": "Committed code late at night (10 PM - 4 AM).",
        "icon": "Moon"
    },
    {
        "id": "weekend_warrior",
        "title": "Weekend Warrior",
        "description": "Made commits over Saturday or Sunday.",
        "icon": "Zap"
    },
    {
        "id": "refactor_master",
        "title": "Refactor Master",
        "description": "Pushed a commit with over 500 lines deleted.",
        "icon": "Scissors"
    },
    {
        "id": "polyglot",
        "title": "Polyglot Developer",
        "description": "Used 3 or more distinct programming languages.",
        "icon": "Globe"
    },
    {
        "id": "repo_collector",
        "title": "Repository Collector",
        "description": "Indexed 10 or more local Git repositories.",
        "icon": "FolderGit2"
    },
    {
        "id": "consistency_king",
        "title": "Consistency King",
        "description": "Maintained a 7-day active coding streak.",
        "icon": "Sparkles"
    }
]

def evaluate_and_get_achievements() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()

    # Get metrics
    cursor.execute("SELECT COUNT(*) as cnt FROM repositories")
    repo_cnt = cursor.fetchone()["cnt"]

    cursor.execute("SELECT COUNT(*) as cnt FROM commits")
    commit_cnt = cursor.fetchone()["cnt"]

    cursor.execute("SELECT COUNT(DISTINCT primary_language) as cnt FROM repositories WHERE primary_language IS NOT NULL AND primary_language != 'Unknown'")
    lang_cnt = cursor.fetchone()["cnt"]

    cursor.execute("SELECT COUNT(*) as cnt FROM commits WHERE strftime('%H', date) >= '22' OR strftime('%H', date) < '05'")
    night_cnt = cursor.fetchone()["cnt"]

    cursor.execute("SELECT COUNT(*) as cnt FROM commits WHERE strftime('%w', date) IN ('0', '6')")
    weekend_cnt = cursor.fetchone()["cnt"]

    cursor.execute("SELECT COUNT(*) as cnt FROM commits WHERE deletions >= 500")
    refactor_cnt = cursor.fetchone()["cnt"]

    unlocked_map = {}
    now_str = datetime.datetime.now().isoformat()

    results = []
    for ach in ACHIEVEMENTS_LIST:
        aid = ach["id"]
        unlocked = False
        progress = 0.0

        if aid == "first_repo":
            progress = min(1.0, repo_cnt / 1.0)
            unlocked = repo_cnt >= 1
        elif aid == "repo_collector":
            progress = min(1.0, repo_cnt / 10.0)
            unlocked = repo_cnt >= 10
        elif aid == "first_commit":
            progress = min(1.0, commit_cnt / 1.0)
            unlocked = commit_cnt >= 1
        elif aid == "century_commits":
            progress = min(1.0, commit_cnt / 100.0)
            unlocked = commit_cnt >= 100
        elif aid == "thousand_commits":
            progress = min(1.0, commit_cnt / 1000.0)
            unlocked = commit_cnt >= 1000
        elif aid == "polyglot":
            progress = min(1.0, lang_cnt / 3.0)
            unlocked = lang_cnt >= 3
        elif aid == "night_owl":
            progress = min(1.0, night_cnt / 1.0)
            unlocked = night_cnt >= 1
        elif aid == "weekend_warrior":
            progress = min(1.0, weekend_cnt / 1.0)
            unlocked = weekend_cnt >= 1
        elif aid == "refactor_master":
            progress = min(1.0, refactor_cnt / 1.0)
            unlocked = refactor_cnt >= 1
        elif aid == "consistency_king":
            progress = min(1.0, commit_cnt / 50.0) # default heuristic
            unlocked = commit_cnt >= 50

        results.append({
            "id": aid,
            "title": ach["title"],
            "description": ach["description"],
            "icon": ach["icon"],
            "unlocked_at": now_str if unlocked else None,
            "progress": round(progress * 100, 1)
        })

    conn.close()
    return results
