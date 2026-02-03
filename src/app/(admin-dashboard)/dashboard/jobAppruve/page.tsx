"use client";

import * as React from "react";
import Pagination from "@/components/reusable/pagination";
import { Search } from "lucide-react";

/* ================= TYPES ================= */
type Job = {
  id: string;
  bookingNo: string;
  completedAt: string;
  homeowner: string;
  cleaner: string;
  package: string;
  location: string;
  amount: number;
  notes: string;
  beforePhotos: number;
  afterPhotos: number;
  status: "pending" | "approved" | "rejected";
};

/* ================= DATA ================= */
const jobs: Job[] = [
  {
    id: "1",
    bookingNo: "BK-2024-007",
    completedAt: "2024-01-16 02:30 PM",
    homeowner: "Robert Martinez",
    cleaner: "Maria Rodriguez",
    package: "Deep Cleaning · 4 Hours",
    location: "789 Park Ave, New York",
    amount: 120,
    notes:
      "Deep cleaned kitchen, bathrooms, and living room. Removed tough stains from carpet.",
    beforePhotos: 2,
    afterPhotos: 2,
    status: "pending",
  },
  {
    id: "2",
    bookingNo: "BK-2024-008",
    completedAt: "2024-01-16 04:15 PM",
    homeowner: "Jennifer Lee",
    cleaner: "Jessica Thompson",
    package: "Regular Cleaning · 3 Hours",
    location: "456 Broadway, Los Angeles",
    amount: 90,
    notes:
      "Standard cleaning completed. All rooms dusted and vacuumed.",
    beforePhotos: 1,
    afterPhotos: 1,
    status: "pending",
  },
  {
    id: "3",
    bookingNo: "BK-2024-009",
    completedAt: "2024-01-16 05:45 PM",
    homeowner: "Thomas Anderson",
    cleaner: "Amanda Lee",
    package: "Move-in Cleaning · 5 Hours",
    location: "123 Lake Shore, Chicago",
    amount: 150,
    notes:
      "Complete move-in deep cleaning. Cleaned all appliances, windows, and floors.",
    beforePhotos: 3,
    afterPhotos: 3,
    status: "pending",
  },
];

/* ================= COMPONENT ================= */
export default function JobApprovals() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(2);
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState("");

  const processedJobs = React.useMemo(() => {
    let data = jobs;

    // 🔍 search (bookingNo / homeowner / cleaner)
    if (search) {
      const lower = search.toLowerCase();
      data = data.filter(
        (job) =>
          job.bookingNo.toLowerCase().includes(lower) ||
          job.homeowner.toLowerCase().includes(lower) ||
          job.cleaner.toLowerCase().includes(lower)
      );
    }

    // 🔃 sort
    if (sort === "name-asc") {
      data = [...data].sort((a, b) =>
        a.homeowner.localeCompare(b.homeowner)
      );
    }

    if (sort === "name-desc") {
      data = [...data].sort((a, b) =>
        b.homeowner.localeCompare(a.homeowner)
      );
    }

    return data;
  }, [search, sort]);

  
  
  
  const paginatedJobs = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return processedJobs.slice(start, start + pageSize);
  }, [page, pageSize, processedJobs]);


  return (
    <div className="space-y-6">
      <div className="relative flex w-full items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search booking / homeowner / cleaner"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border px-10 py-2 focus:outline-none"
          />


        </div>

        {/* Sort */}
        <div className="w-40">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-full w-full rounded-lg border px-3 py-2 text-[12px]"
          >
            <option value="">Sort by</option>
            <option value="name-asc">Homeowner (A–Z)</option>
            <option value="name-desc">Homeowner (Z–A)</option>
          </select>

        </div>
      </div>
      {/* Job cards */}
      {paginatedJobs.map((job) => (
        <div
          key={job.id}
          className="rounded-2xl border bg-white p-6 space-y-4"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold">{job.bookingNo}</p>
              <p className="text-xs text-gray-500">
                Completed at {job.completedAt}
              </p>
            </div>

            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700">
              Pending
            </span>
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Homeowner</p>
              <p className="font-medium">{job.homeowner}</p>
            </div>
            <div>
              <p className="text-gray-500">Cleaner</p>
              <p className="font-medium">{job.cleaner}</p>
            </div>
            <div>
              <p className="text-gray-500">Package</p>
              <p className="font-medium">{job.package}</p>
            </div>
            <div>
              <p className="text-gray-500">Amount</p>
              <p className="font-medium">${job.amount}</p>
            </div>
            <div>
              <p className="text-gray-500">Location</p>
              <p className="font-medium">{job.location}</p>
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="text-gray-500 text-sm mb-1">Cleaner Notes</p>
            <p className="rounded-lg bg-gray-50 p-3 text-sm">
              {job.notes}
            </p>
          </div>

          {/* Photos */}
          <div className="grid grid-cols-2 gap-4">
            {/* Before */}
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Before Photos ({job.beforePhotos})
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: job.beforePhotos }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400"
                  >
                    IMG
                  </div>
                ))}
              </div>
            </div>

            {/* After */}
            <div>
              <p className="text-sm text-gray-500 mb-2">
                After Photos ({job.afterPhotos})
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: job.afterPhotos }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400"
                  >
                    IMG
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-2">
            <button className="flex-1 rounded-lg bg-green-600 py-2 text-white font-medium hover:bg-green-700 cursor-pointer">
              ✓ Approve Job
            </button>
            <button className="flex-1 rounded-lg bg-red-600 py-2 text-white font-medium hover:bg-red-700 cursor-pointer">
              ✕ Reject Job
            </button>
          </div>
        </div>
      ))}

      {/* Pagination */}
      <Pagination
        page={page}
        pageSize={pageSize}
        total={processedJobs.length}
        totalPages={Math.ceil(processedJobs.length / pageSize)}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPage(1);
          setPageSize(size);
        }}
      />

    </div>
  );
}
