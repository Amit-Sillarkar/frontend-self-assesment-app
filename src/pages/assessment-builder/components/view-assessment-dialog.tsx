// src/pages/assessment-builder/components/view-assessment-dialog.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Assessment } from "../types";

const formatDesignation = (id: string) => {
  return id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

interface ViewAssessmentDialogProps {
  assessment: Assessment | null;
  onClose: () => void;
}

export function ViewAssessmentDialog({ assessment, onClose }: ViewAssessmentDialogProps) {
  if (!assessment) return null;

  return (
    <Dialog open={!!assessment} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[650px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assessment Details</DialogTitle>
          <DialogDescription>Complete information about the assessment.</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold leading-tight">{assessment.title}</h3>
            <p className="text-sm text-muted-foreground">{assessment.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Hierarchy</p>
              <p className="text-sm font-semibold capitalize">{assessment.hierarchy}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Created At</p>
              <p className="text-sm font-semibold">{new Date(assessment.createdAt).toLocaleDateString()}</p>
            </div>
            {assessment.hierarchy === "custom" && (
              <>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Custom Manager ID</p>
                  <p className="text-sm font-semibold font-mono">{assessment.customManagerId || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Custom Supervisor ID</p>
                  <p className="text-sm font-semibold font-mono">{assessment.customSupervisorId || "—"}</p>
                </div>
              </>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Applicable Designations</p>
            <div className="flex flex-wrap gap-2">
              {assessment.designations.map(dsg => (
                <Badge key={dsg} variant="secondary" className="px-2 py-0.5 text-xs">
                  {formatDesignation(dsg)}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-sm font-semibold">Questions ({assessment.questions.length})</p>
            <div className="space-y-3">
              {assessment.questions.map((q, index) => (
                <div key={q.id} className="bg-muted/30 p-3 rounded-lg border border-border/50 flex justify-between gap-4 items-start">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground block mb-1">Q{index + 1}.</span>
                    <p className="text-sm text-foreground">{q.text}</p>
                  </div>
                  <Badge variant="outline" className="shrink-0 bg-background">
                    {q.weightage}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>

        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}