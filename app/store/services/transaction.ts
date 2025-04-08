import { api } from "./api";

export interface Transaction {
  _id: string;
  user: string;
  type: "expense" | "income";
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  type: "expense" | "income";
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface UpdateTransactionRequest {
  type?: "expense" | "income";
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
    getTransactions: builder.query<Transaction[], void>({
      query: () => "/api/transactions",
      providesTags: ["Transaction"],
    }),
    getTransactionById: builder.query<Transaction, string>({
      query: (id) => `/api/transactions/${id}`,
      providesTags: (_, __, id) => [{ type: "Transaction", id }],
    }),
    createTransaction: builder.mutation<Transaction, CreateTransactionRequest>({
      query: (transaction) => ({
        url: "/api/transactions",
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
        url: `/api/transactions/${id}`,
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
});

export const {
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionApi;
