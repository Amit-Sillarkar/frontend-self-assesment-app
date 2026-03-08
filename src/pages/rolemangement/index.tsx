import { useState, useMemo } from "react";
import {
    PlusIcon,
    EyeIcon,
    Trash2Icon,
    ShieldIcon,
    UsersIcon,
    CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// Common components
import PageHeader from "@/components/page-header";
import TableCard from "@/components/table-card";
import DataTable from "@/components/data-table";
import SearchFilterBar from "@/components/search-filter-bar";
import type { ColumnDef, RowAction } from "@/types/table";

// Page components
import CreateRoleWizard from "./components/create-role-wizard";
import DeleteRoleDialog from "./components/delete-role-dialog";

// Data & types
import { MOCK_CUSTOM_ROLES } from "@/mockdata/custom-roles";
import type { CustomRole, CustomRoleFormData } from "./types";
import { PERMISSION_GROUPS } from "@/constants/enum";
import { ASSIGNABLE_EMPLOYEES } from "@/mockdata/users";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import RoleBadge from "@/components/role-badge";

// ── Helpers ───────────────────────────────────

function permissionLabel(key: string): string {
    for (const group of Object.values(PERMISSION_GROUPS)) {
        const found = group.permissions.find((p) => p.key === key);
        if (found) return found.label;
    }
    return key;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

// ── Column definitions ─────────────────────────

const ROLE_COLUMNS: ColumnDef<CustomRole>[] = [
    {
        key: "roleName",
        header: "Role Name",
        render: (r) => (
            <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ShieldIcon className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="font-semibold text-sm text-foreground">
                    {r.roleName}
                </span>
            </div>
        ),
    },
    {
        key: "assignedEmployees",
        header: "Assigned Employees",
        render: (r) => (
            <div className="flex items-center gap-1.5">
                <UsersIcon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm text-foreground font-medium">
                    {r.assignedEmployees.length}
                </span>
                <span className="text-xs text-muted-foreground">
                    {r.assignedEmployees.length === 1 ? "employee" : "employees"}
                </span>
            </div>
        ),
    },
    {
        key: "permissions",
        header: "Permissions",
        hideBelow: "lg",
        render: (r) => (
            <div className="flex flex-wrap gap-1 max-w-xs">
                {r.permissions.slice(0, 2).map((p) => (
                    <span
                        key={p}
                        className="inline-block px-2 py-0.5 text-xs bg-muted rounded font-mono"
                    >
                        {p}
                    </span>
                ))}
                {r.permissions.length > 2 && (
                    <span className="inline-block px-2 py-0.5 text-xs bg-muted rounded text-muted-foreground">
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
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarIcon className="w-3.5 h-3.5" />
                {formatDate(r.createdAt)}
            </div>
        ),
    },
    {
        key: "createdBy",
        header: "Created By",
        hideBelow: "lg",
        render: (r) => (
            <span className="text-xs text-muted-foreground">{r.createdBy}</span>
        ),
    },
];

// ── Page ─────────────────────────────────────

export default function CustomRolesPage() {
    const [roles, setRoles] = useState<CustomRole[]>(MOCK_CUSTOM_ROLES);
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("all");
    const [viewRole, setViewRole] = useState<CustomRole | null>(null);
    const [deleteRole, setDeleteRole] = useState<CustomRole | null>(null);
    const [isWizardOpen, setIsWizardOpen] = useState(false);

    // ── Filtering ──────────────────────────────

    const filteredRoles = useMemo(() => {
        const q = search.toLowerCase();
        return roles.filter((r) => {
            const matchSearch =
                !q ||
                r.roleName.toLowerCase().includes(q) ||
                r.permissions.some((p) => p.toLowerCase().includes(q)) ||
                r.assignedEmployees.some((e) => e.fullName.toLowerCase().includes(q));

            const matchDate = (() => {
                if (dateFilter === "all") return true;
                const created = new Date(r.createdAt);
                const now = new Date();
                if (dateFilter === "this_month") {
                    return (
                        created.getMonth() === now.getMonth() &&
                        created.getFullYear() === now.getFullYear()
                    );
                }
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

    // ── Handlers ──────────────────────────────

    function handleCreate(data: CustomRoleFormData) {
        const employees = ASSIGNABLE_EMPLOYEES.filter((e) =>
            data.assignedEmployeeIds.includes(e.id),
        );
        const newRole: CustomRole = {
            id: Date.now().toString(),
            roleName: data.roleName,
            assignedEmployees: employees,
            permissions: data.permissions,
            createdBy: "Admin User",
            createdAt: new Date().toISOString().split("T")[0],
        };
        setRoles((prev) => [...prev, newRole]);
    }

    function handleDelete() {
        if (!deleteRole) return;
        setRoles((prev) => prev.filter((r) => r.id !== deleteRole.id));
        setDeleteRole(null);
    }

    // ── Row actions ────────────────────────────

    const rowActions: RowAction<CustomRole>[] = [
        {
            icon: <EyeIcon className="w-4 h-4" />,
            label: "View",
            onClick: setViewRole,
        },
        {
            icon: <Trash2Icon className="w-4 h-4" />,
            label: "Delete",
            onClick: setDeleteRole,
            danger: true,
        },
    ];

    // ── Render ─────────────────────────────────

    return (
        <div className="space-y-6">
            {/* Page header */}
            <PageHeader
                title="Custom Roles"
                subtitle="Define and manage custom permission roles for employees"
            >
                <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => setIsWizardOpen(true)}
                >
                    <PlusIcon className="w-4 h-4" /> Create Custom Role
                </Button>
            </PageHeader>

            {/* Table card */}
            <TableCard
                title="All Custom Roles"
                description="Search by role name, permission, or assigned employee"
                count={filteredRoles.length}
                footer={`Showing ${filteredRoles.length} of ${roles.length} roles`}
                searchArea={
                    <SearchFilterBar
                        search={search}
                        onSearchChange={setSearch}
                        searchPlaceholder="Search by role or permission..."
                        filters={[
                            {
                                value: dateFilter,
                                onChange: setDateFilter,
                                placeholder: "Filter by date",
                                width: "sm:w-44",
                                options: [
                                    { value: "all", label: "All Time" },
                                    { value: "this_month", label: "This Month" },
                                    { value: "last_3_months", label: "Last 3 Months" },
                                ],
                            },
                        ]}
                    />
                }
            >
                <DataTable
                    columns={ROLE_COLUMNS}
                    data={filteredRoles}
                    actions={rowActions}
                    emptyMessage="No custom roles found. Create one using the button above."
                />
            </TableCard>

            {/* Wizard */}
            <CreateRoleWizard
                open={isWizardOpen}
                existingRoleNames={roles.map((r) => r.roleName)}
                onClose={() => setIsWizardOpen(false)}
                onSubmit={handleCreate}
            />

            {/* View modal */}
            <RoleViewModal role={viewRole} onClose={() => setViewRole(null)} />

            {/* Delete dialog */}
            <DeleteRoleDialog
                role={deleteRole}
                onConfirm={handleDelete}
                onCancel={() => setDeleteRole(null)}
            />
        </div>
    );
}

// ── Role View Modal ───────────────────────────

function RoleViewModal({
    role,
    onClose,
}: {
    role: CustomRole | null;
    onClose: () => void;
}) {
    if (!role) return null;
    return (
        <Dialog open={!!role} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[650px] w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShieldIcon className="w-5 h-5 text-primary" />
                        {role.roleName}
                    </DialogTitle>
                    <DialogDescription>
                        Created by {role.createdBy} on {formatDate(role.createdAt)}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5">
                    {/* Assigned employees */}
                    <div>
                        <p className="text-sm font-semibold text-foreground mb-2">
                            Assigned Employees ({role.assignedEmployees.length})
                        </p>
                        <div className="space-y-2">
                            {role.assignedEmployees.map((emp) => (
                                <div
                                    key={emp.id}
                                    className="flex items-center gap-3 px-3 py-2.5 bg-muted/40 rounded-lg"
                                >
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                        <UsersIcon className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">
                                            {emp.fullName}
                                        </p>
                                        <p className="text-xs text-muted-foreground font-mono">
                                            {emp.empId}
                                        </p>
                                    </div>
                                    <RoleBadge role={emp.primaryRole} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Permissions */}
                    <div>
                        <p className="text-sm font-semibold text-foreground mb-2">
                            Permissions ({role.permissions.length})
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {role.permissions.map((p) => (
                                <span
                                    key={p}
                                    className="inline-flex items-center px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-md border border-primary/20"
                                >
                                    {permissionLabel(p)}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
