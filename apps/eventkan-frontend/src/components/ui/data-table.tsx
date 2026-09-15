'use client';

import { cn } from "@/lib/utils";
import { Trash, CheckCircle2 } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import {
  flexRender,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  getCoreRowModel,
  type SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type RowSelectionState,
  type ColumnFiltersState,
} from "@tanstack/react-table";

import { Input } from "./input";
import { Button } from "./button";
import { Checkbox } from "./checkbox";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string | string[] | null;
  onPageChange?: (page: number) => void;
  onSearchChange?: (value: string) => void;
  onBulkDelete?: (rows: TData[]) => void;
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  searchValue?: string;
  pageCount?: number;
  placeholderSearch?: string;
  isFetching?: boolean;
  onLimitChange?: (limit: number) => void;
  customFilters?: React.ReactNode;
  includeDeleted?: boolean;
  onIncludeDeletedChange?: (value: boolean) => void;
  enableRowSelection?: boolean;
  isRowSelectable?: (row: TData) => boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  onPageChange,
  onSearchChange,
  onBulkDelete,
  rowSelection: externalRowSelection,
  onRowSelectionChange,
  searchValue: externalSearchValue,
  pageCount,
  placeholderSearch,
  isFetching,
  onLimitChange,
  customFilters,
  includeDeleted,
  onIncludeDeletedChange,
  enableRowSelection = true,
  isRowSelectable,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [internalRowSelection, setInternalRowSelection] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [internalSearchValue, setInternalSearchValue] = useState("");

  const rowSelection = externalRowSelection ?? internalRowSelection;
  const onRowSelectionChangeHandler = onRowSelectionChange ?? setInternalRowSelection;


  const searchValue = externalSearchValue ?? internalSearchValue;

  const filteredData = useMemo(() => {
    // If onSearchChange is provided, we assume server-side filtering is intended
    // or handled externally, so we return data as is.
    if (onSearchChange) return data;
    if (!searchValue) return data;

    const lowered = searchValue.toLowerCase();

    return data.filter((item: TData) => {
      if (Array.isArray(searchKey)) {
        return searchKey.some((key) => {
          const value = key.split('.').reduce((acc: unknown, part) => {
            if (acc && typeof acc === 'object') {
              return (acc as Record<string, unknown>)[part];
            }
            return undefined;
          }, item as unknown);
          return typeof value === 'string' || typeof value === 'number'
            ? value.toString().toLowerCase().includes(lowered)
            : false;
        });
      } else if (typeof searchKey === 'string') {
        const value = searchKey.split('.').reduce((acc: unknown, part) => {
          if (acc && typeof acc === 'object') {
            return (acc as Record<string, unknown>)[part];
          }
          return undefined;
        }, item as unknown);
        return typeof value === 'string' || typeof value === 'number'
          ? value.toString().toLowerCase().includes(lowered)
          : false;
      }
      return true;
    });
  }, [data, searchKey, searchValue]);

  const tableColumns = useMemo<ColumnDef<TData, TValue>[]>(() => {
    if (!enableRowSelection || columns.some((column) => column.id === 'select')) return columns;

    return [
      {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Pilih semua baris"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={isRowSelectable ? !isRowSelectable(row.original) : false}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Pilih baris ${row.index + 1}`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      },
      ...columns,
    ];
  }, [columns, enableRowSelection]);

  const table = useReactTable({
    data: filteredData,
    columns: tableColumns,
    pageCount: pageCount ?? -1,
    manualPagination: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: onRowSelectionChangeHandler,
    enableRowSelection: isRowSelectable ? (row) => isRowSelectable(row.original) : enableRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  });


  useEffect(() => {
    if (pageIndex < (pageCount ?? Infinity)) {
      onPageChange?.(pageIndex + 1);
    }
  }, [pageIndex, onPageChange, pageCount]);

  useEffect(() => {
    onRowSelectionChangeHandler({});
  }, [includeDeleted]);

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  return (
    <div>
      {/* 🔍 Search input, custom filters & Bulk Actions */}
      <div className="flex items-center justify-between py-4 gap-2">
        <div className="flex items-center gap-2">
          {onBulkDelete && selectedRows.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onBulkDelete(selectedRows.map((row) => row.original))}
              className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2"
            >
              <Trash className="h-4 w-4" />
              Hapus Terpilih ({selectedRows.length})
            </Button>
          )}
          {customFilters}
          {onIncludeDeletedChange && (
            <div className="flex items-center gap-1 rounded-md border bg-background p-1 shadow-sm">
              <Button
                type="button"
                variant={!includeDeleted ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => onIncludeDeletedChange(false)}
              >
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                Data aktif
              </Button>
              <Button
                type="button"
                variant={includeDeleted ? 'destructive' : 'ghost'}
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => onIncludeDeletedChange(true)}
              >
                <Trash className="mr-1.5 h-3.5 w-3.5" /> Recycle bin
              </Button>
            </div>
          )}
        </div>
        <Input
          placeholder={placeholderSearch ? placeholderSearch : "Cari..."}
          value={searchValue}
          onChange={(event) => {
            const value = event.target.value;
            if (onSearchChange) {
              onSearchChange(value);
            } else {
              setInternalSearchValue(value);
            }
            setPageIndex(0); // Reset to first page on search
          }}
          className="max-w-sm dark:bg-sidebar"
        />
      </div>

      {/* 🧱 Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  Memuat Data...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  Oops! Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 🔄 Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center justify-between space-x-6 py-4">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Tampilkan</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                const newSize = Number(value);
                setPageSize(newSize);
                setPageIndex(0);
                onLimitChange?.(newSize);
              }}
            >
              <SelectTrigger className="h-8 w-17.5">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 15, 20, 25, 30].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm font-medium">baris data</p>
          </div>

          {/* <span className="text-sm text-muted-foreground">
            {selectedRows.length} baris terpilih
          </span> */}
        </div>

        <div className="flex items-center justify-end space-x-6 py-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
              {pageCount || 1}
            </span>

            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                suppressHydrationWarning
                onClick={() => setPageIndex((old) => Math.max(old - 1, 0))}
                disabled={pageIndex === 0 || isFetching}
                className={cn(
                  pageIndex === 0 || isFetching
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                )}
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                suppressHydrationWarning
                onClick={() => setPageIndex((old) => old + 1)}
                disabled={pageIndex + 1 >= (pageCount || 0) || isFetching}
                className={cn(
                  pageIndex + 1 >= (pageCount || 0) || isFetching
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                )}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex items-center justify-end space-x-2 py-4">
        <span className="text-sm text-muted-foreground">
          Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
          {pageCount || 1}
        </span>

        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            suppressHydrationWarning
            onClick={() => setPageIndex((old) => Math.max(old - 1, 0))}
            disabled={pageIndex === 0 || isFetching}
          >
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            suppressHydrationWarning
            onClick={() => setPageIndex((old) => old + 1)}
            disabled={pageIndex + 1 >= (pageCount || 0) || isFetching}
          >
            Selanjutnya
          </Button>
        </div>
      </div> */}
    </div>
  );
}
