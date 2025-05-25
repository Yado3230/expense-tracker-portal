"use client";
import React from "react";
import {
  useGetTransactionsQuery,
  TransactionFilters,
  Transaction,
} from "@/app/store/services/transaction";
import { useDeleteTransactionAdminMutation } from "@/app/store/services/admin";
import { format, isValid, parseISO } from "date-fns";
import {
  RefreshCw,
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  Search,
  SlidersHorizontal,
  FilterX,
  Trash2,
  MoreHorizontal,
  Loader2,
  Download,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define pagination settings
const PAGE_SIZES = [5, 10, 25, 50];

const TransactionPage = () => {
  // State for dialogs
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [currentTransaction, setCurrentTransaction] =
    React.useState<Transaction | null>(null);

  // Pagination state
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  // State for filter dialog
  const [showFilters, setShowFilters] = React.useState(false);

  // Filter state with form
  const filterForm = useForm<TransactionFilters>({
    defaultValues: {
      page: 0,
      size: 10,
      query: "",
      minAmount: undefined,
      maxAmount: undefined,
      startDate: "",
      endDate: "",
      category: undefined,
      type: undefined,
      id: undefined,
    },
  });

  const filters = filterForm.watch();

  // Update filters when pagination changes
  React.useEffect(() => {
    filterForm.setValue("page", page);
    filterForm.setValue("size", pageSize);
  }, [page, pageSize, filterForm]);

  // Fetch transactions with filters
  const { data, isLoading, refetch } = useGetTransactionsQuery({
    ...filters,
    page,
    size: pageSize,
  });

  // Delete transaction mutation
  const [deleteTransaction, { isLoading: isDeleting }] =
    useDeleteTransactionAdminMutation();

  const transactions = data?.content || [];
  const pagination = data?.page;

  // Reset page when filters change
  React.useEffect(() => {
    setPage(0);
  }, [
    filters.query,
    filters.minAmount,
    filters.maxAmount,
    filters.startDate,
    filters.endDate,
    filters.category,
    filters.type,
  ]);

  // Handle filter reset
  const handleResetFilters = () => {
    filterForm.reset({
      page: 0,
      size: pageSize,
      query: "",
      minAmount: undefined,
      maxAmount: undefined,
      startDate: "",
      endDate: "",
      category: undefined,
      type: undefined,
      id: undefined,
    });
    setPage(0);
  };

  // Handle delete transaction
  const handleDeleteTransaction = async () => {
    if (!currentTransaction) return;

    try {
      await deleteTransaction(currentTransaction._id).unwrap();
      toast.success("Transaction deleted successfully");
      setIsDeleteDialogOpen(false);
      refetch();
    } catch {
      toast.error("Failed to delete transaction");
    }
  };

  // Handle delete transaction dialog open
  const handleDeleteTransactionDialog = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
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

  // Function to export transactions data
  const exportTransactions = () => {
    // Create CSV header
    const headers = [
      "Type",
      "Title",
      "Description",
      "Category",
      "Amount",
      "Date",
      "User",
    ];

    // Create CSV content
    let csvContent = headers.join(",") + "\n";

    transactions.forEach((transaction) => {
      const row = [
        transaction.type,
        transaction.title,
        transaction.description || "",
        transaction.category.name,
        transaction.amount.toString(),
        formatDate(transaction.date),
        `${transaction.user.firstName} ${transaction.user.lastName}`,
      ];

      // Escape fields that might contain commas
      const escapedRow = row.map((field) => {
        if (
          field.includes(",") ||
          field.includes('"') ||
          field.includes("\n")
        ) {
          return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
      });

      csvContent += escapedRow.join(",") + "\n";
    });

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `transactions-export-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-gray-500">View and filter transaction history</p>
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
            size="sm"
            onClick={() => refetch()}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={exportTransactions}
            className="flex items-center gap-1"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
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
                  value={filters.type || "all"}
                  onValueChange={(value) =>
                    filterForm.setValue(
                      "type",
                      value === "all"
                        ? undefined
                        : (value as "Expense" | "Income")
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Income" className="text-green-600">
                      <div className="flex items-center">
                        <ArrowDownCircle className="h-3.5 w-3.5 mr-2 text-green-600" />
                        Income
                      </div>
                    </SelectItem>
                    <SelectItem value="Expense" className="text-red-600">
                      <div className="flex items-center">
                        <ArrowUpCircle className="h-3.5 w-3.5 mr-2 text-red-600" />
                        Expense
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Search</h4>
                <Input
                  type="text"
                  placeholder="Search transactions..."
                  value={filters.query || ""}
                  onChange={(e) => filterForm.setValue("query", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Min Amount</h4>
                <Input
                  type="number"
                  placeholder="Minimum"
                  value={filters.minAmount || ""}
                  onChange={(e) =>
                    filterForm.setValue(
                      "minAmount",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Max Amount</h4>
                <Input
                  type="number"
                  placeholder="Maximum"
                  value={filters.maxAmount || ""}
                  onChange={(e) =>
                    filterForm.setValue(
                      "maxAmount",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Start Date</h4>
                <Input
                  type="date"
                  value={filters.startDate || ""}
                  onChange={(e) =>
                    filterForm.setValue("startDate", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">End Date</h4>
                <Input
                  type="date"
                  value={filters.endDate || ""}
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
              {pagination?.totalElements || 0} transaction(s) found
            </div>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center">
              <ArrowDownCircle className="mr-2 h-5 w-5 text-green-500" />
              <ArrowUpCircle className="mr-2 h-5 w-5 text-red-500" />
              Transaction History
            </CardTitle>
            <CardDescription>
              Showing {pagination?.totalElements || 0} transaction(s)
            </CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Quick search..."
              value={filters.query || ""}
              onChange={(e) => filterForm.setValue("query", e.target.value)}
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
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            transaction.type === "Income"
                              ? "bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                              : "bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                          }
                        >
                          {transaction.type === "Income" ? (
                            <ArrowDownCircle className="h-3 w-3 mr-1 inline text-green-600" />
                          ) : (
                            <ArrowUpCircle className="h-3 w-3 mr-1 inline text-red-600" />
                          )}
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.title}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {transaction.description}
                      </TableCell>
                      <TableCell>
                        <div
                          className="w-2 h-2 rounded-full inline-block mr-2"
                          style={{
                            backgroundColor: transaction.category.color,
                          }}
                        ></div>
                        <span>{transaction.category.name}</span>
                      </TableCell>
                      <TableCell>
                        <div
                          className={
                            transaction.type === "Income"
                              ? "font-medium text-green-600"
                              : "font-medium text-red-600"
                          }
                        >
                          {formatCurrency(transaction.amount)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatDate(transaction.date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {transaction.user.firstName} {transaction.user.lastName}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleDeleteTransactionDialog(transaction)
                              }
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Transaction
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
              {pagination && pagination.totalElements > 0
                ? `Showing ${page * pageSize + 1}-${Math.min(
                    (page + 1) * pageSize,
                    pagination.totalElements
                  )} of ${pagination.totalElements}`
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
              Page {page + 1} of {pagination?.totalPages || 1}
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((p) =>
                    Math.min((pagination?.totalPages || 1) - 1, p + 1)
                  )
                }
                disabled={
                  page === (pagination?.totalPages || 1) - 1 ||
                  pagination?.totalPages === 0
                }
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
                      <strong>Title:</strong> {currentTransaction.title}
                    </p>
                    <p>
                      <strong>Type:</strong>{" "}
                      <span
                        className={
                          currentTransaction.type === "Income"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {currentTransaction.type === "Income" ? (
                          <ArrowDownCircle className="h-3.5 w-3.5 mr-1 inline" />
                        ) : (
                          <ArrowUpCircle className="h-3.5 w-3.5 mr-1 inline" />
                        )}
                        {currentTransaction.type}
                      </span>
                    </p>
                    <p>
                      <strong>Description:</strong>{" "}
                      {currentTransaction.description}
                    </p>
                    <p>
                      <strong>Category:</strong>{" "}
                      {currentTransaction.category.name}
                    </p>
                    <p>
                      <strong>Amount:</strong>{" "}
                      <span
                        className={
                          currentTransaction.type === "Income"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {formatCurrency(currentTransaction.amount)}
                      </span>
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {formatDate(currentTransaction.date)}
                    </p>
                    <p>
                      <strong>User:</strong> {currentTransaction.user.firstName}{" "}
                      {currentTransaction.user.lastName}
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
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionPage;
