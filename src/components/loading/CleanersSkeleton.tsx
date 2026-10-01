import { Skeleton } from "@/components/ui/skeleton";

const columns = [
  "min-w-48",
  "min-w-56",
  "min-w-24",
  "min-w-28",
  "min-w-24",
  "min-w-24",
  "min-w-20",
];

export default function CleanersSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading cleaners" aria-busy="true">
      <div className="flex w-full items-center gap-3">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 w-40 shrink-0 rounded-lg" />
      </div>

      <div className="w-full overflow-x-auto rounded-xl border bg-white">
        <div className="min-w-245">
          <div className="grid grid-cols-[1.4fr_1.5fr_0.8fr_0.9fr_0.8fr_0.8fr_0.4fr] gap-4 border-b bg-[#F9FAFB] px-6 py-4">
            {columns.map((column, index) => (
              <div key={index} className={column}>
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>

          <div className="divide-y divide-[#F0F1F0]">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="grid grid-cols-[1.4fr_1.5fr_0.8fr_0.9fr_0.8fr_0.8fr_0.4fr] items-center gap-4 px-6 py-4"
              >
                <div className="flex min-w-48 items-center gap-3">
                  <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="min-w-56 space-y-2">
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <div className="flex min-w-24 items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="min-w-28 space-y-2">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-5 w-5 rounded" />
              </div>
            ))}
          </div>
        </div>
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