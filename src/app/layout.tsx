import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import BackgroundCanvas from "@/components/canvas/BackgroundCanvas";

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
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased transition-colors dark:bg-zinc-950 dark:text-zinc-100 selection:bg-violet-500/30 selection:text-violet-200">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <BackgroundCanvas />
            <div className="relative z-10 flex min-h-screen">
              <Sidebar />
              <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex-1 transition-all">{children}</main>
              </div>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
