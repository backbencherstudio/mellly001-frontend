"use client";

import * as React from "react";
import { Search, User, Calendar, MapPin, Clock } from "lucide-react";
import Pagination from "@/components/reusable/pagination";
import BookingSkeleton from "@/components/loading/BookingSkeleton";
import { useGetBookingDetaialsQuery } from "@/redux/features/dashboardOverView/dashboardOverView";
import dayjs from "dayjs";
import CustomModal from "@/components/reusable/CustomModal";
import BookingDetails from "@/components/dashboard/Booking/BookingDetails";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BookingRecord = Record<string, unknown>;

const toDisplayText = (value: unknown, fallback = "-") =>
  typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;

/* ================= HELPERS ================= */
const statusStyle: Record<string, string> = {
  "in-progress": "bg-blue-100 text-blue-700",
  inprogress: "bg-blue-100 text-blue-700",
  confirmed: "bg-purple-100 text-purple-700",
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  rejected: "bg-red-100 text-red-700",
};

/* ================= COMPONENT ================= */
export default function BookingsList() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [selectedBooking, setSelectedBooking] =
    React.useState<BookingRecord | null>(null);
  const [sort, setSort] = React.useState("");

  const queryParams = React.useMemo(() => {
    return {
      search: search || "",
      bookingorderby: "maid_id",
    };
  }, [search]);

  const { data, isLoading, isError, refetch } =
    useGetBookingDetaialsQuery(queryParams);

  const bookingData = React.useMemo(() => {
    const raw = data?.data;
    const rows: unknown[] = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
        ? raw.data
        : [];
    return rows.filter(
      (row): row is BookingRecord =>
        typeof row === "object" && row !== null,
    );
  }, [data]);

  /* search & sort */
  const processedBookings = React.useMemo(() => {
    let list = [...bookingData];

    if (search) {
      const lower = search.toLowerCase();
      list = list.filter(
        (b) =>
          String(b.id || "").toLowerCase().includes(lower) ||
          String(b.homeowner_name || "").toLowerCase().includes(lower) ||
          String(b.cleaner_name || "").toLowerCase().includes(lower) ||
          String(b.service_name || "").toLowerCase().includes(lower) ||
          String(b.location || "").toLowerCase().includes(lower) ||
          String(b.status || "").toLowerCase().includes(lower)
      );
    }

    if (sort === "name-asc") {
      list.sort((a, b) =>
        String(a.homeowner_name ?? "").localeCompare(
          String(b.homeowner_name ?? "")
        )
      );
    } else if (sort === "name-desc") {
      list.sort((a, b) =>
        String(b.homeowner_name ?? "").localeCompare(
          String(a.homeowner_name ?? "")
        )
      );
    } else {
      // Default: Most recent / newest booking at the top
      list.sort((a, b) => {
        const dateB = new Date(String(b.created_at ?? b.createdAt ?? b.booking_date ?? 0)).getTime();
        const dateA = new Date(String(a.created_at ?? a.createdAt ?? a.booking_date ?? 0)).getTime();
        if (dateB !== dateA) return dateB - dateA;
        return String(b.id ?? "").localeCompare(
          String(a.id ?? ""),
          undefined,
          { numeric: true }
        );
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

  if (isLoading) {
    return <BookingSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <p className="text-sm text-red-600">Unable to load bookings. Please try again.</p>
        <Button type="button" variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by booking number, homeowner, or cleaner..."
              className="w-full rounded-xl border px-4 py-2.5 text-sm"
            />
          </div>

          <div className="w-40">
            <Select
              value={sort || undefined}
              onValueChange={(value) => setSort(value)}
            >
              <SelectTrigger className="h-10 w-full rounded-lg border px-3 py-2.5 text-[12px] shadow-none focus:ring-0">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Booking cards */}
        <div className="space-y-3">
          {paginated.length === 0 ? (
            <div className="rounded-2xl border bg-white p-8 text-center text-sm text-gray-500">
              No bookings found.
            </div>
          ) : (
            paginated.map((b, index) => {
              const statusKey = String(b?.status || "pending").toLowerCase();
              const bookingDate = toDisplayText(b?.booking_date, "");
              const formattedDate =
                bookingDate && dayjs(bookingDate).isValid()
                  ? dayjs(bookingDate).format("MMM D, YYYY")
                  : bookingDate || "-";

              const amount = Number(b?.amount ?? 0);
              const formattedAmount =
                Number.isFinite(amount) ? `$${amount.toFixed(2)}` : "$0.00";

              return (
                <div
                  key={String(b?.id ?? b?.booking_id ?? `booking-${index}`)}
                  className="rounded-2xl border bg-white p-5 cursor-pointer hover:border-gray-300 transition"
                  onClick={() => {
                    setSelectedBooking(b);
                    setOpen(true);
                  }}
                >
                  <div className="flex justify-between gap-6">
                    {/* Left */}
                    <div className="space-y-2">
                      <p className="font-semibold">{toDisplayText(b?.id ?? b?.booking_id, "Booking")}</p>

                      <p className="flex items-center gap-2 text-sm text-gray-600">
                        <User size={14} className="shrink-0" /> Homeowner:{" "}
                        {toDisplayText(b?.homeowner_name)}
                      </p>

                      <p className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="shrink-0" />{" "}
                        {formattedDate}
                      </p>

                      <p className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={14} className="shrink-0" />{" "}
                        {toDisplayText(b?.location)}
                      </p>

                      {toDisplayText(b?.service, "") && (
                        <p className="text-xs text-gray-500">{toDisplayText(b?.service, "")}</p>
                      )}
                    </div>

                    {/* Middle */}
                    <div className="space-y-2">
                      <p className="flex items-start lg:items-center gap-2 text-sm text-gray-600">
                        <User size={14} className="shrink-0" /> Cleaner:{" "}
                        {toDisplayText(b?.cleaner_name, "Unassigned")}
                      </p>

                      <p className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={14} className="shrink-0" />{" "}
                        {toDisplayText(b?.booking_time)}
                      </p>

                      <div className="block md:hidden">
                        <span
                          className={`px-3 py-1 rounded-full text-xs capitalize ${
                            statusStyle[statusKey] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {toDisplayText(b?.status, "Pending")}
                        </span>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col w-full items-end justify-between">
                      <div className="hidden md:block">
                        <span
                          className={`px-3 py-1 rounded-full text-xs capitalize ${
                            statusStyle[statusKey] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {toDisplayText(b?.status, "Pending")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border my-2" />

                  <div className="flex justify-between items-center">
                    <div className="text-[14px] text-[#4A5565]">
                      {toDisplayText(b?.service_name, "Cleaning")}
                      {toDisplayText(b?.service_duration, "") ? ` - ${toDisplayText(b?.service_duration, "")}` : ""}
                    </div>
                    <div className="font-semibold text-base text-gray-900">
                      {formattedAmount}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
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
