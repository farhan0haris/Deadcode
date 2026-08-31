import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import BackgroundCanvas from "@/components/canvas/BackgroundCanvas";
import AutoSyncHandler from "@/components/AutoSyncHandler";

export const metadata: Metadata = {
  title: "DeadCode — Every commit has a ghost",
  description:
    "A privacy-first, 100% offline Git time machine and developer journey visualizer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="min-h-screen bg-[#091836] text-[#EBEBEB] antialiased selection:bg-[#74B4D9]/30 selection:text-[#EBEBEB]">
        <ThemeProvider attribute="class" forcedTheme="dark">
          <AuthProvider>
            <AutoSyncHandler />
            <BackgroundCanvas />
            <div className="relative z-10 flex min-h-screen bg-[#091836] text-[#EBEBEB]">
              <Sidebar />
              <div className="flex flex-1 flex-col transition-all duration-300 lg:pl-64">
                <Header />
                <main className="flex-1">{children}</main>
              </div>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
