import { api } from "./api";

export interface Budget {
  _id: string;
  user: string;
  category: string;
  limit: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetRequest {
  category: string;
  limit: number;
  startDate: string;
  endDate: string;
}

export interface UpdateBudgetRequest {
  category?: string;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface DeleteBudgetResponse {
  message: string;
}

export const budgetApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBudgets: builder.query<Budget[], void>({
      query: () => "/api/budgets",
      providesTags: ["Budget"],
    }),
    getBudgetById: builder.query<Budget, string>({
      query: (id) => `/api/budgets/${id}`,
      providesTags: (_, __, id) => [{ type: "Budget", id }],
    }),
    createBudget: builder.mutation<Budget, CreateBudgetRequest>({
      query: (budget) => ({
        url: "/api/budgets",
        method: "POST",
        body: budget,
      }),
      invalidatesTags: ["Budget"],
    }),
    updateBudget: builder.mutation<
      Budget,
      { id: string; budget: UpdateBudgetRequest }
    >({
      query: ({ id, budget }) => ({
        url: `/api/budgets/${id}`,
        method: "PUT",
        body: budget,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Budget", id }, "Budget"],
    }),
    deleteBudget: builder.mutation<DeleteBudgetResponse, string>({
      query: (id) => ({
        url: `/api/budgets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [{ type: "Budget", id }, "Budget"],
    }),
  }),
});

export const {
  useGetBudgetsQuery,
  useGetBudgetByIdQuery,
  useCreateBudgetMutation,
  useUpdateBudgetMutation,
  useDeleteBudgetMutation,
} = budgetApi;
