export interface PendingAssessment {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    status: "new" | "in_progress" | "expiring_soon";
    questions: { id: string; text: string }[];
    savedDraft?: Record<string, number>; // Maps questionId -> rating (1-10)
}

export const MOCK_PENDING_ASSESSMENTS: PendingAssessment[] = [
    {
        id: "pa-1",
        title: "Frontend Developer Evaluation",
        description: "Quarterly self-assessment focusing on React, Next.js, and UI/UX.",
        dueDate: "2026-03-25",
        status: "new",
        questions: [
            { id: "q1", text: "Rate your proficiency in building reusable React components." },
            { id: "q2", text: "How comfortable are you with state management (Redux, Context)?" },
            { id: "q3", text: "Rate your ability to translate Figma designs into pixel-perfect Tailwind CSS." },
        ]
    },
    {
        id: "pa-2",
        title: "Annual Security Compliance 2026",
        description: "Mandatory yearly security awareness training and compliance check.",
        dueDate: "2026-03-14", // Close date to trigger "Expiring Soon"
        status: "expiring_soon",
        questions: [
            { id: "q1", text: "I strictly follow the company's password rotation policy." },
            { id: "q2", text: "I am confident in identifying phishing attempts in emails." },
        ]
    },
    {
        id: "pa-3",
        title: "Project Management Review Q1",
        description: "Self-evaluation for sprint planning and team leadership.",
        dueDate: "2026-04-10",
        status: "in_progress",
        savedDraft: { "q1": 8 }, // User already started this one!
        questions: [
            { id: "q1", text: "Rate your effectiveness in resolving team blockers." },
            { id: "q2", text: "How consistently do you hit sprint delivery targets?" },
        ]
    }
];