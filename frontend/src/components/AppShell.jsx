import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppShell({ children, isAuthenticated, currentTab, setCurrentTab, user, onLogout }) {
  // Layout routing check: If unauthenticated, render raw full-bleed children layout (e.g., Login Page)
  if (!isAuthenticated) {
    return <main className="min-h-screen bg-slate-50">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation shell layout */}
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Primary Workspace Frame */}
      <div className="flex-1 pl-64 flex flex-col">
        {/* Persistent Top Navigation Bar */}
        <Header currentTab={currentTab} user={user} onLogout={onLogout} />

        {/* Dynamic Inner Component Shell Viewport */}
        <main className="pt-16 p-8 min-h-screen box-border overflow-auto w-full">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}