import { Skeleton } from "@/components/ui/skeleton";

export default function JobApprovalSkeleton() {
  return (
    <div className="space-y-4" aria-label="Loading job approvals" aria-busy="true">
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <Skeleton className="h-11 flex-1 rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl sm:w-48" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 2 }, (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-[#E3EAE5] bg-white"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF2EF] px-4 py-3">
              <div className="flex flex-wrap items-center gap-3">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>

            <div className="grid gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)]">
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                {[0, 1].map((person) => (
                  <div key={person} className="flex items-center gap-2.5">
                    <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </div>
                ))}
                </div>
                <div className="flex items-start gap-2 border-t border-[#F0F3F1] pt-3">
                  <Skeleton className="mt-0.5 h-4 w-4 shrink-0 rounded-full" />
                  <Skeleton className="h-8 w-full max-w-md" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-[#EEF2EF] pt-3 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
                {[0, 1].map((gallery) => (
                  <div key={gallery} className="min-w-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-4" />
                    </div>
                    <div className="flex gap-1.5">
                      <Skeleton className="h-16 w-20 shrink-0 rounded-md" />
                      <Skeleton className="h-16 w-20 shrink-0 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-[#EEF2EF] bg-[#FCFDFC] px-4 py-2.5">
              <Skeleton className="h-9 w-24 rounded-lg" />
              <Skeleton className="h-9 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-4 w-36" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </div>
  );
}