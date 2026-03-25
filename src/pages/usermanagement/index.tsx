import { useState } from "react";
import {
  EyeIcon,
  PencilIcon,
  PlusIcon,
  UploadIcon,
  RefreshCwIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdateUserMutation } from "@/store/api/userApi";

import PageHeader from "@/components/page-header";
import TableCard from "@/components/table-card";
import DataTable from "@/components/data-table";
import SearchFilterBar from "@/components/search-filter-bar";
import RoleBadge, { CustomRoleBadge } from "@/components/role-badge";
import { usePagination } from "@/components/table-pagination";
import { useToast } from "@/components/toast-notification";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import UserFormModal from "./components/user-form-modal";

import type { ColumnDef, RowAction } from "@/types/table";
import type { User } from "./types";
import { PRIMARY_ROLE_OPTIONS, PRIMARY_ROLES } from "@/constants/enum";
import { USER_MESSAGES } from "@/constants/messages";
import { useUserHandlers } from "./useUserHandlers";
import UserViewModal from "./components/viewUser/user-view-modal";
import TableSkeleton from "@/components/table-skeleton";

const StatusCell = ({ user }: { user: User }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const handleConfirm = async () => {
    try {
      await updateUser({
        userId: user.id, 
        body: {
          isActive: !user.isActive,
          customRoleId: null
        }
      }).unwrap();
      setIsModalOpen(false);
    } catch {
      console.error(USER_MESSAGES.USER_ACTIVATION_FAILED);
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isLoading}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${user.isActive ? "bg-primary" : "bg-gray-300"
          }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-background transition-transform ${user.isActive ? "translate-x-5" : "translate-x-1"
            }`}
        />
      </button>
      <ConfirmationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title={user.isActive ? "Deactivate User" : "Activate User"}
        message={`Are you sure you want to ${user.isActive ? "deactivate" : "activate"} ${user.fullName}?`}
        confirmText={isLoading ? "Updating..." : "Yes, confirm"}
        variant={user.isActive ? "danger" : "default"}
      />
    </div>
  );
};

// ─── Column Definitions (outside component — never recreated) ─────────────────
const USER_COLUMNS: ColumnDef<User>[] = [
  {
    key: "employeeId",
    header: "Emp ID",
    width: "w-28",
    render: (u) => (
      <span className="text-xs font-bold text-foreground">{u.employeeId}</span>
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
    render: (u) => <span className="text-xs text-muted-foreground">{u.mobile}</span>,
  },
  {
    key: "email",
    header: "Email",
    hideBelow: "lg",
    render: (u) => <span className="text-xs text-muted-foreground">{u.email}</span>,
  },
  {
    key: "roleDefinition",
    header: "Primary Role",
    render: (u) => <RoleBadge role={u.roleDefinition?.name ?? PRIMARY_ROLES.USER}  />,
  },
  {
    key: "customRole",
    header: "Custom Role",
    render: (u) =>
      u.customRole ? (
        <CustomRoleBadge role={u.customRole.name} />
      ) : (
        <span className="text-xs text-muted-foreground">-</span>
      ),
  },
  {
    key: "isActive",
    header: "Status",
    render: (u) => <StatusCell user={u} />,
  },
];

export default function UserManagementPage() {
  const toast = useToast();
  const {
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    isLoading, isError,
    filteredUsers,
    editUser,
    viewUser,
    isAddOpen,
    openAdd,
    openEdit,
    openView,
    clearModals,
    handleSubmit,
    viewUserId,
  } = useUserHandlers();

  const { paginated, PaginationBar } = usePagination(filteredUsers);

  const rowActions: RowAction<User>[] = [
    {
      icon: <EyeIcon className="w-4 h-4" />,
      label: "View",
      onClick: openView,
    },
    {
      icon: <PencilIcon className="w-4 h-4" />,
      label: "Edit",
      onClick: openEdit,
    },
  ];

  if (isError) return <div className="p-6 text-destructive">{USER_MESSAGES.USER_FETCH_FAILED}</div>;

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

        {isLoading ? (
          <TableSkeleton rowCount={6} />
        ) : (
          <>
            <DataTable
              columns={USER_COLUMNS}
              data={paginated}
              actions={rowActions}
            />
            <PaginationBar />
          </>
        )}
      </TableCard>

      {viewUser && (
        <UserViewModal
          userId={viewUserId}
          onClose={clearModals}
        />
      )}

      <UserFormModal
        open={isAddOpen || !!editUser}
        mode={isAddOpen ? "add" : "edit"}
        initialData={editUser}
        onClose={clearModals}
        onSubmit={handleSubmit}
      />
    </div>
  );
}