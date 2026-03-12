import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import type { AssessmentFormData } from "../../types";
import { DESIGNATION_OPTIONS } from "@/mockdata/assessments";

interface Props {
  formData: AssessmentFormData;
  updateForm: (data: Partial<AssessmentFormData>) => void;
  errors: Record<string, string>;
}

export function Step3Designations({ formData, updateForm, errors }: Props) {
  const { designations } = formData;

  const toggleDesignation = (id: string) => {
    const updated = designations.includes(id) ? designations.filter(d => d !== id) : [...designations, id];
    updateForm({ designations: updated });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <Label className="text-base text-foreground font-semibold">Applicable Designations <span className="text-destructive">*</span></Label>
      <p className="text-xs text-muted-foreground -mt-1 mb-4">Select all roles that are required to take this assessment.</p>
      {errors.designations && <p className="text-sm text-destructive font-medium bg-destructive/10 p-2 rounded-md">{errors.designations}</p>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DESIGNATION_OPTIONS.map((dsg) => {
            const isSelected = designations.includes(dsg.id);
            return (
                <div 
                    key={dsg.id} 
                    onClick={() => toggleDesignation(dsg.id)}
                    className={`flex items-center space-x-3 p-3.5 border-2 rounded-xl cursor-pointer select-none transition-all duration-200 ${isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/60 hover:bg-muted/50'}`}
                >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/50 bg-background'}`}>
                        {isSelected && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <span className={`font-semibold text-sm ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>{dsg.label}</span>
                </div>
            )
        })}
      </div>
    </div>
  );
}