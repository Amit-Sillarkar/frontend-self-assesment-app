import {
  UserIcon,
  BuildingIcon,
  FileTextIcon,
  CalendarIcon,
  AwardIcon,
  HashIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { AssessmentTrackingRecord } from "../type";

interface Props {
  record: AssessmentTrackingRecord | null;
  onClose: () => void;
}

function DetailField({
  label,
  value,
  mono = false,
  icon: Icon,
}: {
  label: string;
  value: string;
  mono?: boolean;
  icon?: any;
}) {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/40 hover:bg-secondary/50 transition-all duration-300">
      {Icon && (
        <div className="mt-0.5 p-2 bg-background rounded-lg shadow-sm border border-border/40 text-primary/80">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <div className="space-y-1 overflow-hidden">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p
          className={`text-sm font-medium text-foreground truncate ${mono ? "font-mono" : ""}`}
          title={value}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Completed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">Completed</Badge>;
    case 'Under Review':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none">Under Review</Badge>;
    case 'Needs Revision':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-none">Needs Revision</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default function AssessmentViewModal({ record, onClose }: Props) {
  return (
    <Dialog open={!!record} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] p-0 overflow-hidden flex flex-col">
        {/* Decorative Header Gradient */}
        <div className="h-20 sm:h-24 bg-linear-to-r from-primary/20 via-primary/5 to-transparent w-full absolute top-0 left-0 -z-10" />
        
        <div className="p-6 pb-2 overflow-y-auto">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl sr-only">Assessment Details</DialogTitle>
          </DialogHeader>

          {record && (
            <div className="space-y-6">
              {/* Profile Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-4 border-b border-border/60">
                <div className="w-20 h-20 rounded-2xl bg-background border-4 border-background shadow-md flex items-center justify-center shrink-0 relative group">
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors rounded-xl" />
                  <FileTextIcon className="w-10 h-10 text-primary relative z-10" />
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-bold text-foreground tracking-tight">
                      {record.assessmentName}
                    </h3>
                    {getStatusBadge(record.status)}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <UserIcon className="w-4 h-4" />
                    <span>{record.employeeName}</span>
                    <span className="text-border mx-1">•</span>
                    <span className="font-mono bg-secondary px-1.5 py-0.5 rounded-md text-xs">
                      {record.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailField
                  label="Employee Name"
                  value={record.employeeName}
                  icon={UserIcon}
                />
                <DetailField 
                  label="Department" 
                  value={record.department} 
                  icon={BuildingIcon} 
                />
                <DetailField
                  label="Tracking ID"
                  value={record.id}
                  mono
                  icon={HashIcon}
                />
                <DetailField
                  label="Submitted On"
                  value={record.submittedOn}
                  icon={CalendarIcon}
                />
                
                {/* Full width row for score to emphasize it */}
                <div className="sm:col-span-2 pt-2">
                  <DetailField
                    label="Assessment Score"
                    value={record.score}
                    icon={AwardIcon}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 pt-2 bg-background/50 backdrop-blur-sm border-t border-border/40 mt-auto"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}