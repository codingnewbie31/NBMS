import React, { useState } from 'react';
import { Search, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TopBar({ currentTitle = "Dashboard" }) {
  // Authentication context data layer extraction
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6">
      
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-slate-800">{currentTitle}</h1>
      </div>

      <div className="flex items-center gap-6">
        
        {/* Search query field module */}
        <div className="relative hidden w-64 sm:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Global Notifications Alert bell */}
        <button className="relative rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-600" />
        </button>

        {/* Interactive User profile dropdown context wrapper */}
        <div className="relative flex items-center gap-3 border-l border-slate-200 pl-6">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 text-left focus:outline-none cursor-pointer group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 group-hover:bg-slate-200 transition">
              <User className="h-5 w-5" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-slate-700 leading-tight">
                {user?.name || user?.username || 'Authenticated Staff'}
              </p>
              <p className="text-xs text-slate-400 capitalize">
                {user?.role || 'User'}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition hidden md:block" />
          </button>

          {/* Context Dropdown container box */}
          {dropdownOpen && (
            <div className="absolute right-0 top-12 z-50 w-48 rounded-md border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black/5">
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition text-left cursor-pointer"
              >
                <LogOut className="h-4 w-4 text-slate-400" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}