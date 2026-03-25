// ─────────────────────────────────────────────
// FILE: src/pages/usermanagement/types.ts
//
// Single source of truth for ALL types used in
// this feature — both API shapes and page/form types.
// userApi.ts imports from here so it only contains
// endpoint logic.
// ─────────────────────────────────────────────

import type { PrimaryRole } from "@/constants/enum";

// ── Nested entity types ──────────────────────



export interface RoleDefinition {
  id: number;
  name: PrimaryRole;
  roleType: string;
}

export interface CustomRole {
  id: number;
  name: string;
}

// ── Main API response shape ──────────────────

export interface UserResponse {
  id: string;
  employeeId: string;
  fullName: string;
  mobile: string;
  email: string;
  designation: string | null;
  roleId: number;
  customRoleId: number | null;
  reportingSupervisorId: string | null;
  reportingManagerId: string | null;
  roleDefinition: RoleDefinition | null;
  customRole: CustomRole | null;
  isRoleAssignmentLocked: boolean;
  isActive: boolean;
  preferredLanguage: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Request types ────────────────────────────

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
  mobile?: string;
  preferredLanguage?: string;
  isActive?: boolean;
  roleId?: number;
  customRoleId: Array<{ id: number; name: string }> | null;
  reportingSupervisorId?: string | null;
  reportingManagerId?: string | null;
  isRoleAssignmentLocked?: boolean;
}

export interface GetUsersParams {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  roleNames?: string;
}

// ── Page-level aliases & form types ─────────

export type User = UserResponse;

export type UserFormData = Omit<UpdateUserRequest, "isActive"> & {
  employeeId?: string;
  password?: string;
};