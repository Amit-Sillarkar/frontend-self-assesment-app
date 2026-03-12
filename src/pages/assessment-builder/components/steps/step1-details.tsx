import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AssessmentFormData } from "../../types";

interface Props {
  formData: AssessmentFormData;
  updateForm: (data: Partial<AssessmentFormData>) => void;
  errors: Record<string, string>;
}

export function Step1Details({ formData, updateForm, errors }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <Label className="text-foreground font-semibold">Assessment Title <span className="text-destructive">*</span></Label>
        <Input 
          placeholder="e.g. Q3 Security Compliance" 
          value={formData.title} 
          onChange={(e) => updateForm({ title: e.target.value })} 
          className={`h-10 ${errors.title ? "border-destructive focus-visible:ring-destructive/50" : "focus-visible:ring-primary/50"}`} 
        />
        {errors.title && <p className="text-xs text-destructive font-medium">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-foreground font-semibold">Description <span className="text-destructive">*</span></Label>
        <Textarea 
          placeholder="Provide detailed instructions..." 
          rows={4} 
          value={formData.description} 
          onChange={(e) => updateForm({ description: e.target.value })} 
          className={errors.description ? "border-destructive focus-visible:ring-destructive/50" : "focus-visible:ring-primary/50"} 
        />
        {errors.description && <p className="text-xs text-destructive font-medium">{errors.description}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-foreground font-semibold">Expiry Date <span className="text-muted-foreground font-normal">(Optional)</span></Label>
        <Input 
          type="date" 
          value={formData.expiryDate} 
          onChange={(e) => updateForm({ expiryDate: e.target.value })} 
          className="h-10 focus-visible:ring-primary/50" 
        />
      </div>
    </div>
  );
}