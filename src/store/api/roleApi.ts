// ─────────────────────────────────────────────
// FILE: src/store/api/roleApi.ts
//
// Endpoints from Postman → roles folder:
//   GET  /roles                  → getRoles (paginated + filtered)
//   GET  /roles?groupBy=roleType → getRolesGrouped
//   POST /roles/custom           → createCustomRole
//
// CACHE:
//   createCustomRole → auto refetches both list + grouped
//
// USAGE:
//   const { data } = useGetRolesQuery({ page: 1, limit: 10 });
//   const { data: grouped } = useGetRolesGroupedQuery();
//   const [createRole] = useCreateCustomRoleMutation();
// ─────────────────────────────────────────────

import { baseApi, type ApiResponse, type PaginatedResponse } from "../baseApi";

// ── Types (specific to roles) ────────────────

export interface RoleResponse {
  id: number;
  roleName: string;
  roleType: "PRIMARY" | "CUSTOM";
  isSystemRole: boolean;
  isLocked: boolean;
  permissions: { id: number; permissionKey: string; label: string; group: string }[];
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

// ── Endpoints ────────────────────────────────

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /roles?page=...&limit=...&search=...&roleType=...&sortBy=...
    getRoles: builder.query<PaginatedResponse<RoleResponse>, GetRolesParams>({
      query: (params) => ({
        url: "/roles",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Role" as const,
                id,
              })),
              { type: "Role", id: "LIST" },
            ]
          : [{ type: "Role", id: "LIST" }],
    }),

    // GET /roles?groupBy=roleType
    getRolesGrouped: builder.query<
      ApiResponse<Record<string, RoleResponse[]>>,
      void
    >({
      query: () => ({
        url: "/roles",
        params: { groupBy: "roleType" },
      }),
      providesTags: [{ type: "Role", id: "GROUPED" }],
    }),

    // POST /roles/custom
    createCustomRole: builder.mutation<
      ApiResponse<RoleResponse>,
      CreateCustomRoleRequest
    >({
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
  }),
});

export const {
  useGetRolesQuery,
  useGetRolesGroupedQuery,
  useCreateCustomRoleMutation,
} = roleApi;