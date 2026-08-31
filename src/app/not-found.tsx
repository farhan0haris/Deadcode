import Link from "next/link";
import { Ghost, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 sm:p-6 lg:p-8 text-center">
      <div className="glass-panel max-w-md rounded-2xl p-8 space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/10 text-violet-500">
          <Ghost className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
          404 — Page Not Found
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          This commit ghost seems to have vanished into the mist.
        </p>
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 mx-auto rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-600/25 hover:bg-violet-500"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
