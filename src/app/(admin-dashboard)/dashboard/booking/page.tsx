"use client";

import * as React from "react";
import {
  Search,
  User,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import Pagination from "@/components/reusable/pagination";

/* ================= TYPES ================= */
type BookingStatus =
  | "in-progress"
  | "confirmed"
  | "pending"
  | "completed"
  | "cancelled";

type PaymentStatus = "paid" | "pending" | "refunded";

type Booking = {
  id: string;
  bookingNo: string;
  homeowner: string;
  cleaner: string;
  date: string;
  time: string;
  address: string;
  service: string;
  price: number;
  status: BookingStatus;
  payment: PaymentStatus;
};

/* ================= DATA ================= */
const bookings: Booking[] = [
  {
    id: "1",
    bookingNo: "BK-2024-001",
    homeowner: "Sarah Johnson",
    cleaner: "Maria Rodriguez",
    date: "2024-01-15",
    time: "09:00 AM",
    address: "123 Main St, New York",
    service: "Deep Cleaning · 4 Hours",
    price: 120,
    status: "in-progress",
    payment: "paid",
  },
  {
    id: "2",
    bookingNo: "BK-2024-002",
    homeowner: "Michael Chen",
    cleaner: "Jessica Thompson",
    date: "2024-01-15",
    time: "02:00 PM",
    address: "456 Oak Ave, Los Angeles",
    service: "Regular Cleaning · 3 Hours",
    price: 90,
    status: "confirmed",
    payment: "paid",
  },
  {
    id: "3",
    bookingNo: "BK-2024-003",
    homeowner: "Emma Wilson",
    cleaner: "Amanda Lee",
    date: "2024-01-16",
    time: "10:00 AM",
    address: "789 Pine Rd, Chicago",
    service: "Move-in Cleaning · 5 Hours",
    price: 150,
    status: "confirmed",
    payment: "paid",
  },
  {
    id: "4",
    bookingNo: "BK-2024-004",
    homeowner: "David Brown",
    cleaner: "Patricia Garcia",
    date: "2024-01-16",
    time: "03:00 PM",
    address: "321 Elm St, Houston",
    service: "Regular Cleaning · 2 Hours",
    price: 60,
    status: "pending",
    payment: "pending",
  },
  {
    id: "5",
    bookingNo: "BK-2024-005",
    homeowner: "Lisa Anderson",
    cleaner: "Rachel Kim",
    date: "2024-01-14",
    time: "11:00 AM",
    address: "654 Maple Dr, Phoenix",
    service: "Deep Cleaning · 4 Hours",
    price: 120,
    status: "completed",
    payment: "paid",
  },
  {
    id: "6",
    bookingNo: "BK-2024-006",
    homeowner: "James Wilson",
    cleaner: "Maria Rodriguez",
    date: "2024-01-13",
    time: "01:00 PM",
    address: "987 Cedar Ln, Seattle",
    service: "Regular Cleaning · 3 Hours",
    price: 90,
    status: "cancelled",
    payment: "refunded",
  },
];

/* ================= HELPERS ================= */
const statusStyle: Record<BookingStatus, string> = {
  "in-progress": "bg-blue-100 text-blue-700",
  confirmed: "bg-purple-100 text-purple-700",
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const paymentStyle: Record<PaymentStatus, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  refunded: "bg-gray-100 text-gray-600",
};

/* ================= COMPONENT ================= */
export default function BookingsList() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [search, setSearch] = React.useState("");

  /* search */
  const filtered = React.useMemo(() => {
    if (!search) return bookings;
    return bookings.filter((b) =>
      `${b.bookingNo} ${b.homeowner} ${b.cleaner}`
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
        <div className="relative w-full max-full">
          <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by booking number, homeowner, or cleaner..."
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

      {/* 📦 Booking cards */}
      <div className="space-y-3">
        {paginated.map((b) => (
          <div
            key={b.id}
            className="rounded-2xl border bg-white p-5 flex justify-between gap-6"
          >
            {/* Left */}
            <div className="space-y-2">
              <p className="font-semibold">{b.bookingNo}</p>

              <p className="flex items-center gap-2 text-sm text-gray-600">
                <User size={14} /> Homeowner: {b.homeowner}
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={14} /> {b.date}
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={14} /> {b.address}
              </p>

              <p className="text-xs text-gray-500">{b.service}</p>
            </div>

            {/* Middle */}
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <User size={14} /> Cleaner: {b.cleaner}
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={14} /> {b.time}
              </p>
            </div>

            {/* Right */}
            <div className="flex flex-col items-end justify-between">
              <div className="flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${statusStyle[b.status]}`}
                >
                  {b.status}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${paymentStyle[b.payment]}`}
                >
                  {b.payment}
                </span>
              </div>

              <p className="font-semibold">${b.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 🔽 Pagination */}
      <Pagination
        page={page}
        pageSize={pageSize}
        total={filtered.length}
        totalPages={Math.ceil(filtered.length / pageSize)}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPage(1);
          setPageSize(size);
        }}
      />
    </div>
  );
}
