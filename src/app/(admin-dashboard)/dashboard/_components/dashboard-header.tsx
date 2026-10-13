"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";

import { toast } from "sonner";
import { useSocket } from "@/hooks/useSocket";
import type { RealtimeNotification } from "@/lib/socket-types";
import {
  useGetAllNotificationQuery,
  useLazyGetAllNotificationQuery,
  useGetUnreadNotificationCountQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "@/redux/features/chattingAndSocket/socket";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Notification {
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

const getNotificationLabel = (notification: Notification) => {
  const type = notification.type ?? "";
  if (notificationLabels[type]) return sanitizeTerminology(notificationLabels[type]);
  const raw =
    type
      ?.replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Notification";
  return sanitizeTerminology(raw);
};

const getNotificationHref = (notification: Notification): string => {
  if (notification.targetUrl) return notification.targetUrl;

  const type = (notification.type ?? "").toLowerCase();
  const text = (notification.text ?? "").toLowerCase();

  // Booking or Job related
  if (
    notification.bookingId ||
    type.includes("booking") ||
    type.includes("job") ||
    text.includes("booking")
  ) {
    if (
      type.includes("approval") ||
      type.includes("submission") ||
      text.includes("approval") ||
      text.includes("submission")
    ) {
      return "/dashboard/jobAppruve";
    }
    return "/dashboard/booking";
  }

  if (
    notification.dangerRequestId ||
    type.includes("danger") ||
    type.includes("emergency") ||
    type.includes("safety") ||
    text.includes("danger") ||
    text.includes("emergency")
  ) {
    return "/dashboard/danger-request";
  }

  if (
    notification.applicationId ||
    type.includes("cleaner_registration") ||
    type.includes("cleaner_application") ||
    type.includes("cleaner_request") ||
    text.includes("cleaner application") ||
    (type.includes("registration") && text.includes("cleaner"))
  ) {
    return "/dashboard/cleaner-request";
  }

  if (notification.cleanerId) return "/dashboard/cleaners";

  if (notification.homeownerId || type.includes("homeowner") || text.includes("homeowner")) {
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

  if (notification.jobApprovalId || type.includes("approval") || text.includes("approval")) {
    return "/dashboard/jobAppruve";
  }

  if (
    type.includes("payment") ||
    type.includes("transaction") ||
    text.includes("payment") ||
    text.includes("transaction")
  ) {
    return "/dashboard/payments";
  }

  return "/dashboard";
};

const routeMeta: Record<string, { title: string; desc: string }> = {
  "/dashboard": {
    title: "Dashboard Overview",
    desc: "Welcome back! Here's what's happening with your service today.",
  },
  "/dashboard/homeowners": {
    title: "Homeowners",
    desc: "Manage all homeowner accounts and their activities.",
  },
  "/dashboard/cleaners": {
    title: "Cleaners",
    desc: "Manage all cleaner accounts and their activities.",
  },
  "/dashboard/cleaner-request": {
    title: "Cleaner Applications",
    desc: "Review and manage cleaner applications, documents, and verification status.",
  },
  "/dashboard/booking": {
    title: "Bookings",
    desc: "Manage and monitor all service bookings.",
  },
  "/dashboard/payments": {
    title: "Payments",
    desc: "View and manage payment transactions.",
  },
  "/dashboard/jobAppruve": {
    title: "Job Approvals",
    desc: "Approve or reject job requests from homeowners.",
  },
  "/dashboard/danger-request": {
    title: "Emergency Requests",
    desc: "Review, acknowledge, and resolve urgent safety incidents.",
  },
};

const STORAGE_KEY = "cleen_admin_read_notification_ids";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const DashboardHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { socket } = useSocket();

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [moreItems, setMoreItems] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load persisted read-state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setReadIds(parsed);
      }
    } catch {
      // localStorage not available (SSR guard)
    }
  }, []);

  const { data: firstData, refetch } = useGetAllNotificationQuery({
    page: 1,
    perPage: 10,
  });

  const { data: unreadCountData, refetch: refetchUnreadCount } =
    useGetUnreadNotificationCountQuery();

  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
  const [markAllNotificationsAsRead] = useMarkAllNotificationsAsReadMutation();

  const [fetchMore] = useLazyGetAllNotificationQuery();

  const firstItems: Notification[] = Array.isArray(firstData?.data) ? firstData.data : [];
  const list = [...firstItems, ...moreItems];
  const totalPages = firstData?.pagination?.totalPages ?? 1;
  const hasNextPage = page < totalPages;

  // ---------------------------------------------------------------------------
  // Real-time: listen for receiveNotification (backend legacy relay).
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!socket) return;

    const handleReceiveNotification = (notif?: RealtimeNotification) => {
      // Reset pagination and refresh the first page of the inbox + unread count
      setPage(1);
      setMoreItems([]);
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

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  const isItemRead = (item: Notification) =>
    Boolean(item.isRead || item.is_read || readIds.includes(item.id));

  const unReadCount =
    typeof unreadCountData?.count === "number"
      ? unreadCountData.count
      : typeof firstData?.unread_count === "number"
      ? firstData.unread_count
      : list.filter((item) => !isItemRead(item)).length;

  const meta = routeMeta[pathname] ?? { title: "Dashboard", desc: "Welcome back" };

  const loadMore = async () => {
    if (loadingMore || !hasNextPage) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await fetchMore({ page: nextPage, perPage: 10 }).unwrap();
      const newItems: Notification[] = Array.isArray(res?.data) ? res.data : [];
      setMoreItems((prev) => {
        const existingIds = new Set([
          ...firstItems.map((i) => i.id),
          ...prev.map((i) => i.id),
        ]);
        return [...prev, ...newItems.filter((i) => !existingIds.has(i.id))];
      });
      setPage(nextPage);
    } catch {
      // silently fail — user can retry by clicking again
    } finally {
      setLoadingMore(false);
    }
  };

  const markAsRead = async (id: string) => {
    setReadIds((current) => {
      if (current.includes(id)) return current;
      const updated = [...current, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      await markNotificationAsRead(id).unwrap();
    } catch (err) {
      console.error("Failed to mark notification as read on backend:", err);
    }
  };

  const markAllAsRead = async () => {
    const allIds = Array.from(new Set([...list.map((i) => i.id), ...readIds]));
    setReadIds(allIds);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allIds));
    } catch {}

    try {
      await markAllNotificationsAsRead().unwrap();
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error("Failed to mark all notifications as read on backend:", err);
    }
  };

  const handleNotificationClick = (item: Notification) => {
    markAsRead(item.id);
    setOpen(false);
    router.push(getNotificationHref(item));
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="flex h-full w-full min-w-0 items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold leading-tight text-[#173323] sm:text-2xl">
          {meta.title.trim()}
        </h1>
        <p className="mt-1 hidden max-w-2xl truncate text-sm text-[#718078] sm:block">
          {meta.desc}
        </p>
      </div>

      {/* Notification bell */}
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={
            unReadCount > 0 ? `Notifications, ${unReadCount} unread` : "Notifications"
          }
          aria-expanded={open}
          aria-haspopup="true"
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#E3EAE5] bg-white text-[#345342] shadow-sm transition hover:border-[#B8D5C1] hover:bg-[#F7FBF8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168044] focus-visible:ring-offset-2"
        >
          <Bell className="h-5 w-5 cursor-pointer" aria-hidden="true" />
          {unReadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#E34D4D] px-1 text-[10px] font-bold leading-none text-white">
              {unReadCount > 9 ? "9+" : unReadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-full z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#E3EAE5] bg-white shadow-[0px_16px_40px_rgba(16,40,26,0.14)]">
            {/* Dropdown header */}
            <div className="flex items-center justify-between border-b border-[#EEF2EF] px-4 py-3.5">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-[#173323]">Notifications</h2>
                {unReadCount > 0 && (
                  <span className="rounded-full bg-[#E34D4D]/10 px-2 py-0.5 text-xs font-semibold text-[#E34D4D]">
                    {unReadCount} unread
                  </span>
                )}
              </div>
              {unReadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-[#168044] transition hover:underline"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all as read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {list.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <Bell className="mx-auto mb-2 h-5 w-5 text-[#9AA8A0]" aria-hidden="true" />
                  <p className="text-sm font-medium text-[#53645A]">No notifications</p>
                </div>
              ) : (
                <>
                  {list.map((item) => {
                    const read = isItemRead(item);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNotificationClick(item)}
                        className={`w-full border-b border-[#F0F3F1] px-4 py-3 text-left transition last:border-0 hover:bg-[#F7FBF8] ${
                          read ? "bg-white opacity-80" : "bg-[#F4F9F5]/70"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-[#243B2E]">
                            {getNotificationLabel(item)}
                          </p>
                          {!read && (
                            <span
                              className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#168044]"
                              title="Unread"
                            />
                          )}
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#718078]">
                          {sanitizeTerminology(item.text)}
                        </p>
                        <p className="mt-2 text-[10px] font-medium text-[#9AA8A0]">
                          {new Date(item.created_at).toLocaleString()}
                        </p>
                      </button>
                    );
                  })}

                  {hasNextPage && (
                    <button
                      type="button"
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="w-full border-t border-[#EEF2EF] py-3 text-sm font-semibold text-[#168044] transition hover:bg-[#F7FBF8] disabled:opacity-50"
                    >
                      {loadingMore ? "Loading..." : "Load more"}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
