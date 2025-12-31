import React from 'react';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-base)] font-sans selection:bg-primary-500/30">
      <Sidebar />
      <main className="pl-64 min-h-screen transition-all duration-300">
        <div className="max-w-7xl mx-auto p-8 lg:p-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
