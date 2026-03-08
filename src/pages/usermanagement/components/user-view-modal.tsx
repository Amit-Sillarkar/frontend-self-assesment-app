// ─────────────────────────────────────────────
// FILE: src/pages/user-management/components/user-view-modal.tsx
//
// Read-only User Details modal.
// Opened when the eye icon is clicked in the table.
// ─────────────────────────────────────────────

import { UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import RoleBadge from "@/components/role-badge";
import type { User } from "../types";

interface Props {
  user: User | null;
  onClose: () => void;
}

function DetailField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-semibold text-foreground ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}

export default function UserViewModal({ user, onClose }: Props) {
  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] w-[95vw] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>Complete information about the user</DialogDescription>
        </DialogHeader>

        {user && (
          <div className="space-y-5">
            {/* Profile row */}
            <div className="flex items-center gap-4 p-4 bg-secondary/40 rounded-xl border border-border">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <UserIcon className="w-7 h-7 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-base text-foreground">{user.fullName}</p>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">{user.empId}</p>
                <p className="text-xs text-muted-foreground">{user.designation}</p>
              </div>
              <RoleBadge role={user.primaryRole} />
            </div>

            {/* Detail grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <DetailField label="Mobile"       value={user.mobile}       mono />
              <DetailField label="Email"        value={user.email} />
              <DetailField label="Custom Role"  value={user.customRole ?? "None"} />
              <DetailField
                label="Role Lock"
                value={user.roleLockStatus === "locked" ? "🔒 Locked" : "Unlocked"}
              />
              <DetailField
                label="Reporting Supervisor"
                value={user.reportingSupervisor ?? "—"}
              />
              <DetailField
                label="Reporting Manager"
                value={user.reportingManager ?? "—"}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}