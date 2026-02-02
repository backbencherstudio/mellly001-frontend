/** @format */
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function Pagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const [open, setOpen] = useState(false);

  const pageSizes = [10, 20, 50, "all"] as const;

  const getPages = () => {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 3) return [1, 2, 3, "...", totalPages];
    if (page >= totalPages - 2)
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const pages = getPages();
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex w-full items-center justify-between text-sm text-gray-600">
      {/* Left */}
      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className={`h-8 w-8 rounded-md border flex items-center justify-center
            ${page === 1 ? "opacity-40" : "hover:bg-gray-50"}`}
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={i} className="px-2 text-gray-400">
              …
            </span>
          ) : (
            <button
              key={i}
              onClick={() => onPageChange(Number(p))}
              disabled={page === p}
              className={`h-8 min-w-[32px] rounded-md px-2 font-medium
                ${
                  page === p
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-100"
                }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className={`h-8 w-8 rounded-md border flex items-center justify-center
            ${page === totalPages ? "opacity-40" : "hover:bg-gray-50"}`}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <span>
          Showing {start} to {end} of {total} entries
        </span>

        {/* Page size dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 rounded-md border px-3 py-1.5 hover:bg-gray-50"
          >
            Show {pageSize === total ? "All" : pageSize}
            <ChevronRight
              className={`rotate-90 transition ${
                open ? "rotate-[270deg]" : ""
              }`}
              size={14}
            />
          </button>

          {open && (
            <div className="absolute right-0 z-10 mt-1 w-28 rounded-md border bg-white shadow-md">
              {pageSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    onPageSizeChange(size === "all" ? total : size);
                    setOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                >
                  {size === "all" ? "All" : size}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
