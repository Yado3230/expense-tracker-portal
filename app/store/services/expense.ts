import { api } from "./api";

export interface Expense {
  _id: string;
  user: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  receipt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseRequest {
  amount: number;
  category: string;
  description: string;
  date: string;
  receipt?: string;
}

export interface UpdateExpenseRequest {
  amount?: number;
  category?: string;
  description?: string;
  date?: string;
  receipt?: string;
}

export interface DeleteExpenseResponse {
  message: string;
}

export const expense = api.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query<Expense[], void>({
      query: () => "/api/expenses",
      providesTags: ["Expense"],
    }),
    getExpenseById: builder.query<Expense, string>({
      query: (id) => `/api/expenses/${id}`,
      providesTags: (_, __, id) => [{ type: "Expense", id }],
    }),
    createExpense: builder.mutation<Expense, CreateExpenseRequest>({
      query: (expense) => ({
        url: "/api/expenses",
        method: "POST",
        body: expense,
      }),
      invalidatesTags: ["Expense"],
    }),
    updateExpense: builder.mutation<
      Expense,
      { id: string; expense: UpdateExpenseRequest }
    >({
      query: ({ id, expense }) => ({
        url: `/api/expenses/${id}`,
        method: "PUT",
        body: expense,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Expense", id }, "Expense"],
    }),
    deleteExpense: builder.mutation<DeleteExpenseResponse, string>({
      query: (id) => ({
        url: `/api/expenses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [{ type: "Expense", id }, "Expense"],
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useGetExpenseByIdQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expense;
