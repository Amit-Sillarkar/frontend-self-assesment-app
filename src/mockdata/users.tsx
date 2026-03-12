// ─────────────────────────────────────────────
// FILE: src/mockdata/users.ts
//
// Dummy data — replace with real API calls.
// ─────────────────────────────────────────────

import type { User } from "@/pages/usermanagement/types";

export const MOCK_USERS: User[] = [
  {
    id: "1",
    empId: "ADMIN001",
    fullName: "Arjun Sharma",
    mobile: "9800000001",
    email: "arjun.sharma@kdaher.com",
    primaryRole: "super_admin",
    customRole: null,
    designation: "System Administrator",
    reportingSupervisor: null,
    reportingManager: null,
    roleLockStatus: "not_locked",
  },
  {
    id: "2",
    empId: "MGR001",
    fullName: "Priya Desai",
    mobile: "9800000002",
    email: "priya.desai@kdaher.com",
    primaryRole: "manager",
    customRole: "Project Lead",
    designation: "Project Manager",
    reportingSupervisor: "Rahul Patil",
    reportingManager: null,
    roleLockStatus: "not_locked",
  },
  {
    id: "3",
    empId: "SUP001",
    fullName: "Rahul Patil",
    mobile: "9800000003",
    email: "rahul.patil@kdaher.com",
    primaryRole: "supervisor",
    customRole: null,
    designation: "Site Supervisor",
    reportingSupervisor: null,
    reportingManager: "Priya Desai",
    roleLockStatus: "locked",
  },
  {
    id: "4",
    empId: "USR001",
    fullName: "Sneha Kulkarni",
    mobile: "9800000004",
    email: "sneha.kulkarni@kdaher.com",
    primaryRole: "user_labor",
    customRole: null,
    designation: "Site Worker",
    reportingSupervisor: "Rahul Patil",
    reportingManager: "Priya Desai",
    roleLockStatus: "not_locked",
  },
  {
    id: "5",
    empId: "MGR002",
    fullName: "Kiran Mehta",
    mobile: "9800000005",
    email: "kiran.mehta@kdaher.com",
    primaryRole: "manager",
    customRole: "Safety Officer",
    designation: "Safety Manager",
    reportingSupervisor: null,
    reportingManager: null,
    roleLockStatus: "not_locked",
  },
  {
    id: "6",
    empId: "SUP002",
    fullName: "Amit Joshi",
    mobile: "9800000006",
    email: "amit.joshi@kdaher.com",
    primaryRole: "supervisor",
    customRole: "Quality Inspector",
    designation: "QA Supervisor",
    reportingSupervisor: null,
    reportingManager: "Kiran Mehta",
    roleLockStatus: "not_locked",
  },
   {
    id: "3",
    empId: "SUP001",
    fullName: "Rahul Patil",
    mobile: "9800000003",
    email: "rahul.patil@kdaher.com",
    primaryRole: "supervisor",
    customRole: null,
    designation: "Site Supervisor",
    reportingSupervisor: null,
    reportingManager: "Priya Desai",
    roleLockStatus: "locked",

  },
];

// Used for employee search in Custom Role wizard Step 2
// (Excludes super_admin by spec)
export const ASSIGNABLE_EMPLOYEES = MOCK_USERS.filter(
  (u) => u.primaryRole !== "super_admin"
).map((u) => ({
  id: u.id,
  empId: u.empId,
  fullName: u.fullName,
  primaryRole: u.primaryRole,
  customRole: u.customRole,
}));

// Custom role options for dropdowns in User form
export const MOCK_CUSTOM_ROLE_OPTIONS = [
  { value: "none",              label: "None" },
  { value: "project_lead",      label: "Project Lead" },
  { value: "safety_officer",    label: "Safety Officer" },
  { value: "quality_inspector", label: "Quality Inspector" },
];