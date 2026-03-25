// ─────────────────────────────────────────────
// FILE: src/pages/usermanagement/useUserHandlers.ts
// ─────────────────────────────────────────────

import { useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
    useGetUsersQuery,
    useUpdateUserMutation,
    useCreateUserMutation,
} from "@/store/api/userApi";
import { useToast } from "@/components/toast-notification";
import { USER_MESSAGES } from "@/constants/messages";
import { validateUserForm, type FormErrors } from "./utils/validation";
import type { User, UserFormData } from "./types";

export function useUserHandlers() {
    const toast = useToast();
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const { data: apiResponse, isLoading, isError } = useGetUsersQuery();
    const [updateUser] = useUpdateUserMutation();
    const [createUser] = useCreateUserMutation();

    const isAddOpen = searchParams.get("addUser") === "true";
    const editUserId = searchParams.get("editUser");
    const viewUserId = searchParams.get("viewUser");

    const users = useMemo<User[]>(() => apiResponse?.data ?? [], [apiResponse]);

    const editUser = useMemo(
        () => (editUserId ? users.find((u) => u.id === editUserId) ?? null : null),
        [users, editUserId]
    );

    const viewUser = useMemo(
        () => (viewUserId ? users.find((u) => u.id === viewUserId) ?? null : null),
        [users, viewUserId]
    );

    const filteredUsers = useMemo(() => {
        const q = search.toLowerCase().trim();
        return users.filter((u) => {
            const matchSearch =
                !q ||
                u.fullName?.toLowerCase().includes(q) ||
                u.employeeId?.toLowerCase().includes(q) ||
                u.email?.toLowerCase().includes(q) ||
                u.mobile?.includes(q);
            const matchRole =
                roleFilter === "all" || u.roleDefinition?.name === roleFilter;
            return matchSearch && matchRole;
        });
    }, [users, search, roleFilter]);

    const clearModals = useCallback(() => {
        const next = new URLSearchParams(searchParams);
        next.delete("addUser");
        next.delete("editUser");
        next.delete("viewUser");
        setSearchParams(next);
    }, [searchParams, setSearchParams]);

    const openAdd = useCallback(() => {
        const next = new URLSearchParams(searchParams);
        next.set("addUser", "true");
        setSearchParams(next);
    }, [searchParams, setSearchParams]);

    const openEdit = useCallback(
        (user: User) => {
            const next = new URLSearchParams(searchParams);
            next.set("editUser", user.id);
            setSearchParams(next);
        },
        [searchParams, setSearchParams]
    );

    const openView = useCallback(
        (user: User) => {
            const next = new URLSearchParams(searchParams);
            next.set("viewUser", user.id);
            setSearchParams(next);
        },
        [searchParams, setSearchParams]
    );

    const handleSubmit = useCallback(
        async (data: UserFormData): Promise<FormErrors> => {
            const mode = isAddOpen ? "add" : "edit";
            const validationErrors = validateUserForm(data, mode);
            if (Object.keys(validationErrors).length > 0) {
                return validationErrors;
            }

            // 2. Show pending toast
            toast.info(mode === "add" ? USER_MESSAGES.USER_CREATION_INPROGRESS : USER_MESSAGES.USER_UPDATE_INPROGRESS);
            try {
                if (mode === "add") {
                    await createUser({
                        employeeId: data.employeeId!,
                        fullName: data.fullName!,
                        mobile: data.mobile!,
                        email: data.email!,
                        password: data.password!,
                        roleId: data.roleId!,
                        designation: data.designation ?? "",
                        customRoleId: data.customRoleId ?? 0,
                        reportingSupervisorId: data.reportingSupervisorId ?? undefined,
                        isRoleAssignmentLocked: data.isRoleAssignmentLocked ?? false,
                    }).unwrap();
                    toast.success(USER_MESSAGES.CREATE_SUCCESS);
                } else if (editUser) {
                    await updateUser({
                        userId: editUser.id,
                        body: {
                            fullName: data.fullName,
                            email: data.email,
                            mobile: data.mobile,
                            designation: data.designation,
                            roleId: data.roleId,
                            customRoleId: data.customRoleId,
                            reportingSupervisorId: data.reportingSupervisorId,
                            reportingManagerId: data.reportingManagerId,
                            isRoleAssignmentLocked: data.isRoleAssignmentLocked,
                        },
                    }).unwrap();
                    toast.success(USER_MESSAGES.UPDATE_SUCCESS);
                }

                clearModals();
                return {}; // empty = success, modal will close
            } catch (err: any) {
                const message = err?.data?.message ?? (mode === "add"? USER_MESSAGES.CREATE_FAILED : USER_MESSAGES.UPDATE_FAILED);
                toast.error(message);
                return {}; 
            }
        },
        [isAddOpen, editUser, createUser, updateUser, toast, clearModals]
    );

    // ── Status toggle ────────────────────────────
    const handleToggleStatus = useCallback(
        async (user: User) => {
            const action = user.isActive ? "Deactivating" : "Activating";
            toast.info(`${action} user...`);
            try {
                await updateUser({
                    userId: user.id,
                    body: { isActive: !user.isActive },
                }).unwrap();
                toast.success(
                    `User ${user.isActive ? USER_MESSAGES.USER_DEACTIVATED_SUCCESS : USER_MESSAGES.USER_ACTIVATED_SUCCESS} successfully.`
                );
            } catch {
                toast.error(USER_MESSAGES.USER_ACTIVATION_FAILED);
            }
        },
        [updateUser, toast]
    );

    return {
        search, setSearch,
        roleFilter, 
        setRoleFilter,
        isLoading, 
        isError,
        filteredUsers,
        editUser, viewUser,
        isAddOpen,
        openAdd, 
        openEdit, 
        openView, 
        clearModals,
        handleSubmit,
        handleToggleStatus,
        viewUserId,
    };
}