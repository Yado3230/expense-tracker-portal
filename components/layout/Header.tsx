"use client";
import React from "react";
import { Search, Bell, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export const Header = () => {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <header className="h-16 border-b bg-white px-4 flex items-center justify-between">
      {/* Search Section */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
        <Button
          onClick={() => router.push("/dashboard/settings")}
          variant="ghost"
          size="icon"
        >
          <Settings className="h-5 w-5 text-gray-600" />
        </Button>
        <Button onClick={logout} variant="ghost" size="icon" title="Logout">
          <LogOut className="h-5 w-5 text-gray-600" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/avatars/default.png" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
