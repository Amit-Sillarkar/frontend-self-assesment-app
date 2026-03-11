import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom"; 
import {
  EyeIcon,
  PencilIcon,
  Trash2Icon,
  PlusIcon,
  UploadIcon,
  RefreshCwIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import PageHeader from "@/components/page-header";
import TableCard from "@/components/table-card";
import DataTable from "@/components/data-table";
import SearchFilterBar from "@/components/search-filter-bar";
import RoleBadge from "@/components/role-badge";
import { usePagination } from "@/components/table-pagination";
import { useToast } from "@/components/toast-notification";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import type { ColumnDef, RowAction } from "@/types/table";

import UserViewModal from "./components/user-view-modal";
import UserFormModal from "./components/user-form-modal";

import type { User, UserFormData } from "./types";
import { MOCK_USERS } from "@/mockdata/users";
import { PRIMARY_ROLE_OPTIONS } from "@/constants/enum";
import { USER_MESSAGES } from "@/constants/messages";

const USER_COLUMNS: ColumnDef<User>[] = [
  {
    key: "empId",
    header: "Emp ID",
    width: "w-28",
    render: (u) => (
      <span className="text-xs font-bold text-foreground">{u.empId}</span>
    ),
  },
  {
    key: "fullName",
    header: "Name",
    render: (u) => (
      <div className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
          <UserIcon className="w-4 h-4 text-primary" />
        </div>
        <span className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
          {u.fullName}
        </span>
      </div>
    ),
  },
  {
    key: "mobile",
    header: "Mobile",
    hideBelow: "lg",
    render: (u) => (
      <span className="text-xs text-muted-foreground">{u.mobile}</span>
    ),
  },
  {
    key: "email",
    header: "Email",
    hideBelow: "lg",
    render: (u) => (
      <span className="text-xs text-muted-foreground">{u.email}</span>
    ),
  },
  {
    key: "primaryRole",
    header: "Primary Role",
    render: (u) => <RoleBadge role={u.primaryRole} />,
  },
];

export default function UserManagementPage() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams(); // URL state

  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Derive modal states from URL
  const isAddOpen = searchParams.get("addUser") === "true";
  const editUserId = searchParams.get("editUser");
  const viewUserId = searchParams.get("viewUser");
  const deleteUserId = searchParams.get("deleteUser");

  const editUser = useMemo(
    () => users.find((u) => u.id === editUserId) || null,
    [users, editUserId],
  );
  const viewUser = useMemo(
    () => users.find((u) => u.id === viewUserId) || null,
    [users, viewUserId],
  );
  const deleteUser = useMemo(
    () => users.find((u) => u.id === deleteUserId) || null,
    [users, deleteUserId],
  );

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchSearch =
        !q ||
        u.fullName.toLowerCase().includes(q) ||
        u.empId.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.mobile.includes(q);
      const matchRole = roleFilter === "all" || u.primaryRole === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const { paginated, PaginationBar } = usePagination(filteredUsers);

  // ── URL Updaters ──────────────────────────────────
  const clearModals = () => {
    searchParams.delete("addUser");
    searchParams.delete("editUser");
    searchParams.delete("viewUser");
    searchParams.delete("deleteUser");
    setSearchParams(searchParams);
  };

  const openAdd = () => {
    searchParams.set("addUser", "true");
    setSearchParams(searchParams);
  };

  // ── Handlers ──────────────────────────────────────
  function handleSaveAdd(data: UserFormData) {
    setUsers((prev) => [...prev, { ...data, id: Date.now().toString() }]);
    clearModals();
    toast.success(USER_MESSAGES.CREATE_SUCCESS);
  }

  function handleSaveEdit(data: UserFormData) {
    if (!editUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editUser.id ? { ...data, id: editUser.id } : u,
      ),
    );
    clearModals();
    toast.success(USER_MESSAGES.UPDATE_SUCCESS);
  }

  function handleDelete() {
    if (!deleteUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
    clearModals();
    toast.deleted(USER_MESSAGES.DELETE_SUCCESS);
  }

  const rowActions: RowAction<User>[] = [
    {
      icon: <EyeIcon className="w-4 h-4" />,
      label: "View",
      onClick: (u) => {
        searchParams.set("viewUser", u.id);
        setSearchParams(searchParams);
      },
    },
    {
      icon: <PencilIcon className="w-4 h-4" />,
      label: "Edit",
      onClick: (u) => {
        searchParams.set("editUser", u.id);
        setSearchParams(searchParams);
      },
    },
    {
      icon: <Trash2Icon className="w-4 h-4" />,
      label: "Delete",
      onClick: (u) => {
        searchParams.set("deleteUser", u.id);
        setSearchParams(searchParams);
      },
      danger: true,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="User Management"
        subtitle="Manage system users, roles, and permissions"
      >
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => toast.info(USER_MESSAGES.SYNC_SUCCESS)}
        >
          <RefreshCwIcon className="w-4 h-4" /> True-in Sync
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => toast.info(USER_MESSAGES.IMPORT_SUCCESS)}
        >
          <UploadIcon className="w-4 h-4" /> Import Data
        </Button>
        <Button
          size="sm"
          className="gap-2 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          onClick={openAdd}
        >
          <PlusIcon className="w-4 h-4" /> Add User
        </Button>
      </PageHeader>

      <TableCard
        title="All Users"
        description="Search and manage all system users"
        count={filteredUsers.length}
        searchArea={
          <SearchFilterBar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search by name, ID, email..."
            filters={[
              {
                value: roleFilter,
                onChange: setRoleFilter,
                placeholder: "All Roles",
                options: [
                  { value: "all", label: "All Roles" },
                  ...PRIMARY_ROLE_OPTIONS,
                ],
              },
            ]}
          />
        }
      >
        <DataTable
          columns={USER_COLUMNS}
          data={paginated}
          actions={rowActions}
          emptyMessage="No users found. Try adjusting your search or filters."
        />
        <PaginationBar />
      </TableCard>

      {/* View Modal */}
      <UserViewModal user={viewUser} onClose={clearModals} />

      {/* Self-contained Form Modal mapping to Add or Edit */}
      <UserFormModal
        open={isAddOpen || !!editUser}
        mode={isAddOpen ? "add" : "edit"}
        initialData={editUser}
        onClose={clearModals}
        onSubmit={isAddOpen ? handleSaveAdd : handleSaveEdit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={!!deleteUser}
        onClose={clearModals}
        onConfirm={handleDelete}
        title={USER_MESSAGES.DELETE_CONFIRM_TITLE}
        message={
          deleteUser
            ? USER_MESSAGES.DELETE_CONFIRM_DESC(deleteUser.fullName)
            : ""
        }
        confirmText="Delete User"
      />
    </div>
  );
}
