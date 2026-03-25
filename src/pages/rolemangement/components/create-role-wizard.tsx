import { useState, useEffect } from "react";
import { ChevronRightIcon, ChevronLeftIcon, ShieldPlusIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import WizardStepper from "./wizard-stepper";
import Step1DefineRole from "./step1-define-role";
import Step2SelectEmployees from "./step2-select-employees";
import Step3SetPermissions from "./step3-set-permissions";

import { ROLE_MESSAGES } from "@/constants/messages";
import type { CustomRoleFormData } from "../types";

const EMPTY: CustomRoleFormData = {
  roleName: "",
  assignedEmployeeIds: [],
  permissionIds: [], 
};

interface Props {
  open: boolean;
  existingRoleNames: string[];
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (data: CustomRoleFormData) => void;
}

export default function CreateRoleWizard({ open, existingRoleNames, isSubmitting, onClose, onSubmit }: Props) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CustomRoleFormData>(EMPTY);
  const [errors, setErrors] = useState({ step1: "", step2: "", step3: "" });

  useEffect(() => {
      if (open) {
          const savedDraft = localStorage.getItem("draft_create_custom_role");
          if (savedDraft) {
              const parsed = JSON.parse(savedDraft);
              // Merge with EMPTY to ensure arrays are never undefined
              setForm({
                  roleName: parsed.form?.roleName || "",
                  assignedEmployeeIds: parsed.form?.assignedEmployeeIds || [],
                  permissionIds: parsed.form?.permissionIds || [],
              });
              setStep(parsed.step || 1);
          } else {
              setForm(EMPTY);
              setStep(1);
          }
          setErrors({ step1: "", step2: "", step3: "" });
      }
  }, [open]);

  useEffect(() => {
      if (open && (form.roleName || form.assignedEmployeeIds?.length > 0 || form.permissionIds?.length > 0)) {
          localStorage.setItem("draft_create_custom_role", JSON.stringify({ form, step }));
      }
  }, [form, step, open]);

  function validateStep1(): boolean {
    if (!form.roleName.trim()) {
      setErrors((e) => ({ ...e, step1: ROLE_MESSAGES.STEP1_INCOMPLETE }));
      return false;
    }
    if (existingRoleNames.map((n) => n.toLowerCase()).includes(form.roleName.trim().toLowerCase())) {
      setErrors((e) => ({ ...e, step1: ROLE_MESSAGES.ROLE_EXISTS(form.roleName.trim()) }));
      return false;
    }
    setErrors((e) => ({ ...e, step1: "" }));
    return true;
  }

  function validateStep2(): boolean {
    if (form.assignedEmployeeIds.length === 0) {
      setErrors((e) => ({ ...e, step2: ROLE_MESSAGES.STEP2_INCOMPLETE }));
      return false;
    }
    setErrors((e) => ({ ...e, step2: "" }));
    return true;
  }

  function validateStep3(): boolean {
    if (form.permissionIds.length === 0) {
      setErrors((e) => ({ ...e, step3: ROLE_MESSAGES.STEP3_INCOMPLETE }));
      return false;
    }
    setErrors((e) => ({ ...e, step3: "" }));
    return true;
  }

  function handleNext() {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
  }

  function handleBack() {
    if (step > 1) setStep((s) => s - 1);
  }

  function handleAssign() {
    if (validateStep1() && validateStep2() && validateStep3()) {
      onSubmit(form);
      localStorage.removeItem("draft_create_custom_role");
    }
  }

  const STEP_LABELS: Record<number, string> = { 1: "Define Role", 2: "Select Employees", 3: "Set Permissions" };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[650px] w-[95vw] h-[85vh] flex flex-col p-0 overflow-hidden bg-background border-border/60 shadow-xl">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border bg-card relative overflow-hidden shrink-0">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/40" />
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/10">
                  <ShieldPlusIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left space-y-0.5">
                  <DialogTitle className="text-lg font-bold text-foreground">Create Custom Role</DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">Define a role, assign employees, and configure permissions.</DialogDescription>
              </div>
          </div>
        </DialogHeader>

        <div className="px-5 pt-5 pb-2 shrink-0 flex justify-center w-full bg-background">
          <div className="w-full max-w-md"><WizardStepper currentStep={step} /></div>
        </div>

        <div className="flex-1 min-h-0 px-5 pb-5 flex flex-col">
          {step === 1 && <Step1DefineRole roleName={form.roleName} onChange={(v) => setForm((f) => ({ ...f, roleName: v }))} error={errors.step1} />}
          {step === 2 && <Step2SelectEmployees selected={form.assignedEmployeeIds} onChange={(ids) => setForm((f) => ({ ...f, assignedEmployeeIds: ids }))} error={errors.step2} />}
          {step === 3 && <Step3SetPermissions selected={form.permissionIds} onChange={(perms) => setForm((f) => ({ ...f, permissionIds: perms }))} error={errors.step3} />}
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-card shrink-0">
          <Button variant="outline" size="sm" onClick={step === 1 ? onClose : handleBack} className="h-8 border-border text-xs text-foreground hover:bg-muted shadow-sm transition-all">
            {step === 1 ? "Cancel" : <span className="flex items-center gap-1"><ChevronLeftIcon className="w-3.5 h-3.5" /> Back</span>}
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider hidden sm:inline-block">Step {step} of 3 — {STEP_LABELS[step]}</span>
            {step < 3 ? (
              <Button size="sm" onClick={handleNext} className="h-8 gap-1 text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all">
                Next <ChevronRightIcon className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button 
                size="sm" 
                onClick={handleAssign} 
                disabled={form.permissionIds.length === 0 || isSubmitting}
                className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all"
              >
                {isSubmitting ? (
                   <>
                     <Loader2Icon className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                     Assigning...
                   </>
                ) : (
                   "Assign Role"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}