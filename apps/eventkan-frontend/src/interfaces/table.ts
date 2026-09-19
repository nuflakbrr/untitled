import type { Column } from '@tanstack/react-table';

export interface SortableTableHeaderProps<TData> {
  column: Column<TData, unknown>;
  label: string;
}

export interface CellActionProps<TData> {
  data: TData;
}
