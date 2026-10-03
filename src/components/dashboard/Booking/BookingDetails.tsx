"use client";

import React, { useState } from "react";
import dayjs from "dayjs";
import { toast } from "sonner";
import {
  useGetBookingByIdQuery,
  useGetCleanersQuery,
  useUpdateBookingStatusMutation,
  useAssignBookingCleanerMutation,
} from "@/redux/features/dashboardOverView/dashboardOverView";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BookingDetailsData = {
  id?: string | number;
  booking_id?: string | number;
  bookingId?: string | number;
  status?: string;
  booking_date?: string | null;
  payment_status?: string | null;
  payment?: {
    status?: string | null;
    transactions?: unknown;
    status_history?: unknown;
  } | null;
  payment_transaction?: unknown;
  payment_status_history?: unknown;
  residential_cleaning_package?: {
    title?: string;
    duration?: string;
    price?: number | string;
  } | null;
  service_name?: string;
  service?: string;
  service_duration?: string;
  total_price?: number | string | null;
  amount?: number | string | null;
  revenue?: number | string | null;
  user?: {
    id?: string | number;
    name?: string;
    email?: string;
    phone_number?: string;
    location?: string;
  } | null;
  homeowner_name?: string;
  homeowner_location?: string;
  location?: string;
  maid?: {
    id?: string | number;
    name?: string;
    email?: string;
    phone_number?: string;
  } | null;
  maid_id?: string | number;
  cleaner_id?: string | number;
  cleanerId?: string | number;
  cleaner_name?: string;
  cleaner?: { id?: string | number } | null;
  slot?: string | number;
  booking_time?: string;
  start_time?: string;
  end_time?: string;
  cancle_reason?: string;
  maid_note?: string;
};

type PaymentTransaction = {
  id?: string | number;
  booking_id?: string | number;
  user_id?: string | number;
  type?: string;
  status?: string;
  amount?: number | string | null;
  paid_amount?: number | string | null;
  created_at?: string | null;
};

type PaymentStatusHistory = {
  id?: string | number;
  previous_status?: string | null;
  status?: string | null;
  changed_by?: string | number | null;
  created_at?: string | null;
};

const toBookingDetailsData = (value: unknown): BookingDetailsData | null =>
  typeof value === "object" && value !== null
    ? (value as BookingDetailsData)
    : null;

const getPaymentTransactions = (value: unknown): PaymentTransaction[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is PaymentTransaction =>
          typeof item === "object" && item !== null,
      )
    : [];

const getPaymentStatusHistory = (value: unknown): PaymentStatusHistory[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is PaymentStatusHistory =>
          typeof item === "object" && item !== null,
      )
    : [];

const formatCurrency = (value: number | string | null | undefined) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? `$${amount.toFixed(2)}` : "N/A";
};

const formatPaymentDate = (value?: string | null) =>
  value && dayjs(value).isValid()
    ? dayjs(value).format("MMM D, YYYY · h:mm A")
    : "N/A";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== "object" || error === null) return fallback;

  if ("data" in error && typeof error.data === "object" && error.data !== null) {
    const data = error.data;
    if ("message" in data && typeof data.message === "string") {
      return data.message;
    }
  }

  if ("message" in error && typeof error.message === "string") {
    return error.message;
  }

  return fallback;
};

