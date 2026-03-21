// ─────────────────────────────────────────────
// FILE: src/store/baseApi.ts
//
// Central RTK Query base API definition.
// This REPLACES the axios interceptor pattern
// you had in src/lib/api.ts.
//
// HOW IT WORKS:
// 1. Every request auto-attaches the Bearer token
//    from localStorage (like your axios interceptor).
// 2. On 401, it auto-calls /auth/refresh-tokens,
//    saves the new token, and retries the request
//    (exactly like your axios 401 interceptor).
// 3. If refresh fails → clears token → redirects
//    to /login (same as your axios catch block).
//
// All feature API slices (authApi, userApi, etc.)
// inject their endpoints into this single base.
// ─────────────────────────────────────────────

import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const API_URL = "http://localhost:3001/v1";

// ── Generic response wrappers (used by all API slices) ──
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ── Raw base query with auth header ──────────
const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include", // sends httpOnly cookies (refresh token)
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// ── Wrapper: auto-refresh on 401 ─────────────
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Attempt to refresh the access token
    const refreshResult = await rawBaseQuery(
      { url: "/auth/refresh-tokens", method: "POST" },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const data = refreshResult.data as { data: { accessToken: string } };
      localStorage.setItem("accessToken", data.data.accessToken);

      // Retry the original failed request with new token
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      // Refresh failed → force logout
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  }

  return result;
};

// ── Base API slice ───────────────────────────
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Role", "Permission"],
  endpoints: () => ({}), // empty — feature APIs inject their own
});