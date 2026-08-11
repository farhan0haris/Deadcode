export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  githubUsername: string | null;
  createdAt: Date;
}

export interface RepositoryItem {
  id: string;
  githubRepoId: number;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  isPrivate: boolean;
  defaultBranch: string;
  githubUrl: string;
  syncedAt: Date | null;
  _count?: {
    commits: number;
  };
}

export interface CommitItem {
  id: string;
  repositoryId: string;
  sha: string;
  message: string;
  authorName: string;
  authorEmail: string;
  date: Date;
  additions: number;
  deletions: number;
  filesChanged: number;
  url: string;
  repositoryName?: string;
}

export interface AchievementItem {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  progress: number;
}

export interface DeveloperStats {
  totalRepositories: number;
  totalCommits: number;
  totalAdditions: number;
  totalDeletions: number;
  currentStreak: number;
  longestStreak: number;
  primaryLanguage: string;
  nightOwlPercentage: number;
  mostProductiveDay: string;
  languages: { name: string; percentage: number; color: string; count: number }[];
}

export interface OnThisDayMemory {
  yearAgo: number;
  date: Date;
  commit: CommitItem;
  repoName: string;
}
