import React, { useState } from 'react';
import { Search, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TopBar({ currentTitle }) {
  const { user, logout } = useAuth();
  // Controls the user dropdown's open/closed state
  const [menuOpen, setMenuOpen] = useState(false);

  // Initials fallback for the avatar chip when no photo exists
  const initials = (user?.name || user?.username || 'U').trim().charAt(0).toUpperCase();

  return (
    // 64px enterprise header: white surface, bottom border only, soft shadow
    <header className="flex h-16 w-full shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      {/* Left: page title + breadcrumb trail */}
      <div className="min-w-0">
        <h1 className="truncate text-lg font-bold text-slate-900 tracking-tight">{currentTitle}</h1>
        <p className="truncate text-xs font-medium text-slate-400">
          Home <span className="mx-1 text-slate-300">/</span> {currentTitle}
        </p>
      </div>

      {/* Right: search, notifications, user block */}
      <div className="flex items-center gap-4">
        {/* Search input, desktop only */}
        <div className="relative hidden w-64 md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Notification bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </button>

        {/* User block: avatar, name, role, dropdown toggle */}
        <div className="relative border-l border-slate-200 pl-4">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-3 cursor-pointer"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-emerald-400">
              {initials}
            </span>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold leading-none text-slate-800">
                {user?.name || user?.username || 'Operator'}
              </p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-wide leading-none text-slate-400">
                {user?.role || 'System Node'}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
          </button>

          {/* Dropdown menu: profile/settings placeholders + working logout */}
          {menuOpen && (
            <div className="absolute right-0 top-12 z-50 w-48 rounded-md border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black/5">
              <button
                type="button"
                disabled
                className="flex w-full items-center justify-between px-4 py-2 text-xs font-medium text-slate-400 cursor-not-allowed"
              >
                <span className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5" aria-hidden="true" />
                  Profile
                </span>
                <span className="text-[9px] uppercase tracking-wide">Soon</span>
              </button>
              <button
                type="button"
                disabled
                className="flex w-full items-center justify-between px-4 py-2 text-xs font-medium text-slate-400 cursor-not-allowed"
              >
                <span className="flex items-center gap-2">
                  <Settings className="h-3.5 w-3.5" aria-hidden="true" />
                  Settings
                </span>
                <span className="text-[9px] uppercase tracking-wide">Soon</span>
              </button>
              <div className="my-1 border-t border-slate-100" />
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}