import { ChevronsUpDown } from 'lucide-react';

import type { SortableTableHeaderProps } from '@/interfaces/table';

import { Button } from '@/components/ui/button';

export default function SortableTableHeader<TData>({
  column,
  label,
}: SortableTableHeaderProps<TData>) {
  const sortDirection = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      aria-label={`Urutkan berdasarkan ${label}`}
      aria-sort={
        sortDirection === 'asc'
          ? 'ascending'
          : sortDirection === 'desc'
            ? 'descending'
            : 'none'
      }
      className="h-auto cursor-pointer p-0 text-[10px] font-extrabold uppercase tracking-[.08em] text-eventkan-muted hover:bg-transparent hover:text-eventkan-ink"
    >
      {label}
      <ChevronsUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
