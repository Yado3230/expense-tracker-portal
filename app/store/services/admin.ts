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
