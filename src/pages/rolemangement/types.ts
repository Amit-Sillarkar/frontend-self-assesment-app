import type { PrimaryRole } from "@/constants/enum";

export interface AssignedEmployee {
  id: string;
  empId: string;
  fullName: string;
  primaryRole: PrimaryRole;
}

export interface CustomRole {
  id: string;
  roleName: string;
  assignedEmployees: AssignedEmployee[];
  permissions: string[];
  createdBy: string;
  createdAt: string; 
}

// Wizard form state matched precisely to backend payload needs
export interface CustomRoleFormData {
  roleName: string;
  assignedEmployeeIds: string[];
  permissionIds: number[]; 
}