"use client";

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { toast } from "sonner";
import {
  useGetBookingByIdQuery,
  useGetCleanersQuery,
  useUpdateBookingStatusMutation,
  useAssignBookingCleanerMutation,
} from "@/redux/features/dashboardOverView/dashboardOverView";

export default function BookingDetails({
  bookingData: initialBookingData,
  onClose,
}: {
  bookingData: any;
  onClose?: () => void;
}) {
  const bookingId =
    initialBookingData?.booking_id ||
    initialBookingData?.bookingId ||
    initialBookingData?.id;

  const {
    data: apiBookingDetailData,
    isLoading: isBookingLoading,
    refetch,
  } = useGetBookingByIdQuery(bookingId, {
    skip: !bookingId,
  });

  const bookingData =
    apiBookingDetailData?.data ||
    apiBookingDetailData?.booking ||
    apiBookingDetailData ||
    initialBookingData;

  const [selectedCleanerId, setSelectedCleanerId] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("PENDING");

  useEffect(() => {
    if (bookingData) {
      if (bookingData.status) {
        setSelectedStatus(bookingData.status.toUpperCase());
      }
      const existingCleanerId =
        bookingData.maid?.id ||
        bookingData.maid_id ||
        bookingData.cleaner_id ||
        bookingData.cleanerId ||
        bookingData.cleaner?.id;
      if (existingCleanerId) {
        setSelectedCleanerId(String(existingCleanerId));
      }
    }
  }, [bookingData]);

  const { data: cleanersData, isLoading: isCleanersLoading } =
    useGetCleanersQuery({});
  const [updateBookingStatus, { isLoading: isUpdatingStatus }] =
    useUpdateBookingStatusMutation();
  const [assignBookingCleaner, { isLoading: isAssigningCleaner }] =
    useAssignBookingCleanerMutation();

  const cleanersList: any[] = React.useMemo(() => {
    const raw = cleanersData?.data?.data || cleanersData?.data;
    if (Array.isArray(raw)) return raw;
    return [];
  }, [cleanersData]);

  if (!bookingData && !isBookingLoading) {
    return (
      <p className="px-2 py-4 text-sm text-gray-500">No booking selected.</p>
    );
  }

  const currentBookingId =
    bookingData?.id ||
    bookingData?.booking_id ||
    bookingId ||
    "-";

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
    try {
      const res = await updateBookingStatus({
        id: currentBookingId,
        status: selectedStatus.toUpperCase(),
      }).unwrap();
      toast.success(res?.message || "Booking status updated successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update booking status");
    }
  };

  // Cleaner Assignment Handler
  const handleAssignCleaner = async () => {
    if (!selectedCleanerId) {
      toast.error("Please select a cleaner to assign");
      return;
    }

    try {
      const res = await assignBookingCleaner({
        id: currentBookingId,
        cleaner_id: selectedCleanerId,
      }).unwrap();
      toast.success(res?.message || "Cleaner assigned successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to assign cleaner");
    }
  };

  return (
    <div className="space-y-4 px-2 py-1 text-sm">
      {/* Top Header: ID & Status */}
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <p className="text-xs text-gray-400">Booking ID</p>
          <p className="font-semibold text-gray-900 text-sm md:text-base break-all">
            {currentBookingId}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {bookingData?.payment_status && (
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium border bg-gray-50 text-gray-700 border-gray-200">
              Payment: {bookingData.payment_status}
            </span>
          )}
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

      {/* Admin Controls: Status Management & Cleaner Assignment */}
      <div className="rounded-lg border bg-gray-50/70 p-3 space-y-3">
        <p className="text-xs font-semibold text-gray-700">Admin Controls</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Status Select */}
          <div className="space-y-1">
            <label className="text-[11px] text-gray-500">Change Status</label>
            <div className="flex gap-1.5">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-md border bg-white px-2 py-1.5 text-xs text-gray-800 focus:outline-none"
              >
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="STARTED">Started</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="COMPLETED">Completed</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
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
              <select
                value={selectedCleanerId}
                onChange={(e) => setSelectedCleanerId(e.target.value)}
                disabled={isCleanersLoading}
                className="w-full rounded-md border bg-white px-2 py-1.5 text-xs text-gray-800 focus:outline-none"
              >
                <option value="">-- Select Cleaner --</option>
                {cleanersList.map((cleaner) => {
                  const cleanerId =
                    cleaner.userId ||
                    cleaner.user_id ||
                    cleaner.user?.id ||
                    cleaner.id;
                  return (
                    <option key={cleanerId} value={cleanerId}>
                      {cleaner.name}
                    </option>
                  );
                })}
              </select>
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

