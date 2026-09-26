import React from "react";

type Homeowner = {
  name: string;
  email: string;
  phone_number: string | null;
  location: string | null;
  bookings: number;
  total_spent: number;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
};

export default function HomeownerDetails({
  homeowner,
}: {
  homeowner: Homeowner | null;
}) {
  if (!homeowner) {
    return <p className="px-4 text-sm text-gray-500">No homeowner selected.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 text-sm sm:grid-cols-2">
      <div>
        <p className="text-gray-500">Name</p>
        <p className="font-medium">{homeowner.name}</p>
      </div>
      <div>
        <p className="text-gray-500">Email</p>
        <p className="font-medium">{homeowner.email}</p>
      </div>
      <div>
        <p className="text-gray-500">Phone</p>
        <p className="font-medium">
          {homeowner.phone_number || "Not Provided"}
        </p>
      </div>
      <div>
        <p className="text-gray-500">Location</p>
        <p className="font-medium">{homeowner.location || "Not Provided"}</p>
      </div>
      <div>
        <p className="text-gray-500">Bookings</p>
        <p className="font-medium">{homeowner.bookings}</p>
      </div>
      <div>
        <p className="text-gray-500">Total Spent</p>
        <p className="font-medium">${homeowner.total_spent.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-gray-500">Status</p>
        <p className="font-medium capitalize">{homeowner.status}</p>
      </div>
    </div>
  );
}
