import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { navigationConfig } from '../config/navigation';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    // Fixed sidebar with an industrial dark slate finish
    <aside className="fixed inset-y-0 left-0 z-20 flex h-full w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-200">
      
      {/* Branding Header Section */}
      <div className="flex h-16 flex-col justify-center border-b border-slate-800 px-6 bg-slate-900/50">
        <span className="text-xl font-black tracking-wider text-white antialiased">NASHAT BEVERAGES</span>
        <span className="text-xs font-semibold tracking-medium text-slate-500 uppercase">Operations Center</span>
      </div>

      {/* Navigation Links Grid Tree */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {navigationConfig.map((group) => (
          <div key={group.group} className="space-y-1">
            
            {/* Group Header Label */}
            <h3 className="px-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              {group.group}
            </h3>

            {/* Group Link Map Iteration */}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    className={`group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20"
                        : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`} />
                    <span className="truncate">{item.name}</span>
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