"use client";
import React from "react";
import {
  useGetAllBudgetsQuery,
  useDeleteBudgetAdminMutation,
  AdminBudget,
} from "@/app/store/services/admin";
import {
  FilterX,
  Loader2,
  MoreHorizontal,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
  WalletIcon,
  UserIcon,
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

// Define budget categories array
const BUDGET_CATEGORIES = [
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
interface BudgetFilters {
  search: string;
  category: string | null;
  userId: string | null;
  minBudget: number;
  maxBudget: number;
}

// Define pagination settings
const PAGE_SIZES = [5, 10, 25, 50];

const BudgetPage = () => {
  // State for dialogs and filters
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [currentBudget, setCurrentBudget] = React.useState<AdminBudget | null>(
    null
  );

  // Pagination state
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Filter state with form
  const filterForm = useForm<BudgetFilters>({
    defaultValues: {
      search: "",
      category: null,
      userId: null,
      minBudget: 0,
      maxBudget: 10000,
    },
  });

  // State for filter dialog
  const [showFilters, setShowFilters] = React.useState(false);

  const filters = filterForm.watch();

  // Get all unique users from budgets for filter dropdown
  const [uniqueUsers, setUniqueUsers] = React.useState<
    { id: string; name: string }[]
  >([]);

  // Admin-specific operations
  const {
    data: allBudgets = [],
    isLoading: isLoadingAllBudgets,
    refetch: refetchAllBudgets,
  } = useGetAllBudgetsQuery();

  const [deleteBudgetAdmin, { isLoading: isDeletingAdmin }] =
    useDeleteBudgetAdminMutation();

  // Extract unique users on data load
  React.useEffect(() => {
    if (allBudgets.length > 0) {
      const userMap = new Map<string, { id: string; name: string }>();

      allBudgets.forEach((budget) => {
        if (!userMap.has(budget.user._id)) {
          userMap.set(budget.user._id, {
            id: budget.user._id,
            name: `${budget.user.firstName} ${budget.user.lastName}`,
          });
        }
      });

      setUniqueUsers(Array.from(userMap.values()));
    }
  }, [allBudgets]);

  // Filter budgets based on all filters
  const filteredBudgets = React.useMemo(() => {
    return allBudgets.filter((budget) => {
      // Text search - look in category and user name
      const searchMatch =
        filters.search === "" ||
        budget.category.toLowerCase().includes(filters.search.toLowerCase()) ||
        `${budget.user.firstName} ${budget.user.lastName}`
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      // Category filter
      const categoryMatch =
        filters.category === null ||
        filters.category === "all" ||
        budget.category === filters.category;

      // User filter
      const userMatch =
        filters.userId === null ||
        filters.userId === "all" ||
        budget.user._id === filters.userId;

      // Budget range filter
      const budgetMatch =
        budget.limit >= filters.minBudget && budget.limit <= filters.maxBudget;

      return searchMatch && categoryMatch && userMatch && budgetMatch;
    });
  }, [allBudgets, filters]);

  // Apply pagination
  const paginatedBudgets = React.useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredBudgets.slice(startIndex, startIndex + pageSize);
  }, [filteredBudgets, page, pageSize]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredBudgets.length / pageSize);

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
      minBudget: 0,
      maxBudget: 10000,
    });
  };

  // Handle budget deletion
  const handleDeleteBudget = async () => {
    if (!currentBudget) return;

    try {
      await deleteBudgetAdmin(currentBudget._id).unwrap();
      toast.success("Budget deleted successfully");
      setIsDeleteDialogOpen(false);
      refetchAllBudgets();
    } catch {
      toast.error("Failed to delete budget");
    }
  };

  // Handle delete budget dialog open
  const handleDeleteBudgetDialog = (budget: AdminBudget) => {
    setCurrentBudget(budget);
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
  const isLoading = isLoadingAllBudgets;

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
            Budget Management
          </h1>
          <p className="text-gray-500">
            Manage budgets for all users across the platform
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
              refetchAllBudgets();
            }}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Filter Budgets</CardTitle>
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
                    {BUDGET_CATEGORIES.map((category) => (
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
                <h4 className="font-medium text-sm">Min Budget</h4>
                <Input
                  type="number"
                  placeholder="Minimum"
                  value={filters.minBudget}
                  onChange={(e) =>
                    filterForm.setValue("minBudget", Number(e.target.value))
                  }
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Max Budget</h4>
                <Input
                  type="number"
                  placeholder="Maximum"
                  value={filters.maxBudget}
                  onChange={(e) =>
                    filterForm.setValue("maxBudget", Number(e.target.value))
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
              {filteredBudgets.length} budget(s) found
            </div>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center">
              <WalletIcon className="mr-2 h-5 w-5 text-purple-500" />
              All Users&apos; Budgets
            </CardTitle>
            <CardDescription>
              Showing {filteredBudgets.length} budget(s)
            </CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search budgets..."
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
                  <TableHead>Category</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Budget Limit</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBudgets.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No budgets found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedBudgets.map((budget) => (
                    <TableRow key={budget._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-purple-50 text-purple-700 hover:bg-purple-100"
                          >
                            {budget.category}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-gray-400" />
                          <span>
                            {budget.user.firstName} {budget.user.lastName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatCurrency(budget.limit)}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(budget.startDate)}</TableCell>
                      <TableCell>{formatDate(budget.endDate)}</TableCell>
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
                              onClick={() => handleDeleteBudgetDialog(budget)}
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
              {filteredBudgets.length > 0
                ? `Showing ${(page - 1) * pageSize + 1}-${Math.min(
                    page * pageSize,
                    filteredBudgets.length
                  )} of ${filteredBudgets.length}`
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

      {/* Delete Budget Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Budget</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this budget? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          {currentBudget && (
            <div className="py-4">
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTitle className="text-yellow-800">
                  You&apos;re about to delete this budget:
                </AlertTitle>
                <AlertDescription className="text-yellow-700">
                  <div className="mt-2">
                    <p>
                      <strong>User:</strong> {currentBudget.user.firstName}{" "}
                      {currentBudget.user.lastName}
                    </p>
                    <p>
                      <strong>Category:</strong> {currentBudget.category}
                    </p>
                    <p>
                      <strong>Budget Limit:</strong>{" "}
                      {formatCurrency(currentBudget.limit)}
                    </p>
                    <p>
                      <strong>Period:</strong>{" "}
                      {formatDate(currentBudget.startDate)} to{" "}
                      {formatDate(currentBudget.endDate)}
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
              onClick={handleDeleteBudget}
              disabled={isDeletingAdmin}
            >
              {isDeletingAdmin && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BudgetPage;
