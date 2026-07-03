import React from 'react';
import { navigationConfig } from '../config/navigation';

export default function Sidebar({ currentPath = "/dashboard", onNavigate }) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-slate-950 text-slate-200">
      
      {/* Updated Branding Title and Subtitle Block */}
      <div className="flex h-16 flex-col justify-center border-b border-slate-800 px-6">
        <span className="text-xl font-bold tracking-wider text-white leading-tight">NBMS</span>
        <span className="text-xs text-slate-500 font-medium">Management System</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {navigationConfig.map((group) => (
          <div key={group.group} className="space-y-1">
            
            <h3 className="px-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
              {group.group}
            </h3>

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;

                return (
                  <button
                    key={item.name}
                    onClick={() => onNavigate && onNavigate(item.path)}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition cursor-pointer ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

          </div>
        ))}
      </nav>

    </aside>
  );
}