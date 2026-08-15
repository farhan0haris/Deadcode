"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { securityLogger } from "@/lib/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    securityLogger.error("DATABASE_ERROR", error, { digest: error.digest, level: "global" });
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen items-center justify-center bg-[#091836] p-6 text-[#EBEBEB]">
        <div className="w-full max-w-md rounded-3xl border border-[#74B4D9]/25 bg-[#0d2452] p-8 text-center shadow-2xl space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-black text-[#EBEBEB]">Application Error</h2>
          <p className="text-xs text-[#EBEBEB]/70 leading-relaxed font-medium">
            An unexpected global system error occurred. Please try reloading the application.
          </p>
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 mx-auto rounded-xl bg-gradient-to-r from-[#10367D] via-[#1647a3] to-[#74B4D9] px-5 py-2.5 text-xs font-black text-[#EBEBEB] border border-[#74B4D9]/40 shadow-md hover:scale-105 transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reload Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}
