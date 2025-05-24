"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Wallet,
  CreditCard,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Category",
    href: "/dashboard/categories",
    icon: <Wallet className="h-5 w-5" />,
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export const Sidebar = ({ isCollapsed, onCollapse }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gradient-to-b from-[#673ab7] to-[#512da8] text-white transition-all duration-300",
        isCollapsed && "w-20"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
        <Link href="/" className="flex items-center space-x-2">
          {!isCollapsed && (
            <>
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-xl font-bold">B</span>
              </div>
              <span className="text-xl font-bold">Tracker</span>
            </>
          )}
          {isCollapsed && (
            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-xl font-bold">B</span>
            </div>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={() => onCollapse(!isCollapsed)}
        >
          <ChevronLeft className={cn("h-4 w-4", isCollapsed && "rotate-180")} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <div
                className={cn(
                  "flex items-center",
                  isCollapsed ? "mx-auto" : ""
                )}
              >
                {item.icon}
                {!isCollapsed && <span className="ml-3">{item.title}</span>}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
