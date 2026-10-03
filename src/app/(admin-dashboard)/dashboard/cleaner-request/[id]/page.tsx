"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useCancelCleanerRequestMutation } from "../../../../../redux/features/cleanerRequest/cleanerRequestApi";
import { Button } from "@/components/ui/button";

const getErrorMessage = (value: unknown) => {
  if (typeof value !== "object" || value === null) {
    return "Cancel failed. Please try again.";
  }

  if ("data" in value && typeof value.data === "object" && value.data !== null) {
    const data = value.data;
    if ("message" in data && typeof data.message === "string") {
      return data.message;
    }
  }

  if ("message" in value && typeof value.message === "string") {
    return value.message;
  }

  return "Cancel failed. Please try again.";
};

export default function CancelCleanerRequestPage() {
  const router = useRouter();
  const params = useParams();

  const rawId = (params as { id?: string | string[] })?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const [cancelRequest, { isLoading }] = useCancelCleanerRequestMutation();

  const handleCancel = async () => {
    setError(null);
    const requestId = id?.trim();
    if (!requestId) {
      setError("A valid request ID is required to cancel this request.");
      return;
    }

    try {
      const response = await cancelRequest({
        id: requestId,
        reason: reason.trim() || undefined,
      }).unwrap();

      if (response?.success === false) {
        setError(response?.message || "Cancel failed. Please try again.");
        return;
      }

      router.push("/dashboard/cleaner-request");
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError));
    }
  };

  return (
    <div className="space-y-4 p-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Cancel Request</h1>
        <p className="text-sm text-gray-600">
          Request ID: <span className="font-medium">{id ?? "-"}</span>
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Reason (optional)
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Type reason..."
          className="w-full rounded-xl border px-3 py-2 text-sm"
          rows={4}
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Back
        </Button>

        <Button
          variant="destructive"
          onClick={handleCancel}
          disabled={isLoading || !id?.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cancelling...
            </>
          ) : (
            "Confirm Cancel"
          )}
        </Button>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
