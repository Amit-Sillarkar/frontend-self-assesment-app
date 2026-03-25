import { Skeleton } from "@/components/ui/skeleton";

export default function UserViewSkeleton() {
  return (
    <div className="p-6 space-y-8">
      {/* Profile Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-border/60">
        <Skeleton className="w-20 h-20 rounded-2xl" /> {/* Avatar Icon placeholder */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-48" /> {/* Full Name placeholder */}
            <Skeleton className="h-6 w-20 rounded-full" /> {/* Role Badge placeholder */}
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-32" /> {/* Designation placeholder */}
            <Skeleton className="h-4 w-4 rounded-full" /> {/* Bullet separator */}
            <Skeleton className="h-5 w-24" /> {/* Employee ID placeholder */}
          </div>
        </div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Each block represents a DetailField */}
        <Skeleton className="h-18 w-full rounded-xl" /> {/* Mobile placeholder */}
        <Skeleton className="h-18 w-full rounded-xl" /> {/* Email placeholder */}
        
        {/* Custom Roles Section */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl border border-border/50">
          <Skeleton className="w-8 h-8 rounded-lg" /> {/* Icon placeholder */}
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 w-20" /> {/* Label placeholder */}
            <div className="flex gap-2">
               <Skeleton className="h-6 w-24 rounded-md" /> {/* Badge 1 */}
               <Skeleton className="h-6 w-20 rounded-md" /> {/* Badge 2 */}
            </div>
          </div>
        </div>

        <Skeleton className="h-18 w-full rounded-xl" /> {/* Role Lock Status placeholder */}

        {/* Reporting IDs Section */}
        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
           <Skeleton className="h-18 w-full rounded-xl" /> {/* Supervisor ID placeholder */}
           <Skeleton className="h-18 w-full rounded-xl" /> {/* Manager ID placeholder */}
        </div>
      </div>
    </div>
  );
}