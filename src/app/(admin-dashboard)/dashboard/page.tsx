/** @format */
"use client";

import React from "react";
import {
  Calendar,
  Users,
  UserCheck,
  DollarSign,
  Clock4,
} from "lucide-react";
import { LuUserPlus } from "react-icons/lu";
import ArrowIcon from "@/components/icon/ArrowIcon";

type Stat = {
  id: string;
  title: string;
  value: string;
  percent: string;
  bg: string;
  textcolor: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type recent ={
  id:number;
  title: string;
  name:string;
  time:string;
  bg:string;
}

export default function DashboardPage() {
  // 👉 Later: replace this with API data
  const stats: Stat[] = [
    {
      id: "users",
      title: "Total Homeowners",
      value: "1,248",
      percent: "+12%",
      icon: Users   ,
      bg: "#2B7FFF",
      textcolor: "#155DFC",
    },
    {
      id: "consults",
      title: "Total Cleaners",
      value: "342",
      percent: "+8%",
      icon: UserCheck ,
      bg: "#00C950",
      textcolor: "#00A63E",
    },
    {
      id: "simulations",
      title: "Active Bookings",
      value: "86",
      percent: "+5%",
      icon: Calendar ,
      bg: "#AD46FF",
      textcolor: "#9810FA",
    },
    {
      id: "patients",
      title: "Total Revenue",
      value: "$45,231",
      percent: "+23%",
      icon: DollarSign ,
      bg: "#F0B100",
      textcolor: "#F54900",
    },
    {
      id: "users",
      title: "Completed Jobs",
      value: "2,847",
      percent: "+18%",
      icon: ArrowIcon,
      bg: "#615FFF",
      textcolor: "#155DFC",
    },
    {
      id: "consults",
      title: "Pending Approvals",
      value: "12",
      percent: "-3%",
      icon: Clock4 ,
      bg: "#FF6900",
      textcolor: "#00A63E",
    },
  
  ];

  const Activity: recent[] =[
    {
      id:1,
      bg: "#AD46FF",
      title:"New booking created",
      name:"Sarah Johnson",
      time:"5 minutes ago"
    },

    {
      id:2,
      bg:" #00C950",
      title:"Payment received",
      name:"Michael Chen",
      time:"12 minutes ago"
    },
      {
      id:1,
      bg: "#2B7FFF",
      title:"Cleaner registered",
      name:"Emma Wilson",
      time:"1 hour ago"
    },

    {
      id:2,
      bg:" #615FFF",
      title:"Job completed",
      name:"David Brown",
      time:"2 hours ago"
    },
      {
      id:1,
      bg: "#F0B100",
      title:"New homeowner signed up",
      name:"Lisa Anderson",
      time:"3 hours ago"
    },

   
  ]

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
              <div className="space-y-2">
                 <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: item.bg }}
                >
                  <Icon
                    className="h-5 w-5 text-white"
                    
                  />
                </div>
                <p className="text-sm font-normal text-[#4A5565]">
                  {item.title}
                </p>

                <p className="text-3xl font-bold text-[#101828] leading-100%">
                  {item.value}
                </p>

               
              </div>

              {/* Right Icon */}
              <div>
                <div className="text-sm text-[#4CAF50] bg-[#F0FDF4] rounded-sm">
                  <p className="px-2 py-1">{item.percent}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className=" border border-[#E5E7EB] rounded-2xl">
     
<div className="p-6">
   <h3 className="text-[#032B15] text-[20px] font-bold leading-100% pb-[26px]">Recent Activity</h3>
            <div className="space-y-4">
            {
              Activity.map((index)=>{
                return <div key={index.id} className="">
                  <div className="">
                    <div className="flex justify-between">
                  <div className="flex gap-3">
                      <div className="w-3 h-3 rounded-full flex  flex-col justify-center items-center my-auto" style={{backgroundColor: index.bg}}></div>
                   <div>
                     <p className="text-[#032B15] text-base font-normal leading-100%">{index.title}</p>
                    <p className="text-[#787878] font-normal leading-140% text-sm pt-2.5">{index.name}</p>
                   </div>
                  </div>
                    <p className="text-[#676968] font-normal leading-140% text-sm flex justify-center text-center items-center">{index.time}</p>
                 
                  </div>
                  <hr className="mt-3"/>
                  </div>
                
                </div>
            
              })
            }
          </div>
</div>
      </div>
    </div>
  );
}
