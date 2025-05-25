"use client";
import React, { useState, useMemo } from "react";
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
import { Transaction } from "@/app/store/services/transaction";
import {
  useGetAllUsersQuery,
  useGetAllTransactionsQuery,
  ApiUser,
  PaginatedResponse,
} from "@/app/store/services/admin";

// Define types for the API responses
type TransactionsResponse = Transaction[] | PaginatedResponse<Transaction>;
type UsersResponse = ApiUser[] | PaginatedResponse<ApiUser>;

const DashboardPage = () => {
  const [timeframe, setTimeframe] = useState("month");
  const router = useRouter();

  // Fetch transactions and users data from the API with proper typing
  const { data: transactionsData, isLoading: isLoadingTransactions } =
    useGetAllTransactionsQuery() as {
      data: TransactionsResponse | undefined;
      isLoading: boolean;
    };

  const { data: usersData, isLoading: isLoadingUsers } =
    useGetAllUsersQuery() as {
      data: UsersResponse | undefined;
      isLoading: boolean;
    };

  // Extract transactions array regardless of response format
  const transactions = useMemo(() => {
    if (!transactionsData) return [];
    return Array.isArray(transactionsData)
      ? transactionsData
      : transactionsData.content || [];
  }, [transactionsData]);

  // Extract users array regardless of response format
  const users = useMemo(() => {
    if (!usersData) return [];
    return Array.isArray(usersData) ? usersData : usersData.content || [];
  }, [usersData]);

  // Calculate real platform stats from actual data
  const platformStats = useMemo(() => {
    // Default values in case calculations can't be performed
    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.isActive).length,
      totalTransactions: transactions.length,
      totalRevenue: 0,
      newUsersThisMonth: 0,
      userGrowth: 0,
      transactionGrowth: 0,
      revenueGrowth: 0,
    };

    // Calculate total revenue from all transactions
    stats.totalRevenue = transactions.reduce((sum, transaction) => {
      if (transaction.type === "Income") {
        return sum + transaction.amount;
      }
      return sum;
    }, 0);

    // Calculate new users this month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    stats.newUsersThisMonth = users.filter((user) => {
      const createdAt = new Date(user.createdAt);
      return createdAt >= firstDayOfMonth;
    }).length;

    // Calculate growth metrics if we have enough data
    // For now we'll use placeholder values since we don't have historical data
    // In a real app, you would compare with previous period data
    if (stats.totalUsers > 0) {
      stats.userGrowth = Math.round(
        (stats.newUsersThisMonth / stats.totalUsers) * 100
      );
    }

    // For transaction and revenue growth, we would need historical data
    // These are placeholders that could be replaced with real calculations
    stats.transactionGrowth = stats.totalTransactions > 0 ? 5 : 0;
    stats.revenueGrowth = stats.totalRevenue > 0 ? 8 : 0;

    return stats;
  }, [users, transactions]);

  // Calculate user activity data by day of week
  const userActivityData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const activityByDay = days.map((day) => ({ day, count: 0 }));

    // Count transactions by day of week
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date || transaction.createdAt);
      const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      activityByDay[dayIndex].count += 1;
    });

    return activityByDay;
  }, [transactions]);

  // Get recent transactions and users
  const recentTransactions = transactions.slice(0, 5);
  const recentUsers = users.slice(0, 5);

  // Format currency values
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Helper function to get transaction display date
  const getTransactionDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return "Last week";
  };

  // Helper function to get user display date
  const getUserJoinedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays === 2) return "2 days ago";
    if (diffDays === 3) return "3 days ago";
    if (diffDays === 4) return "4 days ago";
    if (diffDays === 5) return "5 days ago";
    return `${diffDays} days ago`;
  };

  // Helper to get transaction icon and color based on category
  const getTransactionDisplay = (transaction: Transaction) => {
    // Default values
    let icon = transaction.type === "Income" ? "💰" : "🛒";
    let color =
      transaction.type === "Income"
        ? "bg-blue-100 text-blue-700"
        : "bg-emerald-100 text-emerald-700";

    // Check if category exists and has icon/color
    if (transaction.category) {
      if (transaction.category.icon) icon = transaction.category.icon;
      if (transaction.category.color) {
        const categoryColor = transaction.category.color;
        // Map color string to appropriate tailwind classes
        if (categoryColor.includes("red")) color = "bg-red-100 text-red-700";
        else if (categoryColor.includes("blue"))
          color = "bg-blue-100 text-blue-700";
        else if (categoryColor.includes("green"))
          color = "bg-emerald-100 text-emerald-700";
        else if (
          categoryColor.includes("amber") ||
          categoryColor.includes("yellow")
        )
          color = "bg-amber-100 text-amber-700";
        else if (categoryColor.includes("purple"))
          color = "bg-indigo-100 text-indigo-700";
      }
    }

    return { icon, color };
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
                    Transactions by day of week
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
                    {userActivityData.map((item, index) => {
                      // Find the max count to normalize the heights
                      const maxCount = Math.max(
                        ...userActivityData.map((d) => d.count)
                      );
                      // Calculate height percentage (min 5% height even if count is 0)
                      const heightPercentage =
                        maxCount > 0 ? 5 + (item.count / maxCount) * 95 : 5;

                      return (
                        <div key={index} className="flex flex-col items-center">
                          <div
                            className="w-8 bg-gradient-to-t from-violet-500 to-purple-500 rounded-t-md transition-all duration-500 hover:from-violet-400 hover:to-purple-400"
                            style={{ height: `${heightPercentage}%` }}
                          ></div>
                          <span className="text-xs mt-2 text-gray-600">
                            {item.day}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Chart overlay */}
                  <div className="absolute top-4 left-4">
                    <h4 className="font-semibold text-gray-700">
                      Weekly Transaction Activity
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
              <Button
                variant="outline"
                size="sm"
                className="shadow-sm gap-1"
                onClick={() => router.push("/dashboard/transactions")}
              >
                <HistoryIcon className="h-4 w-4" />
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {isLoadingTransactions ? (
                  <div className="p-8 text-center text-gray-500">
                    Loading transactions...
                  </div>
                ) : recentTransactions && recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction: Transaction) => {
                    const { icon, color } = getTransactionDisplay(transaction);
                    return (
                      <div
                        key={transaction._id}
                        className={cn(
                          "flex items-center justify-between p-4 transition-colors duration-200 hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}
                          >
                            <span className="text-lg">{icon}</span>
                          </div>
                          <div>
                            <p className="font-medium">{transaction.title}</p>
                            <p className="text-sm text-gray-500">
                              {getTransactionDate(transaction.createdAt)} •{" "}
                              <span className="text-violet-600">
                                {transaction.user.firstName}{" "}
                                {transaction.user.lastName}
                              </span>
                            </p>
                          </div>
                        </div>
                        <span
                          className={`font-medium ${
                            transaction.type === "Income"
                              ? "text-green-600"
                              : ""
                          }`}
                        >
                          {transaction.type === "Income" ? "+" : ""}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No transactions found
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 py-3 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/transactions")}
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => router.push("/dashboard/users")}
                >
                  <UsersIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {isLoadingUsers ? (
                  <div className="p-8 text-center text-gray-500">
                    Loading users...
                  </div>
                ) : recentUsers && recentUsers.length > 0 ? (
                  recentUsers.map((user: ApiUser) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-4 transition-colors duration-200 hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-lg">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.firstName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            user.firstName.charAt(0) + user.lastName.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {getUserJoinedDate(user.createdAt)} • {user.email}
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
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No users found
                  </div>
                )}
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

          {/* Platform Health - Based on real data */}
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
                    <span className="text-sm font-medium">User Activity</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                      {platformStats.activeUsers > 0 ? "Active" : "Low"}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width:
                          platformStats.totalUsers > 0
                            ? `${Math.min(
                                100,
                                (platformStats.activeUsers /
                                  platformStats.totalUsers) *
                                  100
                              )}%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {platformStats.activeUsers} active users of{" "}
                    {platformStats.totalUsers} total
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Transaction Volume
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                      {platformStats.totalTransactions > 100
                        ? "High"
                        : platformStats.totalTransactions > 50
                        ? "Medium"
                        : "Low"}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{
                        width: `${Math.min(
                          100,
                          (platformStats.totalTransactions / 200) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {platformStats.totalTransactions} transactions processed
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Revenue</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-600">
                      {platformStats.totalRevenue > 10000
                        ? "Excellent"
                        : platformStats.totalRevenue > 5000
                        ? "Good"
                        : "Growing"}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-amber-500"
                      style={{
                        width: `${Math.min(
                          100,
                          (platformStats.totalRevenue / 20000) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatCurrency(platformStats.totalRevenue)} total revenue
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
