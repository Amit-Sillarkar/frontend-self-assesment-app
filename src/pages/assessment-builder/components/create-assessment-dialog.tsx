import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {type Assessment, type AssessmentQuestion } from "../types";
import { PlusCircle, Trash2, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { DESIGNATION_OPTIONS, MOCK_MANAGERS, MOCK_SUPERVISORS } from "@/mockdata/assessments";


interface CreateAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (assessment: Assessment) => void;
  initialData?: Assessment | null;
}

export function CreateAssessmentDialog({ open, onOpenChange, onSave, initialData }: CreateAssessmentDialogProps) {
  const [step, setStep] = useState(1);
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([{ id: Date.now().toString(), text: "", weightage: "" }]);
  const [designations, setDesignations] = useState<string[]>([]);
  const [hierarchy, setHierarchy] = useState<"default" | "custom">("default");
  const [customManagerId, setCustomManagerId] = useState("");
  const [customSupervisorId, setCustomSupervisorId] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Populate data if Editing
  useEffect(() => {
    if (open) {
      if (initialData) {
        setTitle(initialData.title);
        setDescription(initialData.description);
        setQuestions(initialData.questions);
        setDesignations(initialData.designations);
        setHierarchy(initialData.hierarchy);
        setCustomManagerId(initialData.customManagerId || "");
        setCustomSupervisorId(initialData.customSupervisorId || "");
      } else {
        // Reset form for New Assessment
        setStep(1);
        setTitle("");
        setDescription("");
        setQuestions([{ id: Date.now().toString(), text: "", weightage: "" }]);
        setDesignations([]);
        setHierarchy("default");
        setCustomManagerId("");
        setCustomSupervisorId("");
      }
      setErrors({});
      setStep(1);
    }
  }, [open, initialData]);

  const totalWeightage = useMemo(() => {
    return questions.reduce((sum, q) => sum + (Number(q.weightage) || 0), 0);
  }, [questions]);

  // Validations
  const validateStep1 = () => {
    const newErrors: any = {};
    if (!title.trim()) newErrors.title = "This field is required";
    if (!description.trim()) newErrors.description = "This field is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: any = {};
    let hasEmptyQuestion = false;
    questions.forEach((q) => {
      if (!q.text.trim() || !q.weightage) hasEmptyQuestion = true;
    });

    if (hasEmptyQuestion) newErrors.questions = "Please fill out all question texts and weightages.";
    if (totalWeightage !== 100) newErrors.weightage = "Total weightage must be exactly 100%.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && totalWeightage === 100;
  };

  const validateStep3 = () => {
    const newErrors: any = {};
    if (designations.length === 0) newErrors.designations = "Please select at least one designation.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors: any = {};
    if (hierarchy === "custom") {
      if (!customManagerId) newErrors.manager = "Please select a manager.";
      if (!customSupervisorId) newErrors.supervisor = "Please select a supervisor.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setErrors({});
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const addQuestion = () => {
    const lastQ = questions[questions.length - 1];
    if (!lastQ.text.trim() || !lastQ.weightage) {
      setErrors({ ...errors, questions: "Please add question and weightage for the current row first." });
      return;
    }
    if (totalWeightage >= 100) {
      setErrors({ ...errors, weightage: "Total weightage is already 100% or more. Cannot add another." });
      return;
    }
    setErrors({});
    setQuestions([...questions, { id: Date.now().toString(), text: "", weightage: "" }]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
      setErrors({});
    }
  };

  const updateQuestion = (id: string, field: keyof AssessmentQuestion, value: string | number) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
    setErrors({});
  };

  const toggleDesignation = (id: string) => {
    setDesignations(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
    setErrors({});
  };

  const handleSave = () => {
    if (!validateStep4()) return;

    const assessmentToSave: Assessment = {
      id: initialData ? initialData.id : `new-${Date.now()}`,
      title,
      description,
      questions,
      designations,
      hierarchy,
      customManagerId: hierarchy === "custom" ? customManagerId : undefined,
      customSupervisorId: hierarchy === "custom" ? customSupervisorId : undefined,
      createdAt: initialData ? initialData.createdAt : new Date().toISOString().split('T')[0],
    };

    onSave(assessmentToSave);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-162.5 w-[95vw] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl">
            {initialData ? "Edit Assessment" : "Create Assessment"} - Step {step} of 4
          </DialogTitle>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-2 flex-1 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
            ))}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* STEP 1: Details */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label>Assessment Title <span className="text-destructive">*</span></Label>
                <Input value={title} onChange={(e) => { setTitle(e.target.value); setErrors({ ...errors, title: "" }); }} className={errors.title ? "border-destructive" : ""} />
                {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
              </div>
              <div className="space-y-2">
                <Label>Description <span className="text-destructive">*</span></Label>
                <Textarea rows={4} value={description} onChange={(e) => { setDescription(e.target.value); setErrors({ ...errors, description: "" }); }} className={errors.description ? "border-destructive" : ""} />
                {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
              </div>
            </div>
          )}

          {/* STEP 2: Questions & Weightage */}
          {step === 2 && (
            <div className="space-y-5">
              {errors.questions && <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md"><AlertCircle className="w-4 h-4" /> {errors.questions}</div>}
              {errors.weightage && <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md"><AlertCircle className="w-4 h-4" /> {errors.weightage}</div>}

              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div key={q.id} className="flex flex-col sm:flex-row gap-3 items-start bg-muted/20 p-4 rounded-md border border-border">
                    <div className="flex-1 w-full space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground">Question {index + 1} <span className="text-destructive">*</span></Label>
                      <Input value={q.text} onChange={(e) => updateQuestion(q.id, 'text', e.target.value)} className={!q.text.trim() && errors.questions ? "border-destructive" : ""} />
                    </div>
                    <div className="w-full sm:w-30 space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground">Weightage (%) <span className="text-destructive">*</span></Label>
                      <Input type="number" value={q.weightage} onChange={(e) => updateQuestion(q.id, 'weightage', e.target.value)} className={(!q.weightage && errors.questions) || totalWeightage > 100 ? "border-destructive" : ""} />
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive sm:mt-6 mt-0 self-end sm:self-auto hover:bg-destructive/10" onClick={() => removeQuestion(q.id)} disabled={questions.length === 1}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/40 p-3 rounded-md border border-dashed">
                <span className="text-sm font-medium">Total Weightage: <span className={totalWeightage !== 100 ? "text-destructive font-bold" : "text-green-600 font-bold"}>{totalWeightage}%</span> / 100%</span>
                <Button type="button" variant="outline" size="sm" onClick={addQuestion} className="w-full sm:w-auto gap-2"><PlusCircle className="w-4 h-4" /> Add Question</Button>
              </div>
            </div>
          )}

          {/* STEP 3: Designations */}
          {step === 3 && (
            <div className="space-y-4">
              <Label className="text-base">Applicable Designations <span className="text-destructive">*</span></Label>
              {errors.designations && <p className="text-sm text-destructive font-medium">{errors.designations}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {DESIGNATION_OPTIONS.map((dsg) => (
                  <label key={dsg.id} className={`flex items-center space-x-3 p-3 border rounded-md cursor-pointer transition-colors ${designations.includes(dsg.id) ? 'border-primary bg-primary/5' : 'hover:bg-muted/50 border-border'}`}>
                    <input type="checkbox" className="h-4 w-4 rounded text-primary focus:ring-primary accent-primary" checked={designations.includes(dsg.id)} onChange={() => toggleDesignation(dsg.id)} />
                    <span className="font-medium text-sm text-foreground">{dsg.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Approval Hierarchy */}
          {step === 4 && (
            <div className="space-y-4">
              <Label className="text-base">Select Hierarchy Type <span className="text-destructive">*</span></Label>
              <div className="grid gap-4 mt-2">
                <label className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${hierarchy === 'default' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
                  <input type="radio" name="hierarchy" value="default" checked={hierarchy === 'default'} onChange={() => setHierarchy('default')} className="w-4 h-4 mt-0.5 text-primary accent-primary" />
                  <div>
                    <h4 className="font-medium text-foreground">Default Hierarchy</h4>
                    <p className="text-sm text-muted-foreground mt-1">Follows standard reporting line (User &rarr; Supervisor &rarr; Manager).</p>
                  </div>
                </label>
                
                <label className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${hierarchy === 'custom' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
                  <input type="radio" name="hierarchy" value="custom" checked={hierarchy === 'custom'} onChange={() => setHierarchy('custom')} className="w-4 h-4 mt-0.5 text-primary accent-primary" />
                  <div>
                    <h4 className="font-medium text-foreground">Custom Hierarchy</h4>
                    <p className="text-sm text-muted-foreground mt-1">Assign specific reviewers manually.</p>
                  </div>
                </label>
              </div>

              {/* DYNAMIC CUSTOM HIERARCHY DROPDOWNS */}
              {hierarchy === 'custom' && (
                <div className="mt-6 p-4 border border-dashed rounded-lg bg-muted/20 space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <Label>Select Supervisor <span className="text-destructive">*</span></Label>
                    <Select value={customSupervisorId} onValueChange={(v) => { setCustomSupervisorId(v); setErrors({ ...errors, supervisor: "" }) }}>
                      <SelectTrigger className={errors.supervisor ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select a supervisor..." />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_SUPERVISORS.map((sup) => (
                          <SelectItem key={sup.id} value={sup.id}>{sup.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.supervisor && <p className="text-xs text-destructive">{errors.supervisor}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Select Manager <span className="text-destructive">*</span></Label>
                    <Select value={customManagerId} onValueChange={(v) => { setCustomManagerId(v); setErrors({ ...errors, manager: "" }) }}>
                      <SelectTrigger className={errors.manager ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select a manager..." />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_MANAGERS.map((mgr) => (
                          <SelectItem key={mgr.id} value={mgr.id}>{mgr.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.manager && <p className="text-xs text-destructive">{errors.manager}</p>}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <Separator />
        
        <div className="flex items-center justify-between w-full px-6 py-4 mt-auto">
          <Button variant="outline" onClick={handleBack} disabled={step === 1} className="w-24">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          {step < 4 ? (
            <Button onClick={handleNext} className="w-24">Next <ArrowRight className="w-4 h-4 ml-2" /></Button>
          ) : (
            <Button onClick={handleSave}><CheckCircle2 className="w-4 h-4 mr-2" /> {initialData ? "Save Changes" : "Publish"}</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}