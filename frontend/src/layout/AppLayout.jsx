import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import PageContainer from './PageContainer';

export default function AppLayout({ children, currentTitle }) {
  return (
    // Flex root template preventing horizontal and vertical viewport shifts
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 font-sans antialiased">
      
      {/* Structural layout column: Sidebar pinning layer */}
      <Sidebar />

      {/* Main computational panel rendering frame */}
      <div className="pl-64 flex flex-col min-h-screen">
        
        {/* Upper persistent workspace controls container */}
        <TopBar currentTitle={currentTitle} />

        {/* Dynamic routing presentation canvas viewport layout */}
        <main className="flex-1 overflow-y-auto">
          <PageContainer>
            {children}
          </PageContainer>
        </main>

      </div>
    </div>
  );
}