import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
    rowCount?: number;
}

export default function TableSkeleton({ rowCount = 5 }: TableSkeletonProps) {
    return (
        <div className="w-full border border-border/60 rounded-lg overflow-hidden bg-card">
            <div className="flex items-center bg-muted/50 border-b border-border/60 px-4 py-3">
                <div className="w-28"><Skeleton className="h-4 w-16" /></div> {/* Emp ID */}
                <div className="flex-1"><Skeleton className="h-4 w-24" /></div> {/* Name */}
                <div className="hidden lg:block w-40"><Skeleton className="h-4 w-20" /></div> {/* Mobile */}
                <div className="hidden lg:block flex-1"><Skeleton className="h-4 w-32" /></div> {/* Email */}
                <div className="w-32"><Skeleton className="h-4 w-20" /></div> {/* Role */}
                <div className="w-24"><Skeleton className="h-4 w-16" /></div> {/* Status */}
                <div className="w-20"></div> {/* Actions Spacer */}
            </div>

            {/* Custom Table Body */}
            <div className="divide-y divide-border/60">
                {Array.from({ length: rowCount }).map((_, rowIndex) => (
                    <div key={rowIndex} className="flex items-center px-4 py-4 hover:bg-muted/30 transition-colors">
                        {/* Emp ID */}
                        <div className="w-28">
                            <Skeleton className="h-4 w-12" />
                        </div>

                        {/* Name with Avatar Circle */}
                        <div className="flex-1 flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                        </div>

                        {/* Mobile (Hidden on small screens) */}
                        <div className="hidden lg:block w-40">
                            <Skeleton className="h-4 w-24" />
                        </div>

                        {/* Email (Hidden on small screens) */}
                        <div className="hidden lg:block flex-1">
                            <Skeleton className="h-4 w-40" />
                        </div>

                        {/* Role Badge Placeholder */}
                        <div className="w-32">
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>

                        {/* Status Toggle Placeholder */}
                        <div className="w-24">
                            <Skeleton className="h-5 w-10 rounded-full" />
                        </div>

                        {/* Actions Placeholder */}
                        <div className="w-20 flex gap-2 justify-end">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Area Skeleton */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/60 bg-muted/20">
                <Skeleton className="h-4 w-48" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
            </div>
        </div>
    );
}