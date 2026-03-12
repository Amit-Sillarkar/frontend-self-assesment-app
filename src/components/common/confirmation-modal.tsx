import { 
    AlertTriangleIcon, 
    Trash2Icon, 
    CheckCircle2Icon, 
    InfoIcon, 
    AlertCircleIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export type ModalVariant = "default" | "danger" | "success" | "warning" | "info";

export interface ConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: ModalVariant;
    isDanger?: boolean; // Kept for backwards compatibility
}

// STRICLY USING THEME VARIABLES FROM index.css ONLY
const VARIANT_CONFIG = {
    danger: {
        gradient: "from-destructive to-destructive/40",
        iconBg: "bg-destructive/10 border-destructive/10",
        iconColor: "text-destructive",
        Icon: Trash2Icon,
        buttonClass: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    },
    success: {
        gradient: "from-primary to-primary/40",
        iconBg: "bg-primary/10 border-primary/10",
        iconColor: "text-primary",
        Icon: CheckCircle2Icon,
        buttonClass: "bg-primary text-primary-foreground hover:bg-primary/90",
    },
    warning: {
        gradient: "from-accent to-accent/40",
        iconBg: "bg-accent/20 border-accent/20",
        iconColor: "text-accent-foreground",
        Icon: AlertTriangleIcon,
        buttonClass: "bg-accent text-accent-foreground hover:bg-accent/90",
    },
    info: {
        gradient: "from-secondary to-secondary/40",
        iconBg: "bg-secondary/50 border-border/60",
        iconColor: "text-secondary-foreground",
        Icon: InfoIcon,
        buttonClass: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50",
    },
    default: {
        gradient: "from-primary to-primary/40",
        iconBg: "bg-primary/10 border-primary/10",
        iconColor: "text-primary",
        Icon: AlertCircleIcon,
        buttonClass: "bg-primary text-primary-foreground hover:bg-primary/90",
    }
};

export function ConfirmationModal({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "default",
    isDanger = false,
}: ConfirmationModalProps) {
    
    const activeVariant = isDanger ? "danger" : variant;
    const config = VARIANT_CONFIG[activeVariant];
    const ActiveIcon = config.Icon;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-[450px] w-[95vw] p-0 overflow-hidden bg-background border-border/60 shadow-xl shrink-0">
                
                <DialogHeader className="px-5 pt-5 pb-4 border-b border-border bg-card relative overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient}`} />
                    
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border ${config.iconBg}`}>
                            <ActiveIcon className={`w-5 h-5 ${config.iconColor}`} />
                        </div>
                        <div className="text-left space-y-0.5">
                            <DialogTitle className="text-lg font-bold text-foreground">
                                {title}
                            </DialogTitle>
                        </div>
                    </div>
                </DialogHeader>

                <div className="px-5 py-6 bg-background">
                    <DialogDescription className="text-sm text-foreground/80 leading-relaxed">
                        {message}
                    </DialogDescription>
                </div>

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
                        className={`h-8 text-xs shadow-sm hover:shadow-md transition-all ${config.buttonClass}`}
                    >
                        {confirmText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}