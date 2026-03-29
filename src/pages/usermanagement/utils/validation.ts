import type { UserFormData } from "../types";

export type FormErrors = Partial<Record<keyof UserFormData, string>>;

export const validateUserForm = (form: UserFormData, mode: "add" | "edit"): FormErrors => {
    const e: FormErrors = {};
    if (mode === "add") {
        if (!form.employeeId?.trim()) e.employeeId = "Employee ID is required.";
        if (!form.password?.trim()) e.password = "Password is required.";
    }
    if (!form.fullName?.trim()) e.fullName = "Full name is required.";
    if (!form.mobile?.trim()) e.mobile = "Mobile number is required."; 
        else if (!/^\d{10}$/.test(form.mobile)) {
        e.mobile = "Enter a valid 10-digit mobile number.";
    }    
    if (!form.email?.trim()) {
        e.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        e.email = "Enter a valid email.";
    }
    if (!form.roleId) e.roleId = "Primary role is required.";
    return e;
};