"use client";

import * as React from "react";
import { Search, User, Calendar, MapPin, Clock } from "lucide-react";
import Pagination from "@/components/reusable/pagination";
import { useGetBookingDetaialsQuery } from "@/redux/features/dashboardOverView/dashboardOverView";
import dayjs from "dayjs";
import CustomModal from "@/components/reusable/CustomModal";
import BookingDetails from "@/components/dashboard/Booking/BookingDetails";
/* ================= TYPES ================= */
type BookingStatus =
  | "in-progress"
  | "confirmed"
  | "pending"
  | "completed"
  | "cancelled"
  | "rejected";

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
  rejected: "bg-red-100 text-red-700",
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
  const [open, setOpen] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(
    null,
  );
  const [sort, setSort] = React.useState("");

  const queryParams = React.useMemo(() => {
    return {
      search: search || "",
      bookingorderby: "maid_id",
    };
  }, [search]);

  const { data, isLoading } = useGetBookingDetaialsQuery(queryParams);

  const bookingData = React.useMemo(() => {
    const raw = data?.data;

    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;

    return [];
  }, [data]);

  /* search & sort */
  const processedBookings = React.useMemo(() => {
    let list = [...bookingData];

    if (search) {
      const lower = search.toLowerCase();
      list = list.filter(
        (b: any) =>
          String(b.id || "").toLowerCase().includes(lower) ||
          String(b.homeowner_name || "").toLowerCase().includes(lower) ||
          String(b.cleaner_name || "").toLowerCase().includes(lower) ||
          String(b.service_name || "").toLowerCase().includes(lower) ||
          String(b.location || "").toLowerCase().includes(lower) ||
          String(b.status || "").toLowerCase().includes(lower)
      );
    }

    if (sort === "name-asc") {
      list.sort((a: any, b: any) =>
        String(a.homeowner_name || "").localeCompare(String(b.homeowner_name || ""))
      );
    } else if (sort === "name-desc") {
      list.sort((a: any, b: any) =>
        String(b.homeowner_name || "").localeCompare(String(a.homeowner_name || ""))
      );
    } else {
      // Default: Most recent / newest booking at the top
      list.sort((a: any, b: any) => {
        const dateB = new Date(b.created_at || b.createdAt || b.booking_date || 0).getTime();
        const dateA = new Date(a.created_at || a.createdAt || a.booking_date || 0).getTime();
        if (dateB !== dateA) return dateB - dateA;
        return String(b.id || "").localeCompare(String(a.id || ""), undefined, { numeric: true });
      });
    }

    return list;
  }, [bookingData, search, sort]);

  React.useEffect(() => {
    setPage(1);
  }, [search, sort]);

  /* pagination */
  const paginated = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return processedBookings.slice(start, start + pageSize);
  }, [processedBookings, page, pageSize]);

  return (
    <div>
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
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-full w-full rounded-lg border px-3 py-2.5 focus:outline-none text-[12px] cursor-pointer"
            >
              <option value="">Sort by</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>

        {/*  Booking cards */}
        <div className="space-y-3">
          {paginated.map((b: any) => {
            const statusKey = b.status as BookingStatus;

            return (
              <div
                key={b.id}
                className="rounded-2xl border bg-white p-5 cursor-pointer"
                onClick={() => {
                  setSelectedBooking(b);
                  setOpen(true);
                }}
              >
                <div className="flex justify-between gap-6">
                  {/* Left */}
                  <div className="space-y-2">
                    <p className="font-semibold">{b.id}</p>

                    <p className="flex items-center gap-2 text-sm text-gray-600">
                      <User size={14} className="" /> Homeowner:{" "}
                      {b.homeowner_name}
                    </p>

                    <p className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={14} />{" "}
                      {dayjs(b.booking_date).format("MMM D, YYYY")}
                    </p>

                    <p className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={14} className="shrink-0" /> {b.location}
                    </p>

                    <p className="text-xs text-gray-500">{b.service}</p>
                  </div>

                  {/* Middle */}
                  <div className="space-y-2">
                    <p className="flex items-start lg:items-center gap-2 text-sm text-gray-600">
                      <User size={14} className="shrink-0" /> Cleaner:{" "}
                      {b.cleaner_name}
                    </p>

                    <p className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={14} /> {b.booking_time}
                    </p>
                    <div className="block md:hidden ">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${statusStyle[statusKey]}`}
                      >
                        <span className="uppercase "> {b.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col w-full items-end justify-between">
                    <div className="hidden md:block">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${statusStyle[statusKey]}`}
                      >
                        <span className="uppercase "> {b.status}</span>
                      </span>
                    </div>
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
          total={processedBookings.length}
          totalPages={Math.ceil(processedBookings.length / pageSize)}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPage(1);
            setPageSize(size);
          }}
        />
      </div>
      <div>
        <CustomModal
          open={open}
          title="Booking Details"
          size="mmd"
          onOpenChange={setOpen}
        >
          <BookingDetails bookingData={selectedBooking} />
        </CustomModal>
      </div>
    </div>
  );
}
