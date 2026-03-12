import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { PlusIcon, EyeIcon, PencilIcon, Trash2Icon, MoreVertical, FileQuestion, Network, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PageHeader from "@/components/page-header";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { useToast } from "@/components/toast-notification";

import { ViewAssessmentDialog } from "./components/view-assessment-dialog";
import { CreateAssessmentDialog } from "./components/create-assessment-dialog";
import { initialAssessments, DESIGNATION_OPTIONS } from "@/mockdata/assessments";
import type { Assessment } from "./types";

export default function AssessmentBuilderPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const [assessments, setAssessments] = useState<Assessment[]>(initialAssessments || []);
  const [search, setSearch] = useState("");
  const [designationFilter, setDesignationFilter] = useState("all");

  const isCreateOpen = searchParams.get("createAssessment") === "true";
  const viewAssessmentId = searchParams.get("viewAssessment");
  const editAssessmentId = searchParams.get("editAssessment");
  const deleteAssessmentId = searchParams.get("deleteAssessment");

  const viewAssessmentData = useMemo(() => viewAssessmentId ? assessments.find((a) => a.id === viewAssessmentId) || null : null, [viewAssessmentId, assessments]);
  const editAssessmentData = useMemo(() => editAssessmentId ? assessments.find((a) => a.id === editAssessmentId) || null : null, [editAssessmentId, assessments]);
  const deleteAssessmentData = useMemo(() => deleteAssessmentId ? assessments.find((a) => a.id === deleteAssessmentId) || null : null, [deleteAssessmentId, assessments]);

  const clearModals = () => {
    searchParams.delete("createAssessment");
    searchParams.delete("viewAssessment");
    searchParams.delete("editAssessment");
    searchParams.delete("deleteAssessment");
    setSearchParams(searchParams);
  };

  const filteredAssessments = useMemo(() => {
    const q = search.toLowerCase();
    return assessments.filter((a) => {
      const matchSearch = !q || a.title.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q);
      const matchDesignation = designationFilter === "all" || a.designations?.includes(designationFilter);
      return matchSearch && matchDesignation;
    });
  }, [assessments, search, designationFilter]);

  const handleSaveAssessment = (savedAssessment: Assessment) => {
    setAssessments((prev) => {
      const exists = prev.find((a) => a.id === savedAssessment.id);
      if (exists) return prev.map((a) => (a.id === savedAssessment.id ? savedAssessment : a));
      return [savedAssessment, ...prev];
    });
    clearModals();
    toast.success("Assessment saved successfully.");
  };

  function handleDelete() {
    if (!deleteAssessmentData) return;
    setAssessments((prev) => prev.filter((a) => a.id !== deleteAssessmentData.id));
    clearModals();
    if (toast.deleted) toast.deleted("Assessment deleted successfully.");
    else toast.success("Assessment deleted successfully.");
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <PageHeader title="Assessment Builder" subtitle="Create and manage compliance tests and training quizzes">
        <Button size="sm" className="gap-2 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5" onClick={() => { searchParams.set("createAssessment", "true"); setSearchParams(searchParams); }}>
          <PlusIcon className="w-4 h-4" /> Create Assessment
        </Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-xl border border-border/60 shadow-sm">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search assessments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10 focus-visible:ring-primary/50" />
        </div>
        <Select value={designationFilter} onValueChange={setDesignationFilter}>
          <SelectTrigger className="w-full sm:w-[220px] h-10">
            <SelectValue placeholder="All Designations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Designations</SelectItem>
            {DESIGNATION_OPTIONS.map((opt) => (<SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      {filteredAssessments.length === 0 ? (
        <div className="p-12 text-center bg-card rounded-xl border border-dashed border-border/60 text-muted-foreground">No assessments found matching your search.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAssessments.map((assessment) => (
            <div key={assessment.id} className="bg-card border border-border/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-wrap gap-1.5 pr-4">
                  {assessment.designations?.slice(0, 2).map((d) => (
                    <Badge key={d} variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] px-2 py-0 capitalize">{d.replace("_", " ")}</Badge>
                  ))}
                  {(assessment.designations?.length || 0) > 2 && (
                    <Badge variant="outline" className="bg-muted text-muted-foreground border-border/60 text-[10px] px-2 py-0">+{(assessment.designations?.length || 0) - 2}</Badge>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2 text-muted-foreground hover:text-foreground"><MoreVertical className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 shadow-xl border-border/60">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => { searchParams.set("viewAssessment", assessment.id); setSearchParams(searchParams); }}>
                      <EyeIcon className="mr-2 h-4 w-4 text-muted-foreground" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => { searchParams.set("editAssessment", assessment.id); setSearchParams(searchParams); }}>
                      <PencilIcon className="mr-2 h-4 w-4 text-muted-foreground" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => { searchParams.set("deleteAssessment", assessment.id); setSearchParams(searchParams); }}>
                      <Trash2Icon className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1.5 leading-tight group-hover:text-primary transition-colors">{assessment.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">{assessment.description}</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50 text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-md"><FileQuestion className="w-3.5 h-3.5" /> {assessment.questions?.length || 0} Questions</div>
                <div className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-md capitalize"><Network className="w-3.5 h-3.5" /> {assessment.hierarchy || "Default"}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ViewAssessmentDialog open={!!viewAssessmentData} assessment={viewAssessmentData} onClose={clearModals} />
      <CreateAssessmentDialog open={isCreateOpen || !!editAssessmentData} onOpenChange={(isOpen) => !isOpen && clearModals()} onSave={handleSaveAssessment} initialData={editAssessmentData} />
      <ConfirmationModal open={!!deleteAssessmentData} onClose={clearModals} onConfirm={handleDelete} title="Delete Assessment" message={deleteAssessmentData ? `Are you sure you want to delete "${deleteAssessmentData.title}"?` : ""} confirmText="Delete Assessment" />
    </div>
  );
}