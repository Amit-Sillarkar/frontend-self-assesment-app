import { AlertTriangleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean; // Defaults to true for delete actions
}

export function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = true,
}: ConfirmationModalProps) {
  // Handlers
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[450px] w-[95vw] p-0 overflow-hidden bg-background border-border/60 shadow-xl shrink-0">
        {/* ── Fixed Header ── */}
        <DialogHeader className="px-5 pt-5 pb-4 border-b border-border bg-card relative overflow-hidden">
          {/* Gradient Line: Red for danger (delete), Orange for normal confirmations */}
          <div
            className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
              isDanger
                ? "from-destructive to-destructive/40"
                : "from-primary to-primary/40"
            }`}
          />

          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border ${
                isDanger
                  ? "bg-destructive/10 border-destructive/10"
                  : "bg-primary/10 border-primary/10"
              }`}
            >
              <AlertTriangleIcon
                className={`w-5 h-5 ${isDanger ? "text-destructive" : "text-primary"}`}
              />
            </div>
            <div className="text-left space-y-0.5">
              <DialogTitle className="text-lg font-bold text-foreground">
                {title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* ── Body Content ── */}
        <div className="px-5 py-6 bg-background">
          <DialogDescription className="text-sm text-foreground/80 leading-relaxed">
            {message}
          </DialogDescription>
        </div>

        {/* ── Fixed Footer ── */}
        <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-border bg-card">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 text-xs border-border text-foreground hover:bg-muted shadow-sm hover:shadow-md transition-all"
          >
            {cancelText}
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            variant={isDanger ? "destructive" : "default"}
            className={`h-8 text-xs shadow-sm hover:shadow-md transition-all ${
              !isDanger &&
              "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
