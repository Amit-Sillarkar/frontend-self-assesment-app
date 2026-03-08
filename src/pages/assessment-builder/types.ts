export interface AssessmentQuestion {
  id: string;
  text: string;
  weightage: number | string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  designations: string[];
  hierarchy: "default" | "custom";
  customManagerId?: string;
  customSupervisorId?: string;
  createdAt: string;
}