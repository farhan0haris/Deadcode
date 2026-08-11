"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Calendar,
  FolderGit2,
  GitCommit,
  BarChart3,
  Award,
  Search,
  Sparkles,
  User,
  Settings,
  LogOut,
  Ghost,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "On This Day", href: "/today", icon: Calendar },
  { name: "Repositories", href: "/repos", icon: FolderGit2 },
  { name: "Timeline", href: "/timeline", icon: GitCommit },
  { name: "Analytics", href: "/languages", icon: BarChart3 },
  { name: "Achievements", href: "/achievements", icon: Award },
  { name: "Yearly Retrospective", href: "/wrapped", icon: Sparkles },
  { name: "Search", href: "/search", icon: Search },
  { name: "Public Profile", href: "/profile/demo", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Hide sidebar on public landing and login pages
  if (pathname === "/" || pathname === "/login") {
    return null;
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-zinc-200 bg-white/90 backdrop-blur-xl transition-all duration-300 dark:border-zinc-800/80 dark:bg-zinc-950/80",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col justify-between p-4">
        <div>
          {/* Logo Header & Collapse Toggle */}
          <div className="flex items-center justify-between px-2 py-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 transition-opacity hover:opacity-90"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20">
                <Ghost className="h-5 w-5 text-white" />
              </div>
              {!isCollapsed && (
                <div>
                  <span className="bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-base font-bold tracking-tight text-transparent dark:from-white dark:to-zinc-400">
                    DeadCode
                  </span>
                  <span className="block text-[10px] font-normal tracking-wide text-zinc-500">
                    v2.0 SaaS
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 sm:block"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5" aria-label="Main Navigation">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.name : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all duration-200",
                    isActive
                      ? "bg-violet-600/10 text-violet-600 font-semibold dark:bg-violet-600/15 dark:text-violet-400 border border-violet-500/20 shadow-sm"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-200"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-200",
                      isActive ? "text-violet-500 scale-110" : "text-zinc-400"
                    )}
                  />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800/80">
          <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800/40 dark:bg-zinc-900/40">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 font-semibold text-xs text-violet-700 dark:bg-violet-950 dark:text-violet-300 border border-violet-300/40 dark:border-violet-700/50">
                {session?.user?.name?.[0]?.toUpperCase() || "D"}
              </div>
              {!isCollapsed && (
                <div className="truncate">
                  <p className="truncate text-xs font-medium text-zinc-900 dark:text-zinc-200">
                    {session?.user?.name || "Developer"}
                  </p>
                  <p className="truncate text-[10px] text-zinc-500">
                    @{session?.user?.email?.split("@")[0] || "offline"}
                  </p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={() => signOut()}
                title="Sign out"
                aria-label="Sign out of your account"
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-200 hover:text-red-600 dark:hover:bg-zinc-800 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
