import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/components/toast-notification";
import { useGetRolesQuery, useCreateCustomRoleMutation } from "@/store/api/roleApi";
import type { CustomRole, CustomRoleFormData } from "../types";

export function useRoleManagement() {
    const [searchParams, setSearchParams] = useSearchParams();
    const toast = useToast();

    // ── API Hooks ──
    const queryParams = useMemo(() => ({ limit: 100 }), []);
    const { data: apiResponse, isLoading, isFetching, isError } = useGetRolesQuery(queryParams);
    const [createRoleMutation, { isLoading: isCreating }] = useCreateCustomRoleMutation();

    // ── Local State ──
    const [roles, setRoles] = useState<CustomRole[]>([]);
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("all");

    // ── Synchronize API data with Local State ──
    useEffect(() => {
        if (!apiResponse) return;

        let rawRoles: any[] = [];
        const res = apiResponse as any; // <-- Force TS to bypass strict checking here

        if (Array.isArray(res)) rawRoles = res;
        else if (res?.data && Array.isArray(res.data)) rawRoles = res.data;
        else if (res?.data?.data && Array.isArray(res.data.data)) rawRoles = res.data.data;

        if (rawRoles.length > 0) {
            const mappedRoles: CustomRole[] = rawRoles.map((r: any) => ({
                id: String(r.id),
                roleName: r.roleName || r.name || "Unnamed Role",
                assignedEmployees: Array.from({ length: r.userCount || 0 }).map((_, i) => ({
                    id: `dummy-${r.id}-${i}`,
                    empId: `EMP-${i}`,
                    fullName: "Assigned User",
                    primaryRole: "EMPLOYEE" as any,
                })),
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

    const editRoleData = useMemo(() => (editRoleId ? roles.find((r) => r.id === editRoleId) || null : null), [editRoleId, roles]);
    const viewRoleData = useMemo(() => (viewRoleId ? roles.find((r) => r.id === viewRoleId) || null : null), [viewRoleId, roles]);
    const deleteRoleData = useMemo(() => deleteRoleId ? roles.find((r) => r.id === deleteRoleId) || null : null, [deleteRoleId, roles]);

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
            // Mapping exact payload required by backend
            await createRoleMutation({
                roleName: data.roleName,
                userIds: data.assignedEmployeeIds,
                permissionIds: data.permissionIds
            }).unwrap();
            
            toast.success("Custom role created successfully.");
            clearModals();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create custom role.");
        }
    }

    function handleEditSave(updatedRole: CustomRole) {
        // Local stub for edit till PUT/PATCH api is added
        setRoles((prev) => prev.map((r) => (r.id === updatedRole.id ? updatedRole : r)));
        clearModals();
        toast.success("Custom role updated successfully.");
    }

    function handleDelete() {
        // Local stub for delete till DELETE api is added
        if (!deleteRoleData) return;
        setRoles((prev) => prev.filter((r) => r.id !== deleteRoleData.id));
        clearModals();
        toast.success("Custom role deleted successfully.");
    }

    return {
        roles,
        search, setSearch,
        dateFilter, setDateFilter,
        isLoading: isLoading || isFetching,
        isError,
        isCreating,
        isCreateOpen,
        editRoleData, viewRoleData, deleteRoleData,
        searchParams, setSearchParams,
        clearModals, handleCreate, handleEditSave, handleDelete
    };
}