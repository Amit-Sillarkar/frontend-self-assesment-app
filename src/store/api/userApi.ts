// ─────────────────────────────────────────────
// FILE: src/store/api/userApi.ts
//
// Endpoints from Postman → user folder:
//   GET    /users                → getUsers (paginated + filtered)
//   GET    /users/:id            → getUserById
//   POST   /users                → createUser
//   PATCH  /users/:userId        → updateUser
//
// CACHE:
//   createUser  → auto refetches user list
//   updateUser  → auto refetches that user + list
//
// USAGE:
//   const { data, isLoading } = useGetUsersQuery({ page: 1, limit: 10 });
//   const [createUser] = useCreateUserMutation();
// ─────────────────────────────────────────────

import { baseApi, type ApiResponse, type PaginatedResponse } from "../baseApi";

// ── Types (specific to users) ────────────────

export interface UserResponse {
  id: string;
  employeeId: string;
  fullName: string;
  mobile: string;
  email: string;
  roleId: number;
  customRoleId: number | null;
  designation: string;
  reportingSupervisorId: string | null;
  reportingManagerId: string | null;
  isRoleAssignmentLocked: boolean;
  isActive: boolean;
  preferredLanguage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  employeeId: string;
  fullName: string;
  mobile: string;
  email: string;
  password: string;
  roleId: number;
  customRoleId?: number | null;
  designation: string;
  reportingSupervisorId?: string;
  isRoleAssignmentLocked?: boolean;
}

export interface UpdateUserRequest {
  fullName?: string;
  designation?: string;
  email?: string;
  preferredLanguage?: string;
  isActive?: boolean;
  roleId?: number;
  customRoleId?: number | null;
  reportingSupervisorId?: string;
  reportingManagerId?: string;
  isRoleAssignmentLocked?: boolean;
}

export interface GetUsersParams {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string; // e.g. "fullName:asc"
}

// ── Endpoints ────────────────────────────────

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /users?search=...&isActive=...&page=...&limit=...&sortBy=...
    getUsers: builder.query<PaginatedResponse<UserResponse>, GetUsersParams>({
      query: (params) => ({
        url: "/users",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "User" as const,
                id,
              })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    // GET /users/:id
    getUserById: builder.query<ApiResponse<UserResponse>, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    // POST /users
    createUser: builder.mutation<ApiResponse<UserResponse>, CreateUserRequest>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // PATCH /users/:userId
    updateUser: builder.mutation<
      ApiResponse<UserResponse>,
      { userId: string; body: UpdateUserRequest }
    >({
      query: ({ userId, body }) => ({
        url: `/users/${userId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "User", id: userId },
        { type: "User", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} = userApi;