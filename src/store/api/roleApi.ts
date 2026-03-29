import { baseApi, type ApiResponse } from "../baseApi";

// ── Types ────────────────────────────────

// Backend role shape (fixed based on your API)
export interface RoleResponse {
  id: number;
  name: string; // ✅ API uses "name"
  roleType: "PRIMARY" | "CUSTOM";
  isSystemRole: boolean;
  isLocked: boolean;
  permissions?: { id: number; permissionKey: string; label: string; group: string; }[] | string[];
  userCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Backend list response
export interface RolesListResponse {
  data: RoleResponse[];
  type: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetRolesParams {
  page?: number;
  limit?: number;
  search?: string;
  roleType?: "PRIMARY" | "CUSTOM";
  isSystemRole?: boolean;
  isLocked?: boolean;
  sortBy?: string;
  groupBy?: string;
}

export interface CreateCustomRoleRequest {
  roleName: string;
  userIds: string[];
  permissionIds: number[];
}

export interface UpdateCustomRoleRequest {
  roleId: number;
  roleName?: string;
  permissionIds?: number[];
}

export interface UpdateCustomRoleRequest {
  roleId: number;
  roleName?: string;
  permissionIds?: number[];
}

// ── API ────────────────────────────────


export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<{ roles: RoleResponse[]; pagination: RolesListResponse["pagination"] }, GetRolesParams>({
      query: (params) => ({
        url: "/roles",
        params,
      }),
      transformResponse: (response: ApiResponse<RolesListResponse>) => {
        return {
          roles: response.data.data,
          pagination: response.data.pagination,
        };
      },

      providesTags: (result) =>
        result
          ? [
            ...result.roles.map(({ id }) => ({
              type: "Role" as const,
              id,
            })),
            { type: "Role", id: "LIST" },
          ]
          : [{ type: "Role", id: "LIST" }],
    }),

    // ✅ GET /roles?groupBy=roleType
    getRolesGrouped: builder.query<
      Record<string, RoleResponse[]>,
      void
    >({
      query: () => ({
        url: "/roles",
        params: { groupBy: "roleType" },
      }),

      transformResponse: (response: ApiResponse<Record<string, RoleResponse[]>>) => {
        return response.data;
      },

      providesTags: [{ type: "Role", id: "GROUPED" }],
    }),

    // ✅ POST /roles/custom
    createCustomRole: builder.mutation<
      RoleResponse,
      CreateCustomRoleRequest
    >({
      query: (body) => ({
        url: "/roles/custom",
        method: "POST",
        body,
      }),

      transformResponse: (response: ApiResponse<RoleResponse>) => {
        return response.data; // ✅ unwrap
      },

      invalidatesTags: [
        { type: "Role", id: "LIST" },
        { type: "Role", id: "GROUPED" },
      ],
    }),

    // PATCH /roles/custom/:roleId
    updateCustomRole: builder.mutation<ApiResponse<RoleResponse>, UpdateCustomRoleRequest>({
      query: ({ roleId, ...body }) => ({
        url: `/roles/custom/${roleId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { roleId }) => [
        { type: "Role", id: String(roleId) },
        { type: "Role", id: "LIST" },
        { type: "Role", id: "GROUPED" },
      ],
    }),

    // DELETE /roles/custom/:roleId
    deleteCustomRole: builder.mutation<ApiResponse<{ deletedRoleId: number; roleName: string }>, number>({
      query: (roleId) => ({
        url: `/roles/custom/${roleId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, roleId) => [
        { type: "Role", id: String(roleId) },
        { type: "Role", id: "LIST" },
        { type: "Role", id: "GROUPED" },
      ],
    }),
  }),
});

// ── Hooks ────────────────────────────────

export const {
  useGetRolesQuery,
  useGetRolesGroupedQuery,
  useCreateCustomRoleMutation,
  useUpdateCustomRoleMutation,
  useDeleteCustomRoleMutation,
} = roleApi;