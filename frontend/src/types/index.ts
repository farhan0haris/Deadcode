export interface Repository {
  id: number;
  name: str;
  path: string;
  created_at: string | null;
  last_commit_at: string | null;
  total_commits: number;
  primary_language: string;
  is_pinned: boolean;
  is_archived: boolean;
}

export interface Commit {
  hash: string;
  repo_id: number;
  repo_name: string;
  repo_path: string;
  author: string;
  email: string;
  date: string;
  years_ago?: number;
  message: string;
  branch: string;
  files_changed: number;
  insertions: number;
  deletions: number;
  primary_language: string;
}

export interface GlobalStats {
  total_repositories: number;
  total_commits: number;
  total_lines_added: number;
  total_lines_removed: number;
  primary_language: string;
  active_streak: number;
  longest_streak: number;
  most_productive_year: number;
  most_productive_day: string;
  weekend_coding_percentage: number;
  night_coding_percentage: number;
  languages: Record<string, number>;
  daily_contributions: Record<string, number>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked_at: string | null;
  progress: number;
}

export interface Milestone {
  type: string;
  title: string;
  date: string;
  description: string;
  icon: string;
}
