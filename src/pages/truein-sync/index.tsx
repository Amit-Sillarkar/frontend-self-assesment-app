import { useState, useMemo } from 'react';
import { Download, CheckCircle } from 'lucide-react';

import PageHeader from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/toast-notification";
import { ConfirmationModal } from "@/components/common/confirmation-modal";

// Shared table & layout components to match User Management
import TableCard from '@/components/table-card';
import SearchFilterBar from '@/components/search-filter-bar';
import { usePagination } from '@/components/table-pagination';

import SyncTable from './components/sync-table';
import EditTrueinUserModal from './components/edit-user-modal';
import { MOCK_TRUEIN_USERS, type TrueinUser } from '@/mockdata/truein-users';

export default function TrueinSyncPage() {
  const toast = useToast();
  const [apiKey, setApiKey] = useState('••••••');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedUsers, setFetchedUsers] = useState<TrueinUser[] | null>(null);
  
  // ─── Search & Filter State ───
  const [searchQuery, setSearchQuery] = useState("");
  const [designationFilter, setDesignationFilter] = useState("all");
  
  // ─── Selection State ───
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  // ─── Modal States ───
  const [isSyncConfirmOpen, setIsSyncConfirmOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<TrueinUser | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleFetchData = () => {
    setIsFetching(true);
    // Mimic network latency
    setTimeout(() => {
      setFetchedUsers(MOCK_TRUEIN_USERS);
      setIsFetching(false);
      toast.success("Successfully fetched users from Truein");
    }, 800);
  };

  // ─── Filtering Logic ───
  const filteredUsers = useMemo(() => {
    if (!fetchedUsers) return [];
    const q = searchQuery.toLowerCase();
    
    return fetchedUsers.filter(u => {
      const matchesSearch = !q || u.name.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
      const matchesDesignation = designationFilter === "all" || u.designation === designationFilter;
      return matchesSearch && matchesDesignation;
    });
  }, [fetchedUsers, searchQuery, designationFilter]);

  // Extract unique designations for the dropdown
  const uniqueDesignations = useMemo(() => {
    if (!fetchedUsers) return [];
    const designations = new Set(fetchedUsers.map(u => u.designation));
    return Array.from(designations).map(d => ({ value: d, label: d }));
  }, [fetchedUsers]);

  // ─── Pagination Logic ───
  const { paginated, PaginationBar } = usePagination(filteredUsers);

  // ─── Selection Logic (Current Page Only) ───
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newIds = paginated.map(u => u.id).filter(id => !selectedUsers.includes(id));
      setSelectedUsers(prev => [...prev, ...newIds]);
    } else {
      const pageIds = paginated.map(u => u.id);
      setSelectedUsers(prev => prev.filter(id => !pageIds.includes(id)));
    }
  };

  const handleSelectUser = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, id]);
    } else {
      setSelectedUsers(prev => prev.filter(userId => userId !== id));
    }
  };

  // ─── Save & Sync Actions ───
  const handleSaveEdit = (updatedUser: TrueinUser) => {
    setFetchedUsers(prev => 
      prev ? prev.map(u => u.id === updatedUser.id ? updatedUser : u) : null
    );
    toast.success("User details updated for sync.");
  };

  const executeSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSelectedUsers([]);
      toast.success(`${selectedUsers.length} users successfully synced to the system!`);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <PageHeader 
        title="Truein Sync" 
        subtitle="Synchronize your user directory with the Truein system"
      />

      {/* ─── API KEY CONFIGURATION CARD ─── */}
      <Card className="shadow-sm border-border/60">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1 w-full">
              <label className="text-sm font-semibold text-foreground">API Key</label>
              <Input 
                type="password" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)} 
                className="bg-muted/30 w-full font-mono tracking-widest"
                placeholder="Enter your Truein API Key"
              />
            </div>
            
            <Button 
              onClick={handleFetchData}
              disabled={isFetching || !apiKey}
              className="w-full sm:w-auto shadow-sm" 
            >
              <Download className="w-4 h-4 mr-2" />
              {isFetching ? "Fetching Data..." : "Fetch Data"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ─── FETCHED USERS TABLE CARD ─── */}
      {fetchedUsers && (
        <div className="mt-8 animate-in fade-in duration-500">
          <TableCard
            title="Review Fetched Users"
            description={`${selectedUsers.length} of ${fetchedUsers.length} total users selected for sync.`}
            count={filteredUsers.length}
            searchArea={
              <div className="flex flex-col xl:flex-row xl:items-center gap-3 w-full">
                <SearchFilterBar
                  search={searchQuery}
                  onSearchChange={setSearchQuery}
                  searchPlaceholder="Search by name or ID..."
                  filters={[
                    {
                      value: designationFilter,
                      onChange: setDesignationFilter,
                      placeholder: "All Designations",
                      options: [
                        { value: "all", label: "All Designations" },
                        ...uniqueDesignations
                      ]
                    }
                  ]}
                />
                <Button 
                  onClick={() => setIsSyncConfirmOpen(true)}
                  disabled={selectedUsers.length === 0 || isSyncing} 
                  className="shrink-0 transition-all shadow-sm w-full xl:w-auto"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isSyncing ? "Syncing..." : "Sync Selected"}
                </Button>
              </div>
            }
          >
            <SyncTable 
              users={paginated} // Render only current page items
              selectedUsers={selectedUsers}
              onSelectAll={handleSelectAll}
              onSelectUser={handleSelectUser}
              onEditUser={setEditingUser} 
            />
            <PaginationBar />
          </TableCard>
        </div>
      )}

      {/* ─── MODALS ─── */}
      <EditTrueinUserModal
        open={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveEdit}
      />

      <ConfirmationModal
        open={isSyncConfirmOpen}
        onClose={() => setIsSyncConfirmOpen(false)}
        onConfirm={executeSync}
        title="Confirm User Sync"
        message={`Are you sure you want to synchronize ${selectedUsers.length} selected user(s) into your core system directory?`}
        confirmText="Yes, Sync Users"
        variant="success"
      />
    </div>
  );
}