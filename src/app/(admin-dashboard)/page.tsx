"use client";

import React from "react";

import {
  Activity as ActivityIcon,
  Calendar,
  Clock3,
  Clock4,
  DollarSign,
  Users,
  UserCheck,
} from "lucide-react";
import { LuUserPlus } from "react-icons/lu";
import ArrowIcon from "@/components/icon/ArrowIcon";
import DashboardSkeleton from "@/components/loading/DashboardSkeleton";
import {
  useGetActivitiesQuery,
  useGetDashboardOverviewQuery,
  useGetUsersQuery,
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

// Title-er protita shobder prothom letter capital korar helper function
const formatActivityTitle = (title: string): string => {
  if (!title) return "";

  const customMap: Record<string, string> = {
    approve_job_submission: "Job Submission Approved",
  };

  if (customMap[title]) {
    return customMap[title];
  }

  return title
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

type Stat = {
  id: string;
  title: string;
  value: string;
  bg: string;
  textcolor: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type recent = {
  id: number;
  title: string;
  name: string;
  time: string;
  sender: {
    name: string;
  };
  created_at: string;
  bg: string;
};

export default function DashboardPage() {
  const { data: activity, isLoading: isActivityLoading } = useGetActivitiesQuery({});

  const { data, isLoading: isOverviewLoading } = useGetDashboardOverviewQuery({});
  // console.log(data)
  //  Later: replace this with API data
  const stats: Stat[] = [
    {
      id: "1",
      title: "Total Homeowners",
      value: data?.data?.total_homeowners,

      icon: Users,
      bg: "#2B7FFF",
      textcolor: "#155DFC",
    },
    {
      id: "2",
      title: "Total Cleaners",
      value: data?.data?.total_cleaners,

      icon: UserCheck,
      bg: "#00C950",
      textcolor: "#00A63E",
    },
    {
      id: "3",
      title: "Active Bookings",
      value: data?.data?.active_bookings,

      icon: Calendar,
      bg: "#AD46FF",
      textcolor: "#9810FA",
    },
    {
      id: "4",
      title: "Total Revenue",
      // Shudhu 4 no item-er jonno currency format kora hoyeche
      value: formatCurrency(data?.data?.total_revenue),

      icon: DollarSign,
      bg: "#F0B100",
      textcolor: "#F54900",
    },
    {
      id: "5",
      title: "Completed Jobs",
      value: data?.data?.completed_bookings,

      icon: ArrowIcon,
      bg: "#615FFF",
      textcolor: "#155DFC",
    },
    {
      id: "6",
      title: "Pending Approvals",
      value: data?.data?.pending_bookings,

      icon: Clock4,
      bg: "#FF6900",
      textcolor: "#00A63E",
    },
  ];
  const activitys = activity?.data?.data?.slice(0, 10) || [];
  // console.log(activitys, "dfsdfd")

  const Activity: recent[] =
    activitys?.map((item: recent, index: number) => ({
      id: index + 1,
      bg: ["#AD46FF", "#00C950", "#2B7FFF", "#615FFF", "#F0B100"][index % 5],
      title: formatActivityTitle(item.title),
      name: item.sender?.name,
      time: item.created_at,
      sender: item.sender,
      created_at: item.created_at,
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
              {/* Left */}
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

              {/* Right Icon */}
              {/* <div>
                  <div className="text-sm text-[#4CAF50] bg-[#F0FDF4] rounded-sm">
                    <p className="px-2 py-1">{item.percent}</p>
                  </div>
                </div> */}
            </div>
          );
        })}
      </div>
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
            {Activity.length}
          </span>
        </div>

        {Activity.length > 0 ? (
          <div className="divide-y divide-[#F0F1F0] px-6">
            {Activity.map((item) => (
              <div
                key={item.id}
                className="group flex gap-4 py-5 transition-colors hover:bg-[#FBFDFC]"
              >
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
                <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-[#183324]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-[#7A817D]">
                      {item.name || "Unknown user"}
                    </p>
                  </div>
                  <p className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-[#737B76] sm:pt-0.5">
                    <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                    {formatTime(item.time)}
                  </p>
                </div>
              </div>
            ))}
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
