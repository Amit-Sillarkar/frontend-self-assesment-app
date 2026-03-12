import { 
    FileTextIcon, 
    HelpCircleIcon, 
    XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { Assessment } from "../types"; 

interface ViewAssessmentDialogProps {
    assessment: Assessment | null;
    open: boolean;
    onClose: () => void;
}

function formatDisplayDate(dateString?: string) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric"
    });
}

export function ViewAssessmentDialog({ assessment, open, onClose }: ViewAssessmentDialogProps) {
    if (!assessment) return null;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-[700px] w-[95vw] max-h-[85vh] flex flex-col p-0 overflow-hidden bg-background border-border/60 shadow-xl">
                
                <DialogHeader className="px-5 pt-5 pb-4 border-b border-border bg-card relative overflow-hidden shrink-0">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/40" />
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/10 mt-1">
                            <FileTextIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-left space-y-1 flex-1 pr-6">
                            <div className="flex justify-between items-start gap-4">
                                <DialogTitle className="text-xl font-bold text-foreground leading-tight">{assessment.title}</DialogTitle>
                                <Badge variant={assessment.status === 'published' ? 'default' : 'secondary'} className="capitalize shrink-0 shadow-sm">
                                    {assessment.status || 'Draft'}
                                </Badge>
                            </div>
                            <DialogDescription className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {assessment.description || "No description provided for this assessment."}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Hierarchy</p>
                            <p className="text-sm font-semibold text-foreground capitalize">{assessment.hierarchy || "Default"}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Created At</p>
                            <p className="text-sm font-semibold text-foreground">{formatDisplayDate(assessment.createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Expiry Date</p>
                            <p className="text-sm font-semibold text-foreground">{formatDisplayDate(assessment.expiryDate)}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Applicable Designations</p>
                        <div className="flex flex-wrap gap-2">
                            {assessment.designations?.length > 0 ? (
                                assessment.designations.map(d => (
                                    <Badge key={d} variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs px-2.5 py-0.5 capitalize shadow-sm">
                                        {d.replace("_", " ")}
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-xs text-muted-foreground font-medium bg-muted/30 px-2 py-1 rounded-md">None assigned</span>
                            )}
                        </div>
                    </div>

                    <Separator className="bg-border/50" />
                    
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                                <HelpCircleIcon className="w-4 h-4 text-primary" /> Assessment Questions
                            </h3>
                            <span className="text-xs font-bold text-foreground bg-muted/50 px-2.5 py-1 rounded-md border border-border/50">
                                {assessment.questions?.length || 0} Total
                            </span>
                        </div>

                        {(!assessment.questions || assessment.questions.length === 0) ? (
                            <div className="p-5 rounded-xl border border-dashed border-border/60 text-center text-sm text-muted-foreground bg-muted/20">
                                No questions added to this assessment yet.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {assessment.questions.map((q, index) => {
                                    // Safe fallbacks to prevent undefined errors
                                    const qText = q.text || (q as any).questionText || "Untitled Question";
                                    const qWeight = q.weightage || (q as any).marks || 0;

                                    return (
                                        <div key={q.id || index} className="bg-card border border-border/60 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row justify-between sm:items-start gap-3 hover:shadow-md transition-shadow">
                                            <div className="text-sm font-medium text-foreground leading-relaxed flex-1">
                                                <span className="text-primary font-bold mr-1.5">{index + 1}.</span> {qText}
                                            </div>
                                            <Badge variant="secondary" className="shrink-0 text-[10px] px-2.5 py-1 border-border/50 bg-muted/30 text-muted-foreground self-start mt-0.5">
                                                Weightage: <span className="font-bold ml-1 text-foreground">{qWeight}%</span>
                                            </Badge>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-end px-5 py-3 mt-auto border-t border-border bg-card shrink-0">
                    <Button onClick={onClose} variant="outline" size="sm" className="h-8 w-24 border-border text-foreground hover:bg-muted shadow-sm transition-all">Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}