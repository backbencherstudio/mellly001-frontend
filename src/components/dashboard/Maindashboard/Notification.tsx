/** @format */
"use client";

import React from "react";
import { AlertCircle, Info } from "lucide-react";

type NotificationType = "error" | "warning" | "info";

type NotificationItem = {
  id: number;
  type: NotificationType;
  message: string;
};

const notifications: NotificationItem[] = [
  {
    id: 1,
    type: "error",
    message: "Upload failed for patient #2847",
  },
  {
    id: 2,
    type: "warning",
    message: "Consent form missing for 3 patients",
  },
  {
    id: 3,
    type: "info",
    message: "Follow-up needed: 5 patients pending response",
  },
];

const styles = {
  error: {
    bg: "bg-red-50",
    border: "border-red-500",
    icon: "text-red-500",
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-500",
    icon: "text-yellow-500",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-500",
    icon: "text-blue-500",
  },
};

export default function Notifications() {
  return (
    <div className='w-full h-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
      {/* Title */}
      <h3 className='mb-4 text-lg font-semibold text-gray-900'>
        Notifications
      </h3>

      {/* Alerts */}
      <div className='space-y-3'>
        {notifications.map((item) => {
          const style = styles[item.type];

          return (
            <div
              key={item.id}
              className={`flex items-center gap-3 rounded-lg border-l-4 p-4 ${style.bg} ${style.border}`}>
              <AlertCircle size={18} className={style.icon} />
              <p className='text-sm text-gray-900'>{item.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
