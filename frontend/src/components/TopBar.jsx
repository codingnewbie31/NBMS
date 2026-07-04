// src/components/TopBar.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function TopBar({ currentTitle, onMenuClick }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const menuRef = useRef(null);
  const notificationRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = (user?.name || user?.username || "U")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <header className="relative z-40 flex h-16 w-full shrink-0 items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-sm px-4 sm:px-6">
      {/* Left: Mobile menu + page title */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors lg:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold text-slate-900 tracking-tight">
            {currentTitle}
          </h1>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <span>Home</span>
            <span className="text-slate-300">/</span>
            <span className="text-emerald-600">{currentTitle}</span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-48 lg:w-64 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:w-56 lg:focus:w-72"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="Notifications"
            className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </span>
          </button>

          {/* Notifications dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-slate-200 bg-white py-2 shadow-lg shadow-slate-200/50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Notifications
                </p>
              </div>
              <div className="py-8 text-center">
                <Bell className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm text-slate-400">No new notifications</p>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2.5 rounded-xl p-1.5 pr-2 hover:bg-slate-100 transition-all"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-emerald-600 text-xs font-bold text-white shadow-sm shadow-emerald-200">
              {initials}
            </span>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold leading-none text-slate-800">
                {user?.name || user?.username || "Operator"}
              </p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wide leading-none text-slate-400">
                {user?.role || "Operator"}
              </p>
            </div>
            <ChevronDown
              className={`hidden sm:block h-4 w-4 text-slate-400 transition-transform ${
                menuOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-lg shadow-slate-200/50">
              {/* User info */}
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-800">
                  {user?.name || user?.username || "Operator"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {user?.email || user?.phoneNumber || ""}
                </p>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <button
                  type="button"
                  disabled
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                >
                  <User className="h-4 w-4" aria-hidden="true" />
                  <span className="flex-1 text-left">Profile</span>
                  <span className="text-[10px] font-medium uppercase tracking-wide text-slate-300">
                    Soon
                  </span>
                </button>
                <button
                  type="button"
                  disabled
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                >
                  <Settings className="h-4 w-4" aria-hidden="true" />
                  <span className="flex-1 text-left">Settings</span>
                  <span className="text-[10px] font-medium uppercase tracking-wide text-slate-300">
                    Soon
                  </span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}