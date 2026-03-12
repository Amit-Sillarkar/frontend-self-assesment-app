import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, SaveIcon, SendIcon, HelpCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { useToast } from "@/components/toast-notification";
import PageHeader from "@/components/page-header";


// Mock Data
import { MOCK_PENDING_ASSESSMENTS, type PendingAssessment } from "@/mockdata/pending-assessments";
import { RatingScale } from "./components/rating-scale";

export default function AssessmentPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [assessment, setAssessment] = useState<PendingAssessment | null>(null);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    // Fetch Assessment Data on mount
    useEffect(() => {
        const data = MOCK_PENDING_ASSESSMENTS.find(a => a.id === id);
        if (data) {
            setAssessment(data);
            // Load draft if exists
            if (data.savedDraft) setAnswers(data.savedDraft);
        }
    }, [id]);

    const handleRatingChange = (questionId: string, rating: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: rating }));
    };

    const handleSaveDraft = () => {
        // Logic to save draft to API goes here
        toast.success("Draft saved successfully. You can return later.");
        navigate("/dashboard/pending-assessments");
    };

    const handleSubmit = () => {
        // Logic to submit to API goes here
        setIsConfirmOpen(false);
        toast.success("Assessment submitted successfully!");
        navigate("/dashboard/pending-assessments");
    };

    if (!assessment) return <div className="p-10 text-center text-muted-foreground">Loading assessment...</div>;

    const answeredCount = Object.keys(answers).length;
    const totalCount = assessment.questions.length;
    const allAnswered = answeredCount === totalCount;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer w-fit transition-colors" onClick={() => navigate("/dashboard/pending-assessments")}>
                <ChevronLeft className="w-4 h-4" /> Back to My Assessments
            </div>

            <PageHeader title={assessment.title} subtitle={assessment.description} />

            {/* ── Progress Banner ── */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div>
                    <h4 className="font-bold text-primary flex items-center gap-2">
                        <HelpCircleIcon className="w-4 h-4" /> Self Evaluation Form
                    </h4>
                    <p className="text-sm text-muted-foreground mt-0.5">Please rate yourself on a scale of 1 to 10 for each competency.</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-foreground">Progress: {answeredCount} / {totalCount}</span>
                    <div className="w-32 h-2 bg-background rounded-full mt-1.5 overflow-hidden border border-border/50">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(answeredCount / totalCount) * 100}%` }} />
                    </div>
                </div>
            </div>

            {/* ── Questions List ── */}
            <div className="space-y-6">
                {assessment.questions.map((q, idx) => (
                    <div key={q.id} className="bg-card border border-border/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <h3 className="text-lg font-semibold text-foreground leading-relaxed">
                            <span className="text-primary font-bold mr-2">{idx + 1}.</span> 
                            {q.text}
                        </h3>
                        <div className="mt-2">
                            <RatingScale 
                                value={answers[q.id]} 
                                onChange={(val) => handleRatingChange(q.id, val)} 
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Sticky Action Footer ── */}
            <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/60 p-4 shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.1)] z-40 flex items-center justify-end gap-4 md:pl-64">
                <Button variant="outline" onClick={handleSaveDraft} className="shadow-sm border-border/60 hover:bg-muted transition-all gap-2 h-10">
                    <SaveIcon className="w-4 h-4" /> Save as Draft
                </Button>
                <Button 
                    onClick={() => setIsConfirmOpen(true)} 
                    disabled={!allAnswered} 
                    className="shadow-sm hover:shadow-md transition-all gap-2 h-10 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                    <SendIcon className="w-4 h-4" /> Submit Assessment
                </Button>
            </div>

            {/* ── Submission Modal ── */}
            <ConfirmationModal
                variant="success"
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleSubmit}
                title="Submit Assessment"
                message="Are you sure you want to submit your evaluation? Once submitted, your answers will be sent to your manager and cannot be modified."
                confirmText="Yes, Submit"
                isDanger={false} // Uses the beautiful primary orange gradient instead of red
            />
        </div>
    );
}