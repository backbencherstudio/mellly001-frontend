"use client";

import React from "react";
import dayjs from "dayjs";
import { Star } from "lucide-react";

export default function CleanerDetails({ cleaner }: { cleaner: any }) {
  if (!cleaner) {
    return (
      <p className="px-2 py-4 text-sm text-gray-500">No cleaner selected.</p>
    );
  }

  const status = (cleaner?.status || "active").toLowerCase();

  const statusStyles: Record<string, string> = {
    active: "bg-green-100 text-green-700 border-green-200",
    busy: "bg-yellow-100 text-yellow-700 border-yellow-200",
    inactive: "bg-gray-100 text-gray-700 border-gray-200",
    confirmed: "bg-purple-100 text-purple-700 border-purple-200",
    completed: "bg-green-100 text-green-700 border-green-200",
    "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  };

  const formattedDate =
    cleaner?.joined_at && dayjs(cleaner.joined_at).isValid()
      ? dayjs(cleaner.joined_at).format("MMM D, YYYY")
      : cleaner?.joined_at || "-";

  return (
    <div className="space-y-4 px-4 py-1 text-sm">
      {/* Top Header: ID & Status */}
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <p className="text-xs text-gray-400">Cleaner ID</p>
          <p className="font-semibold text-gray-900 text-base">
            {cleaner?.id || "-"}
          </p>
        </div>
        <div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium border capitalize ${
              statusStyles[status] ||
              "bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            <span className="uppercase">{cleaner.status}</span>
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-gray-500">Cleaner Name</p>
          <p className="font-medium text-gray-900 mt-0.5">
            {cleaner?.name || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Email Address</p>
          <p className="font-medium text-gray-900 mt-0.5 break-all">
            {cleaner?.email || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Phone Number</p>
          <p className="font-medium text-gray-900 mt-0.5">
            {cleaner?.phone_number || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Joined Date</p>
          <p className="font-medium text-gray-900 mt-0.5">{formattedDate}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Rating</p>
          <div className="flex items-center gap-1 font-medium text-gray-900 mt-0.5">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{cleaner?.rating ?? "0"}</span>
            <span className="text-xs text-gray-500 font-normal">
              ({cleaner?.total_reviews ?? 0} reviews)
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500">Jobs Completed</p>
          <p className="font-medium text-gray-900 mt-0.5">
            {cleaner?.jobs?.completed ?? 0} / {cleaner?.jobs?.total ?? 0}
            {cleaner?.jobs?.completion_rate != null && (
              <span className="text-xs text-gray-500 font-normal ml-1">
                ({cleaner.jobs.completion_rate}% completion)
              </span>
            )}
          </p>
        </div>

        {cleaner?.location && (
          <div className="sm:col-span-2">
            <p className="text-xs text-gray-500">Location / Address</p>
            <p className="font-medium text-gray-900 mt-0.5 leading-relaxed">
              {cleaner?.location}
            </p>
          </div>
        )}
      </div>

      {/* Amount / Earnings Footer */}
      <div className="flex items-center justify-between border-t pt-3">
        <p className="font-medium text-gray-700">Total Earnings</p>
        <p className="text-lg font-bold text-gray-900">
          ${cleaner?.earnings ?? 0}
        </p>
      </div>
    </div>
  );
}
