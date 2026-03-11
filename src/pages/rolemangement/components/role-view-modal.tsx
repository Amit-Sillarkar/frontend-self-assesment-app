import {
  ShieldCheckIcon,
  CalendarIcon,
  UsersIcon,
  CheckCircle2Icon,
  UserCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { CustomRole } from "../types";

interface RoleViewModalProps {
  role: CustomRole | null;
  onClose: () => void;
}

// Helper to format date nicely
function formatDisplayDate(iso: string) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function RoleViewModal({ role, onClose }: RoleViewModalProps) {
  if (!role) return null;

  return (
    <Dialog open={!!role} onOpenChange={(open) => !open && onClose()}>
      {/* 1. Changed to max-h-[85vh] so the modal shrinks to fit the content! */}
      <DialogContent className="sm:max-w-[650px] w-[95vw] max-h-[85vh] flex flex-col p-0 overflow-hidden bg-background border-border/60 shadow-xl">
        {/* ── Fixed Header ── */}
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border bg-card relative overflow-hidden shrink-0">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/40" />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/10">
              <ShieldCheckIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left space-y-0.5">
              <DialogTitle className="text-lg font-bold text-foreground">
                Custom Role Details
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Complete breakdown of{" "}
                <span className="font-semibold text-foreground">
                  {role.roleName}
                </span>{" "}
                permissions.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto px-5 py-5 custom-scrollbar space-y-5">
          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Stat Card 1: Role Name */}
            <div className="bg-card border border-border/60 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Role Name
                </span>
              </div>
              <p className="font-semibold text-foreground text-sm">
                {role.roleName}
              </p>
            </div>

            {/* Stat Card 2: Created Date */}
            <div className="bg-card border border-border/60 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Created On
                </span>
              </div>
              <p className="font-medium text-foreground text-sm">
                {formatDisplayDate(role.createdAt)}
              </p>
            </div>

            {/* Stat Card 3: Created By */}
            <div className="bg-card border border-border/60 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <UserCircleIcon className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Created By
                </span>
              </div>
              <p className="font-medium text-foreground text-sm">
                {role.createdBy || "System Admin"}
              </p>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Permissions Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-primary" /> Active Permissions
              </h3>
              <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {role.permissions.length} Total
              </span>
            </div>

            {role.permissions.length === 0 ? (
              <div className="p-3 rounded-md border border-dashed border-border/60 text-center text-xs text-muted-foreground bg-muted/20">
                No permissions assigned to this role.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {role.permissions.map((perm) => (
                  <div
                    key={perm}
                    className="flex items-center gap-2 p-2 rounded-md border border-primary/20 bg-primary/5 text-primary-foreground shadow-sm"
                  >
                    {/* <CheckCircle2Icon className="w-3.5 h-3.5 text-primary" /> */}
                    <span className="text-xs text-center  font-medium text-foreground">
                      {perm}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator className="bg-border/50" />

          {/* Assigned Employees Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <UsersIcon className="w-3.5 h-3.5 text-primary" /> Assigned
                Employees
              </h3>
              <span className="text-[10px] font-bold bg-secondary/50 text-secondary-foreground border border-border/50 px-2 py-0.5 rounded-full">
                {role.assignedEmployees.length} Users
              </span>
            </div>

            {role.assignedEmployees.length === 0 ? (
              <div className="p-3 rounded-md border border-dashed border-border/60 text-center text-xs text-muted-foreground bg-muted/20">
                No employees are currently assigned to this role.
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {role.assignedEmployees.map((emp, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 bg-muted/50 border border-border/60 hover:bg-muted transition-colors px-2.5 py-1 rounded-full"
                  >
                    <div className="w-4 h-4 rounded-full bg-background flex items-center justify-center border border-border">
                      <UserCircleIcon className="w-2.5 h-2.5 text-muted-foreground" />
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      {typeof emp === "string"
                        ? emp
                        : emp.fullName || emp.name || `Employee ${idx + 1}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Fixed Footer ── */}
        <div className="flex items-center justify-end px-5 py-3 mt-auto border-t border-border bg-card shrink-0">
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="h-8 w-20 text-xs border-border text-foreground hover:bg-muted shadow-sm hover:shadow-md transition-all"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
