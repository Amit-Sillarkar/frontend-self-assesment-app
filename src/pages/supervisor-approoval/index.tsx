import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { EditIcon, UserIcon, CalendarIcon, AlertCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/page-header";
import TableCard from "@/components/table-card";
import DataTable from "@/components/data-table";
import SearchFilterBar from "@/components/search-filter-bar";
import { usePagination } from "@/components/table-pagination";

import { MOCK_SUPERVISOR_REVIEWS, type SupervisorReview } from "@/mockdata/supervisor-reviews";
import type { ColumnDef, RowAction } from "@/types/table";

function formatDisplayDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function SupervisorApprovalListPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredData = useMemo(() => {
        const q = search.toLowerCase();
        return MOCK_SUPERVISOR_REVIEWS.filter(r => {
            const matchSearch = !q || r.employeeName.toLowerCase().includes(q) || r.assessmentTitle.toLowerCase().includes(q);
            const matchStatus = statusFilter === "all" || r.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [search, statusFilter]);

    const { paginated, PaginationBar } = usePagination(filteredData);

    const COLUMNS: ColumnDef<SupervisorReview>[] = [
        {
            key: "employeeName",
            header: "Employee & Assessment",
            render: (r) => (
                <div className="flex flex-col space-y-1 py-1">
                    <span className="font-bold text-[15px] text-foreground flex items-center gap-2">
                        <div className="p-1.5 bg-primary/10 rounded-md shrink-0">
                            <UserIcon className="w-3.5 h-3.5 text-primary" />
                        </div>
                        {r.employeeName} 
                        <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full ml-1">{r.employeeId}</span>
                    </span>
                    <span className="text-[13px] font-medium text-muted-foreground pl-[30px]">{r.assessmentTitle}</span>
                </div>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (r) => {
                if (r.status === 'expiring_soon') return <Badge variant="destructive" className="shadow-sm animate-pulse px-2.5 py-1"><AlertCircle className="w-3.5 h-3.5 mr-1.5" /> Expiring Soon</Badge>;
                if (r.status === 'in_progress') return <Badge variant="secondary" className="bg-secondary text-secondary-foreground border-border shadow-sm px-3 py-1">Draft Saved</Badge>;
                return <Badge variant="default" className="bg-primary text-primary-foreground shadow-sm px-3 py-1">Pending Review</Badge>;
            },
        },
        {
            key: "submittedDate",
            header: "Timeline",
            hideBelow: "md",
            render: (r) => (
                <div className="flex flex-col space-y-1.5 text-xs font-medium">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 opacity-70" /> Sub: {formatDisplayDate(r.submittedDate)}
                    </span>
                    <span className={`flex items-center gap-1.5 ${r.status === 'expiring_soon' ? 'text-destructive font-bold' : 'text-foreground'}`}>
                        <CalendarIcon className="w-3.5 h-3.5 opacity-70" /> Due: {formatDisplayDate(r.dueDate)}
                    </span>
                </div>
            ),
        },
    ];

    const rowActions: RowAction<SupervisorReview>[] = [
        {
            icon: <EditIcon className="w-4 h-4" />,
            label: "Evaluate",
            onClick: (r) => navigate(`/dashboard/supervisor-approval/review/${r.id}`),
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <PageHeader title="Pending Approvals" subtitle="Review and approve employee self-assessments" />

            <TableCard
                title="Reviews Queue"
                description="List of all assessments waiting for your evaluation."
                count={filteredData.length}
                searchArea={
                    <SearchFilterBar 
                        search={search} 
                        onSearchChange={setSearch} 
                        searchPlaceholder="Search by employee or title..."
                        filters={[
                            {
                                value: statusFilter,
                                onChange: setStatusFilter,
                                placeholder: "Filter by Status",
                                width: "sm:w-[180px]",
                                options: [
                                    { value: "all", label: "All Reviews" },
                                    { value: "pending", label: "Pending Review" },
                                    { value: "in_progress", label: "Draft Saved" },
                                    { value: "expiring_soon", label: "Expiring Soon" }
                                ]
                            }
                        ]}
                    />
                }
            >
                <DataTable columns={COLUMNS} data={paginated} actions={rowActions} emptyMessage="No reviews pending your approval." />
                <PaginationBar />
            </TableCard>
        </div>
    );
}