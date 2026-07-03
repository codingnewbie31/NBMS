import React from 'react';

export default function PageContainer({ children }) {
  return (
    // Layout Section: Core application canvas viewport spacing grid
    <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {children}
      </div>
    </main>
  );
}