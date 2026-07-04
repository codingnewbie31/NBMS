import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Droplets, ChevronLeft, ChevronRight } from 'lucide-react';
import { navigationConfig } from '../config/navigation';

// Collapse state now owned by AppLayout, passed down as props
export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    // Fixed, sticky sidebar with an industrial dark-slate finish
    <aside
      className={`fixed inset-y-0 left-0 z-20 flex h-screen flex-col border-r border-slate-800 bg-slate-950 text-slate-200 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Branding header: company mark + product name */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-800 bg-slate-900/50 px-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white shadow-md shadow-emerald-900/30">
          <Droplets className="h-5 w-5" aria-hidden="true" />
        </span>
        {!collapsed && (
          <div className="min-w-0 overflow-hidden whitespace-nowrap">
            <p className="truncate text-sm font-black tracking-wider text-white">NASHAT BEVERAGES</p>
            <p className="truncate text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
              Management System 
            </p>
          </div>
        )}
      </div>

      {/* Grouped navigation, scrollable independent of header/footer */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-5 space-y-6">
        {navigationConfig.map((group) => (
          <div key={group.group} className="space-y-1">
            {!collapsed && (
              <h3 className="px-3 text-[10px] font-bold tracking-widest text-slate-600 uppercase">
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
                    aria-current={isActive ? 'page' : undefined}
                    className={`group flex w-full items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-sm font-medium transition-colors duration-150 cursor-pointer ${
                      isActive
                        ? 'border-emerald-500 bg-slate-900 text-white'
                        : 'border-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-900/60 hover:text-slate-100'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive ? 'text-emerald-500' : 'text-slate-500 group-hover:text-slate-200'
                      }`}
                    />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle, pinned above the footer */}
      <div className="shrink-0 border-t border-slate-800 px-3 py-2">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex w-full items-center justify-center gap-2 rounded-md py-2 text-slate-500 hover:bg-slate-900/60 hover:text-slate-200 transition-colors cursor-pointer"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-semibold">Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* Footer: version + live system indicator */}
      <div className="shrink-0 border-t border-slate-800 px-4 py-3">
        <div className="flex items-center justify-center gap-2 text-[10px] font-medium text-slate-500">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
          {!collapsed && <span className="whitespace-nowrap">System Online · v1.0.0</span>}
        </div>
      </div>
    </aside>
  );
}