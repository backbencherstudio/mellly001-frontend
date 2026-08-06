"use client";

import * as React from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { toast } from "sonner";

import Pagination from "@/components/reusable/pagination";
import { useGetJobApprovalQuery, useGetJobApprovalUpdateMutation } from "@/redux/features/dashboardOverView/dashboardOverView";

/* ================= COMPONENT ================= */
export default function JobApprovals() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(2);
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState("");

  const [approve] = useGetJobApprovalUpdateMutation();
  const handleCompleted = (id: string) => {
    toast.success("Job completed successfully");
    approve({ id, status: "COMPLETED" });
  };
  const handleReject = (id: string) => {
    toast.error("Job rejected successfully");
    approve({ id, status: "REJECTED" });
  };

  const { data: jobApproval } = useGetJobApprovalQuery({});
  // console.log(jobApproval, "ooooopp")
  const rawdd = jobApproval?.data?.data?.[0]?.before_photos?.[0];


  const jobApprovalData = React.useMemo(() => {
    const raw = jobApproval?.data?.data;
    return Array.isArray(raw) ? raw : [];
  }, [jobApproval]);

  const processedJobs = React.useMemo(() => {
    let data = [...jobApprovalData];

    if (search) {
      const lower = search.toLowerCase();

      data = data.filter(
        (job) =>
          job.bookingNo?.toLowerCase().includes(lower) ||
          job.homeowner?.name?.toLowerCase().includes(lower) ||
          job.maid?.name?.toLowerCase().includes(lower)
      );
    }

    if (sort === "name-asc") {
      data.sort((a, b) => a.homeowner.name.localeCompare(b.homeowner.name));
    }

    if (sort === "name-desc") {
      data.sort((a, b) => b.homeowner.name.localeCompare(a.homeowner.name));
    }

    return data;
  }, [search, sort, jobApprovalData]);


  React.useEffect(() => {
    setPage(1);
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
              <p className="font-semibold">{job.slot}  </p>
              <p className="text-xs text-gray-500">
                Completed at  {" "}
                {new Date(job.booking_date).toLocaleString("en-GB")}
              </p>
            </div>

            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700">
              {job.status}
            </span>
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Homeowner</p>
              <p className="font-medium">{job?.homeowner?.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Cleaner</p>
              <p className="font-medium">{job.maid.name}</p>
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
              <p className="font-medium">{job.homeowner_location}</p>
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="text-gray-500 text-sm mb-1">Cleaner Notes</p>
            <p className="rounded-lg bg-gray-50 p-3 text-sm">
              {job.maid?.maid_note}
            </p>
          </div>

          {/* Photos */}
          <div className="grid grid-cols-2 gap-4">
            {/* Before */}
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Before Photos ({job.before_photos?.length || 0})
              </p>

              <div className="grid grid-cols-2 gap-2">
                {job.before_photos?.map((img: string, i: number) => (
                  <img
                    key={i}
                    crossOrigin="anonymous"
                    src={img}
                    alt="before"
                    className="h-40 w-full object-contain rounded-lg"
                  />
                ))}
              </div>
            </div>

            {/* After */}
            <div>
              <p className="text-sm text-gray-500 mb-2">
                After Photos ({job.afterPhotos})
              </p>
              <div className="grid grid-cols-2 gap-2">
                {job.after_photos?.map((img: string, i: number) => (
                  <img
                    crossOrigin="anonymous"
                    key={i}
                    src={img}
                    alt="after"
                    className="h-40 w-full object-contain rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-2">
            <button onClick={() => handleCompleted(job.id)} className="flex-1 rounded-lg bg-green-600 py-2 text-white font-medium hover:bg-green-700 cursor-pointer">
              ✓ Approve Job
            </button>
            <button onClick={() => handleReject(job.id)} className="flex-1 rounded-lg bg-red-600 py-2 text-white font-medium hover:bg-red-700 cursor-pointer">
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
