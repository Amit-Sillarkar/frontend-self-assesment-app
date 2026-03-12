import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ArrowLeft, CheckCircle2, FilePlusIcon } from "lucide-react";
import { type Assessment, type AssessmentFormData } from "../types";

// Import the beautifully separated steps
import { Step1Details } from "./steps/step1-details";
import { Step2Questions } from "./steps/step2-questions";
import { Step3Designations } from "./steps/step3-designations";
import { Step4Hierarchy } from "./steps/step4-hierarchy";

interface CreateAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (assessment: Assessment) => void;
  initialData?: Assessment | null;
}

const EMPTY_FORM: AssessmentFormData = {
    title: "", description: "", expiryDate: "",
    questions: [{ id: Date.now().toString(), text: "", weightage: "" }],
    designations: [], hierarchy: "default", 
    hierarchySteps: [{ id: `self-${Date.now()}`, type: "self" }] 
};

export function CreateAssessmentDialog({ open, onOpenChange, onSave, initialData }: CreateAssessmentDialogProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<AssessmentFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [step4Error, setStep4Error] = useState("");

  const updateForm = (updates: Partial<AssessmentFormData>) => {
      setFormData(prev => ({ ...prev, ...updates }));
      setErrors({}); // clear errors on typing
  };

  useEffect(() => {
    if (open) {
      if (initialData) {
          setFormData({
              title: initialData.title,
              description: initialData.description,
              expiryDate: initialData.expiryDate || "",
              questions: initialData.questions?.length ? initialData.questions : EMPTY_FORM.questions,
              designations: initialData.designations || [],
              hierarchy: initialData.hierarchy || "default",
              hierarchySteps: initialData.hierarchySteps?.length ? initialData.hierarchySteps : EMPTY_FORM.hierarchySteps
          });
      } else {
          const draft = localStorage.getItem("draft_assessment_v2");
          if (draft) {
              const parsed = JSON.parse(draft);
              setFormData(parsed.formData);
              setStep(parsed.step || 1);
          } else {
              setFormData(EMPTY_FORM);
              setStep(1);
          }
      }
      setErrors({});
    }
  }, [open, initialData]);

  // Save Draft automatically
  useEffect(() => {
      if (open && !initialData && (formData.title || formData.questions.length > 1)) {
          localStorage.setItem("draft_assessment_v2", JSON.stringify({ formData, step }));
      }
  }, [formData, step, open, initialData]);

  const validateStep = () => {
    const newErrors: any = {};
    if (step === 1) {
        if (!formData.title.trim()) newErrors.title = "This field is required";
        if (!formData.description.trim()) newErrors.description = "This field is required";
    }
    if (step === 2) {
        let hasEmpty = false;
        let totalW = 0;
        formData.questions.forEach(q => {
            if (!q.text.trim() || !q.weightage) hasEmpty = true;
            totalW += (Number(q.weightage) || 0);
        });
        if (hasEmpty) newErrors.questions = "Fill all questions and weightages.";
        if (totalW !== 100) newErrors.weightage = "Total weightage must be exactly 100%.";
    }
    if (step === 3) {
        if (formData.designations.length === 0) newErrors.designations = "Select at least one designation.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep(p => Math.min(p + 1, 4));
  };

  const handleSave = () => {
    if (step4Error) return; // Prevent save if Step 4 validation is failing

    const assessmentToSave: Assessment = {
      id: initialData ? initialData.id : `new-${Date.now()}`,
      ...formData,
      createdAt: initialData ? initialData.createdAt : new Date().toISOString().split('T')[0],
      status: "published",
    };

    onSave(assessmentToSave);
    localStorage.removeItem("draft_assessment_v2");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] w-[95vw] h-[85vh] flex flex-col p-0 overflow-hidden bg-background border-border/60 shadow-xl">
        
        {/* ── Fixed Header ── */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-card relative overflow-hidden shrink-0">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/40" />
          
          <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/10">
                  <FilePlusIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left space-y-1">
                  <DialogTitle className="text-xl font-bold text-foreground">
                      {initialData ? "Edit Assessment" : "Create Assessment"}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                      Step {step} of 4 — {
                          step === 1 ? "General Information" : 
                          step === 2 ? "Questions & Weightage" : 
                          step === 3 ? "Target Audience" : "Approval Hierarchy"
                      }
                  </DialogDescription>
              </div>
          </div>
          <div className="flex gap-2 mt-4 px-1">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-primary shadow-sm' : 'bg-muted/50'}`} />
            ))}
          </div>
        </DialogHeader>

        {/* ── Dynamic Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
            {step === 1 && <Step1Details formData={formData} updateForm={updateForm} errors={errors} />}
            {step === 2 && <Step2Questions formData={formData} updateForm={updateForm} errors={errors} />}
            {step === 3 && <Step3Designations formData={formData} updateForm={updateForm} errors={errors} />}
            {step === 4 && <Step4Hierarchy formData={formData} updateForm={updateForm} onErrorChange={setStep4Error} />}
        </div>

        <Separator className="bg-border/60" />
        
        {/* ── Fixed Footer ── */}
        <div className="flex items-center justify-between px-6 py-4 bg-card shrink-0">
          <Button variant="outline" onClick={() => setStep(p => Math.max(p - 1, 1))} disabled={step === 1} className="w-24 shadow-sm border-border/60 hover:bg-muted transition-all">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          {step < 4 ? (
            <Button onClick={handleNext} className="w-24 shadow-sm hover:shadow-md transition-all bg-primary text-primary-foreground hover:bg-primary/90">
                Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={!!step4Error} className="shadow-sm hover:shadow-md transition-all bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                <CheckCircle2 className="w-4 h-4 mr-2" /> {initialData ? "Save Changes" : "Publish"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}