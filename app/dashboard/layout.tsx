"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, Header } from "@/components/layout";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check admin status after component mounts (client-side only)
    const checkAdminStatus = () => {
      const adminStatus = localStorage.getItem("isAdmin");
      setIsAdmin(adminStatus === "true");
      setIsLoading(false);

      // If explicitly not admin, redirect to login
      if (adminStatus === "false" || adminStatus === null) {
        router.replace("/auth/login");
      }
    };

    checkAdminStatus();
  }, [router]);

  // Show loading state while checking
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Show access denied if not admin (this will show briefly before redirect)
  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-cyan-500 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600">
              Only administrators can access the dashboard.
            </p>
          </div>
          <Link
            href="/auth/login"
            className="text-cyan-500 hover:text-cyan-600 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

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
