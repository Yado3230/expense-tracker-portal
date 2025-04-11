"use client";
import React from "react";
import {
  useGetAllTransactionsQuery,
  useDeleteTransactionAdminMutation,
} from "@/app/store/services/admin";
import {
  FilterX,
  Loader2,
  MoreHorizontal,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
  ArrowDownCircle,
  ArrowUpCircle,
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

// Define transaction categories array
const TRANSACTION_CATEGORIES = [
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
  "Income",
  "Salary",
  "Investment",
  "Other",
];

// Define filter interface for type safety
interface TransactionFilters {
  search: string;
  category: string | null;
  type: string | null;
  userId: string | null;
  minAmount: number;
  maxAmount: number;
  startDate: string;
  endDate: string;
}

// Define pagination settings
const PAGE_SIZES = [5, 10, 25, 50];

// AdminTransaction interface for standardized display
interface AdminTransaction {
  _id: string;
  user: {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// Define the type for the raw API response
interface RawApiTransaction {
  _id: string;
  user:
    | string
    | {
        _id: string;
        email: string;
        firstName?: string;
        lastName?: string;
      };
  type: "Income" | "Expense" | "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

const TransactionPage = () => {
  // State for dialogs and filters
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [currentTransaction, setCurrentTransaction] =
    React.useState<AdminTransaction | null>(null);

  // Pagination state
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Initialize date filter with a wide range to accommodate future dates in the sample data
  const pastDate = new Date(2020, 0, 1); // January 1, 2020
  const futureDate = new Date(2026, 11, 31); // December 31, 2026

  // Filter state with form
  const filterForm = useForm<TransactionFilters>({
    defaultValues: {
      search: "",
      category: null,
      type: null,
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

  // Get all unique users from transactions for filter dropdown
  const [uniqueUsers, setUniqueUsers] = React.useState<
    { id: string; name: string }[]
  >([]);

  // Admin-specific operations
  const {
    data: allTransactions = [],
    isLoading: isLoadingAllTransactions,
    refetch: refetchAllTransactions,
  } = useGetAllTransactionsQuery();

  // Debug logging
  React.useEffect(() => {
    console.log("API Response (allTransactions):", allTransactions);
  }, [allTransactions]);

  const [deleteTransactionAdmin, { isLoading: isDeletingAdmin }] =
    useDeleteTransactionAdminMutation();

  // Process transactions to ensure they have the right structure
  const adminTransactions = React.useMemo<AdminTransaction[]>(() => {
    // Cast to the correct type that handles both string and object user fields
    const processed = (allTransactions as RawApiTransaction[]).map(
      (transaction) => {
        // Standardize type to lowercase for consistent processing
        const normalizedType = transaction.type.toLowerCase() as
          | "income"
          | "expense";

        // Handle user data
        let userData = {
          _id: "",
          email: "unknown@example.com",
          firstName: "",
          lastName: "",
        };

        // Check if transaction already has a user object with expected structure
        if (typeof transaction.user === "object" && transaction.user !== null) {
          userData = {
            _id: transaction.user._id || "",
            email: transaction.user.email || "unknown@example.com",
            firstName: transaction.user.firstName || "",
            lastName: transaction.user.lastName || "",
          };
        } else if (typeof transaction.user === "string") {
          // If user is just a string ID
          userData._id = transaction.user;
        }

        return {
          ...transaction,
          type: normalizedType,
          user: userData,
        } as AdminTransaction;
      }
    );

    console.log("Processed adminTransactions:", processed);
    return processed;
  }, [allTransactions]);

  // Extract unique users on data load
  React.useEffect(() => {
    if (adminTransactions.length > 0) {
      const userMap = new Map<string, { id: string; name: string }>();

      adminTransactions.forEach((transaction) => {
        if (transaction.user && !userMap.has(transaction.user._id)) {
          // Use email as identifier if name is not available
          const displayName = transaction.user.email || "Unknown User";
          userMap.set(transaction.user._id, {
            id: transaction.user._id,
            name: displayName,
          });
        }
      });

      setUniqueUsers(Array.from(userMap.values()));
    }
  }, [adminTransactions]);

  // Filter transactions based on all filters
  const filteredTransactions = React.useMemo(() => {
    console.log("Current filter settings:", filters);

    const filtered = adminTransactions.filter((transaction) => {
      // Text search - look in description, category and user email
      const searchMatch =
        filters.search === "" ||
        transaction.description
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        transaction.category
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        transaction.user.email
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      // Category filter
      const categoryMatch =
        filters.category === null ||
        filters.category === "all" ||
        transaction.category === filters.category;

      // Type filter - compare with the normalized lowercase type
      const typeMatch =
        filters.type === null ||
        filters.type === "all" ||
        transaction.type === filters.type;

      // User filter
      const userMatch =
        filters.userId === null ||
        filters.userId === "all" ||
        transaction.user._id === filters.userId;

      // Amount range filter
      const amountMatch =
        transaction.amount >= filters.minAmount &&
        transaction.amount <= filters.maxAmount;

      // Date range filter
      const transactionDate = new Date(transaction.date);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      const dateMatch =
        (!startDate || transactionDate >= startDate) &&
        (!endDate || transactionDate <= endDate);

      // Debug filter conditions for first transaction
      if (transaction._id === adminTransactions[0]?._id) {
        console.log("Filter debug for first transaction:", {
          searchMatch,
          categoryMatch,
          typeMatch,
          userMatch,
          amountMatch,
          dateMatch,
          transactionDate: transactionDate.toISOString(),
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
        });
      }

      return (
        searchMatch &&
        categoryMatch &&
        typeMatch &&
        userMatch &&
        amountMatch &&
        dateMatch
      );
    });

    console.log("Filtered transactions count:", filtered.length);
    return filtered;
  }, [adminTransactions, filters]);

  // Apply pagination
  const paginatedTransactions = React.useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredTransactions.slice(startIndex, startIndex + pageSize);
  }, [filteredTransactions, page, pageSize]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredTransactions.length / pageSize);

  // Reset page when filters change or page size changes
  React.useEffect(() => {
    setPage(1);
  }, [filters, pageSize]);

  // Handle filter reset
  const handleResetFilters = () => {
    filterForm.reset({
      search: "",
      category: null,
      type: null,
      userId: null,
      minAmount: 0,
      maxAmount: 10000,
      startDate: pastDate.toISOString().split("T")[0],
      endDate: futureDate.toISOString().split("T")[0],
    });
  };

  // Handle transaction deletion
  const handleDeleteTransaction = async () => {
    if (!currentTransaction) return;

    try {
      await deleteTransactionAdmin(currentTransaction._id).unwrap();
      toast.success("Transaction deleted successfully");
      setIsDeleteDialogOpen(false);
      refetchAllTransactions();
    } catch {
      toast.error("Failed to delete transaction");
    }
  };

  // Handle delete transaction dialog open
  const handleDeleteTransactionDialog = (transaction: AdminTransaction) => {
    setCurrentTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  // Format currency
  const formatCurrency = (amount: number, isExpense: boolean = false) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      signDisplay: isExpense ? "negative" : "auto",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy") : "Invalid date";
  };

  // Loading state
  const isLoading = isLoadingAllTransactions;

  // Debug logging
  React.useEffect(() => {
    console.log("Filtered transactions length:", filteredTransactions.length);
    console.log("Paginated transactions:", paginatedTransactions);
  }, [filteredTransactions, paginatedTransactions]);

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
            Transaction Management
          </h1>
          <p className="text-gray-500">
            Manage transactions for all users across the platform
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
              refetchAllTransactions();
            }}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Filter Transactions</CardTitle>
            <CardDescription>
              Apply filters to narrow down results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Type</h4>
                <Select
                  value={filters.type || undefined}
                  onValueChange={(value) => filterForm.setValue("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income" className="text-green-600">
                      <div className="flex items-center">
                        <ArrowDownCircle className="h-3.5 w-3.5 mr-2 text-green-600" />
                        Income
                      </div>
                    </SelectItem>
                    <SelectItem value="expense" className="text-red-600">
                      <div className="flex items-center">
                        <ArrowUpCircle className="h-3.5 w-3.5 mr-2 text-red-600" />
                        Expense
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                    {TRANSACTION_CATEGORIES.map((category) => (
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
              {filteredTransactions.length} transaction(s) found
            </div>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center">
              {filters.type === "income" ? (
                <ArrowDownCircle className="mr-2 h-5 w-5 text-green-500" />
              ) : filters.type === "expense" ? (
                <ArrowUpCircle className="mr-2 h-5 w-5 text-red-500" />
              ) : (
                <>
                  <ArrowDownCircle className="mr-2 h-5 w-5 text-green-500" />
                  <ArrowUpCircle className="mr-2 h-5 w-5 text-red-500" />
                </>
              )}
              All Users&apos; Transactions
            </CardTitle>
            <CardDescription>
              Showing {filteredTransactions.length} transaction(s)
            </CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
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
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTransactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            transaction.type === "income"
                              ? "bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                              : "bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                          }
                        >
                          {transaction.type === "income" ? (
                            <ArrowDownCircle className="h-3 w-3 mr-1 inline text-green-600" />
                          ) : (
                            <ArrowUpCircle className="h-3 w-3 mr-1 inline text-red-600" />
                          )}
                          {transaction.type.charAt(0).toUpperCase() +
                            transaction.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {transaction.description}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          {transaction.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-gray-400" />
                          <span>
                            {transaction.user.email || "Unknown User"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={
                            transaction.type === "income"
                              ? "font-medium text-green-600"
                              : "font-medium text-red-600"
                          }
                        >
                          {transaction.type === "income"
                            ? formatCurrency(transaction.amount)
                            : formatCurrency(transaction.amount, true)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatDate(transaction.date)}
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
                              onClick={() =>
                                handleDeleteTransactionDialog(transaction)
                              }
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
              {filteredTransactions.length > 0
                ? `Showing ${(page - 1) * pageSize + 1}-${Math.min(
                    page * pageSize,
                    filteredTransactions.length
                  )} of ${filteredTransactions.length}`
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

      {/* Delete Transaction Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {currentTransaction && (
            <div className="py-4">
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTitle className="text-yellow-800">
                  You&apos;re about to delete this transaction:
                </AlertTitle>
                <AlertDescription className="text-yellow-700">
                  <div className="mt-2">
                    <p>
                      <strong>User:</strong>{" "}
                      {currentTransaction.user.email || "Unknown User"}
                    </p>
                    <p>
                      <strong>Type:</strong>{" "}
                      <span
                        className={
                          currentTransaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {currentTransaction.type === "income" ? (
                          <ArrowDownCircle className="h-3.5 w-3.5 mr-1 inline" />
                        ) : (
                          <ArrowUpCircle className="h-3.5 w-3.5 mr-1 inline" />
                        )}
                        {currentTransaction.type.charAt(0).toUpperCase() +
                          currentTransaction.type.slice(1)}
                      </span>
                    </p>
                    <p>
                      <strong>Description:</strong>{" "}
                      {currentTransaction.description}
                    </p>
                    <p>
                      <strong>Category:</strong> {currentTransaction.category}
                    </p>
                    <p>
                      <strong>Amount:</strong>{" "}
                      <span
                        className={
                          currentTransaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {currentTransaction.type === "income"
                          ? formatCurrency(currentTransaction.amount)
                          : formatCurrency(currentTransaction.amount, true)}
                      </span>
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {formatDate(currentTransaction.date)}
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
              onClick={handleDeleteTransaction}
              disabled={isDeletingAdmin}
            >
              {isDeletingAdmin && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionPage;
