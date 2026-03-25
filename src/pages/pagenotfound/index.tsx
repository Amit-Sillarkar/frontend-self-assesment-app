import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTE_PATHS } from "@/constants/enum";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center animate-in fade-in duration-500">
      <h1 className="text-9xl font-bold text-primary/20">404</h1>
      <h2 className="text-3xl font-semibold mt-4 text-foreground">Lost in the System?</h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        The page you are looking for doesn't exist or has been moved. 
      </p>
      <Link to={ROUTE_PATHS.DASHBOARD} className="mt-8">
        <Button size="lg" className="shadow-md hover:shadow-lg transition-all">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}