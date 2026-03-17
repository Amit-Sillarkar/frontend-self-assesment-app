// ─────────────────────────────────────────────
// FILE: src/components/data-table.tsx
//
// REUSABLE DataTable — works for ANY page.
// Pass `columns`, `data`, and optional `actions`.
//
// HOW TO USE:
//   import DataTable from "@/components/data-table";
//   import type { ColumnDef, RowAction } from "@/types/table";
//
//   const columns: ColumnDef<User>[] = [
//     { key: "empId",    header: "Emp ID", width: "w-28" },
//     { key: "fullName", header: "Name",   render: (u) => <span>{u.fullName}</span> },
//   ];
//
//   const actions: RowAction<User>[] = [
//     { icon: <EyeIcon />, label: "View", onClick: (u) => openView(u) },
//   ];
//
//   <DataTable columns={columns} data={filteredUsers} actions={actions} />
//
// Mobile: renders stacked cards automatically using columns[0] as title
// Desktop: renders a proper <table> with STICKY HEADER and Scrollable Body
// ─────────────────────────────────────────────

import { Users } from "lucide-react";
import type { DataTableProps } from "@/types/table";

const HIDE_CLASSES = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
};

const ALIGN_HEADER = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const ALIGN_CELL = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  actions = [],
  emptyMessage = "No records found.",
  className = "",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div
        className={`py-16 flex flex-col items-center gap-3 text-muted-foreground ${className}`}
      >
        <Users className="w-10 h-10 opacity-25" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      {/* ── DESKTOP TABLE (Sticky Header, Scrollable Body) ── */}
      {/* FIX APPLIED HERE: 
          Changed max-h-[60vh] to max-h-[calc(100vh-330px)] 
          This dynamically calculates the exact height needed to kill the outer scrollbar!
      */}
      <div
        className={`hidden md:block w-full overflow-auto max-h-[calc(100vh-330px)] custom-scrollbar border border-border/50 rounded-lg bg-card shadow-sm ${className}`}
      >
        <table className="w-full text-sm relative text-left">
          {/* Sticky Header */}
          <thead className="bg-muted/95 backdrop-blur-md text-muted-foreground sticky top-0 z-10 shadow-sm">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={[
                    "px-4 py-3.5 text-xs font-semibold uppercase tracking-wider border-b border-border/60",
                    ALIGN_HEADER[col.align ?? "left"],
                    col.hideBelow ? HIDE_CLASSES[col.hideBelow] : "",
                    col.width ?? "",
                  ].join(" ")}
                >
                  {col.header}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-right border-b border-border/60">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Scrollable Body */}
          <tbody className="divide-y divide-border/50">
            {data.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-muted/30 transition-colors group"
              >
                {columns.map((col) => {
                  const raw = (row as Record<string, unknown>)[col.key];
                  return (
                    <td
                      key={col.key}
                      className={[
                        "px-4 py-3.5 text-foreground",
                        ALIGN_CELL[col.align ?? "left"],
                        col.hideBelow ? HIDE_CLASSES[col.hideBelow] : "",
                      ].join(" ")}
                    >
                      {col.render ? col.render(row) : String(raw ?? "")}
                    </td>
                  );
                })}

                {actions.length > 0 && (
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      {actions
                        .filter((a) => !a.hidden?.(row))
                        .map((action) => (
                          <button
                            key={action.label}
                            title={action.label}
                            onClick={() => action.onClick(row)}
                            className={[
                              "w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200",
                              action.danger
                                ? "text-muted-foreground hover:bg-destructive hover:text-destructive-foreground hover:shadow-sm"
                                : "text-muted-foreground hover:bg-primary/10 hover:text-primary hover:shadow-sm",
                            ].join(" ")}
                          >
                            {action.icon}
                          </button>
                        ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── MOBILE CARDS ──────────────────────── */}
      <div className="md:hidden space-y-4">
        {data.map((row) => {
          // titleCol is usually the primary identifier (e.g., Name or ID)
          const [titleCol, ...detailCols] = columns;
          
          return (
            <div
              key={row.id}
              className="bg-card border border-border rounded-xl overflow-hidden shadow-sm transition-all active:scale-[0.98]"
            >
              {/* Card Header: Uses Primary Color for the icon and font-sans from @theme */}
              <div className="px-4 py-3 bg-muted/20 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-sm text-foreground tracking-tight">
                    {titleCol.render
                      ? titleCol.render(row)
                      : String((row as Record<string, unknown>)[titleCol.key] ?? "")}
                  </div>
                </div>
              </div>

              {/* Card Body: 2-Column Grid for Details */}
              <div className="px-4 py-4 grid grid-cols-2 gap-y-4 gap-x-3">
                {detailCols.map((col) => {
                  const raw = (row as Record<string, unknown>)[col.key];
                  return (
                    <div key={col.key} className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                        {col.header}
                      </span>
                      <div className="text-xs font-medium text-foreground">
                        {col.render ? col.render(row) : String(raw ?? "-")}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Card Footer: Standardized Action Buttons */}
              {actions.length > 0 && (
                <div className="px-3 py-3 bg-muted/5 border-t border-border flex items-center gap-2">
                  {actions
                    .filter((a) => !a.hidden?.(row))
                    .map((action) => (
                      <button
                        key={action.label}
                        onClick={() => action.onClick(row)}
                        className={[
                          "flex-1 flex items-center justify-center gap-2 h-9 rounded-md text-xs font-semibold transition-all border",
                          action.danger
                            ? "bg-destructive/5 border-destructive/20 text-destructive hover:bg-destructive hover:text-white"
                            : "bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground",
                        ].join(" ")}
                      >
                        <span className="w-3.5 h-3.5">{action.icon}</span>
                        {action.label}
                      </button>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
