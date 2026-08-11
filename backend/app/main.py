import os
import subprocess
from fastapi import FastAPI, HTTPException, Depends, Response
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional

from app.db import init_db, get_db_connection
from app.models import FolderCreate, DiffRequest
from app.scanner import scan_all_registered_folders, index_repository, find_git_repositories
from app.analytics import get_on_this_day_commits, get_global_statistics, get_developer_journey_milestones
from app.achievements import evaluate_and_get_achievements
from app.export import generate_markdown_report, generate_html_report, generate_json_export, generate_csv_stats

app = FastAPI(title="DeadCode Core API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/api/health")
def health_check():
    return {"status": "online", "mode": "100% offline"}

# --- Folders & Scanner ---
@app.get("/api/folders")
def get_folders():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM scanned_folders ORDER BY added_at DESC")
    folders = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return folders

@app.post("/api/folders")
def add_folder(payload: FolderCreate):
    folder_path = os.path.abspath(payload.path)
    if not os.path.exists(folder_path):
        raise HTTPException(status_code=400, detail="Folder path does not exist on disk.")

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO scanned_folders (path) VALUES (?)", (folder_path,))
        conn.commit()
    except Exception:
        pass
    conn.close()

    # Trigger scan for this folder
    repos = find_git_repositories(folder_path)
    indexed_count = 0
    for r in repos:
        if index_repository(r):
            indexed_count += 1

    return {"status": "success", "indexed_repositories": indexed_count}

@app.post("/api/scan")
def trigger_full_rescan():
    count = scan_all_registered_folders()
    return {"status": "completed", "indexed_count": count}

# --- Repositories ---
@app.get("/api/repositories")
def get_repositories(search: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    if search:
        cursor.execute("""
            SELECT * FROM repositories 
            WHERE name LIKE ? OR path LIKE ? OR primary_language LIKE ?
            ORDER BY is_pinned DESC, last_commit_at DESC
        """, (f"%{search}%", f"%{search}%", f"%{search}%"))
    else:
        cursor.execute("SELECT * FROM repositories ORDER BY is_pinned DESC, last_commit_at DESC")
    repos = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return repos

@app.post("/api/repositories/{repo_id}/pin")
def toggle_pin(repo_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE repositories SET is_pinned = NOT is_pinned WHERE id = ?", (repo_id,))
    conn.commit()
    conn.close()
    return {"status": "updated"}

# --- Commits & On This Day ---
@app.get("/api/commits/today")
def get_today_commits():
    return get_on_this_day_commits()

@app.get("/api/commits/search")
def search_commits(query: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT c.*, r.name as repo_name, r.path as repo_path
        FROM commits c
        JOIN repositories r ON c.repo_id = r.id
        WHERE c.message LIKE ? OR c.hash LIKE ? OR c.author LIKE ? OR r.name LIKE ?
        ORDER BY c.date DESC LIMIT 50
    """, (f"%{query}%", f"%{query}%", f"%{query}%", f"%{query}%"))
    commits = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return commits

@app.post("/api/commits/diff")
def get_commit_diff(payload: DiffRequest):
    try:
        cmd = ["git", "--no-pager", "show", payload.commit_hash]
        result = subprocess.run(
            cmd,
            cwd=payload.repo_path,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            check=True
        )
        return {"hash": payload.commit_hash, "diff": result.stdout}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load diff: {str(e)}")

# --- Analytics, Achievements & Export ---
@app.get("/api/stats")
def get_stats():
    return get_global_statistics()

@app.get("/api/journey")
def get_journey():
    return get_developer_journey_milestones()

@app.get("/api/achievements")
def get_achievements():
    return evaluate_and_get_achievements()

@app.get("/api/export/{fmt}")
def export_report(fmt: str):
    if fmt == "md":
        return Response(content=generate_markdown_report(), media_type="text/markdown")
    elif fmt == "html":
        return Response(content=generate_html_report(), media_type="text/html")
    elif fmt == "json":
        return Response(content=generate_json_export(), media_type="application/json")
    elif fmt == "csv":
        return Response(content=generate_csv_stats(), media_type="text/csv")
    else:
        raise HTTPException(status_code=400, detail="Unsupported export format.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
