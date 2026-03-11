import { useState, useEffect } from "react";
import { ShieldCheckIcon, CheckCircle2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import type { CustomRole } from "../types";

// Mock permissions for the UI
const AVAILABLE_PERMISSIONS = [
    "Manage Users", "View Reports", "Edit Settings",
    "Delete Records", "Approve Requests", "Manage Billing"
];

interface EditRoleModalProps {
    isOpen: boolean;
    role: CustomRole | null;
    onClose: () => void;
    onSave: (updatedRole: CustomRole) => void;
}

export default function EditRoleModal({ isOpen, role, onClose, onSave }: EditRoleModalProps) {
    const [roleName, setRoleName] = useState("");
    const [permissions, setPermissions] = useState<string[]>([]);

    // ── Load Data & Drafts on Open ────────────────────────
    useEffect(() => {
        if (isOpen && role) {
            // Check if there is an unsaved draft in local storage
            const draftKey = `draft_role_${role.id}`;
            const savedDraft = localStorage.getItem(draftKey);
            
            if (savedDraft) {
                const parsed = JSON.parse(savedDraft);
                setRoleName(parsed.roleName);
                setPermissions(parsed.permissions);
            } else {
                setRoleName(role.roleName);
                setPermissions(role.permissions);
            }
        }
    }, [isOpen, role]);

    // ── Save Drafts on Change ─────────────────────────────
    useEffect(() => {
        if (isOpen && role) {
            const draftKey = `draft_role_${role.id}`;
            localStorage.setItem(draftKey, JSON.stringify({ roleName, permissions }));
        }
    }, [roleName, permissions, isOpen, role]);

    // ── Handlers ──────────────────────────────────────────
    const handleTogglePermission = (perm: string) => {
        setPermissions((prev) =>
            prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
        );
    };

    const handleSave = () => {
        if (!role) return;
        onSave({ ...role, roleName, permissions });
        // Clear draft on successful save
        localStorage.removeItem(`draft_role_${role.id}`);
        onClose();
    };

    const handleCancel = () => {
        if (role) {
            // Optional: clear draft if user explicitly cancels
            localStorage.removeItem(`draft_role_${role.id}`);
        }
        onClose();
    };

    // Do not render content if no role is selected
    if (!role) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
            <DialogContent className="sm:max-w-[700px] w-[95vw] h-[85vh] flex flex-col p-0 overflow-hidden bg-background border-border/60 shadow-xl">
                
                {/* ── Fixed Header ── */}
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-card relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/40" />                    
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <ShieldCheckIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left space-y-1">
                            <DialogTitle className="text-xl text-foreground">
                                Edit Custom Role
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground">
                                Modify role name and adjust granular permissions for <span className="font-semibold text-foreground">{role.roleName}</span>.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* ── Scrollable Body ── */}
                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar space-y-6">
                    {/* General Info */}
                    <div className="space-y-3">
                        <Label htmlFor="roleName" className="text-foreground font-medium text-base">Role Name</Label>
                        <Input
                            id="roleName"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            className="focus-visible:ring-primary/50 transition-all text-base py-5"
                            placeholder="e.g. Senior Manager"
                        />
                        <p className="text-xs text-muted-foreground">
                            Changes will instantly apply to the {role.assignedEmployees.length} employees holding this role.
                        </p>
                    </div>
                    {/* Permissions Grid */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-foreground font-medium text-base">Role Permissions</Label>
                            <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                                {permissions.length} Selected
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {AVAILABLE_PERMISSIONS.map((perm) => {
                                const isSelected = permissions.includes(perm);
                                return (
                                    <div
                                        key={perm}
                                        onClick={() => handleTogglePermission(perm)}
                                        className={`
                                            relative flex items-center p-3.5 rounded-lg border-2 cursor-pointer transition-all duration-200 select-none
                                            ${isSelected
                                                ? "border-primary bg-primary/5 shadow-sm"
                                                : "border-border/60 bg-card hover:border-primary/40 hover:bg-muted/30"
                                            }
                                        `}
                                    >
                                        <div className="flex-1 flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted border border-border"}`}>
                                                {isSelected && <CheckCircle2Icon className="w-3.5 h-3.5" />}
                                            </div>
                                            <span className={`text-sm font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                                                {perm}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                {/* ── Fixed Footer ── */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 mt-auto border-t border-border bg-card">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="border-border text-foreground hover:bg-muted"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!roleName.trim() || permissions.length === 0}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
                    >
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}