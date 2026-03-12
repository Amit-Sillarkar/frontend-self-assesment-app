import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Trash2, PlusCircle, AlertTriangle, LockIcon } from "lucide-react";
import { HIERARCHY_STEP_LABELS, type AssessmentFormData, type HierarchyStep, type HierarchyStepType } from "../../types";
import { MOCK_REVIEWERS } from "@/mockdata/assessments";
import { ASSESSMENT_MESSAGES } from "@/constants/messages";

interface Props {
  formData: AssessmentFormData;
  updateForm: (data: Partial<AssessmentFormData>) => void;
  onErrorChange: (error: string) => void;
}


export function Step4Hierarchy({ formData, updateForm, onErrorChange }: Props) {
  const { hierarchy, hierarchySteps } = formData;
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [localError, setLocalError] = useState("");

  // ── Strict Validation Rules ──
  useEffect(() => {
      if (hierarchy === 'default') {
          setLocalError("");
          onErrorChange("");
          return;
      }

      let error = "";
      const selfIdx = hierarchySteps.findIndex(s => s.type === 'self');
      const supIdx = hierarchySteps.findIndex(s => s.type === 'supervisor');
      const manIdx = hierarchySteps.findIndex(s => s.type === 'manager');
      
      if (selfIdx !== 0) error = ASSESSMENT_MESSAGES.Self_Evaluation_first_step;
      else if (supIdx === -1) error = ASSESSMENT_MESSAGES.Reporting_Supervisor_is_mandatory;
      else if (manIdx === -1) error = ASSESSMENT_MESSAGES.Reporting_Manager_is_mandatory;
      else if (manIdx < supIdx) error = ASSESSMENT_MESSAGES.Reporting_Manager_order;
      else if (hierarchySteps.some(s => s.type === 'specific_user' && !s.specificUserId)) error = ASSESSMENT_MESSAGES.Specific_User_selection;

      setLocalError(error);
      onErrorChange(error);
  }, [hierarchySteps, hierarchy, onErrorChange]);

  const addStep = (type: HierarchyStepType) => {
      const newStep: HierarchyStep = { id: Date.now().toString(), type };
      updateForm({ hierarchySteps: [...hierarchySteps, newStep] });
  };

  const removeStep = (id: string) => {
      updateForm({ hierarchySteps: hierarchySteps.filter(s => s.id !== id) });
  };

  const updateSpecificUser = (id: string, userId: string) => {
      updateForm({ hierarchySteps: hierarchySteps.map(s => s.id === id ? { ...s, specificUserId: userId } : s) });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
      if (hierarchySteps[index].type === 'self') {
          e.preventDefault(); // Prevent dragging 'self' completely
          return;
      }
      setDraggedIdx(index);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      if (draggedIdx === null || draggedIdx === dropIndex) return;
      if (dropIndex === 0 && hierarchySteps[0].type === 'self') return;

      const newSteps = [...hierarchySteps];
      const draggedItem = newSteps[draggedIdx];
      newSteps.splice(draggedIdx, 1);
      newSteps.splice(dropIndex, 0, draggedItem);
      updateForm({ hierarchySteps: newSteps });
      setDraggedIdx(null);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <Label className="text-base text-foreground font-semibold">Approval Hierarchy <span className="text-destructive">*</span></Label>
      
      <div className="grid gap-4 mt-2">
        <div onClick={() => updateForm({ hierarchy: 'default' })} className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer select-none transition-all duration-200 ${hierarchy === 'default' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/60 hover:bg-muted/50'}`}>
          <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center transition-colors ${hierarchy === 'default' ? 'border-primary bg-primary' : 'border-muted-foreground/50 bg-background'}`}>
            {hierarchy === 'default' && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
          </div>
          <div>
            <h4 className={`font-semibold ${hierarchy === 'default' ? 'text-primary' : 'text-foreground'}`}>Default Hierarchy</h4>
            <p className="text-sm text-muted-foreground mt-1">Follows standard sequence: Self &rarr; Supervisor &rarr; Manager.</p>
          </div>
        </div>
        
        <div onClick={() => {
            const updates: Partial<AssessmentFormData> = { hierarchy: 'custom' };
            if (hierarchySteps.length === 0) updates.hierarchySteps = [{ id: `self-${Date.now()}`, type: 'self' }];
            updateForm(updates);
        }} className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer select-none transition-all duration-200 ${hierarchy === 'custom' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/60 hover:bg-muted/50'}`}>
          <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center transition-colors ${hierarchy === 'custom' ? 'border-primary bg-primary' : 'border-muted-foreground/50 bg-background'}`}>
            {hierarchy === 'custom' && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
          </div>
          <div>
            <h4 className={`font-semibold ${hierarchy === 'custom' ? 'text-primary' : 'text-foreground'}`}>Custom Hierarchy</h4>
            <p className="text-sm text-muted-foreground mt-1">Build a dynamic multi-step approval workflow. Supervisor & Manager are mandatory.</p>
          </div>
        </div>
      </div>

      {/* ── Custom Hierarchy Builder ── */}
      {hierarchy === 'custom' && (
        <div className="mt-6 p-5 border border-dashed border-primary/30 rounded-xl bg-muted/20 space-y-4 animate-in fade-in slide-in-from-top-4">
          
          {localError && (
              <div className="flex items-center gap-2 bg-destructive/10 text-destructive text-sm font-medium p-3 rounded-lg border border-destructive/20 mb-4 shadow-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {localError}
              </div>
          )}

          <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Workflow Steps</h4>
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/10 bg-background">
                          <PlusCircle className="w-4 h-4" /> Add New Step
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 shadow-xl">
                      <DropdownMenuItem onClick={() => addStep('supervisor')}>Reporting Supervisor</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addStep('manager')}>Reporting Manager</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addStep('specific_user')}>Specific User</DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
          </div>

          <div className="space-y-3 pt-2">
              {hierarchySteps.map((step, index) => {
                  const isSelf = step.type === 'self';
                  return (
                      <div 
                          key={step.id} 
                          draggable={!isSelf}
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDrop={(e) => handleDrop(e, index)}
                          className={`flex items-center gap-3 p-3.5 bg-card border rounded-xl shadow-sm transition-all 
                              ${draggedIdx === index ? 'opacity-50 scale-[0.98]' : 'hover:border-primary/40'} 
                              ${isSelf ? 'border-primary/30 bg-primary/5' : ''}`
                          }
                      >
                          {isSelf ? (
                              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                                  <LockIcon className="w-3.5 h-3.5 text-primary/60" />
                              </div>
                          ) : (
                              <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab active:cursor-grabbing shrink-0" />
                          )}

                          <Badge variant="secondary" className={`shrink-0 w-16 justify-center ${isSelf ? 'bg-primary/20 text-primary border-primary/30' : ''}`}>
                              Step {index + 1}
                          </Badge>
                          
                          <div className="flex-1 pl-2">
                              {step.type === 'specific_user' ? (
                                  <Select value={step.specificUserId} onValueChange={(v) => updateSpecificUser(step.id, v)}>
                                      <SelectTrigger className="h-9 bg-background focus:ring-primary/50">
                                          <SelectValue placeholder="Select a reviewer..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                          {MOCK_REVIEWERS.map(user => (
                                              <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                                          ))}
                                      </SelectContent>
                                  </Select>
                              ) : (
                                  <span className={`text-sm font-semibold ${isSelf ? 'text-primary' : 'text-foreground'}`}>
                                      {HIERARCHY_STEP_LABELS[step.type]}
                                  </span>
                              )}
                          </div>
                          {isSelf ? (
                              <div className="w-8 h-8 shrink-0" />
                          ) : (
                              <Button variant="ghost" size="icon" onClick={() => removeStep(step.id)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                              </Button>
                          )}
                      </div>
                  );
              })}
          </div>
        </div>
      )}
    </div>
  );
}