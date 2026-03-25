import { useState, useEffect } from "react";
import { UserPlusIcon, UserPenIcon, Check, ChevronsUpDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { validateUserForm, type FormErrors } from "../utils/validation";
import type { User, UserFormData } from "../types";
import { useGetUsersQuery } from "@/store/api/userApi";
import { useGetRolesQuery } from "@/store/api/roleApi";

interface CustomRole {
  id: number;
  name: string;
}

const EMPTY_FORM: UserFormData = {
  employeeId: "",
  password: "",
  fullName: "",
  mobile: "",
  email: "",
  roleId: undefined,
  customRoleId: null,
  designation: "",
  reportingSupervisorId: null,
  reportingManagerId: null,
  isRoleAssignmentLocked: false,
};

function FormField({ label, required, hint, error, children, hidden = false }: {
  label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode; hidden?: boolean;
}) {
  if (hidden) return null;
  return (
    <div className="space-y-1.5 flex flex-col">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

interface Props {
  open: boolean;
  mode: "add" | "edit";
  initialData?: User | null;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<FormErrors>;
}

export default function UserFormModal({ open, mode, initialData, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<UserFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSupervisorSearch, setOpenSupervisorSearch] = useState(false);
  const [openCustomRoleSearch, setOpenCustomRoleSearch] = useState(false);
  const { data: supervisors } = useGetUsersQuery({ roleNames: "Supervisor" }, { skip: !open });
  const { data: managers } = useGetUsersQuery({ roleNames: "Manager" }, { skip: !open });

  const { data: customRoles } = useGetRolesQuery({
    roleType: "CUSTOM",
    isSystemRole: true,
    page: 1,
    limit: 100
  }, { skip: !open });

  const isEdit = mode === "edit";
  const userRoleName = initialData?.roleDefinition?.name?.toLowerCase() || "";
  const isPrimary = userRoleName.includes("user") && !userRoleName.includes("supervisor") && !userRoleName.includes("manager");
  const isSupervisor = userRoleName.includes("supervisor");
  const isManager = userRoleName.includes("manager");

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      const initialCustomRoles = initialData.customRole
        ? (Array.isArray(initialData.customRole)
          ? initialData.customRole.map((r: CustomRole) => ({ id: r.id, name: r.name }))
          : [{ id: initialData.customRole.id, name: initialData.customRole.name }])
        : [];

      setForm({
        employeeId: initialData.employeeId,
        password: "",
        fullName: initialData.fullName,
        mobile: initialData.mobile,
        email: initialData.email,
        roleId: initialData.roleDefinition?.id,
        customRoleId: initialCustomRoles,
        designation: initialData.designation ?? "",
        reportingSupervisorId: initialData.reportingSupervisorId,
        reportingManagerId: initialData.reportingManagerId,
        isRoleAssignmentLocked: initialData.isRoleAssignmentLocked,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [open, mode, initialData]);

  const toggleCustomRole = (role: CustomRole) => {
    const currentRoles = Array.isArray(form.customRoleId) ? [...form.customRoleId] : [];
    const index = currentRoles.findIndex((r: CustomRole) => r.id === role.id);
    if (index > -1) {
      currentRoles.splice(index, 1);
    } else {
      currentRoles.push(role);
    }
    handleChange("customRoleId", currentRoles.length > 0 ? currentRoles : null);
  };

  function handleChange<K extends keyof UserFormData>(field: K, value: UserFormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit() {
    const clientErrors = validateUserForm(form, mode);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      const returnedErrors = await onSubmit(form);
      if (Object.keys(returnedErrors).length > 0) {
        setErrors(returnedErrors);
        return;
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-162.5 w-[95vw] h-[90vh] flex flex-col p-0 overflow-hidden bg-background border-border/60 shadow-xl">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-card relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-primary/40" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              {mode === "add"
                ? <UserPlusIcon className="w-5 h-5 text-primary" />
                : <UserPenIcon className="w-5 h-5 text-primary" />}
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

        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6">
            <FormField label="Employee ID" required={mode === "add"} error={errors.employeeId}>
              <Input
                value={form.employeeId ?? ""}
                onChange={(e) => handleChange("employeeId", e.target.value)}
                disabled={true}
              />
            </FormField>

            {mode === "add" && (
              <FormField label="Password" required error={errors.password}>
                <Input
                  type="password"
                  value={form.password ?? ""}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
              </FormField>
            )}

            <FormField label="Full Name" required error={errors.fullName}>
              <Input
                value={form.fullName ?? ""}
                onChange={(e) => handleChange("fullName", e.target.value)}
                disabled={true}
              />
            </FormField>

            <FormField label="Mobile Number" required error={errors.mobile}>
              <Input
                value={form.mobile ?? ""}
                onChange={(e) => handleChange("mobile", e.target.value)}
              />
            </FormField>

            <FormField label="Email" required error={errors.email}>
              <Input
                type="email"
                value={form.email ?? ""}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </FormField>

            <FormField label="Designation">
              <Input
                value={form.designation ?? ""}
                onChange={(e) => handleChange("designation", e.target.value)}
                disabled={true}
              />
            </FormField>

            <FormField label="Primary Role">
              <Input
                value={initialData?.roleDefinition?.name ?? "USER"}
                disabled={isEdit && (isPrimary || isSupervisor || isManager)}
              />
            </FormField>

            <FormField label="Custom Roles">
              <div className="flex flex-col gap-2">
                <Popover open={openCustomRoleSearch} onOpenChange={setOpenCustomRoleSearch}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between font-normal min-h-10 h-auto"
                    >
                      <span className="truncate">
                        {Array.isArray(form.customRoleId) && form.customRoleId.length > 0
                          ? `${form.customRoleId.length} role(s) selected`
                          : "Select custom roles..."}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-75 p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search roles..." />
                      <CommandEmpty>No roles found.</CommandEmpty>
                      <CommandGroup className="max-h-60 overflow-y-auto">
                        {customRoles?.data?.data?.map((role: CustomRole) => {
                          const isSelected = Array.isArray(form.customRoleId) &&
                            form.customRoleId.some((r: CustomRole) => r.id === role.id);
                          return (
                            <CommandItem
                              key={role.id}
                              value={String(role.id)}
                              onSelect={() => toggleCustomRole({ id: role.id, name: role.name })}
                            >
                              <div className={cn(
                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                              )}>
                                {isSelected && <Check className="h-3 w-3" />}
                              </div>
                              <span>{role.name}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(form.customRoleId) && form.customRoleId.map((roleObj: CustomRole) => (
                    <Badge key={roleObj.id} variant="secondary" className="gap-1 pr-1">
                      {roleObj.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-5 w-5 rounded-full p-0 text-muted-foreground hover:text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onClick={() => toggleCustomRole(roleObj)}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </FormField>

            <FormField
              label={isManager ? "Assigned Supervisor" : "Reporting Supervisor"}
              hidden={isSupervisor}
              error={errors.reportingSupervisorId}
            >
              <Popover open={openSupervisorSearch} onOpenChange={setOpenSupervisorSearch}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn("w-full justify-between font-normal", !form.reportingSupervisorId && "text-muted-foreground")}
                    disabled={isEdit && isPrimary}
                  >
                    {form.reportingSupervisorId
                      ? supervisors?.data.find((u: User) => u.id === form.reportingSupervisorId)?.fullName
                      : "Select Supervisor..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-75 p-0">
                  <Command>
                    <CommandInput placeholder="Search name or Employee ID..." />
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup className="max-h-60 overflow-y-auto">
                      {supervisors?.data.map((user: User) => (
                        <CommandItem
                          key={user.id}
                          value={`${user.fullName} ${user.employeeId}`}
                          onSelect={() => {
                            handleChange("reportingSupervisorId", user.id);
                            setOpenSupervisorSearch(false);
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", form.reportingSupervisorId === user.id ? "opacity-100" : "opacity-0")} />
                          <div className="flex flex-col">
                            <span>{user.fullName}</span>
                            <span className="text-xs text-muted-foreground">ID: {user.employeeId}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormField>

            <FormField label="Reporting Manager ID">
              {isSupervisor ? (
                <Select
                  value={form.reportingManagerId ?? "none"}
                  onValueChange={(v) => handleChange("reportingManagerId", v === "none" ? null : v)}
                >
                  <SelectTrigger><SelectValue placeholder="Select Manager" /></SelectTrigger>
                  <SelectContent>
                    {managers?.data.map((m: User) => (
                      <SelectItem key={m.id} value={m.employeeId}>
                        {m.fullName} ({m.employeeId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={form.reportingManagerId ?? ""}
                  onChange={(e) => handleChange("reportingManagerId", e.target.value || null)}
                  disabled={isEdit && (isPrimary || isManager)}
                />
              )}
            </FormField>

          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-card">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting
              ? mode === "add" ? "Creating..." : "Saving..."
              : mode === "add" ? "Create User" : "Save Changes"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}