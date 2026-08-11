import sys
import os
import argparse
import datetime

# Configure stdout for UTF-8 encoding on Windows standard terminals
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Add parent directory to sys.path so app module can be found
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db import init_db, get_db_connection
from app.scanner import find_git_repositories, index_repository
from app.analytics import get_on_this_day_commits, get_global_statistics
from app.achievements import evaluate_and_get_achievements

def run_scan(path: str):
    init_db()
    abs_path = os.path.abspath(path)
    print(f"[DeadCode] Scanner searching in: {abs_path}\n")

    repos = find_git_repositories(abs_path)
    if not repos:
        print("No Git repositories found in target path.")
        return

    scanned = 0
    for r in repos:
        repo_name = os.path.basename(r)
        print(f"Indexing repository: {repo_name}...")
        if index_repository(r):
            scanned += 1

    print(f"\n[+] Successfully indexed {scanned} Git repository/repositories!")

def run_today():
    init_db()
    commits = get_on_this_day_commits()
    if not commits:
        print("No commits found on this day in past years. Run scan first!")
        return

    print("\n--- On This Day Memories ---")
    for c in commits:
        print(f"[{c['years_ago']} yr(s) ago] {c['repo_name']} ({c['hash'][:7]}): {c['message']} (+{c['insertions']}/-{c['deletions']})")

def run_stats():
    init_db()
    s = get_global_statistics()
    print("\n--- Developer Statistics Overview ---")
    print(f"Total Repositories: {s['total_repositories']}")
    print(f"Total Commits:      {s['total_commits']:,}")
    print(f"Lines Added:        +{s['total_lines_added']:,}")
    print(f"Lines Removed:      -{s['total_lines_removed']:,}")
    print(f"Primary Language:   {s['primary_language']}")
    print(f"Longest Streak:     {s['longest_streak']} days")
    print(f"Night Owl Coding:   {s['night_coding_percentage']}%")

def run_doctor():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as cnt FROM repositories")
    repos = cursor.fetchone()["cnt"]
    cursor.execute("SELECT COUNT(*) as cnt FROM commits")
    commits = cursor.fetchone()["cnt"]
    conn.close()

    print("[+] DeadCode Engine Status: Healthy & 100% Offline")
    print(f"  - Database: SQLite ({repos} repos, {commits} commits indexed)")
    print("  - Mode: Read-Only / Local Only")

def main():
    parser = argparse.ArgumentParser(description="DeadCode - Privacy-first local Git time machine CLI")
    subparsers = parser.add_subparsers(dest="command")

    scan_p = subparsers.add_parser("scan", help="Scan and index local Git repositories")
    scan_p.add_argument("path", nargs="?", default=".", help="Directory path to scan")

    subparsers.add_parser("today", help="Display On This Day memories")
    subparsers.add_parser("stats", help="Display developer statistics")
    subparsers.add_parser("doctor", help="Verify installation status")

    args = parser.parse_args()

    if args.command == "scan":
        run_scan(args.path)
    elif args.command == "today":
        run_today()
    elif args.command == "stats":
        run_stats()
    elif args.command == "doctor":
        run_doctor()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
