import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import PageContainer from './PageContainer';

export default function AppLayout({ children, currentTitle }) {
  // Sidebar collapse state lifted here so content spacing can react to it
  const [collapsed, setCollapsed] = useState(false);

  return (
    // Flex root template preventing horizontal and vertical viewport shifts
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Sticky sidebar, now controlled from this layout */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main panel offset matches the sidebar's current width, animated in step */}
      <div
        className={`flex min-h-screen flex-col transition-[padding-left] duration-300 ease-in-out ${
          collapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        {/* Sticky top bar stays pinned while content scrolls */}
        <TopBar currentTitle={currentTitle} />

        {/* Scrollable routing canvas, smooth-scrolls on anchor/programmatic jumps */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <PageContainer>{children}</PageContainer>
        </main>
      </div>
    </div>
  );
}