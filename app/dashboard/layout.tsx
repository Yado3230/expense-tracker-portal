"use client";
import React from "react";
import { Sidebar, Header } from "@/components/layout";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isCollapsed={isCollapsed} onCollapse={setIsCollapsed} />
      <div
        className={cn(
          "transition-all duration-300",
          isCollapsed ? "pl-20" : "pl-64"
        )}
      >
        <Header />
        <main className="p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
