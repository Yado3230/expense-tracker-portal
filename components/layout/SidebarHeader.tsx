"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface SidebarHeaderProps {
  className?: string;
  isCollapsed?: boolean;
  onCollapse?: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  className,
  isCollapsed = false,
  onCollapse,
}) => {
  return (
    <div className={cn("flex items-center justify-between px-4", className)}>
      <Link href="/" className="flex items-center space-x-2">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center space-x-2"
        >
          <svg
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="text-xl font-bold">Expense Tracker</span>
        </motion.div>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onCollapse}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
