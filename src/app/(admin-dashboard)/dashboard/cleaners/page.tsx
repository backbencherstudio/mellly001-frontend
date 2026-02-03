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

/* ================= TYPES ================= */
type Employee = {
  id: string;
  name: string;
  joined: string;
  email: string;
  phone: string;
  rating: number;
  reviews: number;
  jobsDone: number;
  totalJobs: number;
  earnings: number;
  status: "active" | "busy" | "inactive";
};

/* ================= DATA ================= */
const employees: Employee[] = [
  {
    id: "1",
    name: "Maria Rodriguez",
    joined: "2023-08-12",
    email: "maria.r@email.com",
    phone: "+1 234 567 9001",
    rating: 4.9,
    reviews: 110,
    jobsDone: 152,
    totalJobs: 156,
    earnings: 18720,
    status: "active",
  },
  {
    id: "2",
    name: "Jessica Thompson",
    joined: "2023-09-05",
    email: "jessica.t@email.com",
    phone: "+1 234 567 9002",
    rating: 4.8,
    reviews: 147,
    jobsDone: 123,
    totalJobs: 156,
    earnings: 16140,
    status: "busy",
  },
  {
    id: "3",
    name: "Amanda Lee",
    joined: "2023-11-20",
    email: "amanda.lee@email.com",
    phone: "+1 234 567 9003",
    rating: 4.7,
    reviews: 166,
    jobsDone: 152,
    totalJobs: 156,
    earnings: 11760,
    status: "active",
  },
  {
    id: "4",
    name: "Patricia Garcia",
    joined: "2024-01-08",
    email: "patricia.g@email.com",
    phone: "+1 234 567 9004",
    rating: 4.4,
    reviews: 56,
    jobsDone: 100,
    totalJobs: 146,
    earnings: 10440,
    status: "active",
  },
  {
    id: "5",
    name: "Rachel Kim",
    joined: "2023-10-15",
    email: "rachel.kim@email.com",
    phone: "+1 234 567 9005",
    rating: 4.9,
    reviews: 156,
    jobsDone: 152,
    totalJobs: 156,
    earnings: 17160,
    status: "inactive",
  },
];

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
              Joined {row.original.joined}
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
          <Phone size={14} /> {row.original.phone}
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
          ({row.original.reviews})
        </span>
      </div>
    ),
  },
  {
    header: "Jobs",
    cell: ({ row }) => {
      const { jobsDone, totalJobs } = row.original;
      const percent = Math.round((jobsDone / totalJobs) * 100);

      return (
        <div>
          <p className="font-medium">
            {jobsDone} / {totalJobs}
          </p>
          <p className="text-xs text-gray-500">
            {percent}% completion
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
      const status = row.original.status;
      const styles = {
        active: "bg-green-100 text-green-700",
        busy: "bg-yellow-100 text-yellow-700",
        inactive: "bg-gray-100 text-gray-600",
      };

      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
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

  /* search filter */
  const filteredData = React.useMemo(() => {
    if (!search) return employees;

    return employees.filter((e) =>
      `${e.name} ${e.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

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
          <select className="h-full w-full rounded-lg border px-3 py-2 focus:outline-none text-[12px]">
            <option value="">Sort by</option>
            <option value="name">Name</option>
            <option value="date">Date</option>
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
        renderAction={() => (
          <MoreVertical className="cursor-pointer text-gray-400" />
        )}
      />
    </div>
  );
}