export default function BookingDetails({
  bookingData: initialBookingValue,
}: {
  bookingData: unknown;
}) {
  const initialBookingData = toBookingDetailsData(initialBookingValue);
  const bookingId = String(
    initialBookingData?.booking_id ||
    initialBookingData?.bookingId ||
    initialBookingData?.id ||
    "",
  );

  const {
    data: apiBookingDetailData,
    isLoading: isBookingLoading,
    isError: isBookingError,
    refetch,
  } = useGetBookingByIdQuery(bookingId, {
    skip: !bookingId,
  });

  const bookingData = toBookingDetailsData(
    apiBookingDetailData?.data ||
    apiBookingDetailData?.booking ||
    apiBookingDetailData ||
    initialBookingData,
  );

  const [selectedCleanerId, setSelectedCleanerId] = useState<string | null>(null);
  const [selectedStatusOverride, setSelectedStatusOverride] = useState<string | null>(null);

  const {
    data: cleanersData,
    isLoading: isCleanersLoading,
    isError: isCleanersError,
    refetch: refetchCleaners,
  } =
    useGetCleanersQuery({});
  const [updateBookingStatus, { isLoading: isUpdatingStatus }] =
    useUpdateBookingStatusMutation();
  const [assignBookingCleaner, { isLoading: isAssigningCleaner }] =
    useAssignBookingCleanerMutation();

  const cleanersList: Record<string, unknown>[] = React.useMemo(() => {
    const raw = cleanersData?.data?.data || cleanersData?.data;
    return Array.isArray(raw)
      ? raw.filter(
          (cleaner: unknown): cleaner is Record<string, unknown> =>
            typeof cleaner === "object" && cleaner !== null,
        )
      : [];
  }, [cleanersData]);

  if (!bookingData && !isBookingLoading) {
    return (
      <p className="px-2 py-4 text-sm text-gray-500">No booking selected.</p>
    );
  }

  const currentBookingId = String(
    bookingData?.id ||
    bookingData?.booking_id ||
    bookingId ||
    "",
  );
  const selectedStatus =
    selectedStatusOverride ?? bookingData?.status?.toUpperCase() ?? "PENDING";
  const existingCleanerId =
    bookingData?.maid?.id ??
    bookingData?.maid_id ??
    bookingData?.cleaner_id ??
    bookingData?.cleanerId ??
    bookingData?.cleaner?.id;
  const cleanerSelectValue =
    selectedCleanerId ??
    (existingCleanerId === undefined || existingCleanerId === null
      ? undefined
      : String(existingCleanerId));

  const status = (bookingData?.status || "PENDING").toLowerCase();

  const statusStyles: Record<string, string> = {
    confirmed: "bg-purple-100 text-purple-700 border-purple-200",
    completed: "bg-green-100 text-green-700 border-green-200",
    started: "bg-blue-100 text-blue-700 border-blue-200",
    submitted: "bg-indigo-100 text-indigo-700 border-indigo-200",
    "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
    inprogress: "bg-blue-100 text-blue-700 border-blue-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  };

  const formattedDate =
    bookingData?.booking_date && dayjs(bookingData.booking_date).isValid()
      ? dayjs(bookingData.booking_date).format("MMM D, YYYY")
      : bookingData?.booking_date || "-";

  // Service details mapping
  const serviceTitle =
    bookingData?.residential_cleaning_package?.title ||
    bookingData?.service_name ||
    bookingData?.service ||
    "-";

  const serviceDuration =
    bookingData?.residential_cleaning_package?.duration ||
    bookingData?.service_duration ||
    "-";

  // Amount & Revenue
  const rawPrice =
    bookingData?.total_price !== undefined && bookingData?.total_price !== null
      ? bookingData.total_price
      : bookingData?.residential_cleaning_package?.price !== undefined
      ? bookingData.residential_cleaning_package.price
      : bookingData?.amount;

  const formattedAmount =
    rawPrice !== undefined && rawPrice !== null
      ? `$${Number(rawPrice).toFixed(2)}`
      : "$0.00";

  const formattedRevenue =
    bookingData?.revenue !== undefined && bookingData?.revenue !== null
      ? `$${Number(bookingData.revenue).toFixed(2)}`
      : null;

  const paymentStatus =
    bookingData?.payment?.status || bookingData?.payment_status || "UNKNOWN";
  const paymentStatusStyle: Record<string, string> = {
    paid: "bg-green-100 text-green-700",
    completed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    refunded: "bg-gray-100 text-gray-700",
    failed: "bg-red-100 text-red-700",
  };
  const transactionSource = Array.isArray(bookingData?.payment?.transactions)
    ? bookingData.payment.transactions
    : bookingData?.payment_transaction;
  const statusHistorySource = Array.isArray(bookingData?.payment?.status_history)
    ? bookingData.payment.status_history
    : bookingData?.payment_status_history;
  const paymentTransactions = getPaymentTransactions(transactionSource);
  const paymentStatusHistory = getPaymentStatusHistory(statusHistorySource);

  // Homeowner details
  const homeownerName =
    bookingData?.user?.name || bookingData?.homeowner_name || "-";
  const homeownerEmail = bookingData?.user?.email || null;
  const homeownerPhone = bookingData?.user?.phone_number || null;
  const homeownerLocation =
    bookingData?.homeowner_location ||
    bookingData?.user?.location ||
    bookingData?.location ||
    "-";

  // Maid / Cleaner details
  const maidName =
    bookingData?.maid?.name ||
    bookingData?.cleaner_name ||
    (bookingData?.maid ? "Cleaner Assigned" : "Unassigned");
  const maidEmail = bookingData?.maid?.email || null;
  const maidPhone = bookingData?.maid?.phone_number || null;

  // Status Change Handler
  const handleStatusUpdate = async () => {
    if (!selectedStatus) return;
    if (!currentBookingId) {
      toast.error("Unable to update booking: missing booking ID");
      return;
    }

    try {
      const res = await updateBookingStatus({
        id: currentBookingId,
        status: selectedStatus.toUpperCase(),
      }).unwrap();
      if (res?.success === false) {
        toast.error(res?.message || "Failed to update booking status");
        return;
      }
      toast.success(res?.message || "Booking status updated successfully");
      refetch();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to update booking status"));
    }
  };

  // Cleaner Assignment Handler
  const handleAssignCleaner = async () => {
    if (!selectedCleanerId) {
      toast.error("Please select a cleaner to assign");
      return;
    }
    if (!currentBookingId) {
      toast.error("Unable to assign cleaner: missing booking ID");
      return;
    }

    try {
      const res = await assignBookingCleaner({
        id: currentBookingId,
        cleaner_id: selectedCleanerId,
      }).unwrap();
      if (res?.success === false) {
        toast.error(res?.message || "Failed to assign cleaner");
        return;
      }
      toast.success(res?.message || "Cleaner assigned successfully");
      refetch();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to assign cleaner"));
    }
  };

  return (
    <div className="space-y-4 px-2 py-1 text-sm">
      {/* Top Header: ID & Status */}
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <p className="text-xs text-gray-400">Booking ID</p>
          <p className="font-semibold text-gray-900 text-sm md:text-base break-all">
            {currentBookingId || "-"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${paymentStatusStyle[paymentStatus.toLowerCase()] || "bg-gray-50 text-gray-700 border-gray-200"}`}
          >
            Payment: {paymentStatus}
          </span>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium border capitalize ${
              statusStyles[status] ||
              "bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            {bookingData?.status || "PENDING"}
          </span>
        </div>
      </div>

      {isBookingError && (
        <div className="flex items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          <span>Could not load the latest booking details.</span>
          <button type="button" className="font-medium underline" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Homeowner Info */}
        <div className="rounded-lg border bg-gray-50/50 p-3 space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Homeowner</p>
          <p className="font-medium text-gray-900 text-sm">{homeownerName}</p>
          {homeownerEmail && (
            <p className="text-xs text-gray-600">{homeownerEmail}</p>
          )}
          {homeownerPhone && (
            <p className="text-xs text-gray-600">{homeownerPhone}</p>
          )}
        </div>

        {/* Cleaner Info */}
        <div className="rounded-lg border bg-gray-50/50 p-3 space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned Cleaner</p>
          <p className="font-medium text-gray-900 text-sm">{maidName}</p>
          {maidEmail && (
            <p className="text-xs text-gray-600">{maidEmail}</p>
          )}
          {maidPhone && (
            <p className="text-xs text-gray-600">{maidPhone}</p>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-500">Service Package</p>
          <p className="font-medium text-gray-900 mt-0.5">{serviceTitle}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Service Duration</p>
          <p className="font-medium text-gray-900 mt-0.5">{serviceDuration}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Booking Date</p>
          <p className="font-medium text-gray-900 mt-0.5">{formattedDate}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Time Slot</p>
          <p className="font-medium text-gray-900 mt-0.5">
            {bookingData?.slot ? `Slot ${bookingData.slot}` : bookingData?.booking_time || "-"}
            {bookingData?.start_time && ` (${bookingData.start_time} - ${bookingData.end_time || ""})`}
          </p>
        </div>

        <div className="sm:col-span-2">
          <p className="text-xs text-gray-500">Location / Address</p>
          <p className="font-medium text-gray-900 mt-0.5 leading-relaxed text-xs sm:text-sm">
            {homeownerLocation}
          </p>
        </div>

        {bookingData?.cancle_reason && (
          <div className="sm:col-span-2 rounded-md bg-red-50 p-2.5 text-xs text-red-700">
            <span className="font-semibold">Cancel Reason: </span>
            {bookingData.cancle_reason}
          </div>
        )}

        {bookingData?.maid_note && (
          <div className="sm:col-span-2 rounded-md bg-yellow-50 p-2.5 text-xs text-yellow-800">
            <span className="font-semibold">Maid Note: </span>
            {bookingData.maid_note}
          </div>
        )}
      </div>

      <section className="space-y-3 border-t pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold text-gray-900">Payment Details</h3>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${paymentStatusStyle[paymentStatus.toLowerCase()] || "bg-gray-100 text-gray-700"}`}
          >
            {paymentStatus}
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase text-gray-500">
            Transactions ({paymentTransactions.length})
          </h4>
          {paymentTransactions.length > 0 ? (
            paymentTransactions.map((transaction, index) => (
              <div
                key={String(transaction.id ?? `transaction-${index}`)}
                className="grid gap-2 rounded-md border p-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">
                    {transaction.id ? `Transaction ${transaction.id}` : "Transaction"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {[transaction.type, transaction.status]
                      .filter(Boolean)
                      .join(" · ") || "Status unavailable"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatPaymentDate(transaction.created_at)}
                  </p>
                </div>
                <p className="text-xs text-gray-600">
                  Amount <span className="font-semibold text-gray-900">{formatCurrency(transaction.amount)}</span>
                </p>
                <p className="text-xs text-gray-600">
                  Paid <span className="font-semibold text-gray-900">{formatCurrency(transaction.paid_amount)}</span>
                </p>
              </div>
            ))
          ) : (
            <p className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-500">
              No payment transactions recorded.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase text-gray-500">
            Status History ({paymentStatusHistory.length})
          </h4>
          {paymentStatusHistory.length > 0 ? (
            <div className="divide-y rounded-md border px-3">
              {paymentStatusHistory.map((entry, index) => (
                <div
                  key={String(entry.id ?? `payment-history-${index}`)}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2 text-xs"
                >
                  <div>
                    <span className="text-gray-500">
                      {entry.previous_status || "Initial"} → {entry.status || "Unknown"}
                    </span>
                    {entry.changed_by && (
                      <span className="ml-2 text-gray-400">
                        by {entry.changed_by}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-500">
                    {formatPaymentDate(entry.created_at)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-500">
              No payment status changes recorded.
            </p>
          )}
        </div>
      </section>

      {/* Admin Controls: Status Management & Cleaner Assignment */}
      <div className="rounded-lg border bg-gray-50/70 p-3 space-y-3">
        <p className="text-xs font-semibold text-gray-700">Admin Controls</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Status Select */}
          <div className="space-y-1">
            <label className="text-[11px] text-gray-500">Change Status</label>
            <div className="flex gap-1.5">
              <Select
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatusOverride(value)}
              >
                <SelectTrigger className="w-full rounded-md border bg-white px-2 py-1.5 text-xs text-gray-800 shadow-none focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="STARTED">Started</SelectItem>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <button
                type="button"
                onClick={handleStatusUpdate}
                disabled={isUpdatingStatus}
                className="shrink-0 rounded-md bg-[#03652B] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#024e21] disabled:opacity-50 cursor-pointer"
              >
                {isUpdatingStatus ? "..." : "Save"}
              </button>
            </div>
          </div>

          {/* Cleaner Reassign */}
          <div className="space-y-1">
            <label className="text-[11px] text-gray-500">Assign Cleaner</label>
            <div className="flex gap-1.5">
              <Select
                value={cleanerSelectValue}
                onValueChange={(value) => setSelectedCleanerId(value)}
                disabled={isCleanersLoading}
              >
                <SelectTrigger className="w-full rounded-md border bg-white px-2 py-1.5 text-xs text-gray-800 shadow-none focus:ring-0 disabled:opacity-50">
                  <SelectValue placeholder="-- Select Cleaner --" />
                </SelectTrigger>
                <SelectContent>
                  {cleanersList.map((cleaner) => {
                    const nestedUser = cleaner.user;
                    const nestedUserId =
                      typeof nestedUser === "object" && nestedUser !== null && "id" in nestedUser
                        ? nestedUser.id
                        : undefined;
                    const cleanerId =
                      cleaner.userId ??
                      cleaner.user_id ??
                      nestedUserId ??
                      cleaner.id;
                    if (cleanerId === undefined || cleanerId === null || cleanerId === "") {
                      return null;
                    }
                    return (
                      <SelectItem key={String(cleanerId)} value={String(cleanerId)}>
                        {typeof cleaner.name === "string" ? cleaner.name : "Unnamed cleaner"}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {isCleanersError && (
                <button
                  type="button"
                  className="text-left text-xs text-red-600 underline"
                  onClick={() => refetchCleaners()}
                >
                  Cleaner list failed to load. Retry.
                </button>
              )}
              <button
                type="button"
                onClick={handleAssignCleaner}
                disabled={isAssigningCleaner || !selectedCleanerId}
                className="shrink-0 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-black disabled:opacity-50 cursor-pointer"
              >
                {isAssigningCleaner ? "..." : "Assign"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Amount & Revenue Footer */}
      <div className="flex items-center justify-between border-t pt-3">
        <div>
          <p className="font-medium text-gray-700">Total Price</p>
          {formattedRevenue && (
            <p className="text-xs text-gray-500">Revenue: {formattedRevenue}</p>
          )}
        </div>
        <p className="text-lg font-bold text-gray-900">{formattedAmount}</p>
      </div>
    </div>
  );
}

