import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircle, AlertCircle } from "lucide-react";
import type { AssessmentFormData, AssessmentQuestion } from "../../types";

interface Props {
  formData: AssessmentFormData;
  updateForm: (data: Partial<AssessmentFormData>) => void;
  errors: Record<string, string>;
}

export function Step2Questions({ formData, updateForm, errors }: Props) {
  const { questions } = formData;

  const totalWeightage = useMemo(() => {
    return questions.reduce((sum, q) => sum + (Number(q.weightage) || 0), 0);
  }, [questions]);

  const updateQuestion = (id: string, field: keyof AssessmentQuestion, value: string | number) => {
    const updated = questions.map(q => q.id === id ? { ...q, [field]: value } : q);
    updateForm({ questions: updated });
  };

  const addQuestion = () => {
    if (totalWeightage >= 100) return;
    updateForm({ questions: [...questions, { id: Date.now().toString(), text: "", weightage: "" }] });
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      updateForm({ questions: questions.filter(q => q.id !== id) });
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {errors.questions && <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md font-medium"><AlertCircle className="w-4 h-4 shrink-0" /> {errors.questions}</div>}
      {errors.weightage && <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md font-medium"><AlertCircle className="w-4 h-4 shrink-0" /> {errors.weightage}</div>}

      <div className="space-y-4">
        {questions.map((q, index) => (
          <div key={q.id} className="flex flex-col sm:flex-row gap-4 items-start bg-card p-4 rounded-xl border border-border/60 shadow-sm relative group hover:border-primary/30 transition-colors">
            <div className="absolute -left-2 -top-2 w-6 h-6 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
                {index + 1}
            </div>
            <div className="flex-1 w-full space-y-2">
              <Label className="text-xs font-semibold text-foreground">Question Text <span className="text-destructive">*</span></Label>
              <Input placeholder="Enter question..." value={q.text} onChange={(e) => updateQuestion(q.id, 'text', e.target.value)} className={`h-9 ${!q.text.trim() && errors.questions ? "border-destructive" : "focus-visible:ring-primary/50"}`} />
            </div>
            <div className="w-full sm:w-28 space-y-2">
              <Label className="text-xs font-semibold text-foreground">Weightage % <span className="text-destructive">*</span></Label>
              <Input type="number" placeholder="e.g. 20" value={q.weightage} onChange={(e) => updateQuestion(q.id, 'weightage', e.target.value)} className={`h-9 ${(!q.weightage && errors.questions) || totalWeightage > 100 ? "border-destructive" : "focus-visible:ring-primary/50"}`} />
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 sm:mt-6 mt-0 self-end sm:self-auto transition-colors" onClick={() => removeQuestion(q.id)} disabled={questions.length === 1}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border border-dashed border-border/60 mt-2">
        <span className="text-sm font-semibold text-foreground">Total Weightage: <span className={totalWeightage !== 100 ? "text-destructive font-bold" : "text-green-600 font-bold"}>{totalWeightage}%</span> / 100%</span>
        <Button type="button" variant="outline" size="sm" onClick={addQuestion} disabled={totalWeightage >= 100} className="w-full sm:w-auto gap-2 shadow-sm hover:shadow-md transition-all"><PlusCircle className="w-4 h-4" /> Add Question</Button>
      </div>
    </div>
  );
}