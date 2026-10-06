"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";

import {
  Mail,
  Phone,
  Search,
  MapPin,
} from "lucide-react";
import { DataTable } from "@/components/reusable/Table";
import CleanerRequestSkeleton from "@/components/loading/CleanerRequestSkeleton";
import { DialogScrollableContent } from "@/components/dashboard/CleanerRequest/CleanerRequest";
import { useGetCleanerRequestQuery } from "@/redux/features/dashboardOverView/dashboardOverView";
import dayjs from "dayjs";
import { getImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ================= TYPES ================= */
export type Employee = {
  id?: string;
  name?: string;
  email?: string;
  phone_number?: string | null;
  location?: string | null;
  rejected_reason?: string | null;
  applied_date?: string | null;
  avatar?: string | null;
  status?: string;
};

/* ================= COLUMNS ================= */
const columns: ColumnDef<Employee>[] = [
  {
    header: "Cleaner",
    cell: ({ row }) => {
      const name = row.original?.name || "Unknown cleaner";
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("");

      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-green-100 flex items-center justify-center border ">
            {row.original?.avatar ? (
              <img
                src={getImageUrl(row.original.avatar)}
                alt={name}
                className="w-full h-full object-cover "
              />
            ) : (
              <span className="text-sm font-semibold text-green-700">
                {initials}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium leading-none">{name}</p>
            <p className="text-xs text-gray-500 mt-1">
              Applied{" "}
              {row.original?.applied_date && dayjs(row.original.applied_date).isValid()
                ? dayjs(row.original.applied_date).format("MMM D, YYYY")
                : "N/A"}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    header: "Contact",
    cell: ({ row }) => (
      <div className="space-y-1 text-sm text-gray-600">
        <p className="flex items-center text-[#101828] text-sm font-normal leading-140%  gap-2">
          <Mail size={14} /> {row.original?.email || "N/A"}
        </p>
        <p className="flex items-center gap-2">
          <Phone size={14} /> {row.original?.phone_number || "N/A"}
        </p>
      </div>
    ),
  },
  {
    header: "Location",
    size: 250,
    minSize: 200,
    maxSize: 300,
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm w-75 line-clamp-3 whitespace-normal wrap-break">
        <MapPin className="h-4 w-4 shrink-0 text-[#99A1AF]" />
        <span className="font-medium line-clamp-1">
          {row.original?.location || "N/A"}
        </span>
      </div>
    ),
  },

  {
    header: "Reason",
    size: 250,
    minSize: 200,
    maxSize: 300,
    cell: ({ row }) => (
      <div className="w-75 line-clamp-3 whitespace-normal wrap-break">
        <span className="font-medium">
          {row.original?.rejected_reason || "N/A"}
        </span>
      </div>
    ),
  },
  {
    header: "Applied Date",
    cell: ({ row }) => (
      <div>
        <span className="font-medium">
          {row.original?.applied_date && dayjs(row.original.applied_date).isValid()
            ? new Date(row.original.applied_date).toLocaleDateString("en-GB")
            : "N/A"}
        </span>
      </div>
    ),
  },
  {
    header: "Status",
    cell: ({ row }) => {
      const status = row.original?.status || "unknown";
      const styles: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-700",
        verified: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
      };

      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-600"}`}
        >
          <span className="uppercase"> {status}</span>
        </span>
      );
    },
  },
];

/* ================= COMPONENT ================= */
export default function CleanerRequest() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(8);
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState("");

  const { data, isLoading, isError, refetch } =
    useGetCleanerRequestQuery(undefined);
  const cleaners = React.useMemo(() => {
    const rows: unknown = data?.data?.data;
    return Array.isArray(rows)
      ? rows.filter(
          (row: unknown): row is Employee =>
            typeof row === "object" && row !== null,
        )
      : [];
  }, [data]);

  /* search filter */
  const filteredData = React.useMemo(() => {
    let result = cleaners;

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter((e) =>
        `${e?.name ?? ""} ${e?.email ?? ""}`.toLowerCase().includes(lower),
      );
    }

    if (sort === "name-asc") {
      result = [...result].sort((a, b) =>
        (a?.name ?? "").localeCompare(b?.name ?? ""),
      );
    }

    if (sort === "name-desc") {
      result = [...result].sort((a, b) =>
        (b?.name ?? "").localeCompare(a?.name ?? ""),
      );
    }

    return result;
  }, [search, cleaners, sort]);

  /* pagination */
  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  if (isLoading) {
    return <CleanerRequestSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <p className="text-sm text-red-600">Unable to load cleaner requests. Please try again.</p>
        <Button type="button" variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full ">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-xl border px-11 py-2.5 text-sm"
          />
        </div>

        <div className="w-40">
          <Select
            value={sort || undefined}
            onValueChange={(value) => setSort(value)}
          >
            <SelectTrigger className="h-10 w-full rounded-lg border px-3 py-5 text-[12px] shadow-none focus:ring-0">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginatedData}
        page={page}
        pageSize={pageSize}
        total={filteredData.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPage(1);
          setPageSize(size);
        }}
        loading={isLoading}
        renderAction={(row) => (
          <div className="flex gap-2 ">
            <DialogScrollableContent data={row} />
            {/* <button onClick={() => handleApprove(row)} className="p-1 hover:bg-green-100 rounded text-green-600" title="Approve">
                            <Check size={16} />
                        </button>
                        <Link href={`/dashboard/cleaner-request/${row.id}`} className="p-1 hover:bg-red-100 rounded text-red-600">
                            <X size={16} />
                        </Link> */}
          </div>
        )}
      />
    </div>
  );
}
