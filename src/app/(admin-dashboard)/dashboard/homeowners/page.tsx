"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Mail, Phone, MapPin, MoreVertical, Search } from "lucide-react";
import { DataTable } from "@/components/reusable/Table";

type Employee = {
  id: string;
  name: string;
  joined: string;
  email: string;
  phone: string;
  location: string;
  bookings: number;
  totalSpent: number;
  status: "active" | "inactive";
};

const employees: Employee[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    joined: "2024-01-15",
    email: "sarah.j@email.com",
    phone: "+1 234 567 8901",
    location: "New York, NY",
    bookings: 24,
    totalSpent: 2890,
    status: "active",
  },
  {
    id: "2",
    name: "Michael Chen",
    joined: "2024-02-20",
    email: "michael.chen@email.com",
    phone: "+1 234 567 8902",
    location: "Los Angeles, CA",
    bookings: 18,
    totalSpent: 2150,
    status: "active",
  },
  {
    id: "3",
    name: "Emma Wilson",
    joined: "2023-11-08",
    email: "emma.w@email.com",
    phone: "+1 234 567 8903",
    location: "Chicago, IL",
    bookings: 31,
    totalSpent: 3720,
    status: "active",
  },
  {
    id: "4",
    name: "David Brown",
    joined: "2024-03-12",
    email: "david.b@email.com",
    phone: "+1 234 567 8904",
    location: "Houston, TX",
    bookings: 12,
    totalSpent: 1440,
    status: "inactive",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    joined: "2024-01-28",
    email: "lisa.a@email.com",
    phone: "+1 234 567 8905",
    location: "Phoenix, AZ",
    bookings: 27,
    totalSpent: 3240,
    status: "active",
  },
   {
    id: "1",
    name: "Sarah Johnson",
    joined: "2024-01-15",
    email: "sarah.j@email.com",
    phone: "+1 234 567 8901",
    location: "New York, NY",
    bookings: 24,
    totalSpent: 2890,
    status: "active",
  },
  {
    id: "2",
    name: "Michael Chen",
    joined: "2024-02-20",
    email: "michael.chen@email.com",
    phone: "+1 234 567 8902",
    location: "Los Angeles, CA",
    bookings: 18,
    totalSpent: 2150,
    status: "active",
  },
  {
    id: "3",
    name: "Emma Wilson",
    joined: "2023-11-08",
    email: "emma.w@email.com",
    phone: "+1 234 567 8903",
    location: "Chicago, IL",
    bookings: 31,
    totalSpent: 3720,
    status: "active",
  },
  {
    id: "4",
    name: "David Brown",
    joined: "2024-03-12",
    email: "david.b@email.com",
    phone: "+1 234 567 8904",
    location: "Houston, TX",
    bookings: 12,
    totalSpent: 1440,
    status: "inactive",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    joined: "2024-01-28",
    email: "lisa.a@email.com",
    phone: "+1 234 567 8905",
    location: "Phoenix, AZ",
    bookings: 27,
    totalSpent: 3240,
    status: "active",
  },
   {
    id: "1",
    name: "Sarah Johnson",
    joined: "2024-01-15",
    email: "sarah.j@email.com",
    phone: "+1 234 567 8901",
    location: "New York, NY",
    bookings: 24,
    totalSpent: 2890,
    status: "active",
  },
  {
    id: "2",
    name: "Michael Chen",
    joined: "2024-02-20",
    email: "michael.chen@email.com",
    phone: "+1 234 567 8902",
    location: "Los Angeles, CA",
    bookings: 18,
    totalSpent: 2150,
    status: "active",
  },
  {
    id: "3",
    name: "Emma Wilson",
    joined: "2023-11-08",
    email: "emma.w@email.com",
    phone: "+1 234 567 8903",
    location: "Chicago, IL",
    bookings: 31,
    totalSpent: 3720,
    status: "active",
  },
  {
    id: "4",
    name: "David Brown",
    joined: "2024-03-12",
    email: "david.b@email.com",
    phone: "+1 234 567 8904",
    location: "Houston, TX",
    bookings: 12,
    totalSpent: 1440,
    status: "inactive",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    joined: "2024-01-28",
    email: "lisa.a@email.com",
    phone: "+1 234 567 8905",
    location: "Phoenix, AZ",
    bookings: 27,
    totalSpent: 3240,
    status: "active",
  },
  
];

const columns: ColumnDef<Employee>[] = [
  {
    header: "Homeowner",
    cell: ({ row }) => {
      const name = row.original.name;
      const initials = name.split(" ").map(n => n[0]).join("");
      return (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-700">
            {initials}
          </div>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-xs text-gray-500">
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
      <div className="space-y-1">
        <p className="flex gap-2"><Mail size={14} />{row.original.email}</p>
        <p className="flex gap-2"><Phone size={14} />{row.original.phone}</p>
      </div>
    ),
  },
  {
    header: "Location",
    cell: ({ row }) => (
      <div className="flex gap-2"><MapPin size={14} />{row.original.location}</div>
    ),
  },
  { accessorKey: "bookings", header: "Bookings" },
  {
    header: "Total Spent",
    cell: ({ row }) => `$${row.original.totalSpent}`,
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
  const [pageSize, setPageSize] = React.useState(8);

  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return employees.slice(start, start + pageSize);
  }, [page, pageSize]);

  return (
    <div className="space-y-6">
      <div className="relative w-72">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          placeholder="Search employee"
          className="w-full rounded-lg border px-10 py-2"
        />
      </div>

      <DataTable
        columns={columns}
        data={paginatedData}
        page={page}
        pageSize={pageSize}
        total={employees.length}
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


