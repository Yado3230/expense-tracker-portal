"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Wallet,
  Receipt,
  CreditCard,
  Settings,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
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
    title: "Budgets",
    href: "/dashboard/budgets",
    icon: <Wallet className="h-5 w-5" />,
  },
  {
    title: "Expenses",
    href: "/dashboard/expenses",
    icon: <Receipt className="h-5 w-5" />,
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

interface SidebarNavProps {
  isCollapsed?: boolean;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  isCollapsed = false,
}) => {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-2 space-y-1">
      <TooltipProvider delayDuration={0}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    isCollapsed ? "justify-center" : "justify-start"
                  )}
                >
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isCollapsed ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center"
                  >
                    <div
                      className={cn(
                        "mr-3 h-6 w-6",
                        isActive
                          ? "text-primary-foreground"
                          : "text-muted-foreground group-hover:text-accent-foreground"
                      )}
                    >
                      {item.icon}
                    </div>
                    {item.title}
                  </motion.div>
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {item.title}
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </nav>
  );
};
