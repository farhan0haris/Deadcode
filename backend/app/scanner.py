import os
import subprocess
import datetime
from pathlib import Path
from typing import List, Dict
from app.config import IGNORE_DIRS, EXTENSION_LANGUAGE_MAP
from app.db import get_db_connection

def find_git_repositories(root_path: str) -> List[str]:
    git_repos = []
    try:
        for dirpath, dirnames, filenames in os.walk(root_path):
            if ".git" in dirnames:
                git_repos.append(dirpath)
                dirnames.remove(".git")
            
            # Prune other ignore dirs from further recursion
            dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
    except Exception as e:
        print(f"Error walking path {root_path}: {e}")
    return git_repos

def get_repo_primary_language(repo_path: str) -> str:
    lang_counts: Dict[str, int] = {}
    try:
        for root, dirs, files in os.walk(repo_path):
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            for file in files:
                ext = Path(file).suffix.lower()
                if ext in EXTENSION_LANGUAGE_MAP:
                    lang = EXTENSION_LANGUAGE_MAP[ext]
                    lang_counts[lang] = lang_counts.get(lang, 0) + 1
        if lang_counts:
            return max(lang_counts, key=lang_counts.get)
    except Exception:
        pass
    return "Unknown"

def index_repository(repo_path: str) -> bool:
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        repo_name = os.path.basename(os.path.normpath(repo_path))
        primary_lang = get_repo_primary_language(repo_path)

        # Upsert repo record
        cursor.execute("""
            INSERT INTO repositories (name, path, primary_language, scanned_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(path) DO UPDATE SET
                primary_language=excluded.primary_language,
                scanned_at=CURRENT_TIMESTAMP
        """, (repo_name, repo_path, primary_lang))

        cursor.execute("SELECT id FROM repositories WHERE path = ?", (repo_path,))
        repo_id = cursor.fetchone()["id"]

        # Parse commits using git log format: HASH|AUTHOR|EMAIL|ISO_DATE|MESSAGE
        cmd = [
            "git",
            "--no-pager",
            "log",
            "--all",
            "--shortstat",
            "--format=COMMIT:%H|%an|%ae|%ad|%s"
        ]

        result = subprocess.run(
            cmd,
            cwd=repo_path,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            check=True
        )

        commits_batch = []
        first_commit_date = None
        last_commit_date = None
        total_commits = 0

        current_commit = None

        for line in result.stdout.splitlines():
            line = line.strip()
            if line.startswith("COMMIT:"):
                if current_commit:
                    commits_batch.append(current_commit)

                parts = line[7:].split("|", 4)
                if len(parts) == 5:
                    chash, author, email, date_str, msg = parts
                    try:
                        commit_dt = datetime.datetime.fromisoformat(date_str)
                    except Exception:
                        commit_dt = datetime.datetime.now()

                    iso_date = commit_dt.isoformat()
                    total_commits += 1

                    if last_commit_date is None or commit_dt > last_commit_date:
                        last_commit_date = commit_dt
                    if first_commit_date is None or commit_dt < first_commit_date:
                        first_commit_date = commit_dt

                    current_commit = [
                        chash, repo_id, author, email, iso_date, msg, "main", 0, 0, 0, primary_lang
                    ]
            elif current_commit and ("file changed" in line or "files changed" in line):
                # Parse shortstat format: 2 files changed, 10 insertions(+), 5 deletions(-)
                tokens = line.split(",")
                for t in tokens:
                    t = t.strip()
                    if "file" in t:
                        current_commit[7] = int(t.split()[0])
                    elif "insertion" in t:
                        current_commit[8] = int(t.split()[0])
                    elif "deletion" in t:
                        current_commit[9] = int(t.split()[0])

        if current_commit:
            commits_batch.append(current_commit)

        # Bulk insert commits
        cursor.executemany("""
            INSERT OR REPLACE INTO commits 
            (hash, repo_id, author, email, date, message, branch, files_changed, insertions, deletions, primary_language)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, commits_batch)

        # Update repository stats
        cursor.execute("""
            UPDATE repositories 
            SET total_commits = ?,
                created_at = ?,
                last_commit_at = ?
            WHERE id = ?
        """, (
            total_commits,
            first_commit_date.isoformat() if first_commit_date else None,
            last_commit_date.isoformat() if last_commit_date else None,
            repo_id
        ))

        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Failed to index repo at {repo_path}: {e}")
        return False

def scan_all_registered_folders():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT path FROM scanned_folders")
    folders = cursor.fetchall()
    conn.close()

    scanned_count = 0
    for folder in folders:
        repos = find_git_repositories(folder["path"])
        for r_path in repos:
            if index_repository(r_path):
                scanned_count += 1
    return scanned_count
