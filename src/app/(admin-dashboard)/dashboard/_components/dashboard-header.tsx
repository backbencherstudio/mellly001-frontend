"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import NotificationsIcon from "@/components/icon/Notifications";
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
      .replace(/\b\w/g, (letter) => letter.toUpperCase()) ||
    "Notification"
  );
};

const getNotificationHref = (notification: Notification) => {
  if (notification.targetUrl) return notification.targetUrl;

  const type = notification.type?.toLowerCase() || "";
  const entityId = notification.entityId;

  if (notification.bookingId || type.includes("booking") || type.includes("job")) {
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
    title: "Danger Request",
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
    (item) => !(item.isRead || item.is_read || readIds.includes(item.id))
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
      current.includes(item.id) ? current : [...current, item.id]
    );
    setOpen(false);

    const href = getNotificationHref(item);
    if (href) window.location.assign(href);
  };

  return (
    <div className="w-full sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl lg:text-3xl font-bold text-[#101828] leading-120% pb-3">
            {meta.title}
          </h3>
          <p className="font-normal text-base text-[#4A5565]">{meta.desc}</p>
        </div>

        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setOpen(!open)}
            className="cursor-pointer relative"
          >
            <NotificationsIcon />
            {unReadCount > 0 && (
              <div className="absolute -top-1 right-1">
                <div className="h-3 w-3 bg-red-500 rounded-full" />
              </div>
            )}
          </div>

          {open && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg py-2 z-50 max-h-80 overflow-y-auto">
              {list.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-400">
                  No notifications
                </div>
              ) : (
                <>
                  {list.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNotificationClick(item)}
                      className="px-4 py-2.5 hover:bg-gray-100  border-b border-gray-50 last:border-0"
                    >
                      <div className="w-full text-left">
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {getNotificationLabel(item)}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                          {item.text}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(item.created_at).toLocaleString()}
                        </p>
                      </div>
                    </button>
                  ))}

                  {hasNextPage && (
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="w-full text-center py-2.5 text-sm text-[#03652B] font-medium hover:bg-gray-50 border-t border-gray-100 disabled:opacity-50"
                    >
                      {loadingMore ? "Loading..." : "See All"}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;