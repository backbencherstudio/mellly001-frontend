"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Trash2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

import { useSocket } from "@/hooks/useSocket";
import type { RealtimeNotification } from "@/lib/socket-types";
import {
  useGetAllNotificationQuery,
  useGetUnreadNotificationCountQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
  type NotificationItem,
} from "@/redux/features/chattingAndSocket/socket";
import { Button } from "@/components/ui/button";
import NotificationDetailModal from "@/components/dashboard/Notification/NotificationDetailModal";

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
  const { socket } = useSocket();

  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<"all" | "unread" | "read">("all");

  // API Queries & Mutations
  const { data, isLoading, isError, refetch } = useGetAllNotificationQuery({
    page,
    perPage: 15,
    ...(filterStatus === "unread" ? { is_read: false } : {}),
    ...(filterStatus === "read" ? { is_read: true } : {}),
  });

  const { data: unreadCountData, refetch: refetchUnreadCount } =
    useGetUnreadNotificationCountQuery();

  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
  const [markAllNotificationsAsRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteAllNotifications, { isLoading: isDeletingAll }] =
    useDeleteAllNotificationsMutation();

  const handleFilterChange = (status: "all" | "unread" | "read") => {
    setFilterStatus(status);
    setPage(1);
  };

  // Real-time socket listener
  useEffect(() => {
    if (!socket) return;

    const handleReceiveNotification = (notif?: RealtimeNotification) => {
      refetch();
      refetchUnreadCount();
      if (notif?.title || notif?.body) {
        toast.info(notif.title || "New Notification", {
          description: notif.body,
        });
      }
    };

    socket.on("receiveNotification", handleReceiveNotification);
    return () => {
      socket.off("receiveNotification", handleReceiveNotification);
    };
  }, [socket, refetch, refetchUnreadCount]);

  const notifications: NotificationItem[] = Array.isArray(data?.data)
    ? data.data
    : [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const totalUnreadCount =
    typeof unreadCountData?.count === "number"
      ? unreadCountData.count
      : typeof data?.unread_count === "number"
      ? data.unread_count
      : notifications.filter((i) => !i.is_read && !i.isRead).length;

  const isItemRead = (item: NotificationItem) => {
    return Boolean(item.isRead || item.is_read);
  };

  const handleMarkAsRead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await markNotificationAsRead(id).unwrap();
      toast.success("Notification marked as read");
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead().unwrap();
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const handleDeleteSingle = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteNotification(id).unwrap();
      toast.success("Notification deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete notification");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete all notifications?")) return;
    try {
      await deleteAllNotifications().unwrap();
      toast.success("All notifications deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete all notifications");
    }
  };

  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  const [selectedNotificationItem, setSelectedNotificationItem] = useState<NotificationItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenDetail = (item: NotificationItem) => {
    setSelectedNotificationId(item.id);
    setSelectedNotificationItem(item);
    setModalOpen(true);
  };

  const handleDirectNavigate = (e: React.MouseEvent, item: NotificationItem) => {
    e.stopPropagation();
    if (!isItemRead(item)) {
      markNotificationAsRead(item.id).unwrap().catch(() => {});
    }
    router.push(getNotificationHref(item));
  };

  return (
    <div className="w-full space-y-6">
      {/* Header card */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#173323]">Notifications</h2>
            {totalUnreadCount > 0 && (
              <span className="rounded-full bg-[#E34D4D]/10 px-2.5 py-0.5 text-xs font-bold text-[#E34D4D]">
                {totalUnreadCount} unread
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-[#718078]">
            Stay updated with booking, incident, application, and registration alerts.
          </p>
        </div>

        {/* Global Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {totalUnreadCount > 0 && (
            <Button
              type="button"
              variant="outline"
              disabled={isMarkingAll}
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 border-[#168044] text-[#168044] hover:bg-[#F2F7F3]"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </Button>
          )}

          {notifications.length > 0 && (
            <Button
              type="button"
              variant="outline"
              disabled={isDeletingAll}
              onClick={handleDeleteAll}
              className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete all
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleFilterChange("all")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              filterStatus === "all"
                ? "bg-[#168044] text-white shadow-sm"
                : "text-[#59675E] hover:bg-gray-100"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => handleFilterChange("unread")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              filterStatus === "unread"
                ? "bg-[#168044] text-white shadow-sm"
                : "text-[#59675E] hover:bg-gray-100"
            }`}
          >
            Unread
            {totalUnreadCount > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  filterStatus === "unread"
                    ? "bg-white text-[#168044]"
                    : "bg-[#E34D4D]/10 text-[#E34D4D]"
                }`}
              >
                {totalUnreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => handleFilterChange("read")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              filterStatus === "read"
                ? "bg-[#168044] text-white shadow-sm"
                : "text-[#59675E] hover:bg-gray-100"
            }`}
          >
            Read
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            refetch();
            refetchUnreadCount();
          }}
          className="text-xs font-semibold text-[#168044] hover:underline cursor-pointer"
        >
          Refresh
        </button>
      </div>

      {/* Notifications List Card */}
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
            <Button
              variant="outline"
              onClick={() => {
                refetch();
                refetchUnreadCount();
              }}
            >
              Retry
            </Button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F2F7F3] text-[#7A9A84]">
              <Bell className="h-6 w-6" />
            </div>
            <p className="text-base font-semibold text-[#173323]">
              {filterStatus === "unread"
                ? "No unread notifications"
                : filterStatus === "read"
                ? "No read notifications"
                : "No notifications found"}
            </p>
            <p className="mt-1 text-sm text-gray-500">You are all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F0F1F0]">
            {notifications.map((item) => {
              const read = isItemRead(item);
              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenDetail(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleOpenDetail(item);
                  }}
                  className={`group flex cursor-pointer select-none items-start justify-between gap-4 p-5 transition-colors hover:bg-[#FBFDFC] ${
                    read ? "bg-white" : "bg-[#F7FBF8]/80"
                  }`}
                >
                  {/* Left content */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1 cursor-pointer">
                    <span
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                        read ? "bg-gray-300" : "bg-[#168044]"
                      }`}
                      title={read ? "Read" : "Unread"}
                    />
                    <div className="min-w-0 flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 cursor-pointer">
                        <p className="text-sm font-semibold text-[#173323] group-hover:text-[#168044] transition-colors cursor-pointer">
                          {getNotificationLabel(item)}
                        </p>
                        {!read && (
                          <span className="rounded-full bg-[#168044]/10 px-2 py-0.5 text-[10px] font-semibold text-[#168044]">
                            New
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-[#59675E] cursor-pointer">
                        {sanitizeTerminology(item.text)}
                      </p>
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-[#9AA8A0] cursor-pointer">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions on row */}
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(item);
                      }}
                      title="View Details"
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-[#F2F7F3] hover:text-[#168044] transition-colors cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    {!read && (
                      <button
                        type="button"
                        onClick={(e) => handleMarkAsRead(e, item.id)}
                        title="Mark as read"
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-[#F2F7F3] hover:text-[#168044] transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => handleDeleteSingle(e, item.id)}
                      title="Delete notification"
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDirectNavigate(e, item)}
                      title="Go to related page"
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#168044] transition-colors cursor-pointer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
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

      {/* Notification Detail Modal */}
      <NotificationDetailModal
        notificationId={selectedNotificationId}
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialData={selectedNotificationItem}
        onNavigate={(href) => router.push(href)}
      />
    </div>
  );
}
