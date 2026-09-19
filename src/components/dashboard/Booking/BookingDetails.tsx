"use client";

import React from "react";
import dayjs from "dayjs";

export default function BookingDetails({ bookingData }: { bookingData: any }) {
  if (!bookingData) {
    return (
      <p className="px-2 py-4 text-sm text-gray-500">No booking selected.</p>
    );
  }

  const status = (bookingData?.status || "pending").toLowerCase();

  const statusStyles: Record<string, string> = {
    confirmed: "bg-purple-100 text-purple-700 border-purple-200",
    completed: "bg-green-100 text-green-700 border-green-200",
    "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  };

  const formattedDate =
    bookingData?.booking_date && dayjs(bookingData.booking_date).isValid()
      ? dayjs(bookingData.booking_date).format("MMM D, YYYY")
      : bookingData?.booking_date || "-";

  return (
    <div className="space-y-4 px-4 py-1 text-sm">
      {/* Top Header: ID & Status */}
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <p className="text-xs text-gray-400">Booking ID</p>
          <p className="font-semibold text-gray-900 text-base">
            {bookingData?.id || "-"}
          </p>
        </div>
        <div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium border capitalize ${
              statusStyles[status] ||
              "bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            {bookingData?.status || "Pending"}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-gray-500">Homeowner</p>
          <p className="font-medium text-gray-900 mt-0.5">
            {bookingData?.homeowner_name || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Cleaner</p>
          <p className="font-medium text-gray-900 mt-0.5">
            {bookingData?.cleaner_name || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Service Name</p>
          <p className="font-medium text-gray-900 mt-0.5">
            {bookingData?.service_name || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Service Duration</p>
          <p className="font-medium text-gray-900 mt-0.5">
            {bookingData?.service_duration || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Booking Date</p>
          <p className="font-medium text-gray-900 mt-0.5">{formattedDate}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Booking Time</p>
          <p className="font-medium text-gray-900 mt-0.5">
            {bookingData?.booking_time || "-"}
          </p>
        </div>

        <div className="sm:col-span-2">
          <p className="text-xs text-gray-500">Location / Address</p>
          <p className="font-medium text-gray-900 mt-0.5 leading-relaxed">
            {bookingData?.location || "-"}
          </p>
        </div>
      </div>

      {/* Amount Footer */}
      <div className="flex items-center justify-between border-t pt-3">
        <p className="font-medium text-gray-700">Total Amount</p>
        <p className="text-lg font-bold text-gray-900">
          ${bookingData?.amount ?? 0}
        </p>
      </div>
    </div>
  );
}
