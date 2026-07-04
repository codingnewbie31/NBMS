import React from 'react';

export default function PageContainer({ children }) {
  return (
    // Structural layout view container boundary layout box
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {children}
    </div>
  );
}