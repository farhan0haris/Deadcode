import os
from pathlib import Path

APP_NAME = "DeadCode"
APP_DIR = Path.home() / ".deadcode"
APP_DIR.mkdir(parents=True, exist_ok=True)

DB_PATH = APP_DIR / "deadcode.db"

IGNORE_DIRS = {
    "node_modules", "build", "dist", "vendor", ".cache", ".git",
    "venv", ".venv", "__pycache__", ".idea", ".vscode", "bin", "obj", "target"
}

EXTENSION_LANGUAGE_MAP = {
    ".py": "Python",
    ".ts": "TypeScript",
    ".tsx": "TypeScript (React)",
    ".js": "JavaScript",
    ".jsx": "JavaScript (React)",
    ".go": "Go",
    ".rs": "Rust",
    ".cpp": "C++",
    ".c": "C",
    ".h": "C/C++ Header",
    ".cs": "C#",
    ".java": "Java",
    ".kt": "Kotlin",
    ".swift": "Swift",
    ".rb": "Ruby",
    ".php": "PHP",
    ".html": "HTML",
    ".css": "CSS",
    ".scss": "SCSS",
    ".md": "Markdown",
    ".json": "JSON",
    ".yaml": "YAML",
    ".yml": "YAML",
    ".sql": "SQL",
    ".sh": "Shell",
    ".ps1": "PowerShell"
}
