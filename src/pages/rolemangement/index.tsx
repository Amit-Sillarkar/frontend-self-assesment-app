import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
    PlusIcon,
    EyeIcon,
    Trash2Icon,
    ShieldIcon,
    UsersIcon,
    CalendarIcon,
    PencilIcon,
    Loader2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import PageHeader from "@/components/page-header";
import TableCard from "@/components/table-card";
import DataTable from "@/components/data-table";
import SearchFilterBar from "@/components/search-filter-bar";
import type { ColumnDef, RowAction } from "@/types/table";

import { useToast } from "@/components/toast-notification";
import { usePagination } from "@/components/table-pagination";

import CreateRoleWizard from "./components/create-role-wizard";
import RoleViewModal from "./components/role-view-modal";
import EditRoleModal from "./components/edit-role-modal";

import type { CustomRole, CustomRoleFormData } from "./types";
import { ROLE_MESSAGES } from "@/constants/messages";
import { ConfirmationModal } from "@/components/common/confirmation-modal";

import { useGetRolesQuery } from "@/store/api/roleApi";

function formatDate(iso: string) {
    if (!iso) return "N/A";
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default function CustomRolesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const toast = useToast();

    // ── 1. Fetch data from RTK Query ──
    const queryParams = useMemo(() => ({ limit: 100 }), []);
    const { data: apiResponse, isLoading, isFetching, isError } = useGetRolesQuery(queryParams);

    const [roles, setRoles] = useState<CustomRole[]>([]);
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("all");

    // ── 2. Safely Synchronize API data with Local State ──
    useEffect(() => {
        if (!apiResponse) return;

        // Extract the array no matter how the backend wraps it
        let rawRoles: any[] = [];
        if (Array.isArray(apiResponse)) rawRoles = apiResponse;
        else if (apiResponse?.data && Array.isArray(apiResponse.data)) rawRoles = apiResponse.data;
        else if (apiResponse?.data?.data && Array.isArray(apiResponse.data.data)) rawRoles = apiResponse.data.data;

        if (rawRoles.length > 0) {
            const mappedRoles: CustomRole[] = rawRoles.map((r: any) => ({
                id: String(r.id),
                roleName: r.roleName || r.name || "Unnamed Role",
                // Map the user count into mock avatars for the table
                assignedEmployees: Array.from({ length: r.userCount || 0 }).map((_, i) => ({
                    id: `dummy-${r.id}-${i}`,
                    empId: `EMP-${i}`,
                    fullName: "Assigned User",
                    primaryRole: "EMPLOYEE" as any,
                })),
                // Map complex permission objects to strings
                permissions: r.permissions?.map((p: any) => p.permissionKey || p.label || String(p)) || [],
                createdBy: "System",
                createdAt: r.createdAt || new Date().toISOString(),
            }));
            
            setRoles(mappedRoles);
        } else {
            setRoles([]); 
        }
    }, [apiResponse]);

    // ── URL Driven Modal States ──
    const isCreateOpen = searchParams.get("createRole") === "true";
    const editRoleId = searchParams.get("editRole");
    const viewRoleId = searchParams.get("viewRole");
    const deleteRoleId = searchParams.get("deleteRole");

    const editRoleData = useMemo(
        () => (editRoleId ? roles.find((r) => r.id === editRoleId) || null : null),
        [editRoleId, roles],
    );
    const viewRoleData = useMemo(
        () => (viewRoleId ? roles.find((r) => r.id === viewRoleId) || null : null),
        [viewRoleId, roles],
    );
    const deleteRoleData = useMemo(
        () =>
            deleteRoleId ? roles.find((r) => r.id === deleteRoleId) || null : null,
        [deleteRoleId, roles],
    );

    const clearModals = () => {
        searchParams.delete("createRole");
        searchParams.delete("editRole");
        searchParams.delete("viewRole");
        searchParams.delete("deleteRole");
        setSearchParams(searchParams);
    };

    // ── Columns ──
    const ROLE_COLUMNS: ColumnDef<CustomRole>[] = [
        {
            key: "roleName",
            header: "Role Name",
            render: (r) => (
                <div
                    className="flex items-center gap-3 group cursor-pointer"
                    onClick={() => {
                        searchParams.set("viewRole", r.id);
                        setSearchParams(searchParams);
                    }}
                >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20 shadow-sm border border-primary/10">
                        <ShieldIcon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                        {r.roleName}
                    </span>
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
                            <div
                                key={i}
                                className="w-6 h-6 rounded-full bg-accent border-2 border-background flex items-center justify-center text-[10px] font-bold text-accent-foreground z-10 transition-transform hover:-translate-y-1 hover:z-20"
                            >
                                <UsersIcon className="w-3 h-3 opacity-50" />
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">
                            {r.assignedEmployees.length}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            Users
                        </span>
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
                        <span
                            key={i}
                            className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-secondary/50 text-secondary-foreground rounded-md border border-border/50 transition-all hover:bg-secondary hover:shadow-sm"
                        >
                            {p}
                        </span>
                    ))}
                    {r.permissions.length > 2 && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-md border border-border/50">
                            +{r.permissions.length - 2} more
                        </span>
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
        {
            icon: <EyeIcon className="w-4 h-4" />,
            label: "View",
            onClick: (r) => {
                searchParams.set("viewRole", r.id);
                setSearchParams(searchParams);
            },
        },
        {
            icon: <PencilIcon className="w-4 h-4" />,
            label: "Edit",
            onClick: (r) => {
                searchParams.set("editRole", r.id);
                setSearchParams(searchParams);
            },
        },
        {
            icon: <Trash2Icon className="w-4 h-4" />,
            label: "Delete",
            danger: true,
            onClick: (r) => {
                searchParams.set("deleteRole", r.id);
                setSearchParams(searchParams);
            },
        },
    ];

    // ── Filtering ──
    const filteredRoles = useMemo(() => {
        const q = search.toLowerCase();
        return roles.filter((r) => {
            const matchSearch =
                !q ||
                r.roleName.toLowerCase().includes(q) ||
                r.permissions.some((p) => p.toLowerCase().includes(q));
            const matchDate = (() => {
                if (dateFilter === "all") return true;
                const created = new Date(r.createdAt);
                const now = new Date();
                if (dateFilter === "this_month")
                    return (
                        created.getMonth() === now.getMonth() &&
                        created.getFullYear() === now.getFullYear()
                    );
                if (dateFilter === "last_3_months") {
                    const cutoff = new Date(now);
                    cutoff.setMonth(cutoff.getMonth() - 3);
                    return created >= cutoff;
                }
                return true;
            })();
            return matchSearch && matchDate;
        });
    }, [roles, search, dateFilter]);

    // ── 2. Initialize Pagination Hook ──
    const { paginated, PaginationBar } = usePagination(filteredRoles);

    // ── Handlers ──
    function handleCreate(data: CustomRoleFormData) {
        const newRole: CustomRole = {
            id: Date.now().toString(),
            roleName: data.roleName,
            assignedEmployees: [],
            permissions: data.permissions,
            createdBy: "Admin User",
            createdAt: new Date().toISOString().split("T")[0],
        };
        setRoles((prev) => [newRole, ...prev]);
        clearModals();
        toast.success("Custom role created successfully.");
    }

    function handleEditSave(updatedRole: CustomRole) {
        setRoles((prev) => prev.map((r) => (r.id === updatedRole.id ? updatedRole : r)));
        clearModals();
        toast.success("Custom role updated successfully.");
    }

    function handleDelete() {
        if (!deleteRoleData) return;
        setRoles((prev) => prev.filter((r) => r.id !== deleteRoleData.id));
        clearModals();
        toast.success("Custom role deleted successfully.");
    }

    // Safely combine isLoading and isFetching
    const loadingState = isLoading || isFetching;
    
    const emptyMessage = loadingState 
        ? <span className="flex items-center gap-2"><Loader2Icon className="w-4 h-4 animate-spin"/> Loading roles...</span>
        : isError 
        ? "Failed to load roles." 
        : "No custom roles found.";

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
                count={filteredRoles.length}
                searchArea={
                    <SearchFilterBar
                        search={search}
                        onSearchChange={setSearch}
                        searchPlaceholder="Search by role or permission..."
                        filters={[
                            { value: dateFilter, onChange: setDateFilter, placeholder: "Filter by date", width: "sm:w-44", options: [ { value: "all", label: "All Time" }, { value: "this_month", label: "This Month" }, { value: "last_3_months", label: "Last 3 Months" } ] },
                        ]}
                    />
                }
            >
                <DataTable columns={ROLE_COLUMNS} data={paginated} actions={rowActions} emptyMessage={emptyMessage as any} />
                <PaginationBar />
            </TableCard>

            <CreateRoleWizard open={isCreateOpen} existingRoleNames={roles.map((r) => r.roleName)} onClose={clearModals} onSubmit={handleCreate} />
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