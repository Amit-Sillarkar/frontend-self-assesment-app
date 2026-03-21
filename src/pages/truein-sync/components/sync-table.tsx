import { Edit } from 'lucide-react';
import { type TrueinUser } from '@/mockdata/truein-users';

interface SyncTableProps {
  users: TrueinUser[];
  selectedUsers: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectUser: (id: string, checked: boolean) => void;
  onEditUser: (user: TrueinUser) => void;
}

export default function SyncTable({ users, selectedUsers, onSelectAll, onSelectUser, onEditUser }: SyncTableProps) {
  // Check if all visible users on the current page are selected
  const isAllSelected = users.length > 0 && users.every(u => selectedUsers.includes(u.id));

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-sm text-left whitespace-nowrap">
        <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border/50">
          <tr>
            <th className="px-5 py-4 w-[50px] text-center">
              <input 
                type="checkbox" 
                className="rounded border-input w-4 h-4 cursor-pointer accent-primary"
                checked={isAllSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </th>
            {/* Responsive Table Headers */}
            <th className="px-5 py-4 hidden sm:table-cell">Emp ID</th>
            <th className="px-5 py-4">Name</th>
            <th className="px-5 py-4 hidden lg:table-cell">Mobile</th>
            <th className="px-5 py-4 hidden md:table-cell">Designation</th>
            <th className="px-5 py-4 hidden lg:table-cell">Truein Role</th>
            <th className="px-5 py-4 hidden xl:table-cell">Custom Role</th>
            <th className="px-5 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-muted/20 transition-colors">
              <td className="px-5 py-4 text-center">
                <input 
                  type="checkbox" 
                  className="rounded border-input w-4 h-4 cursor-pointer accent-primary"
                  checked={selectedUsers.includes(user.id)}
                  onChange={(e) => onSelectUser(user.id, e.target.checked)}
                />
              </td>
              {/* Responsive Table Cells */}
              <td className="px-5 py-4 font-semibold text-foreground hidden sm:table-cell">{user.id}</td>
              <td className="px-5 py-4 font-medium text-foreground">{user.name}</td>
              <td className="px-5 py-4 text-muted-foreground hidden lg:table-cell">{user.mobile}</td>
              <td className="px-5 py-4 text-foreground hidden md:table-cell">{user.designation}</td>
              <td className="px-5 py-4 hidden lg:table-cell">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-border/60 bg-background text-foreground shadow-sm">
                  {user.trueinRole}
                </span>
              </td>
              <td className="px-5 py-4 text-muted-foreground text-center sm:text-left hidden xl:table-cell">
                {user.customRole || "-"}
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-center items-center">
                  <button 
                    onClick={() => onEditUser(user)}
                    className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                    title="Edit User"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {users.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No matching users found based on your filters.
        </div>
      )}
    </div>
  );
}