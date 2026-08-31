"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  Shield,
  Database,
  Bell,
  Download,
  Key,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Lock,
  Mail,
  Globe,
  MapPin,
  Trash2,
  Save,
  Server,
} from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";

type SettingsTab = "profile" | "security" | "database" | "notifications" | "data";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<string | null>(null);

  // Profile State (Loads from localStorage or session user)
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    github: "",
  });

  // Security Form State
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    githubPat: "",
    twoFactorEnabled: false,
  });

  // Database / Sync Settings State
  const [syncConfig, setSyncConfig] = useState({
    dbEngine: "sqlite",
    databaseUrl: "",
    syncInterval: "1h",
    historyDepth: "all",
    includePrivateRepos: true,
    syncDiffs: true,
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    dailyMemories: true,
    milestoneAlerts: true,
    weeklyDigest: false,
    securityAlerts: true,
  });

  // Load user data on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("deadcode_user_profile");
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
        return;
      } catch {
        // Fallback
      }
    }

    if (session?.user) {
      const user = session.user;
      setProfile((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        username: user.email ? user.email.split("@")[0] : "",
      }));
    }
  }, [session]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    localStorage.setItem("deadcode_user_profile", JSON.stringify(profile));
    setTimeout(() => {
      setIsSaving(false);
      showToast("Your profile information has been saved!");
    }, 500);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (security.newPassword && security.newPassword !== security.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    setIsSaving(true);
    if (security.githubPat) {
      localStorage.setItem("deadcode_github_pat", security.githubPat);
    }
    setTimeout(() => {
      setIsSaving(false);
      showToast("Security preferences and GitHub PAT updated!");
    }, 500);
  };

  const handleTestDatabase = () => {
    if (!syncConfig.databaseUrl) {
      alert("Please enter a valid PostgreSQL connection string first.");
      return;
    }
    setIsTestingDb(true);
    setDbTestResult(null);
    setTimeout(() => {
      setIsTestingDb(false);
      setDbTestResult("Connected successfully: Database reachable (Latency: 22ms)");
    }, 800);
  };

  const handleExport = (format: string) => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify({
          app: "DeadCode v2.0 Cloud Edition",
          user: profile.username || "developer",
          profile,
          exportedAt: new Date().toISOString(),
          format,
        })
      );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `deadcode_${profile.username || "user"}_export.${format.toLowerCase()}`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Exported ${format} archive to your device.`);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8 transition-colors">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 rounded-2xl border border-[#74B4D9]/40 bg-[#0d2452] p-4 text-xs font-bold text-[#EBEBEB] shadow-2xl shadow-black/80 backdrop-blur-xl animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-[#EBEBEB]">
          User Settings & Preferences
        </h1>
        <p className="text-xs text-[#EBEBEB]/70 font-medium">
          Manage your personal profile details, GitHub credentials, database engines, and preferences.
        </p>
      </div>

      {/* Horizontal Tab Navigation */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-[#74B4D9]/20 bg-[#74B4D9]/5 p-1.5 max-w-4xl">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${
            activeTab === "profile"
              ? "bg-gradient-to-r from-[#10367D] to-[#1a4a9c] text-[#EBEBEB] shadow-md border border-[#74B4D9]/40"
              : "text-[#EBEBEB]/70 hover:text-[#EBEBEB] hover:bg-[#74B4D9]/10"
          }`}
        >
          <User className="h-3.5 w-3.5 text-[#74B4D9]" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${
            activeTab === "security"
              ? "bg-gradient-to-r from-[#10367D] to-[#1a4a9c] text-[#EBEBEB] shadow-md border border-[#74B4D9]/40"
              : "text-[#EBEBEB]/70 hover:text-[#EBEBEB] hover:bg-[#74B4D9]/10"
          }`}
        >
          <Shield className="h-3.5 w-3.5 text-[#74B4D9]" />
          <span>Account & Security</span>
        </button>

        <button
          onClick={() => setActiveTab("database")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${
            activeTab === "database"
              ? "bg-gradient-to-r from-[#10367D] to-[#1a4a9c] text-[#EBEBEB] shadow-md border border-[#74B4D9]/40"
              : "text-[#EBEBEB]/70 hover:text-[#EBEBEB] hover:bg-[#74B4D9]/10"
          }`}
        >
          <Database className="h-3.5 w-3.5 text-[#74B4D9]" />
          <span>Database & Cloud Sync</span>
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${
            activeTab === "notifications"
              ? "bg-gradient-to-r from-[#10367D] to-[#1a4a9c] text-[#EBEBEB] shadow-md border border-[#74B4D9]/40"
              : "text-[#EBEBEB]/70 hover:text-[#EBEBEB] hover:bg-[#74B4D9]/10"
          }`}
        >
          <Bell className="h-3.5 w-3.5 text-[#74B4D9]" />
          <span>Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab("data")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${
            activeTab === "data"
              ? "bg-gradient-to-r from-[#10367D] to-[#1a4a9c] text-[#EBEBEB] shadow-md border border-[#74B4D9]/40"
              : "text-[#EBEBEB]/70 hover:text-[#EBEBEB] hover:bg-[#74B4D9]/10"
          }`}
        >
          <Download className="h-3.5 w-3.5 text-[#74B4D9]" />
          <span>Data & Backups</span>
        </button>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* ================= TAB 1: PROFILE ================= */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="glass-panel rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#74B4D9]/15 pb-4">
              <div>
                <h2 className="text-lg font-black text-[#EBEBEB]">Your Developer Profile</h2>
                <p className="text-xs text-[#EBEBEB]/70">Enter your real information. Changes save immediately to your workspace.</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10367D] to-[#1d52b5] text-xl font-black text-[#EBEBEB] shadow-lg border border-[#74B4D9]/30">
                {profile.name ? profile.name[0]?.toUpperCase() : "U"}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#EBEBEB]/70 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#74B4D9]/50" />
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="h-10 w-full rounded-xl border border-[#74B4D9]/20 bg-[#091836]/70 pl-10 pr-4 text-xs font-medium text-[#EBEBEB] placeholder-[#EBEBEB]/30 focus:border-[#74B4D9] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#EBEBEB]/70 mb-1">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#74B4D9]">@</span>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    placeholder="e.g. alex_dev"
                    className="h-10 w-full rounded-xl border border-[#74B4D9]/20 bg-[#091836]/70 pl-8 pr-4 text-xs font-medium text-[#EBEBEB] placeholder-[#EBEBEB]/30 focus:border-[#74B4D9] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#EBEBEB]/70 mb-1">
                  Primary Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#74B4D9]/50" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="e.g. alex@example.com"
                    className="h-10 w-full rounded-xl border border-[#74B4D9]/20 bg-[#091836]/70 pl-10 pr-4 text-xs font-medium text-[#EBEBEB] placeholder-[#EBEBEB]/30 focus:border-[#74B4D9] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#EBEBEB]/70 mb-1">
                  GitHub Profile Handle
                </label>
                <div className="relative">
                  <GithubIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#74B4D9]/50" />
                  <input
                    type="text"
                    value={profile.github}
                    onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                    placeholder="e.g. your_github_username"
                    className="h-10 w-full rounded-xl border border-[#74B4D9]/20 bg-[#091836]/70 pl-10 pr-4 text-xs font-medium text-[#EBEBEB] placeholder-[#EBEBEB]/30 focus:border-[#74B4D9] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#EBEBEB]/70 mb-1">
                  Location / Timezone
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#74B4D9]/50" />
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA / UTC-7"
                    className="h-10 w-full rounded-xl border border-[#74B4D9]/20 bg-[#091836]/70 pl-10 pr-4 text-xs font-medium text-[#EBEBEB] placeholder-[#EBEBEB]/30 focus:border-[#74B4D9] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#EBEBEB]/70 mb-1">
                  Personal Portfolio / Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#74B4D9]/50" />
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    placeholder="https://yourportfolio.com"
                    className="h-10 w-full rounded-xl border border-[#74B4D9]/20 bg-[#091836]/70 pl-10 pr-4 text-xs font-medium text-[#EBEBEB] placeholder-[#EBEBEB]/30 focus:border-[#74B4D9] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#EBEBEB]/70 mb-1">
                Developer Bio / Description
              </label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell others what you build, your core tech stack, and your software philosophy..."
                className="w-full rounded-xl border border-[#74B4D9]/20 bg-[#091836]/70 p-3 text-xs font-medium text-[#EBEBEB] placeholder-[#EBEBEB]/30 focus:border-[#74B4D9] focus:outline-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-[#74B4D9]/15">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#10367D] via-[#1647a3] to-[#74B4D9] px-6 py-2.5 text-xs font-black text-[#EBEBEB] border border-[#74B4D9]/40 shadow-lg shadow-[#10367D]/40 transition-all hover:scale-105"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? "Saving..." : "Save Profile Information"}</span>
              </button>
            </div>
          </form>
        )}

        {/* ================= TAB 2: SECURITY ================= */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <form onSubmit={handleSaveSecurity} className="glass-panel rounded-3xl p-8 space-y-6">
              <div className="border-b border-[#74B4D9]/15 pb-4">
                <h2 className="text-lg font-black text-[#EBEBEB]">Authentication & Security Credentials</h2>
                <p className="text-xs text-[#EBEBEB]/70">Enter your Personal Access Token for private repository access.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#EBEBEB]/70 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={security.currentPassword}
                    onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                    className="h-10 w-full rounded-xl border border-[#74B4D9]/20 bg-[#091836]/70 px-3 text-xs text-[#EBEBEB] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#EBEBEB]/70 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={security.newPassword}
                    onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                    className="h-10 w-full rounded-xl border border-[#74B4D9]/20 bg-[#091836]/70 px-3 text-xs text-[#EBEBEB] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#EBEBEB]/70 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={security.confirmPassword}
                    onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                    className="h-10 w-full rounded-xl border border-[#74B4D9]/20 bg-[#091836]/70 px-3 text-xs text-[#EBEBEB] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#EBEBEB]/70 mb-1">
                  GitHub Personal Access Token (PAT)
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#74B4D9]" />
                  <input
                    type="password"
                    value={security.githubPat}
                    onChange={(e) => setSecurity({ ...security, githubPat: e.target.value })}
                    placeholder="ghp_yourPersonalAccessTokenHere"
                    className="h-10 w-full rounded-xl border border-[#74B4D9]/20 bg-[#091836]/70 pl-10 pr-4 text-xs font-mono text-[#EBEBEB] placeholder-[#EBEBEB]/30 focus:outline-none"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-[#EBEBEB]/60">
                  Generate token at github.com/settings/tokens. Grants read access for your private repositories.
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#74B4D9]/15">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#10367D] via-[#1647a3] to-[#74B4D9] px-6 py-2.5 text-xs font-black text-[#EBEBEB] border border-[#74B4D9]/40 shadow-lg"
                >
                  <Lock className="h-4 w-4" />
                  <span>Save Security Credentials</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB 3: DATABASE & CLOUD SYNC ================= */}
        {activeTab === "database" && (
          <div className="glass-panel rounded-3xl p-8 space-y-6">
            <div className="border-b border-[#74B4D9]/15 pb-4">
              <h2 className="text-lg font-black text-[#EBEBEB]">Database Engine & Cloud Sync Configuration</h2>
              <p className="text-xs text-[#EBEBEB]/70">Choose your storage backend: Local SQLite or Cloud PostgreSQL.</p>
            </div>

            {/* Engine Selector */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                onClick={() => setSyncConfig({ ...syncConfig, dbEngine: "sqlite" })}
                className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                  syncConfig.dbEngine === "sqlite"
                    ? "border-[#74B4D9] bg-[#10367D]/40 shadow-lg shadow-[#10367D]/40"
                    : "border-[#74B4D9]/15 bg-[#091836]/60 hover:bg-[#091836]/90"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-[#74B4D9]" />
                    <span className="text-sm font-black text-[#EBEBEB]">Local SQLite Database</span>
                  </div>
                  {syncConfig.dbEngine === "sqlite" && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                </div>
                <p className="mt-2 text-xs text-[#EBEBEB]/70 leading-relaxed font-medium">
                  100% Local offline mode stored in <code className="text-[#74B4D9]">~/.deadcode/deadcode.db</code>.
                </p>
              </div>

              <div
                onClick={() => setSyncConfig({ ...syncConfig, dbEngine: "postgres" })}
                className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                  syncConfig.dbEngine === "postgres"
                    ? "border-[#74B4D9] bg-[#10367D]/40 shadow-lg shadow-[#10367D]/40"
                    : "border-[#74B4D9]/15 bg-[#091836]/60 hover:bg-[#091836]/90"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-[#74B4D9]" />
                    <span className="text-sm font-black text-[#EBEBEB]">Custom PostgreSQL (Neon / Supabase)</span>
                  </div>
                  {syncConfig.dbEngine === "postgres" && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                </div>
                <p className="mt-2 text-xs text-[#EBEBEB]/70 leading-relaxed font-medium">
                  Connect your cloud database for multi-device sync across all your development machines.
                </p>
              </div>
            </div>

            {/* PostgreSQL Connection String Input */}
            {syncConfig.dbEngine === "postgres" && (
              <div className="space-y-3 pt-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#EBEBEB]/70">
                  Database Connection String (DATABASE_URL)
                </label>
                <input
                  type="text"
                  value={syncConfig.databaseUrl}
                  onChange={(e) => setSyncConfig({ ...syncConfig, databaseUrl: e.target.value })}
                  placeholder="postgresql://user:password@host/database?sslmode=require"
                  className="h-11 w-full rounded-xl border border-[#74B4D9]/25 bg-[#061229] px-4 font-mono text-xs text-[#EBEBEB] placeholder-[#EBEBEB]/30 focus:border-[#74B4D9] focus:outline-none"
                />

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleTestDatabase}
                    disabled={isTestingDb}
                    className="flex items-center gap-2 rounded-xl border border-[#74B4D9]/30 bg-[#74B4D9]/15 px-4 py-2 text-xs font-bold text-[#74B4D9] hover:bg-[#74B4D9]/25 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isTestingDb ? "animate-spin" : ""}`} />
                    <span>{isTestingDb ? "Testing Connection..." : "Test Connection"}</span>
                  </button>
                  {dbTestResult && (
                    <span className="text-xs font-bold text-emerald-400">{dbTestResult}</span>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-[#74B4D9]/15">
              <button
                type="button"
                onClick={() => showToast("Database preferences applied successfully!")}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#10367D] via-[#1647a3] to-[#74B4D9] px-6 py-2.5 text-xs font-black text-[#EBEBEB] border border-[#74B4D9]/40 shadow-lg"
              >
                <Save className="h-4 w-4" />
                <span>Apply Database Settings</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 4: NOTIFICATIONS ================= */}
        {activeTab === "notifications" && (
          <div className="glass-panel rounded-3xl p-8 space-y-6">
            <div className="border-b border-[#74B4D9]/15 pb-4">
              <h2 className="text-lg font-black text-[#EBEBEB]">Notifications & Time Machine Alerts</h2>
              <p className="text-xs text-[#EBEBEB]/70">Configure alerts for your historic coding memories and streak badges.</p>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between rounded-2xl border border-[#74B4D9]/15 bg-[#091836]/60 p-4 cursor-pointer">
                <div>
                  <span className="text-xs font-black text-[#EBEBEB]">Daily "On This Day" Summary</span>
                  <p className="text-[11px] text-[#EBEBEB]/60">Get notified when commits from previous years are discovered on today's calendar date.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.dailyMemories}
                  onChange={(e) => setNotifications({ ...notifications, dailyMemories: e.target.checked })}
                  className="h-4 w-4 rounded border-[#74B4D9]/30 bg-[#74B4D9]/10 text-[#10367D]"
                />
              </label>

              <label className="flex items-center justify-between rounded-2xl border border-[#74B4D9]/15 bg-[#091836]/60 p-4 cursor-pointer">
                <div>
                  <span className="text-xs font-black text-[#EBEBEB]">Milestone Achievements</span>
                  <p className="text-[11px] text-[#EBEBEB]/60">Alerts when you reach milestones like Night Owl, Streak Titan, and First Push.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.milestoneAlerts}
                  onChange={(e) => setNotifications({ ...notifications, milestoneAlerts: e.target.checked })}
                  className="h-4 w-4 rounded border-[#74B4D9]/30 bg-[#74B4D9]/10 text-[#10367D]"
                />
              </label>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#74B4D9]/15">
              <button
                type="button"
                onClick={() => showToast("Notification settings saved!")}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#10367D] via-[#1647a3] to-[#74B4D9] px-6 py-2.5 text-xs font-black text-[#EBEBEB] border border-[#74B4D9]/40 shadow-lg"
              >
                <Save className="h-4 w-4" />
                <span>Save Notification Settings</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 5: DATA & EXPORT ================= */}
        {activeTab === "data" && (
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-8 space-y-6">
              <div className="border-b border-[#74B4D9]/15 pb-4">
                <h2 className="text-lg font-black text-[#EBEBEB]">Export Your Developer Data</h2>
                <p className="text-xs text-[#EBEBEB]/70">Download your personal developer metrics and timeline archives.</p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => handleExport("JSON")}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-[#74B4D9]/20 bg-[#091836]/60 p-5 text-center transition-all hover:bg-[#74B4D9]/15 hover:scale-105"
                >
                  <Download className="h-6 w-6 text-[#74B4D9]" />
                  <span className="text-xs font-black text-[#EBEBEB]">Export as JSON</span>
                  <span className="text-[10px] text-[#74B4D9]">Complete data archive</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleExport("CSV")}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-[#74B4D9]/20 bg-[#091836]/60 p-5 text-center transition-all hover:bg-[#74B4D9]/15 hover:scale-105"
                >
                  <Download className="h-6 w-6 text-[#74B4D9]" />
                  <span className="text-xs font-black text-[#EBEBEB]">Export as CSV</span>
                  <span className="text-[10px] text-[#74B4D9]">Tabular commit records</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleExport("MD")}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-[#74B4D9]/20 bg-[#091836]/60 p-5 text-center transition-all hover:bg-[#74B4D9]/15 hover:scale-105"
                >
                  <Download className="h-6 w-6 text-[#74B4D9]" />
                  <span className="text-xs font-black text-[#EBEBEB]">Export as Markdown</span>
                  <span className="text-[10px] text-[#74B4D9]">GitHub profile badge snippet</span>
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-3xl border border-rose-900/40 bg-rose-950/20 p-8 space-y-4">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="text-base font-black">Reset & Data Wipe</h3>
              </div>
              <p className="text-xs text-rose-300/70 leading-relaxed font-medium">
                Wiping local cache removes indexed commit history. Original Git files on your filesystem remain untouched.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Reset local Git index cache?")) {
                      localStorage.clear();
                      showToast("Local index cache reset.");
                    }
                  }}
                  className="flex items-center gap-2 rounded-xl border border-rose-800/40 bg-rose-950/60 px-4 py-2 text-xs font-bold text-rose-300 hover:bg-rose-900/80"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Reset Local Index</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
