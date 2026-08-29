"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { triggerGitHubSync, getStoredSyncData } from "@/lib/githubSync";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export default function AutoSyncHandler() {
  const { data: session, status } = useSession();
  const [syncState, setSyncState] = useState<"idle" | "syncing" | "done" | "error">("idle");
  const [syncMessage, setSyncMessage] = useState<string>("");

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    const runAutoSync = async () => {
      const userObj = session.user as any;
      const userGithubLogin = userObj.githubLogin || (userObj.email ? userObj.email.split("@")[0] : undefined);
      const userAccessToken = userObj.accessToken;

      // Check if we already synchronized recently for this identity
      const existing = getStoredSyncData();
      if (existing && userGithubLogin && existing.user.login.toLowerCase() === userGithubLogin.toLowerCase()) {
        return; // Already synchronized
      }

      setSyncState("syncing");
      setSyncMessage("Connecting to GitHub & syncing repository metadata...");

      try {
        const result = await triggerGitHubSync(userGithubLogin, userAccessToken);
        setSyncState("done");
        setSyncMessage(`Workspace ready! Synchronized ${result.repos.length} repositories for @${result.user.login}.`);
        setTimeout(() => setSyncState("idle"), 4000);
      } catch (err: any) {
        setSyncState("error");
        setSyncMessage(err?.message || "Automatic GitHub sync incomplete.");
        setTimeout(() => setSyncState("idle"), 6000);
      }
    };

    runAutoSync();
  }, [session, status]);

  if (syncState === "idle") return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-[#74B4D9]/40 bg-[#0A1A3F]/95 p-4 text-xs font-bold text-white shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5">
      {syncState === "syncing" && (
        <>
          <RefreshCw className="h-4 w-4 text-[#74B4D9] animate-spin shrink-0" />
          <span>{syncMessage}</span>
        </>
      )}
      {syncState === "done" && (
        <>
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="text-emerald-300">{syncMessage}</span>
        </>
      )}
      {syncState === "error" && (
        <>
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
          <span className="text-amber-300">{syncMessage}</span>
        </>
      )}
    </div>
  );
}
