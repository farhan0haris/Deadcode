"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = pathname === "/" || pathname === "/login" || pathname === "/register";

  return (
    <div className="relative z-10 flex min-h-screen bg-[#091836] text-[#EBEBEB]">
      {!isPublicPage && <Sidebar />}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 w-full ${
          !isPublicPage ? "lg:pl-64" : ""
        }`}
      >
        {!isPublicPage && <Header />}
        <main className="flex-1 w-full">{children}</main>
      </div>
    </div>
  );
}
