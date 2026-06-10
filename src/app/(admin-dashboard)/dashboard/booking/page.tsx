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
import { useGetBookingDetaialsQuery } from "@/redux/features/dashboardOverView/dashboardOverView";

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
  const [orderBy, setOrderBy] = React.useState("maid_id");

  const queryParams = React.useMemo(() => {
    return {
      search: search || "",
      bookingorderby: orderBy,
    };
  }, [search, orderBy]);

  const { data, isLoading } = useGetBookingDetaialsQuery(queryParams);

  const bookingData = React.useMemo(() => {
    const raw = data?.data;

    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;

    return [];
  }, [data]);

  /* pagination */
  const paginated = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return bookingData.slice(start, start + pageSize);
  }, [bookingData, page, pageSize]);

  return (
    <div className="space-y-6">
      {/*  Top bar */}
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
            <option value="name">Name</option>
            {/* <option value="date">Date</option> */}
          </select>
        </div>
      </div>

      {/* 📦 Booking cards */}
      <div className="space-y-3">
        {paginated.map((b: any) => {
          const statusKey = b.status as BookingStatus;

          return (
            <div key={b.id} className="rounded-2xl border bg-white p-5">
              <div className="flex justify-between gap-6">
                {/* Left */}
                <div className="space-y-2">
                  <p className="font-semibold">{b.id}</p>

                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <User size={14} /> Homeowner: {b.homeowner_name}
                  </p>

                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={14} /> {b.booking_date}
                  </p>

                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={14} /> {b.location}
                  </p>

                  <p className="text-xs text-gray-500">{b.service}</p>
                </div>

                {/* Middle */}
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <User size={14} /> Cleaner: {b.cleaner_name}
                  </p>

                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={14} /> {b.booking_time}
                  </p>
                </div>

                {/* Right */}
                <div className="flex flex-col items-end justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${statusStyle[statusKey]}`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>

              <div className="border my-2" />

              <div className="flex justify-between">
                <div className="text-[14px] text-[#4A5565]">
                  {b.service_name} - {b.service_duration}
                </div>
                <div className="font-semibold">${b.amount}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/*  Pagination */}
      <Pagination
        page={page}
        pageSize={pageSize}
        total={bookingData.length}
        totalPages={Math.ceil(bookingData.length / pageSize)}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPage(1);
          setPageSize(size);
        }}
      />
    </div>
  );
}
