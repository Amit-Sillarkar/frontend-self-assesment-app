import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  BriefcaseIcon,
  ShieldIcon,
  LockIcon,
  UsersIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import RoleBadge, { CustomRoleBadge } from "@/components/role-badge";
import { useGetUserByIdQuery } from "@/store/api/userApi";
import UserViewSkeleton from "./user-view-skleton";
import type { CustomRole } from "../../types";


interface Props {
  userId: string | null;
  onClose: () => void;
}

function DetailField({
  label,
  value,
  mono = false,
  icon: Icon,
}: {
  label: string;
  value: string | React.ReactNode;
  mono?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
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
        <div className={`text-sm font-medium text-foreground ${mono ? "font-mono" : ""}`}>
          {value}
        </div>
      </div>
    </div>
  );
}

export default function UserViewModal({ userId, onClose }: Props) {
  const { data: user, isLoading } = useGetUserByIdQuery(userId ?? "", {
    skip: !userId,
  });

  return (
    <Dialog open={!!userId} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-175 w-[95vw] max-h-[90vh] p-0 overflow-hidden flex flex-col">
        {/* FIX: Add DialogDescription to resolve Shadcn/Radix warning */}
        <DialogHeader className="sr-only">
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>View detailed information for this user profile.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <UserViewSkeleton />
        ) : user ? (
          <>
            <div className="h-20 sm:h-24 bg-linear-to-r from-primary/20 via-primary/5 to-transparent w-full absolute top-0 left-0 -z-10" />

            <div className="p-6 pb-2 overflow-y-auto">
              <div className="space-y-6">
                {/* Profile row */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-4 border-b border-border/60">
                  <div className="w-20 h-20 rounded-2xl bg-background border-4 border-background shadow-md flex items-center justify-center shrink-0 relative group">
                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors rounded-xl" />
                    <UserIcon className="w-10 h-10 text-primary relative z-10" />
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-bold text-foreground tracking-tight">
                        {user.fullName}
                      </h3>

                      {/* Primary Role Display */}
                      {user.roleDefinition && <RoleBadge role={user.roleDefinition.name} />}

                      {user.isRoleAssignmentLocked && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
                          <LockIcon className="w-3 h-3" /> Locked
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <BriefcaseIcon className="w-4 h-4" />
                      <span>{user.designation ?? "—"}</span>
                      <span className="text-border mx-1">•</span>
                      <span className="font-mono bg-secondary px-1.5 py-0.5 rounded-md text-xs">
                        {user.employeeId}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailField label="Mobile" value={user.mobile} mono icon={PhoneIcon} />
                  <DetailField label="Email" value={user.email} icon={MailIcon} />

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/40 hover:bg-secondary/50 transition-all duration-300">
                    <div className="mt-0.5 p-2 bg-background rounded-lg shadow-sm border border-border/40 text-primary/80">
                      <ShieldIcon className="w-4 h-4" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Custom Roles
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {user.customRole ? (
                          Array.isArray(user.customRole) ? (
                            user.customRole.map((role: CustomRole) => (
                              <CustomRoleBadge key={role.id} role={role.name} />
                            ))
                          ) : (
                            <CustomRoleBadge role={user.customRole.name} />
                          )
                        ) : (
                          <p className="text-sm text-muted-foreground">Not Applicable</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <DetailField
                    label="Role Lock Status"
                    value={user.isRoleAssignmentLocked ? "Restricted" : "Open"}
                    icon={ShieldIcon}
                  />

                  <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <DetailField
                      label="Reporting Supervisor ID"
                      value={user.reportingSupervisorId ?? "Not Assigned"}
                      icon={UsersIcon}
                    />
                    <DetailField
                      label="Reporting Manager ID"
                      value={user.reportingManagerId ?? "Not Assigned"}
                      icon={UsersIcon}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
        <DialogFooter className="p-4 pt-2 bg-background/50 backdrop-blur-sm border-t border-border/40 mt-auto" />
      </DialogContent>
    </Dialog>
  );
}