"use client";

import * as React from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Mail, Phone, MapPin, MoreVertical, Search } from "lucide-react";

import { DataTable } from "@/components/reusable/Table";
import { formatDate } from "@/lib/DateFormate";
import { useGetHomeownersQuery } from "@/redux/features/dashboardOverView/dashboardOverView";

type Employee = {
  id: string;
  name: string;
  email: string;
  phone_number: string | null;
  avatar: string | null;
  location: string | null;
  bookings: number;
  total_spent: number;
  joined_at: string;
  status: "active" | "inactive";
};




const columns: ColumnDef<Employee>[] = [
  {
    header: "Homeowner",
    cell: ({ row }) => {
      const user = row.original;

      const initials = user.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();

      return (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#E0E7FF] flex items-center justify-center font-semibold text-indigo-700">
            {initials}
          </div>

          <div>
            <p className="font-normal text-base">{user.name}</p>

            <p className="text-sm text-[#6A7282]">
              Joined {formatDate(user.joined_at)}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    header: "Contact",
    cell: ({ row }) => (
      <div className="space-y-1">
        <p className="flex gap-2 text-sm text-[#101828]"><Mail className="text-[#6A7282] mt-1" size={12} />{row.original.email}</p>
        <p className="flex gap-2 text-[#6A7282]"><Phone size={12} className="text-[#6A7282] mt-1" />{row.original.phone_number}</p>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    size: 250,
    minSize: 200,
    maxSize: 300,
    cell: ({ row }) => (
      <div className="w-[300px] line-clamp-3 whitespace-normal break-words">
        {row.original.location || "N/A"}
      </div>
    ),
  },
  { accessorKey: "bookings", header: "Bookings" },
  {
    header: "Total Spent",
    cell: ({ row }) => `$${row.original.total_spent}`,
  },
  {
    header: "Status",
    cell: ({ row }) => (
      <span className={`px-3 py-1 rounded-full text-xs
        ${row.original.status === "active"
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-600"}`}>
        {row.original.status}
      </span>
    ),
  },
];

export default function EmployeesTable() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState("");

  const { data, isLoading } = useGetHomeownersQuery({
    search,

    page,
    perPage: pageSize,
  });

  const homeowners = data?.data?.data || [];
  const filteredEmployees = React.useMemo(() => {
    let data = Array.isArray(homeowners) ? homeowners : [];

    if (search) {
      const lower = search.toLowerCase();
      data = data.filter((emp) =>
        emp.name.toLowerCase().includes(lower)
      );
    }

    if (sort === "name-asc") {
      data = [...data].sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sort === "name-desc") {
      data = [...data].sort((a, b) => b.name.localeCompare(a.name));
    }

    return data;
  }, [search, sort, homeowners]);



  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return (filteredEmployees || []).slice(start, start + pageSize);
  }, [page, pageSize, filteredEmployees]);


  return (
    <div className="space-y-6">
      <div className="relative flex w-full items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search employee"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full rounded-lg border px-10 py-2 focus:outline-none"
          />

        </div>

        {/* Sort */}
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


      <DataTable
        columns={columns}
        data={paginatedData}
        page={page}
        pageSize={pageSize}
        total={filteredEmployees.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPage(1);
          setPageSize(size);
        }}
      // renderAction={() => (
      //   <Link href="#">
      //     <MoreVertical className="cursor-pointer text-gray-400" />
      //   </Link>
      // )}
      // loading={isLoading}
      />
    </div>
  );
}


