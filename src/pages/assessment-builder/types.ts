export interface AssessmentOption {
  id?: string;
  text: string;
  isCorrect: boolean;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  weightage: number | string;
  options?: AssessmentOption[];
}

// ── HIERARCHY TYPES & CONSTANTS ──
export type HierarchyStepType = 'self' | 'supervisor' | 'manager' | 'specific_user';

// Exported so any file can map a type to its beautiful label!
export const HIERARCHY_STEP_LABELS: Record<HierarchyStepType, string> = {
  self: "Self Evaluation",
  supervisor: "Reporting Supervisor",
  manager: "Reporting Manager",
  specific_user: "Specific User"
};

export interface HierarchyStep {
  id: string;
  type: HierarchyStepType;
  specificUserId?: string; 
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  designations: string[];
  hierarchy: "default" | "custom";
  hierarchySteps?: HierarchyStep[]; 
  createdAt: string;
  
  expiryDate?: string; 
  status?: "draft" | "published" | "archived" | string;
  duration?: number;
  totalMarks?: number;
  passingMarks?: number;
  assignedTo?: string;
}

// ── FORM STATE TYPE ──
export interface AssessmentFormData {
  title: string;
  description: string;
  expiryDate: string;
  questions: AssessmentQuestion[];
  designations: string[];
  hierarchy: "default" | "custom";
  hierarchySteps: HierarchyStep[];
}