import { baseApi } from "../baseApi";

// ── Types for the new grouped response ──────────

export interface PermissionDetail {
  id: number;
  code: string;
  description: string;
  module: string;
}

export interface PermissionGroup {
  module: string;
  permissions: PermissionDetail[];
}

// ── Endpoints ────────────────────────────────

export const permissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /permissions
    getAllPermissions: builder.query<any, void>({
      query: () => "/permissions",
      providesTags: [{ type: "Permission", id: "LIST" }],
    }),
  }),
});

export const { useGetAllPermissionsQuery } = permissionApi;