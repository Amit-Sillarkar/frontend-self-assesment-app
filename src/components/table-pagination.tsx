// ─────────────────────────────────────────────
// FILE: src/components/table-pagination.tsx
//
// Supports TWO modes:
//
// 1. CLIENT-SIDE (default) — pass only `data`:
//    const { paginated, PaginationBar } = usePagination(data);
//
// 2. SERVER-SIDE — pass `data` + server options:
//    const { PaginationBar } = usePagination(roles, {
//        serverSide: true,
//        totalRecords: pagination.total,
//        totalPages: pagination.totalPages,
//        page, pageSize,
//        onPageChange: setPage,
//        onPageSizeChange: setPageSize,
//        isLoading,
//    });
//    // In server mode, `paginated` === `data` (already sliced by API)
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

// ── Server-side options ───────────────────────
interface ServerSideOptions {
  serverSide: true;
  totalRecords: number;
  totalPages: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading?: boolean;
}

// ── Hook ──────────────────────────────────────
export function usePagination<T>(data: T[], serverOptions?: ServerSideOptions) {
  // ── Client-side state (only used when NOT server-side) ──
  const [clientPage, setClientPage] = useState(1);
  const [clientPageSize, setClientPageSize] = useState<PageSize>(10);

  const isServer = serverOptions?.serverSide === true;

  // Resolve which values to use
  const page = isServer ? serverOptions!.page : clientPage;
  const pageSize = isServer ? serverOptions!.pageSize : clientPageSize;
  const totalRecs = isServer ? serverOptions!.totalRecords : data.length;
  const totalPages = isServer
    ? serverOptions!.totalPages
    : Math.max(1, Math.ceil(data.length / clientPageSize));

  const isLoading = isServer ? (serverOptions!.isLoading ?? false) : false;

  // Client-side slice (no-op in server mode — API already sliced)
  const paginated = useMemo(() => {
    if (isServer) return data;
    const safePage = Math.min(clientPage, totalPages);
    const start = (safePage - 1) * clientPageSize;
    return data.slice(start, start + clientPageSize);
  }, [data, isServer, clientPage, clientPageSize, totalPages]);

  function handlePageSizeChange(val: string) {
    const size = Number(val) as PageSize;
    if (isServer) {
      serverOptions!.onPageSizeChange(size);
    } else {
      setClientPageSize(size);
      setClientPage(1);
    }
  }

  function handlePageChange(p: number) {
    if (isServer) {
      serverOptions!.onPageChange(p);
    } else {
      setClientPage(p);
    }
  }

  function PaginationBar() {
    const safePage = Math.min(page, totalPages);
    const start = totalRecs === 0 ? 0 : (safePage - 1) * pageSize + 1;
    const end = Math.min(safePage * pageSize, totalRecs);

    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-t border-border bg-muted/20">
        {/* Left: count + per-page selector */}
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            {totalRecs === 0
              ? "No records"
              : `Showing ${start}–${end} of ${totalRecs}`}
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
              disabled={safePage === 1 || isLoading}
              onClick={() => handlePageChange(safePage - 1)}
            >
              <ChevronLeftIcon className="w-3.5 h-3.5" />
            </Button>

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
                    disabled={isLoading}
                    onClick={() => handlePageChange(item as number)}
                  >
                    {item}
                  </Button>
                )
              )}

            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={safePage === totalPages || isLoading}
              onClick={() => handlePageChange(safePage + 1)}
            >
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  return { page, pageSize, paginated, totalPages, PaginationBar };
}