import sqlite3
from typing import Generator
from app.config import DB_PATH

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def get_db_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS scanned_folders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            path TEXT UNIQUE NOT NULL,
            added_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS repositories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            path TEXT UNIQUE NOT NULL,
            created_at DATETIME,
            last_commit_at DATETIME,
            total_commits INTEGER DEFAULT 0,
            primary_language TEXT,
            is_pinned INTEGER DEFAULT 0,
            is_archived INTEGER DEFAULT 0,
            scanned_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS commits (
            hash TEXT PRIMARY KEY,
            repo_id INTEGER NOT NULL,
            author TEXT,
            email TEXT,
            date DATETIME NOT NULL,
            message TEXT,
            branch TEXT DEFAULT 'main',
            files_changed INTEGER DEFAULT 0,
            insertions INTEGER DEFAULT 0,
            deletions INTEGER DEFAULT 0,
            primary_language TEXT,
            FOREIGN KEY (repo_id) REFERENCES repositories(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS achievements (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            icon TEXT NOT NULL,
            unlocked_at DATETIME,
            progress REAL DEFAULT 0.0
        );

        CREATE INDEX IF NOT EXISTS idx_commits_date ON commits(date);
        CREATE INDEX IF NOT EXISTS idx_commits_repo_id ON commits(repo_id);
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
