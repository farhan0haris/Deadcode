from pydantic import BaseModel
from typing import Optional, List, Dict

class FolderCreate(BaseModel):
    path: str

class RepositoryModel(BaseModel):
    id: int
    name: str
    path: str
    created_at: Optional[str] = None
    last_commit_at: Optional[str] = None
    total_commits: int = 0
    primary_language: Optional[str] = "Unknown"
    is_pinned: bool = False
    is_archived: bool = False

class CommitModel(BaseModel):
    hash: str
    repo_id: int
    repo_name: Optional[str] = ""
    repo_path: Optional[str] = ""
    author: Optional[str] = ""
    email: Optional[str] = ""
    date: str
    message: str
    branch: Optional[str] = "main"
    files_changed: int = 0
    insertions: int = 0
    deletions: int = 0
    primary_language: Optional[str] = "Unknown"

class DiffRequest(BaseModel):
    repo_path: str
    commit_hash: str

class AchievementModel(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    unlocked_at: Optional[str] = None
    progress: float = 0.0

class StatsModel(BaseModel):
    total_repositories: int
    total_commits: int
    total_lines_added: int
    total_lines_removed: int
    primary_language: str
    active_streak: int
    longest_streak: int
    most_productive_year: int
    most_productive_day: str
    weekend_coding_percentage: float
    night_coding_percentage: float
    languages: Dict[str, int]
    daily_contributions: Dict[str, int]
