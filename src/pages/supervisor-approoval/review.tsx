import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, SaveIcon, CheckCircle2, UserCircleIcon, SendIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { useToast } from "@/components/toast-notification";

import { ReviewCard } from "./components/review-card";
import { MOCK_SUPERVISOR_REVIEWS, type SupervisorReview } from "@/mockdata/supervisor-reviews";

export default function SupervisorReviewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [review, setReview] = useState<SupervisorReview | null>(null);
    const [ratings, setRatings] = useState<Record<string, number>>({});
    const [remarks, setRemarks] = useState<Record<string, string>>({});
    
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [showErrors, setShowErrors] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const data = MOCK_SUPERVISOR_REVIEWS.find(r => r.id === id);
        if (data) {
            setReview(data);
            if (data.savedDraft) {
                setRatings(data.savedDraft.ratings || {});
                setRemarks(data.savedDraft.remarks || {});
            }
        }
    }, [id]);

    const handleSaveDraft = () => {
        toast.success("Draft saved successfully.");
        navigate("/dashboard/supervisor-approval");
    };

    const validateSubmission = () => {
        if (!review) return false;
        let isValid = true;

        if (Object.keys(ratings).length < review.questions.length) isValid = false;

        review.questions.forEach(q => {
            const rVal = ratings[q.id];
            if (rVal !== undefined) {
                const diff = Math.abs(q.selfRating - rVal);
                if (diff >= 5) {
                    const text = remarks[q.id];
                    if (!text || text.trim() === "") isValid = false;
                }
            }
        });

        return isValid;
    };

    const handlePreSubmit = () => {
        if (validateSubmission()) {
            setShowErrors(false);
            setIsConfirmOpen(true);
        } else {
            setShowErrors(true);
            toast.error("Please complete all ratings and mandatory remarks before submitting.");
        }
    };

    if (!review) return <div className="p-10 text-center text-muted-foreground">Loading review...</div>;

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in zoom-in-95 fade-in duration-500">
                <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 shadow-sm border border-primary/20">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 text-center px-4">Review Submitted Successfully!</h2>
                <p className="text-muted-foreground text-center max-w-md mb-8 text-sm sm:text-base leading-relaxed px-6">
                    The evaluation for {review.employeeName} has been formally reviewed and recorded.
                </p>
                <Button onClick={() => navigate("/dashboard/supervisor-approval")} className="shadow-sm h-11 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90">
                    Back to Approvals
                </Button>
            </div>
        );
    }

    const progressPercentage = (Object.keys(ratings).length / review.questions.length) * 100;

    return (
        // ── FIXED LAYOUT: Only the inner questions div scrolls ──
        <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden animate-in fade-in duration-500">
            
            {/* ── Fixed Top Area ── */}
            <div className="shrink-0 space-y-5 pb-5 border-b border-border/50">
                
                {/* Custom Header with inline back button */}
                <div className="flex items-center gap-4">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-9 w-9 rounded-full border-border/60 hover:bg-primary/10 hover:text-primary transition-colors shadow-sm" 
                        onClick={() => navigate("/dashboard/supervisor-approval")}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground tracking-tight">Evaluate Assessment</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">{review.assessmentTitle}</p>
                    </div>
                </div>

                {/* Employee Banner */}
                <div className="bg-card border border-border/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/10">
                            <UserCircleIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-bold text-foreground text-lg leading-tight">{review.employeeName}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-[10px] px-2 py-0 border-primary/20 text-primary bg-primary/5">
                                    {review.employeeDesignation}
                                </Badge>
                                <span className="text-xs font-semibold text-muted-foreground">ID: {review.employeeId}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full sm:w-56 sm:items-end">
                        <div className="flex justify-between w-full mb-1.5">
                            <span className="text-xs font-bold text-foreground">Evaluation Progress</span>
                            <span className="text-xs font-bold text-primary">{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full h-2 bg-background rounded-full overflow-hidden border border-border/50">
                            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Scrollable Middle Area (Questions) ── */}
            <div className="flex-1 overflow-y-auto custom-scrollbar py-6 pr-2 space-y-6">
                {review.questions.map((q, idx) => (
                    <ReviewCard 
                        key={q.id}
                        index={idx}
                        questionText={q.text}
                        selfRating={q.selfRating}
                        supervisorRating={ratings[q.id]}
                        remark={remarks[q.id]}
                        onRatingChange={(val) => setRatings(p => ({ ...p, [q.id]: val }))}
                        onRemarkChange={(val) => setRemarks(p => ({ ...p, [q.id]: val }))}
                        showErrors={showErrors}
                    />
                ))}
            </div>

            {/* ── Fixed Bottom Footer ── */}
            <div className="shrink-0 border-t border-border/60 bg-card pt-4 pb-2 flex items-center justify-end gap-3">
                <Button variant="outline" onClick={handleSaveDraft} className="shadow-sm border-border/60 hover:bg-muted transition-all gap-2 h-10 w-full sm:w-auto">
                    <SaveIcon className="w-4 h-4" /> Save Draft
                </Button>
                <Button onClick={handlePreSubmit} className="shadow-sm hover:shadow-md transition-all gap-2 h-10 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                    <SendIcon className="w-4 h-4" /> Approve & Submit
                </Button>
            </div>

            {/* ── Universal Modal ── */}
            <ConfirmationModal
                variant="success"
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => handlePreSubmit()}
                title="Finalize Evaluation"
                message={`You are about to submit your final review for ${review.employeeName}. This action cannot be undone.`}
                confirmText="Approve Evaluation"
            />
        </div>
    );
}