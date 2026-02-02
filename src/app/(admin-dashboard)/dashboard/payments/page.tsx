"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Search,
  CreditCard,
  Wallet,
} from "lucide-react";
import { DataTable } from "@/components/reusable/Table";

/* ================= TYPES ================= */
type PaymentStatus = "completed" | "pending" | "refunded";

type PaymentMethod = "Credit Card" | "Debit Card" | "Paypal" | "Wallet";

type Payment = {
  id: string;
  transactionId: string;
  transactionTime: string;
  bookingId: string;
  from: string;
  to: string;
  amount: number;
  platformFee: number;
  cleanerEarns: number;
  method: PaymentMethod;
  status: PaymentStatus;
};

/* ================= DATA ================= */
const payments: Payment[] = [
  {
    id: "1",
    transactionId: "TXN-2024-00156",
    transactionTime: "2024-01-15 08:45 AM",
    bookingId: "BK-2024-001",
    from: "Sarah Johnson",
    to: "Maria Rodriguez",
    amount: 120,
    platformFee: 12,
    cleanerEarns: 108,
    method: "Credit Card",
    status: "completed",
  },
  {
    id: "2",
    transactionId: "TXN-2024-00157",
    transactionTime: "2024-01-15 01:30 PM",
    bookingId: "BK-2024-002",
    from: "Michael Chen",
    to: "Jessica Thompson",
    amount: 90,
    platformFee: 9,
    cleanerEarns: 81,
    method: "Debit Card",
    status: "completed",
  },
  {
    id: "3",
    transactionId: "TXN-2024-00158",
    transactionTime: "2024-01-15 09:15 AM",
    bookingId: "BK-2024-003",
    from: "Emma Wilson",
    to: "Amanda Lee",
    amount: 150,
    platformFee: 15,
    cleanerEarns: 135,
    method: "Paypal",
    status: "completed",
  },
  {
    id: "4",
    transactionId: "TXN-2024-00159",
    transactionTime: "2024-01-15 02:45 PM",
    bookingId: "BK-2024-004",
    from: "David Brown",
    to: "Patricia Garcia",
    amount: 60,
    platformFee: 6,
    cleanerEarns: 54,
    method: "Wallet",
    status: "pending",
  },
  {
    id: "5",
    transactionId: "TXN-2024-00160",
    transactionTime: "2024-01-14 10:30 AM",
    bookingId: "BK-2024-005",
    from: "Lisa Anderson",
    to: "Rachel Kim",
    amount: 120,
    platformFee: 12,
    cleanerEarns: 108,
    method: "Credit Card",
    status: "completed",
  },
  {
    id: "6",
    transactionId: "TXN-2024-00161",
    transactionTime: "2024-01-13 12:00 PM",
    bookingId: "BK-2024-006",
    from: "James Wilson",
    to: "Maria Rodriguez",
    amount: 90,
    platformFee: 9,
    cleanerEarns: 81,
    method: "Credit Card",
    status: "refunded",
  },
];

/* ================= HELPERS ================= */
const statusStyle: Record<PaymentStatus, string> = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  refunded: "bg-gray-100 text-gray-600",
};

/* ================= COLUMNS ================= */
const columns: ColumnDef<Payment>[] = [
  {
    header: "Transaction",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.transactionId}</p>
        <p className="text-xs text-gray-500">
          {row.original.transactionTime}
        </p>
      </div>
    ),
  },
  {
    header: "Booking",
    cell: ({ row }) => (
      <span className="font-medium text-sm">
        {row.original.bookingId}
      </span>
    ),
  },
  {
    header: "Parties",
    cell: ({ row }) => (
      <div className="text-sm">
        <p>
          <span className="text-gray-500">From:</span>{" "}
          {row.original.from}
        </p>
        <p>
          <span className="text-gray-500">To:</span>{" "}
          {row.original.to}
        </p>
      </div>
    ),
  },
  {
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-semibold">${row.original.amount}</span>
    ),
  },
  {
    header: "Platform Fee",
    cell: ({ row }) => `$${row.original.platformFee}`,
  },
  {
    header: "Cleaner Earns",
    cell: ({ row }) => (
      <span className="font-medium text-green-600">
        ${row.original.cleanerEarns}
      </span>
    ),
  },
  {
    header: "Method",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        {row.original.method === "Wallet" ? (
          <Wallet size={14} />
        ) : (
          <CreditCard size={14} />
        )}
        {row.original.method}
      </div>
    ),
  },
  {
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[row.original.status]}`}
      >
        {row.original.status}
      </span>
    ),
  },
];

/* ================= COMPONENT ================= */
export default function PaymentsTable() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(8);
  const [search, setSearch] = React.useState("");

  /* search */
  const filtered = React.useMemo(() => {
    if (!search) return payments;
    return payments.filter((p) =>
      `${p.transactionId} ${p.bookingId} ${p.from}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  /* pagination */
  const paginated = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  return (
    <div className="space-y-6">
      {/* 🔝 Top bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by transaction ID, booking number, or homeowner..."
            className="w-full rounded-xl border px-11 py-2.5 text-sm"
          />
        </div>

        <button className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm text-gray-600">
          Sort by
          <svg width="14" height="14" viewBox="0 0 24 24">
            <polyline
              points="6 9 12 15 18 9"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>

      {/* 📊 Table */}
      <DataTable
        columns={columns}
        data={paginated}
        page={page}
        pageSize={pageSize}
        total={filtered.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPage(1);
          setPageSize(size);
        }}
      />
    </div>
  );
}
