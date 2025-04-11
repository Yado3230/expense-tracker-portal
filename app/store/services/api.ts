import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Use this helper to create a base query with proper serialization handling
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access_token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
  // Adding this to help with serialization issues
  responseHandler: "json",
});

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Auth", "User", "Expense", "Budget", "Transaction"],
  endpoints: () => ({}),
});
