/** @format */
"use client";

import React from "react";
import { Upload, Sparkles, Calendar, MessageSquare } from "lucide-react";

type ActivityItem = {
  id: number;
  icon: React.ReactNode;
  title: string;
  time: string;
};

const activities: ActivityItem[] = [
  {
    id: 1,
    icon: <Upload size={18} />,
    title: "New photo uploaded for Maria Santos",
    time: "5 min ago",
  },
  {
    id: 2,
    icon: <Sparkles size={18} />,
    title: "Simulation completed for João Silva",
    time: "15 min ago",
  },
  {
    id: 3,
    icon: <Calendar size={18} />,
    title: "Consult booked: Ana Costa – Jan 28, 2pm",
    time: "1 hour ago",
  },
  {
    id: 4,
    icon: <MessageSquare size={18} />,
    title: "New WhatsApp message from Carlos Rocha",
    time: "2 hours ago",
  },
  {
    id: 5,
    icon: <Upload size={18} />,
    title: "New photo uploaded for Patricia Lima",
    time: "3 hours ago",
  },
];

export default function RecentActivity() {
  return (
    <div className='w-full  rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
      {/* Title */}
      <h3 className='mb-4 text-lg font-semibold text-gray-900'>
        Recent Activity
      </h3>

      {/* List */}
      <div className='space-y-4'>
        {activities.map((item, index) => (
          <div key={item.id}>
            <div className='flex items-start gap-4'>
              {/* Icon */}
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700'>
                {item.icon}
              </div>

              {/* Text */}
              <div className='flex-1'>
                <p className='text-sm font-medium text-gray-900'>
                  {item.title}
                </p>
                <p className='text-xs text-gray-500 mt-0.5'>{item.time}</p>
              </div>
            </div>

            {/* Divider */}
            {index !== activities.length - 1 && (
              <div className='mt-4 border-t border-gray-100' />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
