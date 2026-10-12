"use client";

import React from "react";
import { useRouter } from "next/navigation";

import {
  Activity as ActivityIcon,
  Calendar,
  ChevronRight,
  Clock3,
  Clock4,
  DollarSign,
  Users,
  UserCheck,
} from "lucide-react";
import ArrowIcon from "@/components/icon/ArrowIcon";
import DashboardSkeleton from "@/components/loading/DashboardSkeleton";
import {
  useGetActivitiesQuery,
  useGetDashboardOverviewQuery,
} from "@/redux/features/dashboardOverView/dashboardOverView";
import { formatTime } from "@/lib/FormateTime";

// Standard Currency Formatter: $0.00 / $149.00 / $1,644.00
const formatCurrency = (amount: number | string | undefined | null): string => {
  const numericValue = Number(amount) || 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
};

// Title formatter with terminology sanitization
const formatActivityTitle = (title: string): string => {
  if (!title) return "";

  const customMap: Record<string, string> = {
    approve_job_submission: "Job Submission Approved",
    job_approval: "Job Approval Update",
    booking_created: "New Booking Created",
    cleaner_registration: "New Cleaner Application",
    homeowner_registration: "New Homeowner Registration",
    user_registration: "New User Registration",
    new_user_registration: "New User Registration",
    danger_request: "Emergency Request",
    emergency_request: "Emergency Request",
  };

  let formatted = customMap[title];
  if (!formatted) {
    formatted = title
      .replace(/_/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  return formatted
    .replace(/professional\s+maid/gi, "Professional Cleaner")
    .replace(/\bmaid\b/gi, "Cleaner")
    .replace(/\bmaids\b/gi, "Cleaners");
};

// Activity deep-link resolver
const getActivityHref = (item: any): string => {
  if (!item) return "/dashboard";
  if (item?.targetUrl) return item.targetUrl;

  const title = String(item?.title || item?.type || "").toLowerCase();

  // Booking or Job related
  if (
    item?.bookingId ||
    item?.booking_id ||
    title.includes("booking") ||
    title.includes("job")
  ) {
    if (
      title.includes("approval") ||
      title.includes("submission") ||
      title.includes("approve")
    ) {
      return "/dashboard/jobAppruve";
    }
    return "/dashboard/booking";
  }

  // Emergency / Safety Request
  if (
    item?.dangerRequestId ||
    item?.danger_request_id ||
    item?.dangerId ||
    title.includes("danger") ||
    title.includes("emergency") ||
    title.includes("safety")
  ) {
    return "/dashboard/danger-request";
  }

  // Cleaner Application
  if (
    item?.applicationId ||
    item?.application_id ||
    title.includes("cleaner_registration") ||
    title.includes("cleaner_application") ||
    title.includes("cleaner application") ||
    (title.includes("registration") && title.includes("cleaner"))
  ) {
    return "/dashboard/cleaner-request";
  }

  // Cleaner management
  if (item?.cleanerId || item?.cleaner_id) {
    return "/dashboard/cleaners";
  }

  // Homeowner
  if (
    item?.homeownerId ||
    item?.homeowner_id ||
    title.includes("homeowner")
  ) {
    return "/dashboard/homeowners";
  }

  // New User Registration
  if (
    title.includes("user") ||
    title.includes("registration") ||
    title.includes("registered")
  ) {
    if (title.includes("cleaner")) {
      return "/dashboard/cleaner-request";
    }
    return "/dashboard/homeowners";
  }

  // Approvals
  if (
    item?.jobApprovalId ||
    item?.job_approval_id ||
    title.includes("approval")
  ) {
    return "/dashboard/jobAppruve";
  }

  // Payments
  if (
    title.includes("payment") ||
    title.includes("transaction") ||
    title.includes("revenue")
  ) {
    return "/dashboard/payments";
  }

  return "/dashboard";
};

type Stat = {
  id: string;
  title: string;
  value: string;
  bg: string;
  textcolor: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type RecentActivityItem = {
  id: number;
  title: string;
  name: string;
  time: string;
  sender?: {
    name?: string;
  };
  created_at: string;
  bg: string;
  raw: any;
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: activity, isLoading: isActivityLoading } = useGetActivitiesQuery({});
  const { data, isLoading: isOverviewLoading } = useGetDashboardOverviewQuery({});

  const stats: Stat[] = [
    {
      id: "1",
      title: "Total Homeowners",
      value: data?.data?.total_homeowners ?? "0",
      icon: Users,
      bg: "#2B7FFF",
      textcolor: "#155DFC",
    },
    {
      id: "2",
      title: "Total Cleaners",
      value: data?.data?.total_cleaners ?? "0",
      icon: UserCheck,
      bg: "#00C950",
      textcolor: "#00A63E",
    },
    {
      id: "3",
      title: "Active Bookings",
      value: data?.data?.active_bookings ?? "0",
      icon: Calendar,
      bg: "#AD46FF",
      textcolor: "#9810FA",
    },
    {
      id: "4",
      title: "Total Revenue",
      value: formatCurrency(data?.data?.total_revenue),
      icon: DollarSign,
      bg: "#F0B100",
      textcolor: "#F54900",
    },
    {
      id: "5",
      title: "Completed Jobs",
      value: data?.data?.completed_bookings ?? "0",
      icon: ArrowIcon,
      bg: "#615FFF",
      textcolor: "#155DFC",
    },
    {
      id: "6",
      title: "Pending Approvals",
      value: data?.data?.pending_bookings ?? "0",
      icon: Clock4,
      bg: "#FF6900",
      textcolor: "#00A63E",
    },
  ];

  const activityRows = activity?.data?.data?.slice(0, 10) || [];

  const activityList: RecentActivityItem[] =
    activityRows.map((item: any, index: number) => ({
      id: index + 1,
      bg: ["#AD46FF", "#00C950", "#2B7FFF", "#615FFF", "#F0B100"][index % 5],
      title: formatActivityTitle(item?.title || item?.type),
      name:
        item?.sender?.name ||
        item?.name ||
        item?.user_name ||
        "Unknown user",
      time: item?.created_at || item?.time || new Date().toISOString(),
      sender: item?.sender,
      created_at: item?.created_at || "",
      raw: item,
    })) || [];

  if (isActivityLoading || isOverviewLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="w-full space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="flex justify-between gap-6 rounded-xl border border-[#E9E9E9] bg-white p-5 shadow-[0px_4px_33px_8px_rgba(0,0,0,0.04)]"
            >
              <div className="flex justify-between w-full">
                <div className="space-y-1">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: item.bg }}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm font-normal text-[#4A5565]">
                    {item.title}
                  </p>
                </div>
                <p className="text-3xl font-bold text-[#101828] leading-100%">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0px_4px_24px_4px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between border-b border-[#EEF0EF] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF7EF] text-[#168044]">
              <ActivityIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-[#032B15]">
              Recent Activity
            </h3>
          </div>
          <span className="rounded-full bg-[#F2F7F3] px-3 py-1 text-xs font-semibold text-[#168044]">
            {activityList.length}
          </span>
        </div>

        {activityList.length > 0 ? (
          <div className="divide-y divide-[#F0F1F0] px-6">
            {activityList.map((item) => {
              const href = getActivityHref(item.raw);
              return (
                <div
                  key={item.id}
                  onClick={() => router.push(href)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      router.push(href);
                    }
                  }}
                  className="group flex cursor-pointer items-center justify-between gap-4 py-4 transition-colors hover:bg-[#FBFDFC] focus:outline-none"
                  title="Click to view related record"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div className="relative flex w-9 shrink-0 justify-center">
                      <span
                        className="relative z-10 mt-1 h-3 w-3 rounded-full border-[3px] border-white shadow-[0_0_0_2px_var(--activity-color)]"
                        style={{
                          "--activity-color": item.bg,
                          backgroundColor: item.bg,
                        } as React.CSSProperties}
                        aria-hidden="true"
                      />
                      <span className="absolute top-5 bottom-[-1.25rem] w-px bg-[#E8ECE9] group-last:hidden" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm font-semibold text-[#183324] group-hover:text-[#168044] transition-colors">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-[#7A817D]">
                        {item.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-[#737B76]">
                      <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                      {formatTime(item.time)}
                    </p>
                    <ChevronRight className="h-4 w-4 text-[#A1ACA5] transition-transform group-hover:translate-x-0.5 group-hover:text-[#168044]" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#F2F7F3] text-[#7A9A84]">
              <Clock3 className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-[#33483A]">
              No recent activity
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
