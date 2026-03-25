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
import type {
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  GetUsersParams,
} from "@/pages/usermanagement/types";


export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResponse<UserResponse>,GetUsersParams | void>({
      query: (params) => ({
        url: "/users",
        ...(params ? { params } : {}),
      }),
      transformResponse: (response: ApiResponse<PaginatedResponse<UserResponse>>) =>
        response.data,
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

    getUserById: builder.query<UserResponse, string>({
      query: (id) => `/users/${id}`,
      transformResponse: (response: ApiResponse<UserResponse>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    createUser: builder.mutation<UserResponse, CreateUserRequest>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<UserResponse>) => response.data,
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    updateUser: builder.mutation<UserResponse, { userId: string; body: UpdateUserRequest }>({
      query: ({ userId, body }) => ({
        url: `/users/${userId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiResponse<UserResponse>) => response.data,
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