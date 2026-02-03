/** @format */
"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "./pagination";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  renderAction?: (row: TData) => React.ReactNode;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  page = 1,
  pageSize = 10,
  total = data.length,
  onPageChange,
  onPageSizeChange,
  renderAction,
}: DataTableProps<TData, TValue>) {
  const totalPages = Math.ceil(total / pageSize);

  const finalColumns = React.useMemo(() => {
    if (!renderAction) return columns;
    return [
      ...columns,
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }: any) => renderAction(row.original),
      } as ColumnDef<TData, TValue>,
    ];
  }, [columns, renderAction]);

  const table = useReactTable({
    data,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-xl border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className="px-6 py-4 bg-[#F9FAFB] text-[#6A7282] font-normal text-[12px]">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-6 py-4">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {onPageChange && (
        <div className="pt-5">
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            totalPages={totalPages}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange!}
          />
        </div>
      )}
    </div>
  );
}
