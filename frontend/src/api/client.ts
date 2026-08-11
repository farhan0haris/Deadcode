import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Repository, Commit, GlobalStats, Achievement, Milestone } from '../types';

const API_BASE = '/api';

export const api = {
  getFolders: async () => (await axios.get(`${API_BASE}/folders`)).data,
  addFolder: async (path: string) => (await axios.post(`${API_BASE}/folders`, { path })).data,
  rescan: async () => (await axios.post(`${API_BASE}/scan`)).data,

  getRepositories: async (search?: string) => 
    (await axios.get<Repository[]>(`${API_BASE}/repositories`, { params: { search } })).data,
  togglePin: async (id: number) => (await axios.post(`${API_BASE}/repositories/${id}/pin`)).data,

  getTodayCommits: async () => (await axios.get<Commit[]>(`${API_BASE}/commits/today`)).data,
  searchCommits: async (query: string) => 
    (await axios.get<Commit[]>(`${API_BASE}/commits/search`, { params: { query } })).data,
  getDiff: async (repo_path: string, commit_hash: string) =>
    (await axios.post<{ hash: string; diff: string }>(`${API_BASE}/commits/diff`, { repo_path, commit_hash })).data,

  getStats: async () => (await axios.get<GlobalStats>(`${API_BASE}/stats`)).data,
  getJourney: async () => (await axios.get<Milestone[]>(`${API_BASE}/journey`)).data,
  getAchievements: async () => (await axios.get<Achievement[]>(`${API_BASE}/achievements`)).data,
};

export function useStats() {
  return useQuery({ queryKey: ['stats'], queryFn: api.getStats });
}

export function useTodayCommits() {
  return useQuery({ queryKey: ['commits', 'today'], queryFn: api.getTodayCommits });
}

export function useRepositories(search?: string) {
  return useQuery({ queryKey: ['repositories', search], queryFn: () => api.getRepositories(search) });
}

export function useAchievements() {
  return useQuery({ queryKey: ['achievements'], queryFn: api.getAchievements });
}

export function useJourney() {
  return useQuery({ queryKey: ['journey'], queryFn: api.getJourney });
}
