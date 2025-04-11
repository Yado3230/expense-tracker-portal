"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SidebarFooterProps {
  className?: string;
  isCollapsed?: boolean;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ 
  className,
  isCollapsed = false,
}) => {
  return (
    <div className={cn("flex-shrink-0 flex border-t p-4", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start space-x-2",
              isCollapsed && "justify-center"
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/default.png" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: isCollapsed ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-start"
            >
              <span className="text-sm font-medium">Admin User</span>
              <span className="text-xs text-muted-foreground">admin@example.com</span>
            </motion.div>
            {!isCollapsed && <ChevronDown className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
