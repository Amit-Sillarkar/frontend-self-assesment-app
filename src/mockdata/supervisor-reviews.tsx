export interface ReviewQuestion {
    id: string;
    text: string;
    selfRating: number;
}

export interface SupervisorReview {
    id: string;
    assessmentTitle: string;
    employeeName: string;
    employeeId: string;
    employeeDesignation: string; // <-- Added this
    submittedDate: string;
    dueDate: string;
    status: "pending" | "in_progress" | "expiring_soon";
    questions: ReviewQuestion[];
    savedDraft?: {
        ratings: Record<string, number>;
        remarks: Record<string, string>;
    };
}

export const MOCK_SUPERVISOR_REVIEWS: SupervisorReview[] = [
    {
        id: "rev-1",
        assessmentTitle: "Frontend Developer Evaluation",
        employeeName: "Aditya Pawar",
        employeeId: "EMP-042",
        employeeDesignation: "Sr. Frontend Developer",
        submittedDate: "2026-03-12",
        dueDate: "2026-03-20",
        status: "pending",
        questions: [
            { id: "q1", text: "Rate your proficiency in building reusable React components.", selfRating: 9 },
            { id: "q2", text: "How comfortable are you with state management (Redux, Context)?", selfRating: 8 },
            { id: "q3", text: "Rate your ability to translate Figma designs into pixel-perfect Tailwind CSS.", selfRating: 10 },
        ]
    },
    {
        id: "rev-2",
        assessmentTitle: "Project Management Review Q1",
        employeeName: "Srishti Gadekar",
        employeeId: "EMP-018",
        employeeDesignation: "Project Manager",
        submittedDate: "2026-03-10",
        dueDate: "2026-03-15",
        status: "expiring_soon",
        savedDraft: {
            ratings: { "q1": 3 }, 
            remarks: {}
        },
        questions: [
            { id: "q1", text: "Rate your effectiveness in resolving team blockers.", selfRating: 8 },
            { id: "q2", text: "How consistently do you hit sprint delivery targets?", selfRating: 9 },
        ]
    },
    {
        id: "rev-3",
        assessmentTitle: "Security Compliance 2026",
        employeeName: "Sneha Kulkarni",
        employeeId: "EMP-099",
        employeeDesignation: "DevOps Engineer",
        submittedDate: "2026-03-13",
        dueDate: "2026-04-01",
        status: "in_progress",
        savedDraft: {
            ratings: { "q1": 10 },
            remarks: {}
        },
        questions: [
            { id: "q1", text: "I strictly follow the company's password rotation policy.", selfRating: 10 },
        ]
    }
];