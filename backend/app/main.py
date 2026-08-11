import sys
import os
import json
import subprocess
import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# Configure stdout for UTF-8 encoding on Windows standard terminals
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Ensure parent directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db import init_db, get_db_connection
from app.scanner import scan_all_registered_folders, index_repository, find_git_repositories
from app.analytics import get_on_this_day_commits, get_global_statistics, get_developer_journey_milestones
from app.achievements import evaluate_and_get_achievements
from app.export import generate_markdown_report, generate_html_report, generate_json_export, generate_csv_stats

class DeadCodeAPIHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        if path == "/api/health":
            self._set_headers(200)
            self.wfile.write(json.dumps({"status": "online", "mode": "100% offline"}).encode("utf-8"))

        elif path == "/api/folders":
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM scanned_folders ORDER BY added_at DESC")
            folders = [dict(r) for r in cursor.fetchall()]
            conn.close()
            self._set_headers(200)
            self.wfile.write(json.dumps(folders).encode("utf-8"))

        elif path == "/api/repositories":
            search_str = query.get("search", [None])[0]
            conn = get_db_connection()
            cursor = conn.cursor()
            if search_str:
                cursor.execute("""
                    SELECT * FROM repositories 
                    WHERE name LIKE ? OR path LIKE ? OR primary_language LIKE ?
                    ORDER BY is_pinned DESC, last_commit_at DESC
                """, (f"%{search_str}%", f"%{search_str}%", f"%{search_str}%"))
            else:
                cursor.execute("SELECT * FROM repositories ORDER BY is_pinned DESC, last_commit_at DESC")
            repos = [dict(r) for r in cursor.fetchall()]
            conn.close()
            self._set_headers(200)
            self.wfile.write(json.dumps(repos).encode("utf-8"))

        elif path == "/api/commits/today":
            commits = get_on_this_day_commits()
            self._set_headers(200)
            self.wfile.write(json.dumps(commits).encode("utf-8"))

        elif path == "/api/commits/search":
            q = query.get("query", [""])[0]
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("""
                SELECT c.*, r.name as repo_name, r.path as repo_path
                FROM commits c
                JOIN repositories r ON c.repo_id = r.id
                WHERE c.message LIKE ? OR c.hash LIKE ? OR c.author LIKE ? OR r.name LIKE ?
                ORDER BY c.date DESC LIMIT 50
            """, (f"%{q}%", f"%{q}%", f"%{q}%", f"%{q}%"))
            commits = [dict(r) for r in cursor.fetchall()]
            conn.close()
            self._set_headers(200)
            self.wfile.write(json.dumps(commits).encode("utf-8"))

        elif path == "/api/stats":
            stats = get_global_statistics()
            self._set_headers(200)
            self.wfile.write(json.dumps(stats).encode("utf-8"))

        elif path == "/api/journey":
            journey = get_developer_journey_milestones()
            self._set_headers(200)
            self.wfile.write(json.dumps(journey).encode("utf-8"))

        elif path == "/api/achievements":
            achs = evaluate_and_get_achievements()
            self._set_headers(200)
            self.wfile.write(json.dumps(achs).encode("utf-8"))

        elif path.startswith("/api/export/"):
            fmt = path.replace("/api/export/", "")
            if fmt == "md":
                self._set_headers(200, "text/markdown")
                self.wfile.write(generate_markdown_report().encode("utf-8"))
            elif fmt == "html":
                self._set_headers(200, "text/html")
                self.wfile.write(generate_html_report().encode("utf-8"))
            elif fmt == "json":
                self._set_headers(200, "application/json")
                self.wfile.write(generate_json_export().encode("utf-8"))
            elif fmt == "csv":
                self._set_headers(200, "text/csv")
                self.wfile.write(generate_csv_stats().encode("utf-8"))
            else:
                self._set_headers(400)
                self.wfile.write(b"Unsupported export format")
        else:
            self._set_headers(404)
            self.wfile.write(b"Not Found")

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length) if content_length > 0 else b"{}"
        data = json.loads(body.decode("utf-8")) if body else {}

        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/folders":
            folder_path = os.path.abspath(data.get("path", ""))
            if not os.path.exists(folder_path):
                self._set_headers(400)
                self.wfile.write(json.dumps({"detail": "Folder path does not exist"}).encode("utf-8"))
                return

            conn = get_db_connection()
            cursor = conn.cursor()
            try:
                cursor.execute("INSERT INTO scanned_folders (path) VALUES (?)", (folder_path,))
                conn.commit()
            except Exception:
                pass
            conn.close()

            repos = find_git_repositories(folder_path)
            count = sum(1 for r in repos if index_repository(r))
            self._set_headers(200)
            self.wfile.write(json.dumps({"status": "success", "indexed_repositories": count}).encode("utf-8"))

        elif path == "/api/scan":
            count = scan_all_registered_folders()
            self._set_headers(200)
            self.wfile.write(json.dumps({"status": "completed", "indexed_count": count}).encode("utf-8"))

        elif path.startswith("/api/repositories/") and path.endswith("/pin"):
            repo_id = int(path.split("/")[3])
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("UPDATE repositories SET is_pinned = NOT is_pinned WHERE id = ?", (repo_id,))
            conn.commit()
            conn.close()
            self._set_headers(200)
            self.wfile.write(json.dumps({"status": "updated"}).encode("utf-8"))

        elif path == "/api/commits/diff":
            repo_path = data.get("repo_path", "")
            commit_hash = data.get("commit_hash", "")
            try:
                cmd = ["git", "--no-pager", "show", commit_hash]
                result = subprocess.run(
                    cmd,
                    cwd=repo_path,
                    capture_output=True,
                    text=True,
                    encoding="utf-8",
                    errors="replace",
                    check=True
                )
                self._set_headers(200)
                self.wfile.write(json.dumps({"hash": commit_hash, "diff": result.stdout}).encode("utf-8"))
            except Exception as e:
                self._set_headers(500)
                self.wfile.write(json.dumps({"detail": str(e)}).encode("utf-8"))

        else:
            self._set_headers(404)
            self.wfile.write(b"Not Found")

def run_server(port=8000):
    init_db()
    server_address = ("127.0.0.1", port)
    httpd = HTTPServer(server_address, DeadCodeAPIHandler)
    print(f"[DeadCode] Backend API Server running at http://127.0.0.1:{port}")
    httpd.serve_forever()

if __name__ == "__main__":
    run_server()
