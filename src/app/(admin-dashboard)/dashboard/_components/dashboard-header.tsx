/** @format */
"use client";

import NotificationsIcon from "@/components/icon/Notifications";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineNotificationsActive } from "react-icons/md";

const routeMeta: Record<
  string,
  { title: string; desc: string }
> = {
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
};

const DashboardHeader = () => {
  const pathname = usePathname();

  const meta = routeMeta[pathname] ?? {
    title: "Dashboard",
    desc: "Welcome back",
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="">
          <h3 className="text-2xl lg:text-3xl font-bold text-[#101828] leading-120% pb-3">{meta.title}</h3>
          <p className="font-normal text-base text-[#4A5565]">
            {meta.desc}
          </p>
        </div>

        {/* Right */}
       <div className="relative">
         <div>
            <Link href="#">
          <NotificationsIcon />
        </Link>
        </div>
        <div className="absolute top-0 right-0">
            <div className="h-3 w-3 bg-red-500 rounded-full"></div>
        </div>
       </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
