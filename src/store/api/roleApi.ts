import { baseApi, type ApiResponse, type PaginatedResponse } from "../baseApi";

// ── Types (specific to roles) ────────────────
export interface RoleResponse {
  id: number | string;
  roleName?: string;
  name?: string;
  roleType: "PRIMARY" | "CUSTOM";
  isSystemRole: boolean;
  isLocked: boolean;
  permissions: { id: number; permissionKey: string; label: string; group: string }[] | string[];
  userCount: number;
  createdAt: string;
  updatedAt: string;
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

// ── Endpoints ────────────────────────────────
export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getRoles: builder.query<any, GetRolesParams>({
      query: (params) => ({
        url: "/roles",
        params,
      }),
      providesTags: (result) => {
        let list: any[] = [];
        if (Array.isArray(result)) list = result;
        else if (result?.data && Array.isArray(result.data)) list = result.data;
        else if (result?.data?.data && Array.isArray(result.data.data)) list = result.data.data;

        return [
          ...list.map(({ id }: any) => ({
            type: "Role" as const,
            id: String(id),
          })),
          { type: "Role", id: "LIST" },
        ];
      },
    }),

    // GET /roles?groupBy=roleType
    getRolesGrouped: builder.query<ApiResponse<Record<string, RoleResponse[]>>, void>({
      query: () => ({
        url: "/roles",
        params: { groupBy: "roleType" },
      }),
      providesTags: [{ type: "Role", id: "GROUPED" }],
    }),

    // POST /roles/custom
    createCustomRole: builder.mutation<ApiResponse<RoleResponse>, CreateCustomRoleRequest>({
      query: (body) => ({
        url: "/roles/custom",
        method: "POST",
        body,
      }),
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

export const {
  useGetRolesQuery,
  useGetRolesGroupedQuery,
  useCreateCustomRoleMutation,
  useUpdateCustomRoleMutation,
  useDeleteCustomRoleMutation,
} = roleApi;