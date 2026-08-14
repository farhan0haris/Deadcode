export interface SyncedRepo {
  id: string;
  name: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  isPrivate: boolean;
  htmlUrl: string;
  updatedAt: string;
  defaultBranch: string;
  size: number;
}

export interface SyncedStats {
  reposCount: number;
  commitsCount: number;
  totalStars: number;
  totalForks: number;
  primaryTech: string;
  primaryPercent: number;
  streakDays: number;
}

export interface SyncedLanguage {
  name: string;
  value: number;
  count: number;
  color: string;
}

export interface SyncedUserData {
  login: string;
  name: string;
  avatarUrl: string;
  bio: string;
  publicRepos: number;
  followers: number;
  following: number;
  htmlUrl: string;
}

export interface FullSyncData {
  user: SyncedUserData;
  stats: SyncedStats;
  languages: SyncedLanguage[];
  repos: SyncedRepo[];
  syncedAt: string;
}

const STORAGE_KEY = "deadcode_github_synced_data";

export function getStoredSyncData(): FullSyncData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSyncData(data: FullSyncData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("deadcode_sync_updated"));
}

export async function triggerGitHubSync(username?: string, token?: string): Promise<FullSyncData> {
  const storedProfile = typeof window !== "undefined" ? localStorage.getItem("deadcode_user_profile") : null;
  let parsedUsername = username;
  let parsedToken = token;

  if (!parsedUsername && storedProfile) {
    try {
      const p = JSON.parse(storedProfile);
      parsedUsername = p.github || p.username;
    } catch {
      // ignore
    }
  }

  if (!parsedToken && typeof window !== "undefined") {
    parsedToken = localStorage.getItem("deadcode_github_pat") || undefined;
  }

  if (!parsedUsername && !parsedToken) {
    throw new Error("Please provide your GitHub username or token.");
  }

  const response = await fetch("/api/sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: parsedUsername,
      token: parsedToken,
    }),
  });

  const resJson = await response.json();
  if (!response.ok || !resJson.success) {
    throw new Error(resJson.error || "Failed to sync GitHub account.");
  }

  const syncData: FullSyncData = {
    user: resJson.user,
    stats: resJson.stats,
    languages: resJson.languages,
    repos: resJson.repos,
    syncedAt: resJson.syncedAt,
  };

  saveSyncData(syncData);
  return syncData;
}
