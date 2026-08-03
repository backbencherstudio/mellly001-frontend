"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import NotificationsIcon from "@/components/icon/Notifications";
import { getSocket } from "@/lib/Socket";
import { useGetAllNotificationQuery } from "@/redux/features/chattingAndSocket/socket";

interface Notification {
  id: string;
  _id?: string;
  read: boolean;
  title?: string;
  message?: string;
  body?: string;
  type?: string;
  sender?: {
    name?: string;
  };
}
interface NotificationResponse {
  data: {
    results: Notification[];
  };
}

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
    title: "Cleaners Request",
    desc: "Manage all homeowner accounts and their activities.",
  },
  "/dashboard/booking": {
    title: "Bookings",
    desc: "Manage all Bookings accounts and their activities.",
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
    desc: "Manage all homeowner accounts and their activities.",
  },
};

const DashboardHeader = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    data: notificationData,
    refetch,
  } = useGetAllNotificationQuery(
    {},
    {
      pollingInterval: 5000,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const allNotifications: Notification[] =
    notificationData?.data?.results ??
    notificationData?.data ??
    [];
  const notifications = allNotifications.slice(0, 10);
  const unReadNotificationCount = allNotifications.filter((item) => item.read === false).length;

  const meta = routeMeta[pathname] ?? {
    title: "Dashboard",
    desc: "Welcome back",
  };

  useEffect(() => {
    const socket = getSocket();

    const handleNewNotification = (data: unknown) => {
      console.log("New notification:", data);
      refetch();
    };

    socket.on("new-notification", handleNewNotification);

    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, [refetch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="w-full  sticky top-0 z-10 ">
      <div className="flex items-center justify-between">
        {/* Left */}
        <div>
          <h3 className="text-2xl lg:text-3xl font-bold text-[#101828] leading-120% pb-3">
            {meta.title}
          </h3>
          <p className="font-normal text-base text-[#4A5565]">{meta.desc}</p>
        </div>

        {/* Right - Notification */}
        <div className="relative" ref={dropdownRef}>
          <div onClick={() => setOpen(!open)} className="cursor-pointer relative">
            <NotificationsIcon />
            {unReadNotificationCount > 0 && (
              <div className="absolute -top-1 right-1">
                <div className="h-3 w-3 bg-red-500 rounded-full"></div>
              </div>
            )}
          </div>

          {open && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg py-2 z-50 max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-400">
                  No notifications
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id || item._id}
                    className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-b border-gray-50 last:border-0"
                  >
                    <Link href="/dashboard/support">
                      <p className="text-sm font-medium text-gray-900">
                        {item.sender?.name || item.title || "Notification"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.type || item.message || item.body}
                      </p></Link>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;