// src/components/Sidebar.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Droplets, ChevronLeft, ChevronRight } from "lucide-react";
import { navigationConfig } from "../config/navigation";

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Branding Header */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-100 px-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-200">
          <Droplets className="h-5 w-5" aria-hidden="true" />
        </span>
        {!collapsed && (
          <div className="min-w-0 overflow-hidden whitespace-nowrap">
            <p className="truncate text-sm font-bold tracking-tight text-slate-900">
              Nashat Beverages
            </p>
            <p className="truncate text-[10px] font-semibold tracking-wider text-emerald-600 uppercase">
              Management System
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-5 space-y-6">
        {navigationConfig.map((group) => (
          <div key={group.group} className="space-y-1">
            {!collapsed && (
              <h3 className="px-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                {group.group}
              </h3>
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    title={collapsed ? item.name : undefined}
                    aria-current={isActive ? "page" : undefined}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 shadow-sm"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    } ${collapsed ? "justify-center" : ""}`}
                  >
                    <Icon
                      className={`h-5 w-5 shrink-0 transition-colors ${
                        isActive
                          ? "text-emerald-600"
                          : "text-slate-400 group-hover:text-slate-500"
                      }`}
                    />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                    
                    {/* Active indicator dot */}
                    {isActive && collapsed && (
                      <span className="absolute right-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="shrink-0 border-t border-slate-100 px-3 py-3">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all cursor-pointer"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-slate-100 px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          {!collapsed && (
            <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
              System Online · v1.0.0
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}