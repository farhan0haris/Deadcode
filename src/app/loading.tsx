export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-600" />
        <p className="text-xs text-zinc-500 font-medium animate-pulse">
          Loading DeadCode SaaS...
        </p>
      </div>
    </div>
  );
}
