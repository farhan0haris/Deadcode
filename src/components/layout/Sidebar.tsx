"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Home,
  LayoutDashboard,
  Calendar,
  FolderGit2,
  GitCommit,
  BarChart3,
  CalendarDays,
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
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "On This Day", href: "/today", icon: Calendar },
  { name: "Repositories", href: "/repos", icon: FolderGit2 },
  { name: "Timeline", href: "/timeline", icon: GitCommit },
  { name: "Analytics", href: "/languages", icon: BarChart3 },
  { name: "Heatmap Calendar", href: "/heatmap", icon: CalendarDays },
  { name: "Achievements", href: "/achievements", icon: Award },
  { name: "Yearly Retrospective", href: "/wrapped", icon: Sparkles },
  { name: "Search", href: "/search", icon: Search },
  { name: "Public Profile", href: "/profile/developer", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [localName, setLocalName] = useState<string>("");
  const [localHandle, setLocalHandle] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("deadcode_user_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name) setLocalName(parsed.name);
        if (parsed.username) setLocalHandle(parsed.username);
      } catch {
        // Fallback
      }
    }
  }, []);

  // Hide sidebar on public landing and login/register pages
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return null;
  }

  const displayName = session?.user?.name || localName || "Your Workspace";
  const displayHandle = session?.user?.email ? session.user.email.split("@")[0] : localHandle || "offline";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-[#74B4D9]/15 bg-[#091836]/95 backdrop-blur-2xl transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col justify-between p-4">
        <div>
          {/* Logo Header & Collapse Toggle */}
          <div className="flex items-center justify-between px-2 py-3">
            <Link
              href="/"
              title="Go to DeadCode Home"
              className="flex items-center gap-3 transition-opacity hover:opacity-90"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#10367D] to-[#1d52b5] text-[#EBEBEB] shadow-lg shadow-[#10367D]/50 border border-[#74B4D9]/30">
                <Ghost className="h-5 w-5 text-[#74B4D9]" />
              </div>
              {!isCollapsed && (
                <div>
                  <span className="text-base font-black tracking-tight text-[#EBEBEB]">
                    DeadCode
                  </span>
                  <span className="block text-[10px] font-bold tracking-wide text-[#74B4D9]">
                    Cloud Edition
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden rounded-lg p-1 text-[#EBEBEB]/60 hover:bg-[#74B4D9]/10 hover:text-[#EBEBEB] sm:block"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-5 space-y-1 overflow-y-auto max-h-[calc(100vh-190px)] pr-1" aria-label="Main Navigation">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.name : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-[#10367D] to-[#1a4a9c] text-[#EBEBEB] shadow-md border border-[#74B4D9]/40 shadow-[#10367D]/30"
                      : "text-[#EBEBEB]/70 hover:bg-[#74B4D9]/10 hover:text-[#EBEBEB]"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-200",
                      isActive ? "text-[#74B4D9] scale-110" : "text-[#74B4D9]/60"
                    )}
                  />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="border-t border-[#74B4D9]/15 pt-3">
          <div className="flex items-center justify-between rounded-xl border border-[#74B4D9]/20 bg-[#74B4D9]/5 p-2.5">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#10367D] to-[#1d52b5] text-[#EBEBEB] font-bold text-xs border border-[#74B4D9]/30">
                {displayName[0]?.toUpperCase() || "U"}
              </div>
              {!isCollapsed && (
                <div className="truncate">
                  <p className="truncate text-xs font-extrabold text-[#EBEBEB]">
                    {displayName}
                  </p>
                  <p className="truncate text-[10px] text-[#74B4D9] font-semibold">
                    @{displayHandle}
                  </p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={() => signOut()}
                title="Sign out"
                aria-label="Sign out of your account"
                className="rounded-lg p-1.5 text-[#EBEBEB]/50 hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
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
