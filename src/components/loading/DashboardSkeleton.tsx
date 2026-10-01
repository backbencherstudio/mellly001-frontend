import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="w-full space-y-6" aria-label="Loading dashboard" aria-busy="true">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="flex justify-between gap-6 rounded-xl border border-[#E9E9E9] bg-white p-5 shadow-[0px_4px_33px_8px_rgba(0,0,0,0.04)]"
          >
            <div className="flex w-full justify-between">
              <div className="space-y-2">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
        <div className="flex items-center justify-between border-b border-[#EEF0EF] px-6 py-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-5 w-36" />
          </div>
          <Skeleton className="h-6 w-8 rounded-full" />
        </div>
        <div className="divide-y divide-[#F0F1F0] px-6">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="flex gap-4 py-5">
              <div className="flex w-9 shrink-0 justify-center">
                <Skeleton className="mt-1 h-3 w-3 rounded-full" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48 max-w-full" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-3 w-20 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}