"use client";

import React, { useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  Clock,
  Trash2,
  AlertTriangle,
  FileCheck,
  UserCheck,
  Calendar,
  X,
  User,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

import {
  useGetSingleNotificationQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
  type NotificationItem,
} from "@/redux/features/chattingAndSocket/socket";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface NotificationDetailModalProps {
  notificationId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate?: (href: string) => void;
  initialData?: NotificationItem | null;
}

const sanitizeTerminology = (text?: string | null): string => {
  if (!text) return "";
  return text
    .replace(/professional\s+maid/gi, "Professional Cleaner")
    .replace(/\bmaid\b/gi, "cleaner")
    .replace(/\bmaids\b/gi, "cleaners")
    .replace(/\bMaid\b/g, "Cleaner")
    .replace(/\bMaids\b/g, "Cleaners");
};

const notificationLabels: Record<string, string> = {
  approve_job_submission: "Job Approval Submitted",
  job_approval: "Job Approval Update",
  booking_created: "New Booking Created",
  booking_updated: "Booking Updated",
  cleaner_registration: "Cleaner Application",
  homeowner_registration: "Homeowner Registration",
  user_registration: "User Registration",
  new_user_registration: "User Registration",
  danger_request: "Emergency Request",
  emergency_request: "Emergency Request",
  accept_booking: "Accept Booking",
};

const getNotificationLabel = (item: NotificationItem) => {
  const type = item.type || "";
  if (notificationLabels[type]) {
    return sanitizeTerminology(notificationLabels[type]);
  }
  const raw =
    type
      ?.replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Notification";
  return sanitizeTerminology(raw);
};

const getNotificationIcon = (type?: string) => {
  const t = (type || "").toLowerCase();
  if (t.includes("danger") || t.includes("emergency")) {
    return {
      icon: <ShieldAlert className="h-6 w-6 text-red-600" />,
      bg: "bg-red-50 border-red-200",
    };
  }
  if (t.includes("booking") || t.includes("job")) {
    return {
      icon: <Calendar className="h-6 w-6 text-[#168044]" />,
      bg: "bg-[#F2F7F3] border-[#D1E6D9]",
    };
  }
  if (t.includes("approval") || t.includes("submission")) {
    return {
      icon: <FileCheck className="h-6 w-6 text-[#168044]" />,
      bg: "bg-[#F2F7F3] border-[#D1E6D9]",
    };
  }
  if (t.includes("cleaner") || t.includes("registration")) {
    return {
      icon: <UserCheck className="h-6 w-6 text-blue-600" />,
      bg: "bg-blue-50 border-blue-200",
    };
  }
  return {
    icon: <Bell className="h-6 w-6 text-[#168044]" />,
    bg: "bg-[#F2F7F3] border-[#D1E6D9]",
  };
};

export default function NotificationDetailModal({
  notificationId,
  open,
  onOpenChange,
  initialData,
}: NotificationDetailModalProps) {
  // Query single notification
  const { data: resData, isLoading, isError, refetch } =
    useGetSingleNotificationQuery(notificationId!, {
      skip: !notificationId || !open,
    });

  const [markNotificationAsRead, { isLoading: isMarkingRead }] =
    useMarkNotificationAsReadMutation();
  const [deleteNotification, { isLoading: isDeleting }] =
    useDeleteNotificationMutation();

  // Resolved notification payload
  const rawItem = resData?.data || (resData as unknown as NotificationItem) || initialData;
  const item: NotificationItem | null = rawItem && typeof rawItem === "object" ? rawItem : null;

  const isRead = Boolean(item?.isRead || item?.is_read);

  // Auto-mark as read when modal opens if unread
  useEffect(() => {
    if (open && item && !isRead && notificationId) {
      markNotificationAsRead(notificationId)
        .unwrap()
        .catch(() => {
          // ignore auto-mark silent failure
        });
    }
  }, [open, item, isRead, notificationId, markNotificationAsRead]);

  const handleMarkReadManual = async () => {
    if (!notificationId) return;
    try {
      await markNotificationAsRead(notificationId).unwrap();
      toast.success("Notification marked as read");
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const handleDelete = async () => {
    if (!notificationId) return;
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    try {
      await deleteNotification(notificationId).unwrap();
      toast.success("Notification deleted");
      onOpenChange(false);
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  const iconInfo = getNotificationIcon(item?.type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-xl p-0 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-[#EEF2EF] px-6 py-4 bg-[#FBFDFC]">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#168044]" />
            <DialogTitle className="text-base font-bold text-[#173323]">
              Notification Details
            </DialogTitle>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {isLoading && !item ? (
            <div className="space-y-4 py-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gray-100 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 rounded bg-gray-100 animate-pulse" />
                  <div className="h-3 w-1/3 rounded bg-gray-100 animate-pulse" />
                </div>
              </div>
              <div className="h-24 rounded-xl bg-gray-50 p-4 animate-pulse" />
              <div className="h-16 rounded-xl bg-gray-50 p-4 animate-pulse" />
            </div>
          ) : isError && !item ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
              <p className="text-sm font-semibold text-gray-800">
                Failed to load notification details
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="text-xs cursor-pointer"
              >
                Try Again
              </Button>
            </div>
          ) : item ? (
            <div className="space-y-5">
              {/* Card Header with Icon & Category */}
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${iconInfo.bg} shadow-xs`}
                >
                  {iconInfo.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#F2F7F3] px-2.5 py-0.5 text-xs font-semibold text-[#168044]">
                      {getNotificationLabel(item)}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        isRead
                          ? "bg-gray-100 text-gray-600"
                          : "bg-[#E34D4D]/10 text-[#E34D4D]"
                      }`}
                    >
                      {isRead ? "Read" : "Unread"}
                    </span>
                  </div>

                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[#718078]">
                    <Clock className="h-3.5 w-3.5" />
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "Recently"}
                  </p>
                </div>
              </div>

              {/* Message Box */}
              <div className="rounded-xl border border-[#E3EAE5] bg-[#F9FBFA] p-4.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#718078] mb-1.5">
                  Message
                </p>
                <p className="text-sm leading-relaxed text-[#173323] whitespace-pre-wrap font-normal">
                  {sanitizeTerminology(item.text)}
                </p>
              </div>

              {/* Metadata Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {item.id && (
                  <div className="rounded-lg border border-gray-100 bg-gray-50/70 p-3">
                    <span className="text-[#718078] block mb-0.5">Notification ID</span>
                    <span className="font-mono text-gray-800 truncate block">
                      {item.id}
                    </span>
                  </div>
                )}

                {item.type && (
                  <div className="rounded-lg border border-gray-100 bg-gray-50/70 p-3">
                    <span className="text-[#718078] block mb-0.5">Event Type</span>
                    <span className="font-medium text-gray-800 block">
                      {item.type}
                    </span>
                  </div>
                )}

                {item.sender?.name && (
                  <div className="rounded-lg border border-gray-100 bg-gray-50/70 p-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-[#168044]" />
                    <div>
                      <span className="text-[#718078] block text-[11px]">Sender</span>
                      <span className="font-semibold text-gray-800">
                        {item.sender.name}
                      </span>
                    </div>
                  </div>
                )}

                {(item.bookingId ||
                  item.applicationId ||
                  item.cleanerId ||
                  item.homeownerId ||
                  item.jobApprovalId) && (
                  <div className="rounded-lg border border-gray-100 bg-gray-50/70 p-3">
                    <span className="text-[#718078] block mb-0.5">Reference ID</span>
                    <span className="font-mono text-gray-800 truncate block">
                      {item.bookingId ||
                        item.applicationId ||
                        item.cleanerId ||
                        item.homeownerId ||
                        item.jobApprovalId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-[#EEF2EF] px-6 py-4 bg-[#FBFDFC]">
          {/* Left actions: Delete & Read */}
          <div className="flex items-center gap-2">
            {item && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isDeleting}
                onClick={handleDelete}
                className="flex items-center gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            )}

            {item && !isRead && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isMarkingRead}
                onClick={handleMarkReadManual}
                className="flex items-center gap-1.5 border-[#168044] text-[#168044] hover:bg-[#F2F7F3] text-xs cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Mark as Read
              </Button>
            )}
          </div>

          {/* Right action: Close */}
          <div className="flex items-center gap-2 justify-end">
            <Button
              type="button"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs bg-[#168044] text-white hover:bg-[#126b38] px-5 py-2 font-semibold shadow-xs cursor-pointer"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
