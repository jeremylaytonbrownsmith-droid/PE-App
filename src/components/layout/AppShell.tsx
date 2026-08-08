import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export function AppShell() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="no-print md:hidden flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
          <img src="/icons/icon.svg" alt="" className="w-7 h-7 rounded-lg" />
          <span className="font-bold text-gray-900">PE Planner</span>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 pb-24 md:pb-8 max-w-5xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
