"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";

import { Mail, Phone, Search, MoreVertical, Star } from "lucide-react";
import { DataTable } from "@/components/reusable/Table";
import CleanersSkeleton from "@/components/loading/CleanersSkeleton";
import {
  useGetCleanersQuery,
  useUpdateCleanersMutation,
} from "@/redux/features/dashboardOverView/dashboardOverView";
import dayjs from "dayjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomModal from "@/components/reusable/CustomModal";
import CleanerDetails from "@/components/dashboard/CleanerRequest/CleanerDetails";
import { getImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/* ================= TYPES ================= */
type Employee = {
  id: string;
  userId?: string;
  user_id?: string;
  user?: {
    id: string;
  };
  name?: string;
  email?: string;
  phone_number: string | null;
  avatar: string | null;
  earnings?: number;
  rating?: number;
  total_reviews?: number;
  joined_at?: string;
  status?: string;
  jobs?: {
    completed: number;
    completion_rate: number;
    total: number;
  };
};

/* ================= COLUMNS ================= */
const columns: ColumnDef<Employee>[] = [
  {
    header: "Cleaner",
    cell: ({ row }) => {
      const name = row.original?.name || "Unknown cleaner";
      const initials = name
        ?.split(" ")
        .map((n) => n[0])
        .join("");

      return (
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-100 text-sm font-semibold text-green-700">
            <span>{initials}</span>
            {row.original?.avatar && (
              <img
                src={getImageUrl(row.original.avatar)}
                alt={name}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>
          <div>
            <p className="font-medium leading-none">{name}</p>
            <p className="text-xs text-gray-500 mt-1">
              Joined {row.original?.joined_at && dayjs(row.original.joined_at).isValid()
                ? dayjs(row.original.joined_at).format("MMM D, YYYY")
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
        <p className="flex items-center text-[#101828] text-sm font-normal leading-140% gap-2">
          <Mail size={14} /> {row.original?.email || "N/A"}
        </p>
        <p className="flex items-center gap-2">
          <Phone size={14} /> {row.original?.phone_number || "N/A"}
        </p>
      </div>
    ),
  },
  {
    header: "Rating",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="font-medium">{row.original?.rating ?? 0}</span>
        <span className="text-gray-500">({row.original?.total_reviews ?? 0})</span>
      </div>
    ),
  },
  {
    header: "Jobs",
    cell: ({ row }) => {
      const { completed, total, completion_rate } = row.original?.jobs || {};

      return (
        <div>
          <p className="font-medium">
            {completed ?? 0} / {total ?? 0}
          </p>
          <p className="text-xs text-gray-500">
            {completion_rate ?? 0}% completion
          </p>
        </div>
      );
    },
  },
  {
    header: "Earnings",
    cell: ({ row }) => (
      <span className="font-medium">${row.original?.earnings ?? 0}</span>
    ),
  },
  {
    header: "Status",
    cell: ({ row }) => {
      const status = (
        row.original?.status || "INACTIVE"
      ).toUpperCase() as keyof typeof styles;
      const styles = {
        ACTIVE: "bg-green-100 text-green-700",
        INACTIVE: "bg-gray-100 text-gray-600",
        SUSPENDED: "bg-red-100 text-red-600",
      };

      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.INACTIVE}`}
        >
          <span className="uppercase">{row.original?.status || "INACTIVE"}</span>
        </span>
      );
    },
  },
];

/* ================= COMPONENT ================= */
export default function EmployeesTable() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(8);
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [selectedCleaner, setSelectedCleaner] = React.useState<Employee | null>(
    null,
  );

  const { data, isLoading, isError, refetch } = useGetCleanersQuery({});
  const cleaners = React.useMemo(() => {
    const rows = data?.data?.data;
    return Array.isArray(rows)
      ? rows.filter(
          (row): row is Employee =>
            typeof row === "object" && row !== null,
        )
      : [];
  }, [data]);

  const [updateCleaner] = useUpdateCleanersMutation();

  const updateCleanerStatus = async (row: Employee, status: string) => {
    const targetUserId = row?.userId ?? row?.user_id ?? row?.user?.id ?? row?.id;
    if (!targetUserId) {
      toast.error("Unable to update cleaner: missing user ID");
      return;
    }

    try {
      const response = await updateCleaner({ id: targetUserId, status }).unwrap();
      if (response?.success === false) {
        toast.error(response?.message || "Unable to update cleaner status");
        return;
      }
      toast.success(response?.message || "Cleaner status updated successfully");
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error &&
        typeof error.data === "object" && error.data !== null && "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "Unable to update cleaner status. Please try again.";
      toast.error(message);
    }
  };

  /* search filter */
  const filteredData = React.useMemo(() => {
    let result = Array.isArray(cleaners) ? cleaners : [];

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
    return <CleanersSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <p className="text-sm text-red-600">Unable to load cleaners. Please try again.</p>
        <Button type="button" variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full">
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
              <SelectTrigger className="h-10 w-full rounded-lg border px-3 py-2.5 text-[12px] shadow-none focus:ring-0">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="cursor-pointer">
                  <MoreVertical />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedCleaner(row);
                    setOpen(true);
                  }}
                  className="cursor-pointer"
                >
                  View Details
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => updateCleanerStatus(row, "ACTIVE")}
                  className="cursor-pointer"
                >
                  Activate
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => updateCleanerStatus(row, "INACTIVE")}
                  className="cursor-pointer"
                >
                  Inactivate
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => updateCleanerStatus(row, "SUSPENDED")}
                  className="cursor-pointer"
                >
                  Suspend
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </div>

      <div>
        <CustomModal
          title="Cleaner Details"
          size="mmd"
          open={open}
          onOpenChange={setOpen}
        >
          <CleanerDetails cleaner={selectedCleaner} />
        </CustomModal>
      </div>
    </div>
  );
}
