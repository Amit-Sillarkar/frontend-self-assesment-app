import { useState, useEffect } from "react";
import { UserPlusIcon, UserPenIcon } from "lucide-react";
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
} from "@/components/ui/dialog";
import { PRIMARY_ROLE_OPTIONS } from "@/constants/enum";
import { MOCK_CUSTOM_ROLE_OPTIONS } from "@/mockdata/users";
import type { User, UserFormData } from "../types";

const EMPTY_FORM: UserFormData = {
  empId: "",
  fullName: "",
  mobile: "",
  email: "",
  primaryRole: "user_labor",
  customRole: null,
  designation: "",
  reportingSupervisor: null,
  reportingManager: null,
  roleLockStatus: "not_locked",
};

// ── Form Field Helper ────────────────────────────
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
    <div className="space-y-1.5 flex flex-col">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ── Component Props ──────────────────────────────
interface Props {
  open: boolean;
  mode: "add" | "edit";
  initialData?: User | null;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
}

export default function UserFormModal({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<UserFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});

  // ── Load Data & Drafts on Open ─────────────────
  useEffect(() => {
    if (open) {
      const draftKey =
        mode === "edit" && initialData
          ? `draft_user_edit_${initialData.id}`
          : `draft_user_add`;
      const savedDraft = localStorage.getItem(draftKey);

      if (savedDraft) {
        setForm(JSON.parse(savedDraft));
      } else if (mode === "edit" && initialData) {
        setForm(initialData);
      } else {
        setForm(EMPTY_FORM);
      }
      setErrors({});
    }
  }, [open, mode, initialData]);

  // ── Save Drafts on Change ──────────────────────
  useEffect(() => {
    if (open) {
      const draftKey =
        mode === "edit" && initialData
          ? `draft_user_edit_${initialData.id}`
          : `draft_user_add`;
      // Only save draft if form is not completely empty
      if (form.empId || form.fullName || form.email) {
        localStorage.setItem(draftKey, JSON.stringify(form));
      }
    }
  }, [form, open, mode, initialData]);

  // ── Validation & Submission ────────────────────
  function validate(): boolean {
    const e: Partial<Record<keyof User, string>> = {};
    if (!form.empId?.trim()) e.empId = "Employee ID is required.";
    if (!form.fullName?.trim()) e.fullName = "Full name is required.";
    if (!form.mobile?.trim()) e.mobile = "Mobile number is required.";
    if (!form.email?.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email.";
    if (!form.designation?.trim()) e.designation = "Designation is required.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    // Clear draft on successful submit
    const draftKey =
      mode === "edit" && initialData
        ? `draft_user_edit_${initialData.id}`
        : `draft_user_add`;
    localStorage.removeItem(draftKey);

    onSubmit(form);
  }

  function handleCancel() {
    // Optionally remove draft if they explicitly cancel (commented out so drafts persist until save)
    // const draftKey = mode === "edit" && initialData ? `draft_user_edit_${initialData.id}` : `draft_user_add`;
    // localStorage.removeItem(draftKey);
    onClose();
  }

  function handleChange(field: keyof UserFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field as they type
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="sm:max-w-162.5 w-[95vw] h-[90vh] flex flex-col p-0 overflow-hidden bg-background border-border/60 shadow-xl">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-card relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-primary/40" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              {mode === "add" ? (
                <UserPlusIcon className="w-5 h-5 text-primary" />
              ) : (
                <UserPenIcon className="w-5 h-5 text-primary" />
              )}
            </div>
            <div className="text-left space-y-1">
              <DialogTitle className="text-xl text-foreground">
                {mode === "add" ? "Add New User" : "Edit User"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {mode === "add"
                  ? "Fill in the details below to create a new user account."
                  : "Update user information, roles, and permissions."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6">
            <FormField label="Employee ID" required error={errors.empId}>
              <Input
                placeholder="e.g. EMP001"
                value={form.empId}
                onChange={(e) => handleChange("empId", e.target.value)}
                disabled={mode === "edit"}
                className={
                  errors.empId
                    ? "border-destructive focus-visible:ring-destructive/50"
                    : "focus-visible:ring-primary/50"
                }
              />
            </FormField>

            <FormField label="Full Name" required error={errors.fullName}>
              <Input
                placeholder="Full name"
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className={
                  errors.fullName
                    ? "border-destructive"
                    : "focus-visible:ring-primary/50"
                }
              />
            </FormField>

            <FormField label="Mobile Number" required error={errors.mobile}>
              <Input
                placeholder="10-digit mobile number"
                value={form.mobile}
                onChange={(e) => handleChange("mobile", e.target.value)}
                className={
                  errors.mobile
                    ? "border-destructive"
                    : "focus-visible:ring-primary/50"
                }
              />
            </FormField>

            <FormField label="Email" required error={errors.email}>
              <Input
                type="email"
                placeholder="email@company.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={
                  errors.email
                    ? "border-destructive"
                    : "focus-visible:ring-primary/50"
                }
              />
            </FormField>

            <FormField label="Primary Role" required>
              <Select
                value={form.primaryRole}
                onValueChange={(v) => handleChange("primaryRole", v)}
              >
                <SelectTrigger
                  className={errors.primaryRole ? "border-destructive" : ""}
                >
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

            <FormField label="Custom Role" hint="Assign additional permissions">
              <Select
                value={form.customRole ?? "none"}
                onValueChange={(v) =>
                  handleChange("customRole", v === "none" ? "" : v)
                }
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

            <FormField label="Designation" required error={errors.designation}>
              <Input
                placeholder="e.g. Site Supervisor"
                value={form.designation}
                onChange={(e) => handleChange("designation", e.target.value)}
                className={
                  errors.designation
                    ? "border-destructive"
                    : "focus-visible:ring-primary/50"
                }
              />
            </FormField>

            <FormField label="Role Lock Status">
              <Select
                value={form.roleLockStatus}
                onValueChange={(v) => handleChange("roleLockStatus", v)}
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

            <FormField label="Reporting Supervisor">
              <Input
                placeholder="Supervisor name"
                value={form.reportingSupervisor ?? ""}
                onChange={(e) =>
                  handleChange("reportingSupervisor", e.target.value)
                }
                className="focus-visible:ring-primary/50"
              />
            </FormField>

            <FormField label="Reporting Manager">
              <Input
                placeholder="Manager name"
                value={form.reportingManager ?? ""}
                onChange={(e) =>
                  handleChange("reportingManager", e.target.value)
                }
                className="focus-visible:ring-primary/50"
              />
            </FormField>
          </div>
        </div>

        {/* Fixed Footer Area */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 mt-auto border-t border-border bg-card">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-24 border-border text-foreground hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
          >
            {mode === "add" ? "Create User" : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
