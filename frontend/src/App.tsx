import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { GitNodeCanvas } from './components/canvas/GitNodeCanvas';

import { Dashboard } from './pages/Dashboard';
import { OnThisDay } from './pages/OnThisDay';
import { Repositories } from './pages/Repositories';
import { Timeline } from './pages/Timeline';
import { Statistics } from './pages/Statistics';
import { Languages } from './pages/Languages';
import { Journey } from './pages/Journey';
import { Achievements } from './pages/Achievements';
import { Search } from './pages/Search';
import { Export } from './pages/Export';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-zinc-100 flex relative">
          <GitNodeCanvas />
          <Sidebar />
          <div className="flex-1 ml-64 flex flex-col min-w-0 z-10">
            <Header />
            <main className="flex-1 p-8 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/today" element={<OnThisDay />} />
                <Route path="/repositories" element={<Repositories />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/languages" element={<Languages />} />
                <Route path="/journey" element={<Journey />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/search" element={<Search />} />
                <Route path="/export" element={<Export />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
