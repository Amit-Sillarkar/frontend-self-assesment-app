// ─────────────────────────────────────────────
// FILE: src/components/table-pagination.tsx
//
// Reusable pagination bar used at the bottom of
// every DataTable. Shows "per page" selector
// (10 / 25 / 50) and page navigation.
//
// NOTE: Currently uses client-side slicing.
// When API is ready, just change `onChange` to
// fire an API call instead of local state update.
//
// USAGE:
//   const { page, pageSize, paginated, PaginationBar } = usePagination(data);
//   // Use `paginated` as the data array for <DataTable>
//   // Render <PaginationBar /> inside <TableCard> footer slot
// ─────────────────────────────────────────────

import { useState, useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

// ── Hook ──────────────────────────────────────

export function usePagination<T>(data: T[]) {
  const [page, setPage]         = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(10);

  // Reset to page 1 whenever data length changes (filter applied)
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const safePage   = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, safePage, pageSize]);

  function handlePageSizeChange(val: string) {
    setPageSize(Number(val) as PageSize);
    setPage(1);
  }

  function PaginationBar() {
    const start = data.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
    const end   = Math.min(safePage * pageSize, data.length);

    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-t border-border bg-muted/20">
        {/* Left: count + per-page selector */}
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            {data.length === 0
              ? "No records"
              : `Showing ${start}–${end} of ${data.length}`}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Per page:</span>
            <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="h-7 w-16 text-xs px-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((s) => (
                  <SelectItem key={s} value={String(s)} className="text-xs">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right: page navigation */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={safePage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeftIcon className="w-3.5 h-3.5" />
            </Button>

            {/* Page number pills */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
              .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "..." ? (
                  <span key={`dot-${idx}`} className="text-xs text-muted-foreground px-1">
                    …
                  </span>
                ) : (
                  <Button
                    key={item}
                    variant={item === safePage ? "default" : "outline"}
                    size="sm"
                    className="h-7 w-7 p-0 text-xs"
                    onClick={() => setPage(item as number)}
                  >
                    {item}
                  </Button>
                )
              )}

            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  return { page: safePage, pageSize, paginated, totalPages, PaginationBar };
}