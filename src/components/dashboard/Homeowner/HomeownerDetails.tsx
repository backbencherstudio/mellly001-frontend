import React from "react";

type Homeowner = {
  name?: string;
  email?: string;
  phone_number?: string | null;
  location?: string | null;
  bookings?: number;
  total_spent?: number | string | null;
  status?: string;
};

export default function HomeownerDetails({
  homeowner,
}: {
  homeowner: Homeowner | null;
}) {
  if (!homeowner) {
    return <p className="px-4 text-sm text-gray-500">No homeowner selected.</p>;
  }

  const totalSpent = Number(homeowner?.total_spent ?? 0);

  return (
    <div className="grid grid-cols-1 gap-4 px-4 text-sm sm:grid-cols-2">
      <div>
        <p className="text-gray-500">Name</p>
        <p className="font-medium">{homeowner?.name || "N/A"}</p>
      </div>
      <div>
        <p className="text-gray-500">Email</p>
        <p className="font-medium">{homeowner?.email || "N/A"}</p>
      </div>
      <div>
        <p className="text-gray-500">Phone</p>
        <p className="font-medium">
          {homeowner?.phone_number || "Not Provided"}
        </p>
      </div>
      <div>
        <p className="text-gray-500">Location</p>
        <p className="font-medium">{homeowner?.location || "Not Provided"}</p>
      </div>
      <div>
        <p className="text-gray-500">Bookings</p>
        <p className="font-medium">{homeowner?.bookings ?? 0}</p>
      </div>
      <div>
        <p className="text-gray-500">Total Spent</p>
        <p className="font-medium">
          ${Number.isFinite(totalSpent) ? totalSpent.toFixed(2) : "0.00"}
        </p>
      </div>
      <div>
        <p className="text-gray-500">Status</p>
        <p className="font-medium capitalize">{homeowner?.status || "unknown"}</p>
      </div>
    </div>
  );
}
