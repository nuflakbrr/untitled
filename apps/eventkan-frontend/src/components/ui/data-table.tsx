'use client';

import { Trash, CheckCircle2 } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
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
} from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table';

import { Input } from './input';
import { Button } from './button';
import { Checkbox } from './checkbox';

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
  variant?: 'default' | 'eventkan';
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
  variant = 'default',
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [internalRowSelection, setInternalRowSelection] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [internalSearchValue, setInternalSearchValue] = useState('');

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
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
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
    enableRowSelection: isRowSelectable
      ? (row) => isRowSelectable(row.original)
      : enableRowSelection,
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
  const isEventkan = variant === 'eventkan';

  return (
    <div
      className={cn(
        isEventkan &&
          'mt-5 rounded-[24px] border border-eventkan-ink/15 bg-eventkan-surface p-4 shadow-[0_6px_20px_rgba(17,35,63,.045)] sm:p-5'
      )}
    >
      {/* 🔍 Search input, custom filters & Bulk Actions */}
      <div
        className={cn(
          'flex items-center justify-between gap-2 py-4',
          isEventkan && 'flex-wrap pb-4 sm:flex-nowrap'
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          {customFilters}
          {onIncludeDeletedChange && (
            <div
              className={cn(
                'flex items-center gap-1 rounded-md border bg-background p-1 shadow-sm',
                isEventkan && 'rounded-xl border-eventkan-ink/10 bg-eventkan-canvas/70 shadow-none'
              )}
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  'h-8 px-3 text-xs',
                  isEventkan && 'rounded-lg font-semibold text-eventkan-muted',
                  isEventkan &&
                    !includeDeleted &&
                    'bg-eventkan-navy text-white hover:bg-eventkan-navy-hover hover:text-white hover:[&_svg]:text-white',
                  isEventkan &&
                    includeDeleted &&
                    'hover:bg-eventkan-navy hover:text-white hover:[&_svg]:text-white'
                )}
                onClick={() => onIncludeDeletedChange(false)}
              >
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                Data aktif
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  'h-8 px-3 text-xs',
                  isEventkan &&
                    'rounded-lg font-semibold text-eventkan-muted hover:bg-eventkan-peach/50 hover:text-eventkan-peach-ink hover:[&_svg]:text-eventkan-peach-ink',
                  isEventkan &&
                    includeDeleted &&
                    'bg-eventkan-peach text-eventkan-peach-ink hover:bg-eventkan-peach/70 hover:text-eventkan-peach-ink hover:[&_svg]:text-eventkan-peach-ink'
                )}
                onClick={() => onIncludeDeletedChange(true)}
              >
                <Trash className="mr-1.5 h-3.5 w-3.5" /> Recycle bin
              </Button>
            </div>
          )}
          {onBulkDelete && selectedRows.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onBulkDelete(selectedRows.map((row) => row.original))}
              className={cn(
                'h-8 px-3 text-xs max-sm:w-full',
                isEventkan &&
                  'rounded-lg bg-eventkan-peach font-bold text-eventkan-peach-ink hover:bg-eventkan-peach hover:text-eventkan-peach-ink'
              )}
            >
              <Trash className="h-4 w-4" />
              Hapus Terpilih ({selectedRows.length})
            </Button>
          )}
        </div>
        <Input
          placeholder={placeholderSearch ? placeholderSearch : 'Cari...'}
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
          className={cn(
            'max-w-sm dark:bg-sidebar',
            isEventkan &&
              'h-10 rounded-xl border-eventkan-ink/10 bg-eventkan-surface text-eventkan-ink placeholder:text-eventkan-muted focus-visible:border-eventkan-accent focus-visible:ring-eventkan-accent/20'
          )}
        />
      </div>

      {/* 🧱 Table */}
      <div
        className={cn(
          'rounded-md border',
          isEventkan &&
            'overflow-x-auto rounded-2xl border border-eventkan-ink/10 bg-transparent shadow-none'
        )}
      >
        <Table className={isEventkan ? 'min-w-[720px]' : undefined}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={cn(
                  isEventkan &&
                    'border-eventkan-ink/10 bg-eventkan-canvas/70 hover:bg-eventkan-canvas/70'
                )}
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      isEventkan &&
                        'h-11 px-4 text-[10px] font-extrabold uppercase tracking-[.08em] text-eventkan-muted'
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                  Memuat Data...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    isEventkan &&
                      'border-eventkan-ink/10 hover:bg-eventkan-peach/25 data-[state=selected]:bg-eventkan-peach/45'
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(isEventkan && 'px-4 py-3.5 text-sm text-eventkan-ink')}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className={cn('h-24 text-center', isEventkan && 'text-eventkan-muted')}
                >
                  Oops! Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 🔄 Pagination */}
      <div
        className={cn(
          'flex items-center justify-between gap-3 py-4',
          isEventkan &&
            'flex-col items-stretch text-eventkan-muted sm:flex-row sm:items-center sm:py-5'
        )}
      >
        <div
          className={cn(
            'flex items-center gap-6',
            isEventkan && 'w-full justify-between sm:w-auto sm:justify-start'
          )}
        >
          <div className="flex items-center gap-2">
            <p className={cn('text-sm font-medium', isEventkan && 'text-xs text-eventkan-muted')}>
              Tampilkan
            </p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                const newSize = Number(value);
                setPageSize(newSize);
                setPageIndex(0);
                onLimitChange?.(newSize);
              }}
            >
              <SelectTrigger
                className={cn(
                  'h-8 w-17.5',
                  isEventkan &&
                    'rounded-xl border-eventkan-ink/10 bg-eventkan-surface text-xs text-eventkan-navy'
                )}
              >
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent
                side="top"
                className={cn(
                  isEventkan &&
                    'rounded-xl border-eventkan-ink/10 bg-eventkan-surface p-1 text-eventkan-navy shadow-[0_12px_30px_rgba(17,35,63,.12)]'
                )}
              >
                {[10, 15, 20, 25, 30].map((pageSize) => (
                  <SelectItem
                    key={pageSize}
                    value={`${pageSize}`}
                    className={cn(
                      isEventkan &&
                        'cursor-pointer rounded-lg text-xs text-eventkan-navy focus:bg-eventkan-canvas focus:text-eventkan-navy data-highlighted:bg-eventkan-canvas data-highlighted:text-eventkan-navy'
                    )}
                  >
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className={cn('text-sm font-medium', isEventkan && 'text-xs text-eventkan-muted')}>
              baris data
            </p>
          </div>

          {/* <span className="text-sm text-muted-foreground">
            {selectedRows.length} baris terpilih
          </span> */}
        </div>

        <div
          className={cn(
            'flex items-center justify-end gap-3',
            isEventkan && 'w-full justify-between sm:w-auto sm:justify-end'
          )}
        >
          <div className="flex w-full items-center justify-between gap-3 sm:w-auto">
            <span className={cn('shrink-0 text-sm text-muted-foreground', isEventkan && 'text-xs')}>
              Halaman {table.getState().pagination.pageIndex + 1} dari {pageCount || 1}
            </span>

            <div className={cn('flex items-center gap-2', isEventkan && 'max-sm:flex-1')}>
              <Button
                variant="outline"
                size="sm"
                suppressHydrationWarning
                onClick={() => setPageIndex((old) => Math.max(old - 1, 0))}
                disabled={pageIndex === 0 || isFetching}
                className={cn(
                  pageIndex === 0 || isFetching
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer',
                  isEventkan &&
                    'h-9 rounded-xl border-eventkan-ink/10 bg-eventkan-surface px-3 text-xs font-semibold text-eventkan-navy hover:bg-eventkan-canvas hover:text-eventkan-navy disabled:bg-eventkan-surface max-sm:flex-1'
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
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer',
                  isEventkan &&
                    'h-9 rounded-xl border-eventkan-ink/10 bg-eventkan-surface px-3 text-xs font-semibold text-eventkan-navy hover:bg-eventkan-canvas hover:text-eventkan-navy disabled:bg-eventkan-surface max-sm:flex-1'
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
