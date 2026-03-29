import { useMemo } from "react";
import { CheckIcon, ShieldCheckIcon, Loader2Icon, LayersIcon } from "lucide-react";
import { useGetAllPermissionsQuery } from "@/store/api/permissionApi";

interface Props {
  selected: number[]; 
  onChange: (perms: number[]) => void;
  error: string;
}

// Helper to format codes like "ASSESSMENT_CREATE" -> "Create"
function formatPermissionLabel(code: string, moduleName: string) {
    if (!code) return "Unknown";
    let cleanCode = code.toUpperCase();
    const cleanModule = moduleName.toUpperCase();
    
    // Strip the module prefix if it exists
    if (cleanCode.startsWith(cleanModule + "_")) {
        cleanCode = cleanCode.substring(cleanModule.length + 1);
    }
    
    // Convert remaining code to Title Case (e.g., LOG_EXPORT -> Log Export)
    return cleanCode
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

export default function Step3SetPermissions({ selected, onChange, error }: Props) {
  const { data, isLoading } = useGetAllPermissionsQuery();

  // Safely extract the grouped array from the API response
  const groupedPermissions = useMemo(() => {
      let list = [];
      if (Array.isArray(data?.data?.data)) list = data.data.data;
      else if (Array.isArray(data?.data)) list = data.data;
      else if (Array.isArray(data)) list = data;
      return list;
  }, [data]);

  function togglePermission(id: number) {
    onChange(selected.includes(id) ? selected.filter((p) => p !== id) : [...selected, id]);
  }

  function toggleGroup(ids: number[]) {
    const allSelected = ids.every((id) => selected.includes(id));
    if (allSelected) {
      // Deselect all in group
      onChange(selected.filter((p) => !ids.includes(p)));
    } else {
      // Select all in group
      onChange(Array.from(new Set([...selected, ...ids])));
    }
  }

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-300 min-h-0">
      <div className="shrink-0 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <ShieldCheckIcon className="w-4 h-4 text-primary" /> Assign Permissions
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Select the access rights to grant to this custom role.</p>
          {error && <p className="text-xs text-destructive mt-1 font-medium">{error}</p>}
        </div>
        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full uppercase tracking-wider">
          {selected.length} Selected
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 space-y-4 pb-2">
        {isLoading ? (
             <div className="flex items-center justify-center py-10 text-xs text-muted-foreground gap-2">
                <Loader2Icon className="w-4 h-4 animate-spin text-primary" /> Loading permissions...
             </div>
        ) : groupedPermissions.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">No permissions found.</div>
        ) : (
            groupedPermissions.map((group: any, index: number) => {
                const groupPermIds = group.permissions.map((p: any) => p.id);
                const allGroupSelected = groupPermIds.length > 0 && groupPermIds.every((k: number) => selected.includes(k));
                const someGroupSelected = groupPermIds.some((k: number) => selected.includes(k));

                return (
                    <div key={index} className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm shrink-0">
                        {/* Group Header */}
                        <div className="w-full flex items-center justify-between px-4 py-3 bg-muted/20 border-b border-border/40">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-primary/10 rounded-md">
                                    <LayersIcon className="w-4 h-4 text-primary" />
                                </div>
                                <p className="text-sm font-bold text-foreground">Module: {group.module}</p>
                            </div>

                            <button
                                type="button"
                                onClick={() => toggleGroup(groupPermIds)}
                                className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <span>Select All</span>
                                <div className={`w-4 h-4 rounded-sm flex items-center justify-center border-2 transition-all ${allGroupSelected ? "bg-primary border-primary" : someGroupSelected ? "bg-primary/20 border-primary" : "border-border/80 bg-background"}`}>
                                    {allGroupSelected && <CheckIcon className="w-3 h-3 text-primary-foreground" />}
                                    {someGroupSelected && !allGroupSelected && <div className="w-2 h-0.5 bg-primary rounded-full" />}
                                </div>
                            </button>
                        </div>

                        {/* Group Permissions List */}
                        <div className="divide-y divide-border/40 bg-background">
                            {group.permissions.map((perm: any) => {
                                const isChecked = selected.includes(perm.id);
                                const label = formatPermissionLabel(perm.code, group.module);

                                return (
                                    <div
                                        key={perm.id}
                                        onClick={() => togglePermission(perm.id)}
                                        className={`flex items-start justify-between p-4 cursor-pointer transition-colors duration-200 hover:bg-muted/30 ${isChecked ? "bg-primary/5" : ""}`}
                                    >
                                        <div className="flex-1 pr-6">
                                            <p className={`text-sm font-semibold mb-1 ${isChecked ? "text-foreground" : "text-muted-foreground"}`}>
                                                {label}
                                            </p>
                                            {perm.description && (
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    {perm.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className={`mt-0.5 w-5 h-5 shrink-0 rounded flex items-center justify-center border-2 transition-colors ${isChecked ? "bg-primary border-primary shadow-sm" : "bg-card border-border/80"}`}>
                                            {isChecked && <CheckIcon className="w-3.5 h-3.5 text-primary-foreground" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })
        )}
      </div>
    </div>
  );
}