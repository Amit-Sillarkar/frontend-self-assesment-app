import { ShieldAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotAuthorizedPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 bg-card rounded-lg border border-border/50">
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <ShieldAlertIcon className="w-10 h-10 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
      <p className="text-muted-foreground mt-2 text-center max-w-sm">
        You do not have the necessary permissions to view this section. Please contact your administrator.
      </p>
      <Button variant="outline" className="mt-6" onClick={() => navigate(-1)}>
        Go Back
      </Button>
    </div>
  );
}