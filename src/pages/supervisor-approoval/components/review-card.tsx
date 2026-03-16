import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RatingScale } from "@/pages/assement/components/rating-scale";

interface ReviewCardProps {
    index: number;
    questionText: string;
    selfRating: number;
    supervisorRating?: number;
    remark?: string;
    onRatingChange: (val: number) => void;
    onRemarkChange: (val: string) => void;
    showErrors?: boolean;
}

export function ReviewCard({ index, questionText, selfRating, supervisorRating, remark, onRatingChange, onRemarkChange, showErrors }: ReviewCardProps) {
    
    const diff = supervisorRating !== undefined ? Math.abs(selfRating - supervisorRating) : 0;
    const isRemarkMandatory = diff >= 5;
    const missingRemarkError = showErrors && isRemarkMandatory && (!remark || remark.trim() === "");

    return (
        <div className={`bg-card border rounded-xl p-5 sm:p-6 shadow-sm flex flex-col transition-all duration-300 ${missingRemarkError ? 'border-destructive/50 ring-1 ring-destructive/20' : 'border-border/60 hover:border-primary/30 hover:shadow-md'}`}>
            
            {/* Question & Beautiful Employee Rating Pill */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-5 pb-5 border-b border-border/50">
                <h3 className="text-base sm:text-lg font-semibold text-foreground leading-relaxed flex-1">
                    <span className="text-primary font-bold mr-2">{index + 1}.</span> 
                    {questionText}
                </h3>
                
                {/* ── Polished Employee Rating UI ── */}
                <div className="shrink-0 flex items-center gap-3 bg-primary/5 border border-primary/20 p-1.5 pr-4 rounded-full self-start shadow-sm transition-transform hover:scale-105 duration-300">
                    <div className="w-8 h-8 rounded-full bg-background border border-primary/20 flex items-center justify-center text-primary text-sm font-bold shadow-sm">
                        {selfRating}
                    </div>
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Employee Rating</span>
                </div>
            </div>

            {/* Supervisor Action Area */}
            <div className="space-y-2">
                <Label className="text-sm font-bold text-foreground">Your Supervisor Rating</Label>
                <RatingScale value={supervisorRating} onChange={onRatingChange} />
                
                {/* Conditional Remarks */}
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isRemarkMandatory ? 'max-h-[250px] opacity-100 mt-6' : 'max-h-0 opacity-0 m-0'}`}>
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-3 mt-4">
                        <div className="flex items-start gap-2 text-primary">
                            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                            <p className="text-xs font-medium leading-relaxed">
                                The difference between the self-rating ({selfRating}) and your rating ({supervisorRating}) is significant. A remark is required to explain this discrepancy.
                            </p>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-foreground">Supervisor Remarks <span className="text-destructive">*</span></Label>
                            <Textarea 
                                value={remark || ""}
                                onChange={(e) => onRemarkChange(e.target.value)}
                                placeholder="Please provide detailed constructive feedback..."
                                className={`resize-none bg-background shadow-sm ${missingRemarkError ? 'border-destructive focus-visible:ring-destructive/50' : 'focus-visible:ring-primary/50'}`}
                                rows={3}
                            />
                            {missingRemarkError && <p className="text-[10px] font-bold text-destructive">Remarks are mandatory to proceed.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}