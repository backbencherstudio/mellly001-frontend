"use client";

import { Employee } from "@/app/(admin-dashboard)/dashboard/cleaner-request/page";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useGetClearnerRequestByIdQuery,
  useUpdateCleanerRequestMutation,
} from "@/redux/features/dashboardOverView/dashboardOverView";
import { Eye, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== "object" || error === null) return fallback;

  if ("data" in error && typeof error.data === "object" && error.data !== null) {
    const data = error.data;
    if ("message" in data && typeof data.message === "string") {
      return data.message;
    }
  }

  if ("message" in error && typeof error.message === "string") {
    return error.message;
  }

  return fallback;
};

export function DialogScrollableContent({
  data: employee,
}: {
  data: Employee;
}) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const {
    data,
    isLoading: isDetailsLoading,
    isError: isDetailsError,
    refetch,
  } = useGetClearnerRequestByIdQuery(employee?.id, {
    skip: !employee?.id,
  });

  const [updateCleanerRequest, { isLoading }] =
    useUpdateCleanerRequestMutation();

  if (!employee) {
    return <div>No data found</div>;
  }

  const cleaner = data?.data;

  const rawStatus = (cleaner?.status || employee?.status || "").toUpperCase();
  const isDraftOrIncomplete =
    rawStatus === "DRAFT" ||
    rawStatus === "INCOMPLETE" ||
    cleaner?.status?.toLowerCase() === "draft" ||
    employee?.status?.toLowerCase() === "draft";

  const displayStatus = isDraftOrIncomplete ? "INCOMPLETE" : rawStatus || "PENDING";
  const resumeUrl = cleaner?.resume_url;

  const handleApprove = async () => {
    if (!employee?.id) {
      toast.error("Unable to approve request: missing cleaner ID");
      return;
    }

    try {
      const response = await updateCleanerRequest({
        id: employee.id,
        status: "VERIFIED",
      }).unwrap();

      if (response?.success === false) {
        toast.error(response?.message || "Failed to approve cleaner request");
        return;
      }
      toast.success(response?.message || "Cleaner approved successfully");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to approve cleaner request"));
    }
  };

  const requiredFields = [
    cleaner?.name,
    cleaner?.email,
    cleaner?.phone_number,
    cleaner?.location,
    cleaner?.resume_url,
    cleaner?.id_card_front_url,
    cleaner?.id_card_back_url,
  ];

  const isProfileComplete =
    !isDraftOrIncomplete &&
    requiredFields.every(
      (field) =>
        field !== null && field !== undefined && String(field).trim() !== "",
    );

  const handleReject = async () => {
    if (isDraftOrIncomplete) {
      toast.error("Cannot reject: applicant has not submitted verification yet.");
      setRejectOpen(false);
      return;
    }

    if (!employee?.id) {
      toast.error("Unable to reject request: missing cleaner ID");
      return;
    }

    try {
      const response = await updateCleanerRequest({
        id: employee.id,
        status: "REJECTED",
        rejected_reason: rejectReason,
      }).unwrap();

      if (response?.success === false) {
        toast.error(response?.message || "Cleaner rejection failed");
        return;
      }

      toast.success(response?.message || "Cleaner rejected successfully");
      setRejectReason("");
      setRejectOpen(false);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to reject cleaner request"));
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-1 hover:bg-gray-100 rounded cursor-pointer" title="View Details">
          <Eye size={16} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-[90vw]! w-200! overflow-y-auto rounded">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Cleaner Application Details
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm font-normal text-[#6A7282]">
          Review applicant profile information and documents
        </p>

        {isDetailsLoading && (
          <p className="text-sm text-gray-500">Loading cleaner details...</p>
        )}
        {isDetailsError && (
          <div className="flex items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            <span>Unable to load the latest cleaner details.</span>
            <button type="button" className="font-medium underline" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {isDraftOrIncomplete && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold">Incomplete Application (Not Submitted)</p>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                This applicant has not completed or submitted their verification application yet. Rejection and Approval actions are disabled to prevent invalid submissions.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4 mt-4">
          <p className="text-[#03652B] font-bold text-lg">
            Personal Information
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-[#6A7282]">Full Name</p>
              <p className="font-medium text-[#101828] text-sm">
                {cleaner?.name || "Not Provided"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-[#101828] text-sm">
                {cleaner?.email || "Not Provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-[#101828] text-sm">
                {cleaner?.phone_number || "Not Provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-[#101828] text-sm">
                {cleaner?.location || "Not Provided"}
              </p>
            </div>

            <div>
              <div className="text-[#03652B] font-bold text-lg w-full">
                Address
              </div>
              <p className="text-sm text-gray-500">Street Address</p>
              <p className="font-medium">
                {cleaner?.location || "Not Provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    displayStatus === "VERIFIED"
                      ? "bg-green-100 text-green-700"
                      : displayStatus === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : displayStatus === "INCOMPLETE"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {displayStatus}
                </span>
              </div>
            </div>

            {/* Resume button: Hide or disable when applicant has not uploaded one */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Resume</p>
              {resumeUrl ? (
                <button
                  type="button"
                  onClick={() =>
                    window.open(resumeUrl, "_blank", "noopener,noreferrer")
                  }
                  className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white cursor-pointer hover:bg-green-800 transition shadow-sm"
                >
                  View Resume (PDF)
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed"
                  title="No resume uploaded by applicant"
                >
                  No Resume Uploaded
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#6A7282] mb-2">Front Image</p>
                {cleaner?.id_card_front_url ? (
                  <img
                    src={getImageUrl(cleaner.id_card_front_url)}
                    crossOrigin="anonymous"
                    alt="Front ID"
                    className="w-full h-64 rounded-lg border object-center"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-lg border text-sm text-gray-500">
                    Not Provided
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-[#6A7282] mb-2">Back Image</p>
                {cleaner?.id_card_back_url ? (
                  <img
                    src={getImageUrl(cleaner.id_card_back_url)}
                    crossOrigin="anonymous"
                    alt="Back ID"
                    className="w-full h-64 rounded-lg border object-center"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-lg border text-sm text-gray-500">
                    Not Provided
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons: Disable Reject for incomplete records */}
          <div className="gap-4 flex flex-col md:flex-row w-full pt-2">
            <button
              type="button"
              className={`font-bold text-base py-3.5 border-2 text-center w-full md:px-20 lg:px-25 rounded-lg whitespace-nowrap transition ${
                isDraftOrIncomplete
                  ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                  : "text-red-500 border-red-500 cursor-pointer hover:bg-red-50"
              }`}
              onClick={() => {
                if (isDraftOrIncomplete) {
                  toast.error("Application is incomplete (not submitted yet) and cannot be rejected.");
                  return;
                }
                setRejectOpen(true);
              }}
              disabled={isLoading || isDraftOrIncomplete}
              title={
                isDraftOrIncomplete
                  ? "Cannot reject: application is incomplete and not yet submitted"
                  : "Reject Application"
              }
            >
              {isDraftOrIncomplete
                ? "Not Submitted (Cannot Reject)"
                : isLoading
                  ? "Processing..."
                  : "Reject Application"}
            </button>

            <button
              type="button"
              className="text-white bg-green-800 font-bold text-base py-3.5 cursor-pointer text-center md:px-20 lg:px-25 w-full rounded-lg whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-900 transition"
              onClick={handleApprove}
              disabled={isLoading || !isProfileComplete}
              title={
                !isProfileComplete
                  ? "Cannot approve: profile information or required documents are incomplete"
                  : "Approve and verify cleaner"
              }
            >
              {isLoading ? "Processing..." : "Approve & Verify"}
            </button>
          </div>
        </div>
      </DialogContent>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="w-87.5 md:w-175">
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
          </DialogHeader>

          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className="w-full h-32 border rounded-lg p-3 outline-none"
          />

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim() || isLoading}
            >
              {isLoading ? "Processing..." : "Confirm Reject"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
