// ─────────────────────────────────────────────
// FILE: src/store/api/authApi.ts
//
// Endpoints from Postman → auth folder:
//   POST /auth/login
//   POST /dev/hash-password
//   POST /users/:userId/reset-password
//   POST /users/me/change-password
//
// USAGE:
//   const [login, { isLoading }] = useLoginMutation();
//   const result = await login({ email, password }).unwrap();
// ─────────────────────────────────────────────

import { baseApi, type ApiResponse } from "../baseApi";

// ── Types (specific to auth) ─────────────────

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface ResetPasswordByAdminRequest {
  newPassword: string;
}

interface HashPasswordRequest {
  password: string;
}

// ── Endpoints ────────────────────────────────

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // POST /auth/login
    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    // POST /dev/hash-password
    hashPassword: builder.mutation<ApiResponse<string>, HashPasswordRequest>({
      query: (body) => ({
        url: "/dev/hash-password",
        method: "POST",
        body,
      }),
    }),

    // POST /users/:userId/reset-password
    resetPasswordByAdmin: builder.mutation<
      ApiResponse<void>,
      { userId: string; body: ResetPasswordByAdminRequest }
    >({
      query: ({ userId, body }) => ({
        url: `/users/${userId}/reset-password`,
        method: "POST",
        body,
      }),
    }),

    // POST /users/me/change-password
    changeMyPassword: builder.mutation<ApiResponse<void>, ChangePasswordRequest>({
      query: (body) => ({
        url: "/users/me/change-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useHashPasswordMutation,
  useResetPasswordByAdminMutation,
  useChangeMyPasswordMutation,
} = authApi;