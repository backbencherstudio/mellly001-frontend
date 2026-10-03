"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Mail, Phone, MoreVertical, Search } from "lucide-react";

import { DataTable } from "@/components/reusable/Table";
import HomeownersSkeleton from "@/components/loading/HomeownersSkeleton";
import {
  useGetHomeownersQuery,
  useUpdateHomeownersMutation,
} from "@/redux/features/dashboardOverView/dashboardOverView";
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
import dayjs from "dayjs";
import CustomModal from "@/components/reusable/CustomModal";
import HomeownerDetails from "@/components/dashboard/Homeowner/HomeownerDetails";
import { getImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Employee = {
  id?: string;
  userId?: string;
  user_id?: string;
  user?: { id?: string };
  name?: string;
  email?: string;
  phone_number?: string | null;
  avatar: string | null;
  location?: string | null;
  bookings?: number;
  total_spent?: number | string | null;
  joined_at?: string;
  status?: string;
};

const columns: ColumnDef<Employee>[] = [
  {
    header: "Homeowner",
    cell: ({ row }) => {
      const user = row.original;

      const name = user?.name || "Unknown homeowner";
      const initials = name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();

      return (
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E0E7FF] font-semibold text-indigo-700 border ">
            <span>{initials}</span>
            {user?.avatar && (
              <img
                src={getImageUrl(user.avatar)}
                alt={name}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>

          <div>
            <p className="font-normal text-base">{name}</p>

            <p className="text-sm text-[#6A7282]">
              Joined {user?.joined_at && dayjs(user.joined_at).isValid()
                ? dayjs(user.joined_at).format("MMM D, YYYY")
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
      <div className="space-y-1">
        <p className="flex gap-2 text-sm text-[#101828]">
          <Mail className="text-[#6A7282] mt-1" size={12} />
          {row.original?.email || "N/A"}
        </p>
        <p className="flex gap-2 text-[#6A7282]">
          <Phone size={12} className="text-[#6A7282] mt-1" />
          {row.original?.phone_number || "N/A"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    size: 250,
    minSize: 200,
    maxSize: 300,
    cell: ({ row }) => (
      <div className="w-75 line-clamp-3 whitespace-normal wrap-break">
        {row.original?.location || "N/A"}
      </div>
    ),
  },
  {
    header: "Bookings",
    cell: ({ row }) => row.original?.bookings ?? 0,
  },
  {
    header: "Total Spent",
    cell: ({ row }) => {
      const totalSpent = Number(row.original?.total_spent ?? 0);
      return `$${Number.isFinite(totalSpent) ? totalSpent.toFixed(2) : "0.00"}`;
    },
  },
  {
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`px-3 py-1 rounded-full text-xs
        ${
          (row.original?.status || "inactive").toLowerCase() === "active"
            ? "bg-green-100 text-green-700"
            : (row.original?.status || "inactive").toLowerCase() === "inactive"
              ? "bg-gray-100 text-gray-600"
              : "bg-red-100 text-red-600"
        }`}
      >
        <span className="uppercase font-medium"> {row.original?.status || "INACTIVE"}</span>
      </span>
    ),
  },
];

export default function EmployeesTable() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [selectedHomeowner, setSelectedHomeowner] =
    React.useState<Employee | null>(null);

  const { data, isLoading, isError, refetch } = useGetHomeownersQuery({
    search,

    page,
    perPage: pageSize,
  });

  const [updateHomeowners] = useUpdateHomeownersMutation();
  const updateHomeownerStatus = async (homeowner: Employee, status: string) => {
    const id = homeowner?.userId ?? homeowner?.user_id ?? homeowner?.user?.id ?? homeowner?.id;
    if (!id) {
      toast.error("Unable to update homeowner: missing user ID");
      return;
    }

    try {
      const response = await updateHomeowners({ id, status }).unwrap();
      if (response?.success === false) {
        toast.error(response?.message || "Unable to update homeowner status");
        return;
      }
      toast.success(response?.message || "Homeowner status updated successfully");
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error &&
        typeof error.data === "object" && error.data !== null && "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "Unable to update homeowner status. Please try again.";
      toast.error(message);
    }
  };

  const homeowners = React.useMemo(() => {
    const rows: unknown = data?.data?.data;
    return Array.isArray(rows)
      ? rows.filter(
          (row: unknown): row is Employee =>
            typeof row === "object" && row !== null,
        )
      : [];
  }, [data]);

  const filteredEmployees = React.useMemo(() => {
    let data = homeowners;

    if (search) {
      const lower = search.toLowerCase();
      data = data.filter((emp) =>
        `${emp?.name ?? ""} ${emp?.email ?? ""} ${emp?.phone_number ?? ""}`
          .toLowerCase()
          .includes(lower),
      );
    }

    if (sort === "name-asc") {
      data = [...data].sort((a, b) =>
        (a?.name ?? "").localeCompare(b?.name ?? ""),
      );
    }

    if (sort === "name-desc") {
      data = [...data].sort((a, b) =>
        (b?.name ?? "").localeCompare(a?.name ?? ""),
      );
    }

    return data;
  }, [search, sort, homeowners]);

  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return (filteredEmployees || []).slice(start, start + pageSize);
  }, [page, pageSize, filteredEmployees]);

  if (isLoading) {
    return <HomeownersSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <p className="text-sm text-red-600">Unable to load homeowners. Please try again.</p>
        <Button type="button" variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-6">
        <div className="relative flex w-full items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search homeowners by name, email, or phone"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="w-full rounded-lg border px-10 py-2 focus:outline-none"
            />
          </div>

          {/* Sort */}
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

        <DataTable
          columns={columns}
          data={paginatedData}
          page={page}
          pageSize={pageSize}
          total={filteredEmployees.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPage(1);
            setPageSize(size);
          }}
          renderAction={(row) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label={`Actions for ${row?.name || "homeowner"}`}
                  className="cursor-pointer"
                >
                  <MoreVertical />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedHomeowner(row);
                    setOpen(true);
                  }}
                  className="cursor-pointer"
                >
                  View Details
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => updateHomeownerStatus(row, "ACTIVE")}
                  className="cursor-pointer"
                >
                  Activate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateHomeownerStatus(row, "INACTIVE")}
                  className="cursor-pointer"
                >
                  Inactive
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateHomeownerStatus(row, "SUSPENDED")}
                  className="cursor-pointer"
                >
                  Suspend
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          loading={isLoading}
        />
      </div>

      <div>
        <CustomModal title="text" size="mmd" open={open} onOpenChange={setOpen}>
          <HomeownerDetails homeowner={selectedHomeowner} />
        </CustomModal>
      </div>
    </div>
  );
}
