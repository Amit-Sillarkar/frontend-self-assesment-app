import type { Assessment } from "../pages/assessment-builder/types";

export const initialAssessments: Assessment[] = [
  {
    id: "a-1",
    title: "Frontend Developer Evaluation",
    description: "Quarterly self-assessment for frontend developers focusing on React and UI/UX.",
    questions: [
      { id: "q-1", text: "Rate your proficiency in React Hooks.", weightage: 40 },
      { id: "q-2", text: "How comfortable are you with Tailwind CSS?", weightage: 60 },
    ],
    designations: ["frontend_dev", "ui_ux"], // Array of strings
    hierarchy: "default",
    createdAt: "2026-03-01",
  },
  {
    id: "a-2",
    title: "Managerial Leadership Review",
    description: "Assessment focusing on team management and conflict resolution.",
    questions: [
      { id: "q-3", text: "Describe a time you resolved a team conflict.", weightage: 100 },
    ],
    designations: ["project_manager"], // Array of strings
    hierarchy: "custom",
    createdAt: "2026-03-05",
  },
];

export const DESIGNATION_OPTIONS = [
  { id: "frontend_dev", label: "Frontend Developer" },
  { id: "backend_dev", label: "Backend Developer" },
  { id: "fullstack_dev", label: "Full Stack Developer" },
  { id: "ui_ux", label: "UI/UX Designer" },
  { id: "qa_engineer", label: "QA Engineer" },
  { id: "devops", label: "DevOps Engineer" },
  { id: "project_manager", label: "Project Manager" },
];

export const MOCK_MANAGERS = [
  { id: "m1", name: "Alice Johnson (Engineering Manager)" },
  { id: "m2", name: "Bob Smith (Product Manager)" },
];

export const MOCK_SUPERVISORS = [
  { id: "s1", name: "Charlie Davis (Team Lead)" },
  { id: "s2", name: "Diana Evans (QA Lead)" },
];