import { api } from "./api";
import { Budget as BaseBudget } from "./budget";
import { Expense } from "./expenseApi";
import { Transaction } from "./transaction";

// Define API response user type that uses _id
export interface ApiUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  image?: string | null;
  language?: string;
  isVerified?: boolean;
}

// Define paginated response interface
export interface PaginatedResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

// Define user filter params
export interface UserFilterParams {
  page?: number;
  size?: number;
  query?: string;
  role?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  id?: string;
}

// Define admin budget with nested user object
export interface AdminBudget extends Omit<BaseBudget, "user"> {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface UpdateUserRoleRequest {
  role: "admin" | "user";
}

export interface UpdateUserRoleResponse {
  message: string;
  user: {
    _id: string;
    role: string;
  };
}

export interface MessageResponse {
  message: string;
}

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // User Management
    getAllUsers: builder.query<ApiUser[], void>({
      query: () => "/api/users/all",
      providesTags: ["User"],
    }),
    getUsers: builder.query<PaginatedResponse<ApiUser>, UserFilterParams>({
      query: (params) => {
        // Build query string from params
        const queryParams = new URLSearchParams();
        if (params.page !== undefined)
          queryParams.append("page", params.page.toString());
        if (params.size !== undefined)
          queryParams.append("size", params.size.toString());
        if (params.query) queryParams.append("query", params.query);
        if (params.role) queryParams.append("role", params.role);
        if (params.isActive !== undefined)
          queryParams.append("isActive", params.isActive.toString());
        if (params.startDate) queryParams.append("startDate", params.startDate);
        if (params.endDate) queryParams.append("endDate", params.endDate);
        if (params.id) queryParams.append("id", params.id);

        return `/api/users?${queryParams.toString()}`;
      },
      providesTags: ["User"],
    }),
    deleteUser: builder.mutation<MessageResponse, string>({
      query: (userId) => ({
        url: `/api/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updateUserRole: builder.mutation<
      UpdateUserRoleResponse,
      { userId: string; data: UpdateUserRoleRequest }
    >({
      query: ({ userId, data }) => ({
        url: `/api/users/${userId}/role`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deactivateUser: builder.mutation<MessageResponse, string>({
      query: (userId) => ({
        url: `/api/users/${userId}/deactivate`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),
    activateUser: builder.mutation<MessageResponse, string>({
      query: (userId) => ({
        url: `/api/users/${userId}/activate`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),

    // Budget Management (Admin)
    getAllBudgets: builder.query<AdminBudget[], void>({
      query: () => "/api/budgets/admin/all",
      providesTags: ["Budget"],
    }),
    deleteBudgetAdmin: builder.mutation<MessageResponse, string>({
      query: (budgetId) => ({
        url: `/api/budgets/admin/${budgetId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Budget"],
    }),

    // Expense Management (Admin)
    getAllExpenses: builder.query<Expense[], void>({
      query: () => "/api/expenses/admin/all",
      providesTags: ["Expense"],
    }),
    deleteExpenseAdmin: builder.mutation<MessageResponse, string>({
      query: (expenseId) => ({
        url: `/api/expenses/admin/${expenseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expense"],
    }),

    // Transaction Management (Admin)
    getAllTransactions: builder.query<Transaction[], void>({
      query: () => "/api/transactions/admin",
      providesTags: ["Transaction"],
    }),
    deleteTransactionAdmin: builder.mutation<MessageResponse, string>({
      query: (transactionId) => ({
        url: `/api/transactions/admin/${transactionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transaction"],
    }),
  }),
});

export const {
  // User Management
  useGetAllUsersQuery,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
  useDeactivateUserMutation,
  useActivateUserMutation,

  // Budget Management
  useGetAllBudgetsQuery,
  useDeleteBudgetAdminMutation,

  // Expense Management
  useGetAllExpensesQuery,
  useDeleteExpenseAdminMutation,

  // Transaction Management
  useGetAllTransactionsQuery,
  useDeleteTransactionAdminMutation,
} = adminApi;
