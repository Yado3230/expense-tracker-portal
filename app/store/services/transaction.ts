import { api } from "./api";

export interface Category {
  _id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface UserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Transaction {
  _id: string;
  user: UserInfo;
  type: "Expense" | "Income";
  title: string;
  amount: number;
  category: Category;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface TransactionFilters {
  page?: number;
  size?: number;
  query?: string;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
  category?: string;
  type?: "Expense" | "Income";
  id?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface CreateTransactionRequest {
  type: "Expense" | "Income";
  title: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface UpdateTransactionRequest {
  type?: "Expense" | "Income";
  title?: string;
  amount?: number;
  category?: string;
  description?: string;
  date?: string;
}

export interface DeleteTransactionResponse {
  message: string;
}

export const transactionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<
      PaginatedResponse<Transaction>,
      TransactionFilters
    >({
      query: (params = {}) => {
        // Build query string from params
        const queryParams = new URLSearchParams();

        if (params.page !== undefined)
          queryParams.append("page", params.page.toString());
        if (params.size !== undefined)
          queryParams.append("size", params.size.toString());
        if (params.query) queryParams.append("query", params.query);
        if (params.minAmount !== undefined)
          queryParams.append("minAmount", params.minAmount.toString());
        if (params.maxAmount !== undefined)
          queryParams.append("maxAmount", params.maxAmount.toString());
        if (params.startDate) queryParams.append("startDate", params.startDate);
        if (params.endDate) queryParams.append("endDate", params.endDate);
        if (params.category) queryParams.append("category", params.category);
        if (params.type) queryParams.append("type", params.type);
        if (params.id) queryParams.append("id", params.id);

        const queryString = queryParams.toString();
        return `/api/transactions/admin${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Transaction"],
    }),
    getTransactionById: builder.query<Transaction, string>({
      query: (id) => `/transactions/${id}`,
      providesTags: (_, __, id) => [{ type: "Transaction", id }],
    }),
    createTransaction: builder.mutation<Transaction, CreateTransactionRequest>({
      query: (transaction) => ({
        url: "/transactions",
        method: "POST",
        body: transaction,
      }),
      invalidatesTags: ["Transaction"],
    }),
    updateTransaction: builder.mutation<
      Transaction,
      { id: string; transaction: UpdateTransactionRequest }
    >({
      query: ({ id, transaction }) => ({
        url: `/transactions/${id}`,
        method: "PUT",
        body: transaction,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Transaction", id },
        "Transaction",
      ],
    }),
    deleteTransaction: builder.mutation<DeleteTransactionResponse, string>({
      query: (id) => ({
        url: `/api/transactions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Transaction", id },
        "Transaction",
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionApi;
