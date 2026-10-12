"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Clock, ExternalLink } from "lucide-react";
import {
  useGetAllNotificationQuery,
} from "@/redux/features/chattingAndSocket/socket";
import { Button } from "@/components/ui/button";

interface NotificationItem {
  id: string;
  text: string;
  created_at: string;
  type?: string;
  isRead?: boolean;
  is_read?: boolean;
  targetUrl?: string;
  entityId?: string;
  bookingId?: string;
  applicationId?: string;
  homeownerId?: string;
  cleanerId?: string;
  jobApprovalId?: string;
  dangerRequestId?: string;
  sender?: { name?: string } | null;
}

const STORAGE_KEY = "cleen_admin_read_notification_ids";

const sanitizeTerminology = (text?: string | null): string => {
  if (!text) return "";
  return text
    .replace(/professional\s+maid/gi, "Professional Cleaner")
    .replace(/\bmaid\b/gi, "cleaner")
    .replace(/\bmaids\b/gi, "cleaners")
    .replace(/\bMaid\b/g, "Cleaner")
    .replace(/\bMaids\b/g, "Cleaners");
};

const notificationLabels: Record<string, string> = {
  approve_job_submission: "Job Approval Submitted",
  job_approval: "Job Approval Update",
  booking_created: "New Booking",
  booking_updated: "Booking Updated",
  cleaner_registration: "New Cleaner Application",
  homeowner_registration: "New Homeowner Registration",
  user_registration: "New User Registration",
  new_user_registration: "New User Registration",
  danger_request: "Emergency Request",
  emergency_request: "Emergency Request",
};

const getNotificationLabel = (item: NotificationItem) => {
  const type = item.type || "";
  if (notificationLabels[type]) {
    return sanitizeTerminology(notificationLabels[type]);
  }
  const raw =
    type
      ?.replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Notification";
  return sanitizeTerminology(raw);
};

const getNotificationHref = (item: NotificationItem): string => {
  if (item.targetUrl) return item.targetUrl;

  const type = (item.type || "").toLowerCase();
  const text = (item.text || "").toLowerCase();

  if (
    item.bookingId ||
    type.includes("booking") ||
    type.includes("job") ||
    text.includes("booking")
  ) {
    if (
      type.includes("approval") ||
      type.includes("submission") ||
      text.includes("approval")
    ) {
      return "/dashboard/jobAppruve";
    }
    return "/dashboard/booking";
  }

  if (
    item.dangerRequestId ||
    type.includes("danger") ||
    type.includes("emergency") ||
    type.includes("safety") ||
    text.includes("danger") ||
    text.includes("emergency")
  ) {
    return "/dashboard/danger-request";
  }

  if (
    item.applicationId ||
    type.includes("cleaner_registration") ||
    type.includes("cleaner_application") ||
    type.includes("cleaner_request") ||
    text.includes("cleaner application") ||
    (type.includes("registration") && text.includes("cleaner"))
  ) {
    return "/dashboard/cleaner-request";
  }

  if (item.cleanerId) return "/dashboard/cleaners";
  if (item.homeownerId || type.includes("homeowner") || text.includes("homeowner")) {
    return "/dashboard/homeowners";
  }

  if (
    type.includes("user") ||
    type.includes("registration") ||
    text.includes("registration") ||
    text.includes("registered")
  ) {
    if (text.includes("cleaner") || type.includes("cleaner")) {
      return "/dashboard/cleaner-request";
    }
    return "/dashboard/homeowners";
  }

  if (item.jobApprovalId || type.includes("approval") || text.includes("approval")) {
    return "/dashboard/jobAppruve";
  }

  if (type.includes("payment") || type.includes("transaction") || text.includes("payment")) {
    return "/dashboard/payments";
  }

  return "/dashboard";
};

export default function NotificationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setReadIds(parsed);
      }
    } catch {}
  }, []);

  const { data, isLoading, isError, refetch } = useGetAllNotificationQuery({
    page,
    perPage: 15,
  });

  const notifications: NotificationItem[] = Array.isArray(data?.data)
    ? data.data
    : [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const isItemRead = (item: NotificationItem) => {
    return Boolean(item.isRead || item.is_read || readIds.includes(item.id));
  };

  const markAsRead = (id: string) => {
    setReadIds((current) => {
      if (current.includes(id)) return current;
      const updated = [...current, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const markAllAsRead = () => {
    const allIds = Array.from(new Set([...notifications.map((i) => i.id), ...readIds]));
    setReadIds(allIds);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allIds));
    } catch {}
  };

  const handleClick = (item: NotificationItem) => {
    markAsRead(item.id);
    const href = getNotificationHref(item);
    router.push(href);
  };

  const unreadCount = notifications.filter((i) => !isItemRead(i)).length;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#173323]">Notifications</h2>
          <p className="mt-1 text-sm text-[#718078]">
            Stay updated with booking, incident, application, and registration alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={markAllAsRead}
            className="flex items-center gap-2 border-[#168044] text-[#168044] hover:bg-[#F2F7F3]"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-sm text-red-600">Failed to load notifications.</p>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F2F7F3] text-[#7A9A84]">
              <Bell className="h-6 w-6" />
            </div>
            <p className="text-base font-semibold text-[#173323]">No notifications found</p>
            <p className="mt-1 text-sm text-gray-500">You are all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F0F1F0]">
            {notifications.map((item) => {
              const read = isItemRead(item);
              return (
                <div
                  key={item.id}
                  onClick={() => handleClick(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleClick(item);
                  }}
                  className={`group flex cursor-pointer items-start justify-between gap-4 p-5 transition-colors hover:bg-[#FBFDFC] ${
                    read ? "bg-white" : "bg-[#F7FBF8]/80"
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <span
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                        read ? "bg-gray-300" : "bg-[#168044]"
                      }`}
                      title={read ? "Read" : "Unread"}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[#173323] group-hover:text-[#168044] transition-colors">
                          {getNotificationLabel(item)}
                        </p>
                        {!read && (
                          <span className="rounded-full bg-[#168044]/10 px-2 py-0.5 text-[10px] font-semibold text-[#168044]">
                            New
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-[#59675E]">
                        {sanitizeTerminology(item.text)}
                      </p>
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-[#9AA8A0]">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center text-[#718078] group-hover:text-[#168044] transition-colors">
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#EEF2EF] px-6 py-4">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="text-xs"
            >
              Previous
            </Button>
            <span className="text-xs font-medium text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="text-xs"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
