"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error internally
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-8 pl-72 text-center">
      <div className="glass-panel max-w-md rounded-2xl p-8 space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          Something went wrong
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {error.message || "An unexpected error occurred while loading this view."}
        </p>
        <button
          onClick={reset}
          className="flex items-center justify-center gap-2 mx-auto rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-600/25 hover:bg-violet-500"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}
