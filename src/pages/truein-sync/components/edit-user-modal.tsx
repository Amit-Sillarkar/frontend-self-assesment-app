import { useState, useEffect } from "react";
import { UserPenIcon } from "lucide-react";
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
import { type TrueinUser } from "@/mockdata/truein-users";
import { MOCK_CUSTOM_ROLE_OPTIONS } from "@/mockdata/users";

interface EditUserModalProps {
  open: boolean;
  user: TrueinUser | null;
  onClose: () => void;
  onSave: (updatedUser: TrueinUser) => void;
}

export default function EditTrueinUserModal({ open, user, onClose, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState<TrueinUser | null>(null);

  useEffect(() => {
    if (open && user) {
      setFormData({ ...user });
    }
  }, [open, user]);

  if (!formData) return null;

  const handleChange = (field: keyof TrueinUser, value: string | null) => {
    setFormData((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const handleSubmit = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] p-0 overflow-hidden bg-background border-border/60 shadow-xl shrink-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-card relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-primary/40" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <UserPenIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left space-y-1">
              <DialogTitle className="text-lg font-bold text-foreground">
                Edit Fetched User
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Adjust role mappings and details before syncing.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-6 space-y-5 custom-scrollbar max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 flex flex-col sm:col-span-2">
              <Label className="text-sm font-medium text-foreground text-muted-foreground">Emp ID (Read-only)</Label>
              <Input value={formData.id} disabled className="bg-muted/50" />
            </div>

            <div className="space-y-1.5 flex flex-col">
              <Label className="text-sm font-medium text-foreground">Name</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => handleChange("name", e.target.value)} 
              />
            </div>

            <div className="space-y-1.5 flex flex-col">
              <Label className="text-sm font-medium text-foreground">Mobile</Label>
              <Input 
                value={formData.mobile} 
                onChange={(e) => handleChange("mobile", e.target.value)} 
              />
            </div>

            <div className="space-y-1.5 flex flex-col">
              <Label className="text-sm font-medium text-foreground">Designation</Label>
              <Input 
                value={formData.designation} 
                onChange={(e) => handleChange("designation", e.target.value)} 
              />
            </div>

            <div className="space-y-1.5 flex flex-col">
              <Label className="text-sm font-medium text-foreground text-muted-foreground">Truein Role (Source)</Label>
              <Input value={formData.trueinRole} disabled className="bg-muted/50" />
            </div>

            <div className="space-y-1.5 flex flex-col sm:col-span-2">
              <Label className="text-sm font-medium text-foreground">Map Custom Role</Label>
              <Select
                value={formData.customRole ?? "none"}
                onValueChange={(v) => handleChange("customRole", v === "none" ? null : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a custom role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Custom Role</SelectItem>
                  {MOCK_CUSTOM_ROLE_OPTIONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-card">
          <Button variant="outline" onClick={onClose} className="h-9 text-sm">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="h-9 text-sm bg-primary text-primary-foreground hover:bg-primary/90">
            Save Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}