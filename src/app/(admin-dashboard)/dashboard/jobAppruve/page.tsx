"use client";

import * as React from "react";
import {
  CalendarDays,
  Check,
  DollarSign,
  MapPin,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

import Pagination from "@/components/reusable/pagination";
import { useGetJobApprovalQuery, useGetJobApprovalUpdateMutation } from "@/redux/features/dashboardOverView/dashboardOverView";
import dayjs from "dayjs";
import JobApprovalSkeleton from "@/components/loading/JobApprovalSkeleton";

/* ================= COMPONENT ================= */
export default function JobApprovals() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(2);
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState("");

  const [approve] = useGetJobApprovalUpdateMutation();

  const handleCompleted = async (id: string) => {
    try {
      const response = await approve({
        id,
        status: "COMPLETED",
      }).unwrap();

      if (response?.success === false) {
        toast.error(response.message);
        return;
      }

      toast.success(
        response?.message || "Job completed successfully"
      );
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Something went wrong"
      );
    }
  };




  const handleReject = async (id: string) => {
    try {
      await approve({
        id,
        status: "REJECTED",
      }).unwrap();

      toast.error("Job rejected successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const { data: jobApproval, isLoading } = useGetJobApprovalQuery({});


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
          String(job.id || "").toLowerCase().includes(lower) ||
          job.bookingNo?.toLowerCase().includes(lower) ||
          job.homeowner?.name?.toLowerCase().includes(lower) ||
          job.maid?.name?.toLowerCase().includes(lower),
      );
    }

    if (sort === "name-asc") {
      data.sort((a, b) =>
        (a.homeowner?.name || "").localeCompare(b.homeowner?.name || ""),
      );
    }

    if (sort === "name-desc") {
      data.sort((a, b) =>
        (b.homeowner?.name || "").localeCompare(a.homeowner?.name || ""),
      );
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

  if (isLoading) {
    return <JobApprovalSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#87948C]"
            aria-hidden="true"
          />
          <input
            aria-label="Search job approvals"
            placeholder="Search booking / homeowner / cleaner"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-xl border border-[#E0E8E2] bg-white pl-10 pr-4 text-sm text-[#183324] outline-none transition placeholder:text-[#9AA69F] focus:border-[#70A986] focus:ring-2 focus:ring-[#168044]/10"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            aria-label="Sort job approvals"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-11 w-full rounded-xl border border-[#E0E8E2] bg-white px-3 text-sm text-[#53645A] outline-none transition focus:border-[#70A986] focus:ring-2 focus:ring-[#168044]/10"
          >
            <option value="">Sort by</option>
            <option value="name-asc">Homeowner (A–Z)</option>
            <option value="name-desc">Homeowner (Z–A)</option>
          </select>
        </div>
      </div>

      {paginatedJobs.length > 0 ? (
        <div className="space-y-3">
          {paginatedJobs.map((job) => {
            const status = String(job.status || "PENDING");
            const statusClass = status.toLowerCase().includes("reject")
              ? "bg-[#FFF0EF] text-[#B94239]"
              : status.toLowerCase().includes("complet")
                ? "bg-[#EAF7EF] text-[#168044]"
                : "bg-[#FFF6DF] text-[#9A6B08]";

            return (
              <article
                key={job.id}
                className="overflow-hidden rounded-xl border border-[#E3EAE5] bg-white shadow-[0px_3px_14px_rgba(16,40,26,0.035)]"
              >
                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF2EF] px-4 py-3">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
                    <span className="text-xs font-semibold text-[#168044]">
                      Approval · {String(job.id).slice(-6).toUpperCase()}
                    </span>
                    <span className="rounded-md bg-[#F1F5F2] px-2 py-1 text-xs font-semibold text-[#52665A]">
                      Slot {job.slot || "—"}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#77847C]">
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                      {dayjs(job.booking_date).format("MMM D, YYYY")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-sm font-semibold text-[#263B2E]">
                      <DollarSign className="h-4 w-4 text-[#75847A]" aria-hidden="true" />
                      {job.amount}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass}`}>
                      {status}
                    </span>
                  </div>
                </header>

                <div className="grid gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)]">
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EEF5F0] text-[#3F7654]">
                          <UserRound className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[11px] text-[#89958E]">Homeowner</p>
                          <p className="truncate text-sm font-semibold text-[#263B2E]">
                            {job.homeowner?.name || "Homeowner"}
                          </p>
                        </div>
                      </div>
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F1F1FA] text-[#6667A5]">
                          <UserRound className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[11px] text-[#89958E]">Cleaner</p>
                          <p className="truncate text-sm font-semibold text-[#263B2E]">
                            {job.maid?.name || "Cleaner"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 border-t border-[#F0F3F1] pt-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#75847A]" aria-hidden="true" />
                      <p className="line-clamp-2 break-words text-xs leading-relaxed text-[#59675E]">
                        {job.homeowner_location || "Location not provided"}
                      </p>
                    </div>

                    {job.maid_note && (
                      <p className="line-clamp-2 rounded-md bg-[#F7F9F7] px-3 py-2 text-xs leading-relaxed text-[#59675E]">
                        <span className="font-semibold text-[#34483A]">Note: </span>
                        {job.maid_note}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-[#EEF2EF] pt-3 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
                    {[
                      { label: "Before", photos: job.before_photos },
                      { label: "After", photos: job.after_photos },
                    ].map(({ label, photos }) => (
                      <section key={label} className="min-w-0">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <h3 className="text-xs font-semibold text-[#34483A]">{label}</h3>
                          <span className="text-[10px] text-[#89958E]">{photos?.length || 0}</span>
                        </div>
                        {photos?.length ? (
                          <div className="flex gap-1.5 overflow-x-auto">
                            {photos.slice(0, 3).map((photo: string, index: number) => (
                              <img
                                key={index}
                                src={photo}
                                alt={`${label} job photo ${index + 1}`}
                                crossOrigin="anonymous"
                                className="h-16 w-20 shrink-0 rounded-md bg-[#F2F5F2] object-cover"
                              />
                            ))}
                            {photos.length > 3 && (
                              <span className="flex h-16 w-10 shrink-0 items-center justify-center rounded-md bg-[#F2F5F2] text-[10px] font-medium text-[#718078]">
                                +{photos.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="flex h-16 items-center justify-center rounded-md bg-[#F7F9F7] text-[10px] text-[#89958E]">
                            No photos
                          </div>
                        )}
                      </section>
                    ))}
                  </div>
                </div>

                <footer className="flex justify-end gap-2 border-t border-[#EEF2EF] bg-[#FCFDFC] px-4 py-2.5">
                  <button
                    onClick={() => handleCompleted(job.id)}
                    className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#168044] px-3 text-xs font-semibold text-white transition hover:bg-[#116A37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168044] focus-visible:ring-offset-2"
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(job.id)}
                    className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#F0D3D0] bg-white px-3 text-xs font-semibold text-[#B94239] transition hover:bg-[#FFF5F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8554B] focus-visible:ring-offset-2"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                    Reject
                  </button>
                </footer>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#DCE5DE] bg-white px-6 py-14 text-center">
          <p className="text-sm font-semibold text-[#34483A]">No job approvals found</p>
          <p className="mt-1 text-sm text-[#89958E]">Try another booking, homeowner, or cleaner search.</p>
        </div>
      )}

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
