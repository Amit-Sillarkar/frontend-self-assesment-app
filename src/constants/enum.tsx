// ─────────────────────────────────────────────
// ENUMS / REPEATED HARDCODED ARRAYS
// ─────────────────────────────────────────────

export const USER_ROLES = {
  ADMIN: "admin",
  DEVELOPER: "developer",
  VIEWER: "viewer",
};

export const ROUTE_PATHS = {
  // Public
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  COLORS: "/dashboard/colors",
  COMPONENTS: "/dashboard/components",
  USER_MANAGEMENT: "/dashboard/user-management",
  CUSTOM_ROLES: "/dashboard/custom-roles",
  ASSESSMENT_BUILDER: "/dashboard/assessment-builder",
};

export const NAV_ITEM_KEYS = {
  COLORS: "colors",
  COMPONENTS: "components",
  ASSESSMENT_BUILDER: "assessment-builder",
};

export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

export const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};


export const PERMISSION_GROUPS = {
  FULL_ACCESS: {
    label: "Full Access",
    description: "Complete system control",
    permissions: [
      { key: "VIEW_SYSTEM_LOGS",        label: "View System Logs" },
      { key: "USER_CREATE",             label: "Create Users" },
      { key: "USER_MANAGE",             label: "Manage Users" },
      { key: "MANAGE_HIERARCHY",        label: "Manage Hierarchy" },
      { key: "ROLE_DEFINE",             label: "Define Roles" },
      { key: "ASSESSMENT_CREATE",       label: "Create Assessments" },
      { key: "FINAL_REVIEW_COMPLETION", label: "Final Review & Cycle End" },
      { key: "EXPORT_EXCEL",            label: "Export to Excel" },
    ],
  },
  DEPARTMENT_ACCESS: {
    label: "Department Access",
    description: "Access across the department",
    permissions: [
      { key: "DEPT_REVIEW_COMPLETION",  label: "Review Completion" },
      { key: "DEPT_VIEW_LOG_FORMS",     label: "View Submitted Forms" },
    ],
  },
  TEAM_ACCESS: {
    label: "Team Access",
    description: "Access limited to own team",
    permissions: [
      { key: "TEAM_REVIEW_COMPLETION",  label: "Review Completion" },
      { key: "TEAM_VIEW_LOG_FORMS",     label: "View Submitted Forms" },
    ],
  },
  SELF_ACCESS: {
    label: "Self Access",
    description: "Personal actions only",
    permissions: [
      { key: "SUBMIT_ASSESSMENT",       label: "Submit Assessment" },
      { key: "SELF_VIEW_LOG_FORMS",     label: "View Submitted Forms" },
    ],
  },
}

export type PermissionKey =
  | "VIEW_SYSTEM_LOGS"
  | "USER_CREATE"
  | "USER_MANAGE"
  | "MANAGE_HIERARCHY"
  | "ROLE_DEFINE"
  | "ASSESSMENT_CREATE"
  | "FINAL_REVIEW_COMPLETION"
  | "EXPORT_EXCEL"
  | "DEPT_REVIEW_COMPLETION"
  | "DEPT_VIEW_LOG_FORMS"
  | "TEAM_REVIEW_COMPLETION"
  | "TEAM_VIEW_LOG_FORMS"
  | "SUBMIT_ASSESSMENT"
  | "SELF_VIEW_LOG_FORMS";


export const PRIMARY_ROLES = {
  SUPER_ADMIN: "super_admin",
  MANAGER:     "manager",
  SUPERVISOR:  "supervisor",
  USER_LABOR:  "user_labor",
} as const;

export type PrimaryRole = (typeof PRIMARY_ROLES)[keyof typeof PRIMARY_ROLES];

export const PRIMARY_ROLE_LABELS: Record<PrimaryRole, string> = {
  super_admin: "Super Admin",
  manager:     "Manager",
  supervisor:  "Supervisor",
  user_labor:  "Labor",
};

// All role options for dropdowns
// NOTE: super_admin is excluded from Custom Role assignment
export const PRIMARY_ROLE_OPTIONS = Object.entries(PRIMARY_ROLE_LABELS).map(
  ([value, label]) => ({ value: value as PrimaryRole, label })
);

export const ASSIGNABLE_ROLE_OPTIONS = PRIMARY_ROLE_OPTIONS.filter(
  (r) => r.value !== PRIMARY_ROLES.SUPER_ADMIN
);