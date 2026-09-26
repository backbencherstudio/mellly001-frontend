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
  loading?: boolean;
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
  loading,
}: DataTableProps<TData, TValue>) {
  const totalPages = Math.ceil(total / pageSize);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);

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

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // Don't drag if interacting with buttons, links, dropdowns, inputs
    if (target.closest("button, a, input, select, textarea, [role='menuitem']")) {
      return;
    }

    if (!tableContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - tableContainerRef.current.offsetLeft);
    setScrollLeft(tableContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !tableContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - tableContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    tableContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Horizontal wheel scroll support
  React.useEffect(() => {
    const el = tableContainerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth > el.clientWidth && Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        if (e.shiftKey) return; // Shift + wheel natively scrolls horizontally
        const canScrollLeft = el.scrollLeft > 0 && e.deltaY < 0;
        const canScrollRight =
          el.scrollLeft < el.scrollWidth - el.clientWidth && e.deltaY > 0;

        if (canScrollLeft || canScrollRight) {
          el.scrollLeft += e.deltaY;
        }
      }
    };

    el.addEventListener("wheel", onWheel, { passive: true });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div className="w-full">
      <div
        ref={tableContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`overflow-x-auto rounded-xl border bg-white [&>[data-slot=table-container]]:overflow-visible ${
          isDragging ? "cursor-grabbing select-none" : ""
        }`}
      >
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
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={finalColumns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={finalColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
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
