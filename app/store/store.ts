import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./services/api";

// Configure the store with proper typing
export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [api.reducerPath]: api.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of RTK Query.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "auth/executeQuery/fulfilled",
          "auth/executeQuery/pending",
          "auth/executeMutation/fulfilled",
          "auth/executeMutation/pending",
          "auth/executeMutation/rejected",
          "auth/executeQuery/rejected",
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: [
          "meta.arg",
          "payload.timestamp",
          "meta.baseQueryMeta",
          "meta.request",
        ],
        // Ignore these paths in the state
        ignoredPaths: [
          `${api.reducerPath}.queries`,
          `${api.reducerPath}.mutations`,
        ],
      },
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Setup listeners for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
