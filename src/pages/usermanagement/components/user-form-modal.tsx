// ─────────────────────────────────────────────
// FILE: src/pages/user-management/components/user-form-modal.tsx
//
// Add / Edit user form modal.
// Used for both "Add User" and "Edit User" flows.
// ─────────────────────────────────────────────

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { PRIMARY_ROLE_OPTIONS } from "@/constants/enum";
import { MOCK_CUSTOM_ROLE_OPTIONS } from "@/mockdata/users";
import type { User, UserFormData } from "../types";

// ── Form Field wrapper ───────────────────────

function FormField({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ── Props ────────────────────────────────────

interface Props {
  open: boolean;
  mode: "add" | "edit";
  form: UserFormData;
  errors: Partial<Record<keyof User, string>>;
  onChange: (field: keyof UserFormData, value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

// ── Component ────────────────────────────────

export default function UserFormModal({
  open,
  mode,
  form,
  errors,
  onChange,
  onClose,
  onSubmit,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New User" : "Edit User"}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Fill in the details below to create a new user account."
              : "Update user information, roles, and permissions."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          {/* Employee ID */}
          <FormField label="Employee ID" required error={errors.empId}>
            <Input
              placeholder="e.g. EMP001"
              value={form.empId}
              onChange={(e) => onChange("empId", e.target.value)}
              disabled={mode === "edit"}
              className={errors.empId ? "border-destructive" : ""}
            />
          </FormField>

          {/* Full Name */}
          <FormField label="Full Name" required error={errors.fullName}>
            <Input
              placeholder="Full name"
              value={form.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
              className={errors.fullName ? "border-destructive" : ""}
            />
          </FormField>

          {/* Mobile */}
          <FormField label="Mobile Number" required error={errors.mobile}>
            <Input
              placeholder="10-digit mobile number"
              value={form.mobile}
              onChange={(e) => onChange("mobile", e.target.value)}
              className={errors.mobile ? "border-destructive" : ""}
            />
          </FormField>

          {/* Email */}
          <FormField label="Email" required error={errors.email}>
            <Input
              type="email"
              placeholder="email@company.com"
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
              className={errors.email ? "border-destructive" : ""}
            />
          </FormField>

          {/* Primary Role */}
          <FormField label="Primary Role" required>
            <Select
              value={form.primaryRole}
              onValueChange={(v) => onChange("primaryRole", v)}
            >
              <SelectTrigger className={errors.primaryRole ? "border-destructive" : ""}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIMARY_ROLE_OPTIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* Custom Role */}
          <FormField
            label="Custom Role"
            hint="Assign additional permissions via custom role"
          >
            <Select
              value={form.customRole ?? "none"}
              onValueChange={(v) => onChange("customRole", v === "none" ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOCK_CUSTOM_ROLE_OPTIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* Designation */}
          <FormField label="Designation" required error={errors.designation}>
            <Input
              placeholder="e.g. Site Supervisor"
              value={form.designation}
              onChange={(e) => onChange("designation", e.target.value)}
              className={errors.designation ? "border-destructive" : ""}
            />
          </FormField>

          {/* Role Lock */}
          <FormField label="Role Lock Status">
            <Select
              value={form.roleLockStatus}
              onValueChange={(v) => onChange("roleLockStatus", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_locked">Not Locked</SelectItem>
                <SelectItem value="locked">Locked</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          {/* Reporting Supervisor */}
          <FormField label="Reporting Supervisor">
            <Input
              placeholder="Supervisor name"
              value={form.reportingSupervisor ?? ""}
              onChange={(e) => onChange("reportingSupervisor", e.target.value)}
            />
          </FormField>

          {/* Reporting Manager */}
          <FormField label="Reporting Manager">
            <Input
              placeholder="Manager name"
              value={form.reportingManager ?? ""}
              onChange={(e) => onChange("reportingManager", e.target.value)}
            />
          </FormField>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            {mode === "add" ? "Create User" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}