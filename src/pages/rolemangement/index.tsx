import { PlusIcon, EyeIcon, Trash2Icon, ShieldIcon, UsersIcon, CalendarIcon, PencilIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/page-header";
import TableCard from "@/components/table-card";
import DataTable from "@/components/data-table";
import SearchFilterBar from "@/components/search-filter-bar";
import { usePagination } from "@/components/table-pagination";
import type { ColumnDef, RowAction } from "@/types/table";
import CreateRoleWizard from "./components/create-role-wizard";
import RoleViewModal from "./components/role-view-modal";
import EditRoleModal from "./components/edit-role-modal";
import { ROLE_MESSAGES } from "@/constants/messages";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import type { CustomRole } from "./types";
import { useRoleManagement } from "./hooks/useRoleManagement";


export default function CustomRolesPage() {
    const {
        roles,
        allRoles,
        search,
        setSearch,
        dateFilter,
        setDateFilter,
        isLoading,
        isError,
        isCreating,
        isCreateOpen,
        editRoleData,
        viewRoleData,
        deleteRoleData,
        searchParams,
        setSearchParams,
        clearModals,
        handleCreate,
        handleEditSave,
        handleDelete,
        page,
        pageSize,
        totalRecords,
        totalPages,
        setPage,
        setPageSize,
        formatDate,
    } = useRoleManagement();

    // ── Columns ──
    const ROLE_COLUMNS: ColumnDef<CustomRole>[] = [
        {
            key: "roleName",
            header: "Role Name",
            render: (r) => (
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => { searchParams.set("viewRole", r.id); setSearchParams(searchParams); }}>
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20 shadow-sm border border-primary/10">
                        <ShieldIcon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-200">{r.roleName}</span>
                </div>
            ),
        },
        {
            key: "assignedEmployees",
            header: "Assigned",
            render: (r) => (
                <div className="flex items-center gap-2 group">
                    <div className="flex -space-x-2">
                        {r.assignedEmployees.slice(0, 3).map((_, i) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-accent border-2 border-background flex items-center justify-center text-[10px] font-bold text-accent-foreground z-10 transition-transform hover:-translate-y-1 hover:z-20">
                                <UsersIcon className="w-3 h-3 opacity-50" />
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">{r.assignedEmployees.length}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Users</span>
                    </div>
                </div>
            ),
        },
        {
            key: "permissions",
            header: "Permissions",
            hideBelow: "lg",
            render: (r) => (
                <div className="flex flex-wrap gap-1.5 max-w-[240px]">
                    {r.permissions.slice(0, 2).map((p, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-secondary/50 text-secondary-foreground rounded-md border border-border/50 transition-all hover:bg-secondary hover:shadow-sm">{p}</span>
                    ))}
                    {r.permissions.length > 2 && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-md border border-border/50">+{r.permissions.length - 2} more</span>
                    )}
                </div>
            ),
        },
        {
            key: "createdAt",
            header: "Created",
            hideBelow: "md",
            render: (r) => (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md w-fit">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    {formatDate(r.createdAt)}
                </div>
            ),
        },
    ];

    const rowActions: RowAction<CustomRole>[] = [
        { icon: <EyeIcon className="w-4 h-4" />, label: "View", onClick: (r) => { searchParams.set("viewRole", r.id); setSearchParams(searchParams); } },
        { icon: <PencilIcon className="w-4 h-4" />, label: "Edit", onClick: (r) => { searchParams.set("editRole", r.id); setSearchParams(searchParams); } },
        { icon: <Trash2Icon className="w-4 h-4" />, label: "Delete", danger: true, onClick: (r) => { searchParams.set("deleteRole", r.id); setSearchParams(searchParams); } },
    ];

    // ── Filtering ──
    const { PaginationBar } = usePagination(roles, {
        serverSide: true,
        totalRecords,
        totalPages,
        page,
        pageSize,
        onPageChange: setPage,
        onPageSizeChange: setPageSize,
        isLoading,
    });

    const emptyMessage = isLoading ? <span className="flex items-center gap-2"><Loader2Icon className="w-4 h-4 animate-spin" /> Loading roles...</span> : isError ? "Failed to load roles." : "No custom roles found.";

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader title="Custom Roles" subtitle="Define and manage custom permission roles for employees">
                <Button size="sm" className="gap-2 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5" onClick={() => { searchParams.set("createRole", "true"); setSearchParams(searchParams); }}>
                    <PlusIcon className="w-4 h-4" /> Create Custom Role
                </Button>
            </PageHeader>

            <TableCard
                title="All Custom Roles"
                description="Search by role name, permission, or assigned employee"
                count={totalRecords}
                searchArea={
                    <SearchFilterBar
                        search={search}
                        onSearchChange={setSearch}
                        searchPlaceholder="Search by role or permission..."
                        filters={[{ value: dateFilter, onChange: setDateFilter, placeholder: "Filter by date", width: "sm:w-44", options: [{ value: "all", label: "All Time" }, { value: "this_month", label: "This Month" }, { value: "last_3_months", label: "Last 3 Months" }] }]}
                    />
                }
            >
                <DataTable
                    columns={ROLE_COLUMNS}
                    data={roles}
                    actions={rowActions}
                    emptyMessage={emptyMessage as string}
                />
                <PaginationBar />
            </TableCard>

            <CreateRoleWizard open={isCreateOpen} existingRoleNames={allRoles.map((r) => r.roleName)} onClose={clearModals} onSubmit={handleCreate} isSubmitting={isCreating} />
            <RoleViewModal role={viewRoleData} onClose={clearModals} />
            <EditRoleModal isOpen={!!editRoleData} role={editRoleData} onSave={handleEditSave} onClose={clearModals} />

            <ConfirmationModal
                variant="danger"
                open={!!deleteRoleData}
                onClose={clearModals}
                onConfirm={handleDelete}
                title={ROLE_MESSAGES.DELETE_CONFIRM_TITLE || "Delete Custom Role"}
                message={deleteRoleData ? `Are you sure you want to delete ${deleteRoleData.roleName}?` : ""}
                confirmText="Delete Role"
            />
        </div>
    );
}