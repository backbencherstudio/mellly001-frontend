"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Search,
  CreditCard,
  Wallet,
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  Clock4,
  CreditCardIcon,
  DollarSignIcon,
} from "lucide-react";
import { DataTable } from "@/components/reusable/Table";
import ArrowIcon from "@/components/icon/ArrowIcon";

/* ================= TYPES ================= */
type PaymentStatus = "completed" | "pending" | "refunded";

type PaymentMethod = "Credit Card" | "Debit Card" | "Paypal" | "Wallet";

type Stat = {
  id: string;
  title: string;
  value: string;
  revinew:string;
  bg: string;
  textcolor: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

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

 const stats: Stat[] = [
    {
      id: "users",
      title: "Total Homeowners",
     value: "$480",
     revinew:"Total Revenue",
     icon: DollarSignIcon   ,
     bg: "#00C950",
      textcolor: "#155DFC",
    },
    {
      id: "consults",
      title: "10% commission earned",
      value: "$48",
      revinew: "Platform Fees",

      icon: DollarSignIcon,
      bg: "#2B7FFF",
      textcolor: "#00A63E",
    },
    {
      id: "simulations",
      title: "Total payment records",
      value: "86",
      revinew: "Transactions",

      icon: CreditCardIcon  ,
      bg: "#AD46FF",
      textcolor: "#9810FA",
    },
 
  
  ];

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
          <span className="text-[#101828]">From:</span>{" "}
          {row.original.from}
        </p>
        <p className="text-gray-500">
          To: {row.original.to}
        </p>

      </div>
    ),
  },
  {
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-bold text-base">${row.original.amount}</span>
    ),
  },
  {
    header: "Platform Fee",
    cell: ({ row }) => (
      <p className="text-[#101828] text-base font-normal">
        ${row.original.platformFee}
      </p>
    ),
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
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 pb-6">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="flex justify-between gap-6 rounded-xl border border-[#E9E9E9]  p-5 shadow-[0px_4px_33px_8px_rgba(0,0,0,0.04)]"
              style={{ backgroundColor: item.bg }} >
              {/* Left */}
              <div className="space-y-2 w-full ">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: item.bg }}
                >
                  <p className="text-[#DCFCE7] w-full whitespace-nowrap">{item.revinew}</p>
                </div>
                <p className="text-3xl font-bold text-white leading-100%">
                  {item.value}
                </p>
                <p className="text-sm font-normal text-[#DCFCE7]">
                  {item.title}
                </p>

              </div>

              {/* Right Icon */}
              <div>
                <div className="text-sm ">
                  <Icon
                    className="h-5 w-5 text-white"

                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="space-y-6">
        {/* 🔝 Top bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full ">
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by transaction ID, booking number, or homeowner..."
              className="w-full rounded-xl border px-11 py-2.5 text-sm"
            />
          </div>

          <div className="w-40">
            <select className="h-full w-full rounded-lg border px-3 py-2 focus:outline-none text-[12px]">
              <option value="">Sort by</option>
              {/* <option value="name">Name</option>
            <option value="date">Date</option> */}
            </select>
          </div>
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
    </div>
  );
}
