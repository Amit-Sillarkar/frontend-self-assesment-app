import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, FileTextIcon, UserIcon, BuildingIcon, CalendarIcon, AwardIcon } from "lucide-react";

import PageHeader from "@/components/page-header";
import { submittedAssessments } from "@/mockdata/assessment-tracking";
import { type AssessmentTrackingRecord } from "../type";
import { RatingScale } from "@/pages/assement/components/rating-scale";
import { getStatusBadge } from "../components/statusbadge";

// Simulated mock questions for the filled assessment data
const MOCK_QUESTIONS = [
  { id: "q1", text: "How effectively do you communicate with your team members?" },
  { id: "q2", text: "Rate your ability to meet project deadlines consistently." },
  { id: "q3", text: "How well do you adapt to new technologies and processes?" },
  { id: "q4", text: "Rate your problem-solving skills when facing complex challenges." },
  { id: "q5", text: "How would you rate your contribution to team goals this quarter?" },
];

export default function AssessmentTrackingViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [record, setRecord] = useState<AssessmentTrackingRecord | null>(null);

    // Mock answers mimicking what the user submitted (normally comes from backend API)
    const mockAnswers: Record<string, number> = {
        "q1": 8, "q2": 9, "q3": 7, "q4": 8, "q5": 9
    };

    useEffect(() => {
        const data = submittedAssessments.find(a => a.id === id);
        if (data) {
            setRecord(data as AssessmentTrackingRecord);
        }
    }, [id]);

    if (!record) return <div className="p-10 text-center text-muted-foreground">Loading assessment...</div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            
            <div 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer w-fit transition-colors" 
                onClick={() => navigate("/dashboard/assessment-tracking")}
            >
                <ChevronLeft className="w-4 h-4" /> Back to Assessment Tracking
            </div>

            <PageHeader 
                title="Assessment Results" 
                subtitle={`View detailed assessment submission for ${record.employeeName}`} 
            />

            {/* ── Details Header Card ── */}
            <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-4 border-b border-border/60">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                        <FileTextIcon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-bold text-foreground tracking-tight">
                                {record.assessmentName}
                            </h3>
                            {getStatusBadge(record.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                            <span className="flex items-center gap-1.5"><UserIcon className="w-4 h-4" /> {record.employeeName}</span>
                            <span className="flex items-center gap-1.5"><BuildingIcon className="w-4 h-4" /> {record.department}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Tracking ID</p>
                        <p className="font-medium font-mono text-sm">{record.id}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Submitted On</p>
                        <p className="font-medium flex items-center gap-1.5 text-sm"><CalendarIcon className="w-3.5 h-3.5"/> {record.submittedOn}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Score</p>
                        <p className="font-medium flex items-center gap-1.5 text-sm"><AwardIcon className="w-3.5 h-3.5 text-primary"/> {record.score}</p>
                    </div>
                </div>
            </div>

            {/* ── Completed Responses Area ── */}
            <div className="space-y-6">
                <h4 className="text-lg font-semibold border-b border-border/50 pb-2">Submitted Responses</h4>
                {MOCK_QUESTIONS.map((q, idx) => (
                    <div key={q.id} className="bg-card border border-border/60 rounded-xl p-6 shadow-sm">
                        <h3 className="text-base font-semibold text-foreground leading-relaxed">
                            <span className="text-primary font-bold mr-2">{idx + 1}.</span> 
                            {q.text}
                        </h3>
                        <div className="mt-4">
                            <RatingScale 
                                value={mockAnswers[q.id]} 
                                disabled={true} 
                            />
                        </div>
                    </div>
                ))}
            </div>
            
        </div>
    );
}