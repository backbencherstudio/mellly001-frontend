"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";

import {
  Mail,
  Phone,
  Search,
  MoreVertical,
  Star,
} from "lucide-react";
import { DataTable } from "@/components/reusable/Table";
import { useGetCleanersQuery } from "@/redux/features/dashboardOverView/dashboardOverView";

/* ================= TYPES ================= */
type Employee = {
  id: string;
  name: string;
  email: string;
  phone_number: string | null;
  avatar: string | null;
  earnings: number;
  rating: number;
  total_reviews: number;
  joined_at: string;
  status: "active" | "busy" | "inactive";
  jobs: {
    completed: number;
    completion_rate: number;
    total: number;
  };
};

/* ================= COLUMNS ================= */
const columns: ColumnDef<Employee>[] = [
  {
    header: "Cleaner",
    cell: ({ row }) => {
      const name = row.original.name;
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("");

      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-semibold">
            {initials}
          </div>
          <div>
            <p className="font-medium leading-none">{name}</p>
            <p className="text-xs text-gray-500 mt-1">
              Joined {new Date(row.original.joined_at).toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    header: "Contact",
    cell: ({ row }) => (
      <div className="space-y-1 text-sm text-gray-600">
        <p className="flex items-center text-[#101828] text-sm font-normal leading-140%  gap-2">
          <Mail size={14} /> {row.original.email}
        </p>
        <p className="flex items-center gap-2">
          <Phone size={14} /> {row.original.phone_number || "N/A"}
        </p>
      </div>
    ),
  },
  {
    header: "Rating",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="font-medium">{row.original.rating}</span>
        <span className="text-gray-500">
          ({row.original.total_reviews})
        </span>
      </div>
    ),
  },
  {
    header: "Jobs",
    cell: ({ row }) => {
      const { completed, total, completion_rate } = row.original.jobs;

      return (
        <div>
          <p className="font-medium">
            {completed} / {total}
          </p>
          <p className="text-xs text-gray-500">
            {completion_rate}% completion
          </p>
        </div>
      );
    },
  },
  {
    header: "Earnings",
    cell: ({ row }) => (
      <span className="font-medium">${row.original.earnings}</span>
    ),
  },
  {
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as keyof typeof styles;
      const styles = {
        active: "bg-green-100 text-green-700",
        busy: "bg-yellow-100 text-yellow-700",
        inactive: "bg-gray-100 text-gray-600",
      };

      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.inactive}`}
        >
          {status}
        </span>
      );
    },
  },
];

/* ================= COMPONENT ================= */
export default function EmployeesTable() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(8);
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState("");

  const { data, isLoading } = useGetCleanersQuery({})
  const cleaners = data?.data?.data || [];

  /* search filter */
  const filteredData = React.useMemo(() => {
    let result = Array.isArray(cleaners) ? cleaners : [];

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter((e) =>
        `${e.name} ${e.email}`
          .toLowerCase()
          .includes(lower)
      );
    }

    if (sort === "name-asc") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sort === "name-desc") {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [search, cleaners, sort]);

  /* pagination */
  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full ">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-xl border px-11 py-2.5 text-sm"
          />
        </div>

        <div className="w-40">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-full w-full rounded-lg border px-3 py-2 focus:outline-none text-[12px]"
          >
            <option value="">Sort by</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginatedData}
        page={page}
        pageSize={pageSize}
        total={filteredData.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPage(1);
          setPageSize(size);
        }}
        loading={isLoading}
        renderAction={() => (
          <MoreVertical className="cursor-pointer text-gray-400" />
        )}
      />
    </div>
  );
}
