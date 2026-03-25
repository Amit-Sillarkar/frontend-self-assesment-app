import { useState, useMemo } from "react";
import { SearchIcon, UsersIcon, CheckCircle2Icon, UserCircleIcon, Loader2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGetUsersQuery } from "@/store/api/userApi";

interface Props {
  selected: string[];
  onChange: (ids: string[]) => void;
  error: string;
}

export default function Step2SelectEmployees({ selected, onChange, error }: Props) {
  const [search, setSearch] = useState("");
  
  const { data, isLoading } = useGetUsersQuery({ 
      roleNames: "SUPERVISOR", 
  });

    const users = useMemo(() => {
        if (!data) return [];
        const res = data as any;

        if (Array.isArray(res?.data?.data)) return res.data.data;
        if (Array.isArray(res?.data)) return res.data;
        return Array.isArray(res) ? res : [];
    }, [data]);

  const filtered = useMemo(() => {
    return users.filter((u: any) => 
        u.fullName?.toLowerCase().includes(search.toLowerCase()) || 
        u.employeeId?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, users]);

  const toggle = (id: string) => {
    if (selected.includes(id)) onChange(selected.filter((x) => x !== id));
    else onChange([...selected, id]);
  };

  const toggleAll = () => {
    if (selected.length === filtered.length && filtered.length > 0) onChange([]);
    else onChange(filtered.map((f: any) => f.id));
  };

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-300 min-h-0">
      <div className="shrink-0 space-y-3">
        <div className="flex items-center justify-between">
            <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <UsersIcon className="w-4 h-4 text-primary" /> Select Supervisors
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Choose which supervisors will be assigned this role.</p>
                {error && <p className="text-xs text-destructive mt-1 font-medium">{error}</p>}
            </div>
            <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full uppercase tracking-wider">
                {selected.length} Selected
            </span>
        </div>
        
        <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Search by name or ID..." 
                className="pl-9 h-9 text-xs focus-visible:ring-primary/50" 
            />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar border border-border/60 rounded-xl bg-card shadow-sm divide-y divide-border/40">
        <button onClick={toggleAll} className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/60 transition-colors text-left">
            <span className="text-xs font-bold text-foreground">Select All Filtered</span>
            <div className={`w-4 h-4 rounded-full flex items-center justify-center border-2 transition-colors ${selected.length === filtered.length && filtered.length > 0 ? "bg-primary border-primary" : "border-border"}`}>
                {selected.length === filtered.length && filtered.length > 0 && <CheckCircle2Icon className="w-3 h-3 text-primary-foreground" />}
            </div>
        </button>

        {isLoading ? (
            <div className="flex items-center justify-center py-10 text-xs text-muted-foreground gap-2">
                <Loader2Icon className="w-4 h-4 animate-spin text-primary" /> Loading supervisors...
            </div>
        ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">No matching supervisors found.</div>
        ) : (
            filtered.map((emp: any) => {
                const isChecked = selected.includes(emp.id);
                return (
                    <button
                        key={emp.id}
                        onClick={() => toggle(emp.id)}
                        className={`w-full flex items-center justify-between p-3 transition-colors text-left ${isChecked ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/40"}`}
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center">
                                <UserCircleIcon className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                                <p className={`text-xs font-semibold ${isChecked ? "text-foreground" : "text-muted-foreground"}`}>{emp.fullName}</p>
                                <p className="text-[10px] text-muted-foreground font-mono">{emp.employeeId || "N/A"}</p>
                            </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center border-2 transition-colors ${isChecked ? "bg-primary border-primary shadow-sm" : "border-border"}`}>
                            {isChecked && <CheckCircle2Icon className="w-3 h-3 text-primary-foreground" />}
                        </div>
                    </button>
                );
            })
        )}
      </div>
    </div>
  );
}