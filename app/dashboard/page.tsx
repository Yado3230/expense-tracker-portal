"use client";
import React, { useState } from "react";
import {
  CalendarIcon,
  DollarSignIcon,
  FilterIcon,
  TrendingUpIcon,
  PlusIcon,
  HistoryIcon,
  UsersIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Mock data for demonstration
const recentTransactions = [
  {
    id: "t1",
    title: "Grocery Shopping",
    amount: -82.5,
    user: "Michael Johnson",
    date: "Today",
    category: "Food",
    icon: "🛒",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "t2",
    title: "Salary Deposit",
    amount: 2450.0,
    user: "Sarah Williams",
    date: "Yesterday",
    category: "Income",
    icon: "💰",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "t3",
    title: "Netflix Subscription",
    amount: -14.99,
    user: "David Chen",
    date: "3 days ago",
    category: "Entertainment",
    icon: "🎬",
    color: "bg-red-100 text-red-700",
  },
  {
    id: "t4",
    title: "Electric Bill",
    amount: -94.2,
    user: "Emily Rodriguez",
    date: "Last week",
    category: "Utilities",
    icon: "⚡",
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: "t5",
    title: "Freelance Payment",
    amount: 350.0,
    user: "Alex Patel",
    date: "Last week",
    category: "Income",
    icon: "💼",
    color: "bg-indigo-100 text-indigo-700",
  },
];

// Mock platform stats
const platformStats = {
  totalUsers: 158,
  activeUsers: 132,
  totalTransactions: 2784,
  totalRevenue: 285450.75,
  newUsersThisMonth: 24,
  userGrowth: 15.8,
  transactionGrowth: 8.3,
  revenueGrowth: 12.5,
};

// Mock user activity data by day
const userActivityData = [
  { day: "Mon", count: 45 },
  { day: "Tue", count: 52 },
  { day: "Wed", count: 63 },
  { day: "Thu", count: 58 },
  { day: "Fri", count: 69 },
  { day: "Sat", count: 42 },
  { day: "Sun", count: 38 },
];

// Mock recent users
const recentUsers = [
  {
    id: "u1",
    name: "Emma Thompson",
    email: "emma.t@example.com",
    joined: "Today",
    avatar: "👩‍💼",
    isActive: true,
  },
  {
    id: "u2",
    name: "Daniel Brown",
    email: "daniel.b@example.com",
    joined: "Yesterday",
    avatar: "👨‍💻",
    isActive: true,
  },
  {
    id: "u3",
    name: "Olivia Wilson",
    email: "olivia.w@example.com",
    joined: "2 days ago",
    avatar: "👩‍🦰",
    isActive: true,
  },
  {
    id: "u4",
    name: "James Martin",
    email: "james.m@example.com",
    joined: "3 days ago",
    avatar: "👨‍🦱",
    isActive: false,
  },
  {
    id: "u5",
    name: "Sophia Garcia",
    email: "sophia.g@example.com",
    joined: "5 days ago",
    avatar: "👩‍🏫",
    isActive: true,
  },
];

const DashboardPage = () => {
  const [timeframe, setTimeframe] = useState("month");
  const router = useRouter();

  // Format currency values
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 text-transparent bg-clip-text">
            Admin Dashboard
          </h1>
          <p className="text-gray-500">Platform overview and management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select
            defaultValue={timeframe}
            onValueChange={(value) => setTimeframe(value)}
          >
            <SelectTrigger className="w-[180px] border border-gray-200 shadow-sm">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            className="border border-gray-200 shadow-sm"
          >
            <FilterIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="overflow-hidden border-0 shadow-md bg-white transition-all duration-200 hover:shadow-lg">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-400 to-violet-500"></div>
          <CardContent className="p-6 pt-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold mt-1">
                  {platformStats.totalUsers}
                </h3>
              </div>
              <div className="rounded-full p-3 bg-gradient-to-br from-purple-50 to-violet-100 shadow-sm">
                <UsersIcon className="h-5 w-5 text-violet-600" />
              </div>
            </div>
            <div className="mt-5 flex items-center text-sm">
              <TrendingUpIcon className="mr-1 h-4 w-4 text-green-600" />
              <span className="font-medium text-green-600">
                +{platformStats.userGrowth}%
              </span>
              <span className="ml-1 text-gray-500">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-md bg-white transition-all duration-200 hover:shadow-lg">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
          <CardContent className="p-6 pt-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Transactions
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {platformStats.totalTransactions.toLocaleString()}
                </h3>
              </div>
              <div className="rounded-full p-3 bg-gradient-to-br from-emerald-50 to-teal-100 shadow-sm">
                <HistoryIcon className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-5 flex items-center text-sm">
              <TrendingUpIcon className="mr-1 h-4 w-4 text-green-600" />
              <span className="font-medium text-green-600">
                +{platformStats.transactionGrowth}%
              </span>
              <span className="ml-1 text-gray-500">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-md bg-white transition-all duration-200 hover:shadow-lg">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
          <CardContent className="p-6 pt-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Platform Revenue
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {formatCurrency(platformStats.totalRevenue)}
                </h3>
              </div>
              <div className="rounded-full p-3 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-sm">
                <DollarSignIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-5 flex items-center text-sm">
              <TrendingUpIcon className="mr-1 h-4 w-4 text-green-600" />
              <span className="font-medium text-green-600">
                +{platformStats.revenueGrowth}%
              </span>
              <span className="ml-1 text-gray-500">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-md bg-white transition-all duration-200 hover:shadow-lg">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
          <CardContent className="p-6 pt-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">New Users</p>
                <h3 className="text-2xl font-bold mt-1">
                  {platformStats.newUsersThisMonth}
                </h3>
              </div>
              <div className="rounded-full p-3 bg-gradient-to-br from-amber-50 to-orange-100 shadow-sm">
                <PlusIcon className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="mt-5 flex items-center text-sm">
              <span className="text-gray-500">
                {platformStats.activeUsers} active of {platformStats.totalUsers}{" "}
                total
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Left and Center Columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* User Activity Trends */}
          <Card className="border-0 shadow-md overflow-hidden bg-white transition-all duration-200 hover:shadow-lg">
            <CardHeader className="pb-2 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">User Activity</CardTitle>
                  <CardDescription className="mt-1">
                    Active users and engagement metrics
                  </CardDescription>
                </div>
                <Tabs defaultValue="users" className="w-full sm:w-auto">
                  <TabsList className="grid w-full sm:w-[300px] grid-cols-3 bg-gray-100 p-1">
                    <TabsTrigger value="users" className="text-xs">
                      Users
                    </TabsTrigger>
                    <TabsTrigger value="transactions" className="text-xs">
                      Transactions
                    </TabsTrigger>
                    <TabsTrigger value="revenue" className="text-xs">
                      Revenue
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px] w-full rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full">
                  {/* This would be replaced with actual chart */}
                  <div className="absolute bottom-0 inset-x-0 h-[200px] bg-gradient-to-t from-blue-500/10 to-transparent"></div>
                  <div className="absolute bottom-0 inset-x-0 h-[120px] bg-gradient-to-t from-emerald-500/10 to-transparent"></div>

                  {/* Visual representation of user activity data */}
                  <div className="absolute inset-0 flex items-end justify-around px-4 pb-8">
                    {userActivityData.map((item, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className="w-8 bg-gradient-to-t from-violet-500 to-purple-500 rounded-t-md transition-all duration-500 hover:from-violet-400 hover:to-purple-400"
                          style={{ height: `${(item.count / 70) * 180}px` }}
                        ></div>
                        <span className="text-xs mt-2 text-gray-600">
                          {item.day}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Chart overlay */}
                  <div className="absolute top-4 left-4">
                    <h4 className="font-semibold text-gray-700">
                      Weekly User Activity
                    </h4>
                    <p className="text-sm text-gray-500">
                      Total Active Users: {platformStats.activeUsers}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="border-0 shadow-md overflow-hidden bg-white transition-all duration-200 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <CardTitle className="text-xl">Recent Transactions</CardTitle>
                <CardDescription className="mt-1">
                  Latest platform activity across all users
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="shadow-sm gap-1">
                <HistoryIcon className="h-4 w-4" />
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className={cn(
                      "flex items-center justify-between p-4 transition-colors duration-200 hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.color}`}
                      >
                        <span className="text-lg">{transaction.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium">{transaction.title}</p>
                        <p className="text-sm text-gray-500">
                          {transaction.date} •{" "}
                          <span className="text-violet-600">
                            {transaction.user}
                          </span>
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-medium ${
                        transaction.amount > 0 ? "text-green-600" : ""
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 py-3 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/transactions")}
                // 7505
                className="text-sm text-gray-500 cursor-pointer hover:text-gray-900"
              >
                Load More Transactions
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Recent Users */}
          <Card className="border-0 shadow-md overflow-hidden bg-white transition-all duration-200 hover:shadow-lg">
            <CardHeader className="pb-2 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">New Users</CardTitle>
                  <CardDescription className="mt-1">
                    Recently registered accounts
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <UsersIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 transition-colors duration-200 hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-lg">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">
                          {user.joined} • {user.email}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 p-4">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/users")}
                className="w-full cursor-pointer gap-2 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <UsersIcon className="h-4 w-4" />
                View All Users
              </Button>
            </CardFooter>
          </Card>

          {/* Platform Health */}
          <Card className="border-0 shadow-md overflow-hidden bg-white transition-all duration-200 hover:shadow-lg">
            <CardHeader className="pb-2 border-b border-gray-100">
              <CardTitle className="text-xl">Platform Health</CardTitle>
              <CardDescription className="mt-1">
                System status and monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">API Status</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                      Operational
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-green-500 w-[99%]"></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    99.9% uptime in the last 30 days
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Database Load</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                      Normal
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-blue-500 w-[45%]"></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    45% of capacity utilized
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Storage</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-600">
                      Moderate
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-amber-500 w-[72%]"></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    72% of storage capacity used
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
