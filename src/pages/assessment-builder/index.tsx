import { useState } from "react";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Users, FileQuestion, GitMerge, Search, Filter, MoreVertical, Eye, Edit, Trash } from "lucide-react";
import { initialAssessments } from "@/mockdata/assessments";
import { type Assessment } from "./types";
import { CreateAssessmentDialog } from "./components/create-assessment-dialog";
import { ViewAssessmentDialog } from "./components/view-assessment-dialog";

// Import our new cleanly built Custom Component
import { ConfirmationModal } from "@/components/common/confirmation-modal";

const formatDesignation = (id: string) => {
  return id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function AssessmentBuilderPage() {
  const [assessments, setAssessments] = useState<Assessment[]>(initialAssessments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState<string | null>(null);
  const [viewingAssessment, setViewingAssessment] = useState<Assessment | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [designationFilter, setDesignationFilter] = useState("all");

  const handleSaveAssessment = (savedAssessment: Assessment) => {
    setAssessments(prev => {
      const exists = prev.find(a => a.id === savedAssessment.id);
      if (exists) {
        return prev.map(a => a.id === savedAssessment.id ? savedAssessment : a);
      }
      return [savedAssessment, ...prev];
    });
  };

  const handleCreateNew = () => {
    setEditingAssessment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (assessment: Assessment) => {
    setEditingAssessment(assessment);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setAssessmentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  
  const handleConfirmDelete = () => {
    if (assessmentToDelete) {
      setAssessments(prev => prev.filter(a => a.id !== assessmentToDelete));
      setAssessmentToDelete(null);
      setIsDeleteModalOpen(false); // Close Modal
    }
  };

  const handleCancelDelete = () => {
    setAssessmentToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleView = (assessment: Assessment) => {
    setViewingAssessment(assessment);
  };

  // Filter Logic
  const filteredAssessments = assessments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDesignation = designationFilter === "all" || a.designations.includes(designationFilter);
    return matchesSearch && matchesDesignation;
  });

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader title="Assessment Builder" />
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Create Assessment
        </Button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-muted/20 p-4 rounded-lg border border-border/50">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search assessments..." 
            className="pl-9 w-full bg-background" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-[250px] flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <Select value={designationFilter} onValueChange={setDesignationFilter}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Filter Designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Designations</SelectItem>
              <SelectItem value="frontend_dev">Frontend Developer</SelectItem>
              <SelectItem value="backend_dev">Backend Developer</SelectItem>
              <SelectItem value="fullstack_dev">Full Stack Developer</SelectItem>
              <SelectItem value="ui_ux">UI/UX Designer</SelectItem>
              <SelectItem value="project_manager">Project Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ASSESSMENT CARDS */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssessments.map((assessment) => (
          <Card key={assessment.id} className="flex flex-col relative group">
            <div className="absolute top-3 right-3 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-background/80 rounded-md">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleView(assessment)}>
                    <Eye className="w-4 h-4 mr-2 text-muted-foreground" /> View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEdit(assessment)}>
                    <Edit className="w-4 h-4 mr-2 text-muted-foreground" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleDeleteClick(assessment.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                    <Trash className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <CardHeader className="pb-3 pr-10">
              <div className="flex justify-between items-start mb-3 gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {assessment.designations.map(dsg => (
                    <Badge key={dsg} variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] leading-tight px-2 py-0.5">
                      {formatDesignation(dsg)}
                    </Badge>
                  ))}
                </div>
              </div>
              <CardTitle className="text-lg leading-tight">{assessment.title}</CardTitle>
              <CardDescription className="line-clamp-2 mt-1">{assessment.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-4 flex justify-between text-sm text-muted-foreground border-t border-border/50">
              <div className="flex items-center gap-1.5">
                <FileQuestion className="w-4 h-4" />
                <span>{assessment.questions.length} Questions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <GitMerge className="w-4 h-4" />
                <span className="capitalize">{assessment.hierarchy}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredAssessments.length === 0 && (
          <div className="col-span-full py-16 text-center bg-muted/20 border border-dashed rounded-lg">
            <Users className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">No assessments found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      <CreateAssessmentDialog 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        onSave={handleSaveAssessment} 
        initialData={editingAssessment}
      />

      {/* USING THE NEW CUSTOM COMMON COMPONENT HERE */}
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Assessment"
        message="Are you sure you want to delete this assessment? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
      <ViewAssessmentDialog 
        assessment={viewingAssessment} 
        onClose={() => setViewingAssessment(null)} 
      />
    </div>
  );
}