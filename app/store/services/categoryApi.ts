import { api } from "./api";

export interface Category {
  _id: string;
  name: string;
  type: string;
  transactionType: string;
  description: string;
  icon: string;
  color: string;
  isDefault: boolean;
  isRecurring: boolean;
  isActive: boolean;
  createdBy: string;
  budget: number;
  user: string;
  frequency?: string | null;
  defaultAmount?: number | null;
  lastProcessedDate?: string | null;
  nextProcessedDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "/api/categories",
      providesTags: ["Expense"],
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
