"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { securityLogger } from "@/lib/logger";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    securityLogger.error("DATABASE_ERROR", error, { digest: error.digest });
  }, [error]);

  const displayMessage =
    process.env.NODE_ENV === "development"
      ? error.message || "An unexpected error occurred while loading this view."
      : "An unexpected system error occurred. Our team has been notified.";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-8 pl-72 text-center">
      <div className="glass-panel max-w-md rounded-3xl p-8 space-y-4 border border-[#74B4D9]/25 shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-black text-[#EBEBEB]">
          Something Went Wrong
        </h2>
        <p className="text-xs text-[#EBEBEB]/70 leading-relaxed font-medium">
          {displayMessage}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#10367D] via-[#1647a3] to-[#74B4D9] px-4 py-2.5 text-xs font-black text-[#EBEBEB] border border-[#74B4D9]/40 shadow-md hover:scale-105 transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-[#74B4D9]/20 bg-[#74B4D9]/10 px-4 py-2.5 text-xs font-bold text-[#74B4D9] hover:bg-[#74B4D9]/20 transition-all"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
