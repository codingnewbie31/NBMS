import React from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import PageContainer from "./PageContainer";

export default function AppLayout({
  children,
  currentPath,
  currentTitle,
  onNavigate,
}) {
  return (
    // Application Shell
    <div className="flex h-screen overflow-hidden bg-slate-100">

      {/* Primary Navigation */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
      />

      {/* Workspace */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Global Header */}
        <TopBar
          currentTitle={currentTitle}
        />

        {/* Active Page */}
        <PageContainer>
          {children}
        </PageContainer>

      </div>

    </div>
  );
}