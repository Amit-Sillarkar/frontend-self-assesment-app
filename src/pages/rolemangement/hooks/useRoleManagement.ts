import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/components/toast-notification";

import {
    useGetRolesQuery,
    useCreateCustomRoleMutation,
    type RoleResponse,
} from "@/store/api/roleApi";

import { PRIMARY_ROLES } from "@/constants/enum";          // ✅ enum import
import type { CustomRole, CustomRoleFormData } from "../types"; // ✅ types import

// ── Hook ───────────────────────────────────
export function useRoleManagement() {
    const [searchParams, setSearchParams] = useSearchParams();
    const toast = useToast();
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data, isLoading, isFetching, isError } = useGetRolesQuery({
        page,
        limit: pageSize,
        search: search || undefined,
    });
    const [createRoleMutation, { isLoading: isCreating }] = useCreateCustomRoleMutation();
    const roles = useMemo(() => data?.roles ?? [], [data]);
    const pagination = data?.pagination;


    const mappedRoles: CustomRole[] = useMemo(() => {
        return roles.map((r: RoleResponse) => ({
            id: String(r.id),
            roleName: r.name || "Unnamed Role",
            assignedEmployees: Array.from({ length: r.userCount || 0 }).map((_, i) => ({
                id: `dummy-${r.id}-${i}`,
                empId: `EMP-${i}`,
                fullName: "Assigned User",
                primaryRole: PRIMARY_ROLES.USER, // Defaulting to USER for demo purposes

            })
            ),
            permissions: (r.permissions?.map((p: string | { permissionKey?: string; label?: string }) =>
                typeof p === "string" ? p : p.permissionKey || p.label
            ) || []).filter((p): p is string => Boolean(p)),
            createdBy: "System",
            createdAt: r.createdAt,
        }));
    }, [roles]);

    const filteredRoles = useMemo(() => {
        return mappedRoles.filter((r) => {
            if (!dateFilter || dateFilter === "all") return true;
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
        });
    }, [mappedRoles, dateFilter]);


    // ── URL Driven Modal States ──
    const isCreateOpen = searchParams.get("createRole") === "true";
    const editRoleId = searchParams.get("editRole");
    const viewRoleId = searchParams.get("viewRole");
    const deleteRoleId = searchParams.get("deleteRole");
    const editRoleData = useMemo(() =>
        editRoleId
            ? mappedRoles.find((r) => r.id === editRoleId) || null
            : null,
        [editRoleId, mappedRoles]
    );

    const viewRoleData = useMemo(
        () =>
            viewRoleId
                ? mappedRoles.find((r) => r.id === viewRoleId) || null
                : null,
        [viewRoleId, mappedRoles]
    );

    const deleteRoleData = useMemo(
        () =>
            deleteRoleId
                ? mappedRoles.find((r) => r.id === deleteRoleId) || null
                : null,
        [deleteRoleId, mappedRoles]
    );

    const clearModals = () => {
        searchParams.delete("createRole");
        searchParams.delete("editRole");
        searchParams.delete("viewRole");
        searchParams.delete("deleteRole");
        setSearchParams(searchParams);
    };

    // ── Handlers ──

    async function handleCreate(data: CustomRoleFormData) {
        try {
            await createRoleMutation({
                roleName: data.roleName,
                userIds: data.assignedEmployeeIds,
                permissionIds: data.permissionIds,
            }).unwrap();

            toast.success("Custom role created successfully.");
            clearModals();
        } catch (error: unknown) {
            toast.error(
                (error as { data?: { message?: string } })?.data?.message ||
                "Failed to create custom role."
            );
        }
    }

    function handleEditSave() {
        // Stub (till PUT API comes)
        toast.success("Custom role updated successfully.");
        clearModals();
    }

    function handleDelete() {
        // Stub (till DELETE API comes)
        if (!deleteRoleData) return;

        toast.success("Custom role deleted successfully.");
        clearModals();
    }

    function formatDate(iso: string) {
    if (!iso) return "N/A";
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

    // ── Return ──
    return {
        roles: filteredRoles,         // date-filtered, already paginated by API
        allRoles: mappedRoles,
        search,
        setSearch: (val: string) => {
            setSearch(val);
            setPage(1);             // reset to page 1 on new search
        },
        dateFilter,
        setDateFilter,
        isLoading: isLoading || isFetching,
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
        totalRecords: pagination?.total ?? 0,
        totalPages: pagination?.totalPages ?? 1,
        setPage,
        setPageSize: (val: number) => {
            setPageSize(val);
            setPage(1);
        },
        formatDate,
    };
}