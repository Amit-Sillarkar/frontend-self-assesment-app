// ─────────────────────────────────────────────
// FILE: src/store/api/permissionApi.ts
//
// Endpoints from Postman → permission folder:
//   GET /permissions → getAllPermissions
//
// USAGE:
//   const { data, isLoading } = useGetAllPermissionsQuery();
//   const permissions = data?.data ?? [];
// ─────────────────────────────────────────────

import { baseApi, type ApiResponse } from "../baseApi";

// ── Types (specific to permissions) ──────────

export interface PermissionResponse {
  id: number;
  permissionKey: string;
  label: string;
  group: string;
}

// ── Endpoints ────────────────────────────────

export const permissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /permissions
    getAllPermissions: builder.query<ApiResponse<PermissionResponse[]>, void>({
      query: () => "/permissions",
      providesTags: [{ type: "Permission", id: "LIST" }],
    }),
  }),
});

export const { useGetAllPermissionsQuery } = permissionApi;