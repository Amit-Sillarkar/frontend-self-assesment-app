import type { Assessment } from "../pages/assessment-builder/types";

export const initialAssessments: Assessment[] = [
  {
    id: "a-1",
    title: "Frontend Developer Evaluation",
    description: "Quarterly self-assessment for frontend developers focusing on React, Next.js, and UI/UX implementation.",
    status: "published",
    duration: 30,
    totalMarks: 100,
    passingMarks: 60,
    assignedTo: "Frontend Dev",
    questions: [
      { 
        id: "q-1", 
        text: "Rate your proficiency in React Hooks (useEffect, useMemo, etc.).", 
        weightage: 40,
        options: [{ text: "Beginner", isCorrect: false }, { text: "Advanced", isCorrect: true }]
      },
      { 
        id: "q-2", 
        text: "How comfortable are you with Tailwind CSS and responsive design?", 
        weightage: 60,
        options: [{ text: "Not Comfortable", isCorrect: false }, { text: "Very Comfortable", isCorrect: true }]
      },
    ],
    designations: ["frontend_dev", "ui_ux"],
    hierarchy: "default",
    hierarchySteps: [{ id: `self-1`, type: "self" }],
    createdAt: "2026-03-01",
    expiryDate: "2026-12-31", 
  },
  {
    id: "a-2",
    title: "Project Management Review Q1",
    description: "Assessment focusing on team management, agile methodologies, and conflict resolution.",
    status: "draft",
    duration: 45,
    totalMarks: 100,
    passingMarks: 75,
    assignedTo: "Project Manager",
    questions: [
      { 
        id: "q-3", 
        text: "Describe a time you successfully resolved a critical team conflict during a sprint.", 
        weightage: 50,
      },
      { 
        id: "q-4", 
        text: "Rate your expertise in managing Jira boards and sprint planning.", 
        weightage: 50,
        options: [{ text: "Intermediate", isCorrect: false }, { text: "Expert", isCorrect: true }]
      },
    ],
    designations: ["project_manager"],
    hierarchy: "custom",
    hierarchySteps: [
        { id: `self-2`, type: "self" },
        { id: `sup-2`, type: "supervisor" },
        { id: `man-2`, type: "manager" },
        { id: `spec-2`, type: "specific_user", specificUserId: "u1" } // Kanchan reviews this
    ],
    createdAt: "2026-03-05",
    expiryDate: "2026-06-30",
  },
  {
    id: "a-3",
    title: "Annual Security Compliance 2026",
    description: "Mandatory yearly security awareness training and compliance check for all technical staff.",
    status: "published",
    duration: 20,
    totalMarks: 100,
    passingMarks: 100, // 100% required for compliance
    assignedTo: "All Tech Staff",
    questions: [
      { 
        id: "q-5", 
        text: "I understand and agree to follow the company's data protection and privacy policies.", 
        weightage: 100,
        options: [{ text: "I Agree", isCorrect: true }, { text: "I Disagree", isCorrect: false }]
      }
    ],
    designations: ["frontend_dev", "backend_dev", "fullstack_dev", "devops"],
    hierarchy: "default",
    hierarchySteps: [{ id: `self-3`, type: "self" }],
    createdAt: "2026-01-10",
    expiryDate: "2026-12-31",
  },
  {
    id: "a-4",
    title: "UI/UX Design Portfolio Assessment",
    description: "Evaluation of design systems, prototyping skills, and user research methodologies.",
    status: "published",
    duration: 60,
    totalMarks: 100,
    passingMarks: 70,
    assignedTo: "Design Team",
    questions: [
      { 
        id: "q-6", 
        text: "How often do you conduct user testing before finalizing a Figma prototype?", 
        weightage: 60,
      },
      { 
        id: "q-7", 
        text: "Are you proficient in creating interactive components in Figma?", 
        weightage: 40,
        options: [{ text: "Yes", isCorrect: true }, { text: "No", isCorrect: false }]
      }
    ],
    designations: ["ui_ux"],
    hierarchy: "custom",
    hierarchySteps: [
        { id: `self-4`, type: "self" },
        { id: `spec-4`, type: "specific_user", specificUserId: "u5" }, // Sneha reviews this
        { id: `man-4`, type: "manager" }
    ],
    createdAt: "2026-03-10",
    expiryDate: "2026-09-15",
  },
];

export const DESIGNATION_OPTIONS = [
  { id: "frontend_dev", label: "Frontend Developer" },
  { id: "backend_dev", label: "Backend Developer" },
  { id: "fullstack_dev", label: "Full Stack Developer" },
  { id: "devops", label: "DevOps Engineer" },
  { id: "ui_ux", label: "UI/UX Designer" },
  { id: "project_manager", label: "Project Manager" },
];

// ── Specific Users with 'review_assessment' permission ──
export const MOCK_REVIEWERS = [
  { id: "u1", name: "Kanchan (HR Lead)" },
  { id: "u2", name: "Rahul Sharma (Engineering Manager)" },
  { id: "u3", name: "Priya Desai (Product Director)" },
  { id: "u4", name: "Amit Joshi (Compliance Officer)" },
  { id: "u5", name: "Sneha Kulkarni (Design Lead)" },
];