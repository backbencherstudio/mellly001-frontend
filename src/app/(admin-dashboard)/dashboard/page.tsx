/** @format */
"use client";

import React from "react";
import {
  ShoppingBag,
  Calendar,
  UserRound,
} from "lucide-react";
import { LuUserPlus } from "react-icons/lu";

type Stat = {
  id: string;
  title: string;
  value: string;
  percent: string;
  bg: string;
  textcolor: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export default function DashboardPage() {
  // 👉 Later: replace this with API data
  const stats: Stat[] = [
    {
      id: "users",
      title: "New Leads",
      value: "48",
      percent: "+12% vs last week",
      icon: LuUserPlus,
      bg: "#EFF6FF",
      textcolor: "#155DFC",
    },
    {
      id: "consults",
      title: "Consults Booked",
      value: "23",
      percent: "+8% vs last week",
      icon: Calendar,
      bg: "#F0FDF4",
      textcolor: "#00A63E",
    },
    {
      id: "simulations",
      title: "Simulations Created",
      value: "35",
      percent: "+15% vs last week",
      icon: ShoppingBag,
      bg: "#FAF5FF",
      textcolor: "#9810FA",
    },
    {
      id: "patients",
      title: "Active Patients",
      value: "142",
      percent: "+5% vs last week",
      icon: UserRound,
      bg: "#FFF7ED",
      textcolor: "#F54900",
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="flex justify-between gap-6 rounded-xl border border-[#E9E9E9] bg-white p-5 shadow-[0px_4px_33px_8px_rgba(0,0,0,0.04)]"
            >
              {/* Left */}
              <div className="space-y-2">
                 <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: item.bg }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{ color: item.textcolor }}
                  />
                </div>
                <p className="text-lg font-medium text-[#444950]">
                  {item.title}
                </p>

                <p className="text-[32px] font-semibold text-[#444950] leading-10">
                  {item.value}
                </p>

               
              </div>

              {/* Right Icon */}
              <div>
                <div className="text-sm text-[#4CAF50]">
                  {item.percent}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
