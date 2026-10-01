"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Bell, Circle } from "lucide-react";

import { getSocket } from "@/lib/Socket";

import {
  useGetAllNotificationQuery,
  useLazyGetAllNotificationQuery,
} from "@/redux/features/chattingAndSocket/socket";

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

const notificationLabels: Record<string, string> = {
  approve_job_submission: "Job Approval Submitted",
  job_approval: "Job Approval Update",
  booking_created: "New Booking",
  booking_updated: "Booking Updated",
  cleaner_registration: "New Cleaner Application",
  homeowner_registration: "New Homeowner Registration",
  danger_request: "Urgent Safety Request",
};

const getNotificationLabel = (notification: Notification) => {
  if (notification.type && notificationLabels[notification.type]) {
    return notificationLabels[notification.type];
  }

  return (
    notification.type
      ?.replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Notification"
  );
};

const getNotificationHref = (notification: Notification) => {
  if (notification.targetUrl) return notification.targetUrl;

  const type = notification.type?.toLowerCase() || "";
  const entityId = notification.entityId;

  if (
    notification.bookingId ||
    type.includes("booking") ||
    type.includes("job")
  ) {
    return "/dashboard/booking";
  }

  if (notification.applicationId || type.includes("cleaner")) {
    return "/dashboard/cleaner-request";
  }

  if (notification.homeownerId || type.includes("homeowner")) {
    return "/dashboard/homeowners";
  }

  if (notification.cleanerId) return "/dashboard/cleaners";
  if (notification.jobApprovalId || type.includes("approval")) {
    return "/dashboard/jobAppruve";
  }
  if (notification.dangerRequestId || type.includes("danger")) {
    return "/dashboard/danger-request";
  }

  return entityId ? "/dashboard" : null;
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
    title: "Cleaner Applications ",
    desc: "Review and manage cleaner applications, documents, and verification status",
  },
  "/dashboard/booking": {
    title: "Bookings",
    desc: "Manage and monitor all service bookings",
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

const DashboardHeader = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [moreItems, setMoreItems] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: firstData, refetch } = useGetAllNotificationQuery({
    page: 1,
    perPage: 10,
  });

  const [fetchMore] = useLazyGetAllNotificationQuery();

  const firstItems: Notification[] = Array.isArray(firstData?.data)
    ? firstData.data
    : [];

  const list = [...firstItems, ...moreItems];
  const totalPages = firstData?.pagination?.totalPages ?? 1;
  const hasNextPage = page < totalPages;

  const unReadCount = list.filter(
    (item) => !(item.isRead || item.is_read || readIds.includes(item.id)),
  ).length;

  const meta = routeMeta[pathname] ?? {
    title: "Dashboard",
    desc: "Welcome back",
  };

  // Socket
  useEffect(() => {
    const socket = getSocket();
    const onNew = () => {
      setPage(1);
      setMoreItems([]);
      refetch();
    };
    socket.on("new-notification", onNew);
    return () => {
      socket.off("new-notification", onNew);
    };
  }, [refetch]);

  // Outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

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
        const unique = newItems.filter((i) => !existingIds.has(i.id));
        return [...prev, ...unique];
      });
      setPage(nextPage);
    } catch (err) {
      console.error("Load more failed:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleNotificationClick = (item: Notification) => {
    setReadIds((current) =>
      current.includes(item.id) ? current : [...current, item.id],
    );
    setOpen(false);

    const href = getNotificationHref(item);
    if (href) window.location.assign(href);
  };

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

      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={
            unReadCount > 0
              ? `Notifications, ${unReadCount} unread`
              : "Notifications"
          }
          aria-expanded={open}
          aria-haspopup="true"
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#E3EAE5] bg-white text-[#345342] shadow-sm transition hover:border-[#B8D5C1] hover:bg-[#F7FBF8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168044] focus-visible:ring-offset-2"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          {unReadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#E34D4D] px-1 text-[10px] font-bold leading-none text-white">
              {unReadCount > 9 ? "9+" : unReadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-full z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#E3EAE5] bg-white shadow-[0px_16px_40px_rgba(16,40,26,0.14)]">
            <div className="flex items-center justify-between border-b border-[#EEF2EF] px-4 py-3.5">
              <h2 className="text-sm font-semibold text-[#173323]">
                Notifications
              </h2>
              {unReadCount > 0 && (
                <span className="text-xs font-medium text-[#718078]">
                  {unReadCount} unread
                </span>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {list.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <Bell className="mx-auto mb-2 h-5 w-5 text-[#9AA8A0]" aria-hidden="true" />
                  <p className="text-sm font-medium text-[#53645A]">
                    No notifications
                  </p>
                </div>
              ) : (
                <>
                  {list.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNotificationClick(item)}
                      className="w-full border-b border-[#F0F3F1] px-4 py-3 text-left transition last:border-0 hover:bg-[#F7FBF8]"
                    >
                      <p className="text-sm font-semibold text-[#243B2E]">
                        {getNotificationLabel(item)}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#718078]">
                        {item.text}
                      </p>
                      <p className="mt-2 text-[10px] font-medium text-[#9AA8A0]">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </button>
                  ))}

                  {hasNextPage && (
                    <button
                      type="button"
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="w-full border-t border-[#EEF2EF] py-3 text-sm font-semibold text-[#168044] transition hover:bg-[#F7FBF8] disabled:opacity-50"
                    >
                      {loadingMore ? "Loading..." : "See All"}
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
