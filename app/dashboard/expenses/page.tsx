"use client";
import React from "react";
import {
  useGetAllExpensesQuery,
  useDeleteExpenseAdminMutation,
} from "@/app/store/services/admin";
import {
  FilterX,
  Loader2,
  MoreHorizontal,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
  Receipt,
  UserIcon,
  Calendar,
} from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define expense categories array
const EXPENSE_CATEGORIES = [
  "Housing",
  "Transportation",
  "Food",
  "Utilities",
  "Insurance",
  "Healthcare",
  "Savings",
  "Personal",
  "Entertainment",
  "Debt",
  "Education",
  "Gifts/Donations",
  "Travel",
  "Other",
];

// Define filter interface for type safety
interface ExpenseFilters {
  search: string;
  category: string | null;
  userId: string | null;
  minAmount: number;
  maxAmount: number;
  startDate: string;
  endDate: string;
}

// Define pagination settings
const PAGE_SIZES = [5, 10, 25, 50];

// AdminExpense interface for the API response structure
interface AdminExpense {
  _id: string;
  user: {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  amount: number;
  category: string;
  description: string;
  date: string;
  receipt?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// Define the type for the raw API response
interface RawApiExpense {
  _id: string;
  user:
    | string
    | {
        _id: string;
        email: string;
        firstName?: string;
        lastName?: string;
      };
  amount: number;
  category: string;
  description: string;
  date: string;
  receipt?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

const ExpensePage = () => {
  // State for dialogs and filters
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [currentExpense, setCurrentExpense] =
    React.useState<AdminExpense | null>(null);

  // Pagination state
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Initialize date filter with a wide range to accommodate future dates in the sample data
  // const today = new Date();
  const pastDate = new Date(2020, 0, 1); // January 1, 2020
  const futureDate = new Date(2026, 11, 31); // December 31, 2026

  // Filter state with form
  const filterForm = useForm<ExpenseFilters>({
    defaultValues: {
      search: "",
      category: null,
      userId: null,
      minAmount: 0,
      maxAmount: 10000,
      startDate: pastDate.toISOString().split("T")[0],
      endDate: futureDate.toISOString().split("T")[0],
    },
  });

  // State for filter dialog
  const [showFilters, setShowFilters] = React.useState(false);

  const filters = filterForm.watch();

  // Get all unique users from expenses for filter dropdown
  const [uniqueUsers, setUniqueUsers] = React.useState<
    { id: string; name: string }[]
  >([]);

  // Admin-specific operations
  const {
    data: allExpenses = [],
    isLoading: isLoadingAllExpenses,
    refetch: refetchAllExpenses,
  } = useGetAllExpensesQuery();

  // Debug logging
  React.useEffect(() => {
    console.log("API Response (allExpenses):", allExpenses);
  }, [allExpenses]);

  const [deleteExpenseAdmin, { isLoading: isDeletingAdmin }] =
    useDeleteExpenseAdminMutation();

  // Process expenses to ensure they have the right structure
  const adminExpenses = React.useMemo<AdminExpense[]>(() => {
    // Cast to the correct type that handles both string and object user fields
    const processed = (allExpenses as RawApiExpense[]).map((expense) => {
      // Check if expense already has a user object with expected structure
      if (typeof expense.user === "object" && expense.user !== null) {
        // Make sure we have all required user fields
        return {
          ...expense,
          user: {
            _id: expense.user._id || "",
            email: expense.user.email || "unknown@example.com",
            // Add default values for any missing user fields we might want to display
            firstName: expense.user.firstName || "",
            lastName: expense.user.lastName || "",
          },
        } as AdminExpense;
      }

      // If user is just a string ID, create a default user object
      return {
        ...expense,
        user: {
          _id: typeof expense.user === "string" ? expense.user : "unknown",
          email: "unknown@example.com",
          firstName: "",
          lastName: "",
        },
      } as AdminExpense;
    });

    console.log("Processed adminExpenses:", processed);
    return processed;
  }, [allExpenses]);

  // Extract unique users on data load
  React.useEffect(() => {
    if (adminExpenses.length > 0) {
      const userMap = new Map<string, { id: string; name: string }>();

      adminExpenses.forEach((expense) => {
        if (expense.user && !userMap.has(expense.user._id)) {
          // Use email as identifier if name is not available
          const displayName = expense.user.email || "Unknown User";
          userMap.set(expense.user._id, {
            id: expense.user._id,
            name: displayName,
          });
        }
      });

      setUniqueUsers(Array.from(userMap.values()));
    }
  }, [adminExpenses]);

  // Filter expenses based on all filters
  const filteredExpenses = React.useMemo(() => {
    console.log("Current filter settings:", filters);

    const filtered = adminExpenses.filter((expense) => {
      // Text search - look in description, category and user email
      const searchMatch =
        filters.search === "" ||
        expense.description
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        expense.category.toLowerCase().includes(filters.search.toLowerCase()) ||
        expense.user.email.toLowerCase().includes(filters.search.toLowerCase());

      // Category filter
      const categoryMatch =
        filters.category === null ||
        filters.category === "all" ||
        expense.category === filters.category;

      // User filter
      const userMatch =
        filters.userId === null ||
        filters.userId === "all" ||
        expense.user._id === filters.userId;

      // Amount range filter
      const amountMatch =
        expense.amount >= filters.minAmount &&
        expense.amount <= filters.maxAmount;

      // Date range filter
      const expenseDate = new Date(expense.date);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      const dateMatch =
        (!startDate || expenseDate >= startDate) &&
        (!endDate || expenseDate <= endDate);

      // Debug filter conditions for first expense
      if (expense._id === adminExpenses[0]?._id) {
        console.log("Filter debug for first expense:", {
          searchMatch,
          categoryMatch,
          userMatch,
          amountMatch,
          dateMatch,
          expenseDate: expenseDate.toISOString(),
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
        });
      }

      return (
        searchMatch && categoryMatch && userMatch && amountMatch && dateMatch
      );
    });

    console.log("Filtered expenses count:", filtered.length);
    return filtered;
  }, [adminExpenses, filters]);

  // Apply pagination
  const paginatedExpenses = React.useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredExpenses.slice(startIndex, startIndex + pageSize);
  }, [filteredExpenses, page, pageSize]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredExpenses.length / pageSize);

  // Reset page when filters change or page size changes
  React.useEffect(() => {
    setPage(1);
  }, [filters, pageSize]);

  // Handle filter reset
  const handleResetFilters = () => {
    filterForm.reset({
      search: "",
      category: null,
      userId: null,
      minAmount: 0,
      maxAmount: 10000,
      startDate: pastDate.toISOString().split("T")[0],
      endDate: futureDate.toISOString().split("T")[0],
    });
  };

  // Handle expense deletion
  const handleDeleteExpense = async () => {
    if (!currentExpense) return;

    try {
      await deleteExpenseAdmin(currentExpense._id).unwrap();
      toast.success("Expense deleted successfully");
      setIsDeleteDialogOpen(false);
      refetchAllExpenses();
    } catch {
      toast.error("Failed to delete expense");
    }
  };

  // Handle delete expense dialog open
  const handleDeleteExpenseDialog = (expense: AdminExpense) => {
    setCurrentExpense(expense);
    setIsDeleteDialogOpen(true);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy") : "Invalid date";
  };

  // Loading state
  const isLoading = isLoadingAllExpenses;

  // Debug logging
  React.useEffect(() => {
    console.log("Filtered expenses length:", filteredExpenses.length);
    console.log("Paginated expenses:", paginatedExpenses);
  }, [filteredExpenses, paginatedExpenses]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40 mt-2" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Expense Management
          </h1>
          <p className="text-gray-500">
            Manage expenses for all users across the platform
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              refetchAllExpenses();
            }}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Filter Expenses</CardTitle>
            <CardDescription>
              Apply filters to narrow down results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Category</h4>
                <Select
                  value={filters.category || undefined}
                  onValueChange={(value) =>
                    filterForm.setValue("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {EXPENSE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">User</h4>
                <Select
                  value={filters.userId || undefined}
                  onValueChange={(value) =>
                    filterForm.setValue("userId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {uniqueUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Min Amount</h4>
                <Input
                  type="number"
                  placeholder="Minimum"
                  value={filters.minAmount}
                  onChange={(e) =>
                    filterForm.setValue("minAmount", Number(e.target.value))
                  }
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Max Amount</h4>
                <Input
                  type="number"
                  placeholder="Maximum"
                  value={filters.maxAmount}
                  onChange={(e) =>
                    filterForm.setValue("maxAmount", Number(e.target.value))
                  }
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Start Date</h4>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    filterForm.setValue("startDate", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">End Date</h4>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    filterForm.setValue("endDate", e.target.value)
                  }
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-3 flex justify-between">
            <Button variant="outline" onClick={handleResetFilters}>
              <FilterX className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
            <div className="text-xs text-muted-foreground">
              {filteredExpenses.length} expense(s) found
            </div>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center">
              <Receipt className="mr-2 h-5 w-5 text-emerald-500" />
              All Users&apos; Expenses
            </CardTitle>
            <CardDescription>
              Showing {filteredExpenses.length} expense(s)
            </CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search expenses..."
              value={filters.search}
              onChange={(e) => filterForm.setValue("search", e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No expenses found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedExpenses.map((expense) => (
                    <TableRow key={expense._id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {expense.description}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        >
                          {expense.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-gray-400" />
                          <span>{expense.user.email || "Unknown User"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatCurrency(expense.amount)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatDate(expense.date)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[160px]"
                          >
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteExpenseDialog(expense)}
                              disabled={isDeletingAdmin}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <CardFooter className="border-t bg-gray-50/50 px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {filteredExpenses.length > 0
                ? `Showing ${(page - 1) * pageSize + 1}-${Math.min(
                    page * pageSize,
                    filteredExpenses.length
                  )} of ${filteredExpenses.length}`
                : "No results"}
            </p>
          </div>

          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => setPageSize(Number(value))}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZES.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center text-sm font-medium ml-4">
              Page {page} of {totalPages || 1}
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
              >
                Next
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Delete Expense Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Expense</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          {currentExpense && (
            <div className="py-4">
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTitle className="text-yellow-800">
                  You&apos;re about to delete this expense:
                </AlertTitle>
                <AlertDescription className="text-yellow-700">
                  <div className="mt-2">
                    <p>
                      <strong>User:</strong>{" "}
                      {currentExpense.user.email || "Unknown User"}
                    </p>
                    <p>
                      <strong>Description:</strong> {currentExpense.description}
                    </p>
                    <p>
                      <strong>Category:</strong> {currentExpense.category}
                    </p>
                    <p>
                      <strong>Amount:</strong>{" "}
                      {formatCurrency(currentExpense.amount)}
                    </p>
                    <p>
                      <strong>Date:</strong> {formatDate(currentExpense.date)}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteExpense}
              disabled={isDeletingAdmin}
            >
              {isDeletingAdmin && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpensePage;
