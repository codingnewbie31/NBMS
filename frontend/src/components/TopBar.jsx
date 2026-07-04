import React, { useState } from 'react';
import { Search, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TopBar({ currentTitle }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    // Sticky header bar aligned perfectly on the top axis
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-sm px-6 shadow-xs">
      
      {/* Content context tracking title */}
      <div className="flex items-center">
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">{currentTitle}</h1>
      </div>

      {/* Interface control modules group */}
      <div className="flex items-center gap-4">
        
        {/* Global system layout search bar utility */}
        <div className="relative hidden w-60 sm:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search control panels..."
            className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-xs text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Industrial alerting notification trigger */}
        <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
        </button>

        {/* Dynamic authenticated user runtime navigation dropdown */}
        <div className="relative border-l border-slate-200 pl-4">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-600 group-hover:bg-slate-200 transition-colors">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-slate-800 leading-none mb-0.5">
                {user?.name || user?.username || 'Operator Terminal'}
              </p>
              <p className="text-[10px] font-medium tracking-wide text-slate-400 uppercase leading-none">
                {user?.role || 'System Node'}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
          </button>

          {/* Interactive User Dropdown popover frame */}
          {menuOpen && (
            <div className="absolute right-0 top-11 z-50 w-44 rounded-md border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-100">
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}