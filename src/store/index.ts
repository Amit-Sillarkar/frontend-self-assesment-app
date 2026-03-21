// ─────────────────────────────────────────────
// FILE: src/store/index.ts
//
// Redux store configuration.
// Registers the RTK Query reducer + middleware.
// Without the middleware, RTK Query hooks won't work.
// ─────────────────────────────────────────────

import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./baseApi";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;