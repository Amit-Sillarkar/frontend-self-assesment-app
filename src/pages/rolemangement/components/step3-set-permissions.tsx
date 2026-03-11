import { CheckIcon, ShieldCheckIcon } from "lucide-react";
import { PERMISSION_GROUPS, type PermissionKey } from "@/constants/enum";

interface Props {
  selected: PermissionKey[];
  onChange: (perms: PermissionKey[]) => void;
  error: string;
}

export default function Step3SetPermissions({
  selected,
  onChange,
  error,
}: Props) {
  function togglePermission(key: PermissionKey) {
    onChange(
      selected.includes(key)
        ? selected.filter((p) => p !== key)
        : [...selected, key],
    );
  }

  function toggleGroup(keys: PermissionKey[]) {
    const allSelected = keys.every((k) => selected.includes(k));
    if (allSelected) {
      onChange(selected.filter((p) => !keys.includes(p)));
    } else {
      onChange(Array.from(new Set([...selected, ...keys])));
    }
  }

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-300 min-h-0">
      {/* Fixed Header */}
      <div className="shrink-0 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <ShieldCheckIcon className="w-4 h-4 text-primary" /> Assign
            Permissions
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Select the access rights to grant to this custom role.
          </p>
          {error && (
            <p className="text-xs text-destructive mt-1 font-medium">{error}</p>
          )}
        </div>
        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full uppercase tracking-wider">
          {selected.length} Selected
        </span>
      </div>

      {/* Internal Scrollable Permissions List */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 space-y-3 pb-2">
        {Object.entries(PERMISSION_GROUPS).map(([groupKey, group]) => {
          const groupPermKeys = group.permissions.map(
            (p) => p.key as PermissionKey,
          );
          const allGroupSelected = groupPermKeys.every((k) =>
            selected.includes(k),
          );
          const someGroupSelected = groupPermKeys.some((k) =>
            selected.includes(k),
          );

          return (
            <div
              key={groupKey}
              className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm shrink-0"
            >
              {/* Group Header (Select All) */}
              <button
                onClick={() => toggleGroup(groupPermKeys)}
                className={`w-full flex items-center justify-between px-4 py-3 transition-colors text-left border-b ${someGroupSelected ? "bg-primary/5 border-primary/20" : "bg-muted/30 hover:bg-muted/60 border-border/40"}`}
              >
                <div>
                  <p
                    className={`text-sm font-bold ${someGroupSelected ? "text-primary" : "text-foreground"}`}
                  >
                    {group.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {group.description}
                  </p>
                </div>

                <div
                  className={`w-4 h-4 rounded-sm flex items-center justify-center flex-shrink-0 border-2 transition-all ${allGroupSelected ? "bg-primary border-primary shadow-sm" : someGroupSelected ? "bg-primary/20 border-primary shadow-sm" : "border-border/80 bg-background"}`}
                >
                  {allGroupSelected && (
                    <CheckIcon className="w-3 h-3 text-primary-foreground" />
                  )}
                  {someGroupSelected && !allGroupSelected && (
                    <div className="w-2 h-0.5 bg-primary rounded-full" />
                  )}
                </div>
              </button>

              {/* Individual Permissions Grid */}
              <div className="p-3 bg-background">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {group.permissions.map((perm) => {
                    const key = perm.key as PermissionKey;
                    const isChecked = selected.includes(key);

                    return (
                      <div
                        key={key}
                        onClick={() => togglePermission(key)}
                        className={`relative flex items-center p-2.5 rounded-lg border-2 cursor-pointer transition-all duration-200 select-none ${isChecked ? "border-primary/60 bg-primary/5 shadow-sm" : "border-border/40 bg-card hover:border-primary/30 hover:bg-muted/30"}`}
                      >
                        <div className="flex-1 flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${isChecked ? "bg-primary text-primary-foreground" : "bg-muted border border-border"}`}
                          >
                            {isChecked && <CheckIcon className="w-3 h-3" />}
                          </div>
                          <span
                            className={`text-xs font-semibold ${isChecked ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {perm.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
