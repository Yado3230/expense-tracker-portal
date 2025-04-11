"use client";
import React from "react";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
  useDeactivateUserMutation,
  useActivateUserMutation,
  ApiUser,
} from "@/app/store/services/admin";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCog,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";

// DataTable imports
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const UserPage = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { data: users = [], isLoading, refetch } = useGetAllUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUserRole, { isLoading: isUpdatingRole }] =
    useUpdateUserRoleMutation();
  const [deactivateUser, { isLoading: isDeactivating }] =
    useDeactivateUserMutation();
  const [activateUser, { isLoading: isActivating }] = useActivateUserMutation();

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId).unwrap();
      toast.success("User deleted successfully");
      refetch();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleUpdateRole = async (
    userId: string,
    currentRole: string = "user"
  ) => {
    try {
      if (!userId || userId === "undefined") {
        toast.error("Invalid user ID");
        return;
      }

      const newRole = currentRole === "user" ? "admin" : "user";
      await updateUserRole({ userId, data: { role: newRole } }).unwrap();
      toast.success(`User role updated to ${newRole}`);
      refetch();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update user role");
    }
  };

  const handleToggleUserStatus = async (
    userId: string,
    isActive: boolean = false
  ) => {
    try {
      if (!userId || userId === "undefined") {
        toast.error("Invalid user ID");
        return;
      }

      if (isActive) {
        await deactivateUser(userId).unwrap();
        toast.success("User deactivated successfully");
      } else {
        await activateUser(userId).unwrap();
        toast.success("User activated successfully");
      }
      refetch();
    } catch {
      toast.error(`Failed to ${isActive ? "deactivate" : "activate"} user`);
    }
  };

  const getRoleBadge = (role: string = "user") => {
    switch (role) {
      case "admin":
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <ShieldAlert className="w-3 h-3 mr-1" />
            Admin
          </div>
        );
      case "user":
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Shield className="w-3 h-3 mr-1" />
            User
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <ShieldCheck className="w-3 h-3 mr-1" />
            {role}
          </div>
        );
    }
  };

  const getStatusBadge = (isActive: boolean = false) => {
    return (
      <div
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </div>
    );
  };

  // Format date from ISO string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Column definitions
  const columns: ColumnDef<ApiUser>[] = [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => {
        const user = row.original;
        const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(
          0
        )}`.toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-gray-200">
              <AvatarFallback className="bg-gray-100 text-gray-600">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">
                {`${user.firstName} ${user.lastName}`}
              </span>
              <span className="text-sm text-gray-500">{user.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => getRoleBadge(row.original.role),
    },
    {
      accessorKey: "currency",
      header: "Currency",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.currency || "N/A"}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.isActive),
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => {
        return row.original.createdAt
          ? formatDate(row.original.createdAt)
          : "N/A";
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        const isLoading =
          isDeleting || isUpdatingRole || isDeactivating || isActivating;

        return (
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isLoading}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleUpdateRole(user._id, user.role)}
                >
                  <UserCog className="h-4 w-4 mr-2" />
                  {user.role === "admin"
                    ? "Demote to User"
                    : "Promote to Admin"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleToggleUserStatus(user._id, user.isActive)
                  }
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {user.isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  // Define fullName for filtering (firstName + lastName)
  const getUserFullName = (user: ApiUser) =>
    `${user.firstName} ${user.lastName}`.toLowerCase();

  // Set up global filter function
  const filterUsers = (users: ApiUser[], query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return users.filter(
      (user) =>
        getUserFullName(user).includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery)
    );
  };

  // State for custom search
  const [searchQuery, setSearchQuery] = React.useState("");
  const filteredUsers = React.useMemo(
    () => filterUsers(users, searchQuery),
    [users, searchQuery, filterUsers]
  );

  const table = useReactTable({
    data: filteredUsers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-gray-500">
            Manage your organization&apos;s users, roles, and permissions
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </Button>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="px-6 py-5 border-b bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UsersRound className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-lg font-medium">Users</CardTitle>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <div className="border-t bg-white p-2">
          <DataTablePagination table={table} />
        </div>
      </Card>
    </div>
  );
};

export default UserPage;
