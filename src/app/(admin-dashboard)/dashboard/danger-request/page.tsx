"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";

import {
    Mail,
    Phone,
    Search,
    MoreVertical,
    Star,
    MapPin,
    Eye,
    Edit2,
    Trash2,
    Check,
    X,
} from "lucide-react";
import { DataTable } from "@/components/reusable/Table";
import { DialogScrollableContent } from "@/components/dashboard/CleanerRequest/CleanerRequest";
import { DangerDetails } from "@/components/dashboard/DangerDetails/DangerDetails";
import { LineChart } from "../_components/TotalUserGraph";
import { useGetDangerRequestQuery } from "@/redux/features/dashboardOverView/dashboardOverView";
import DangerRequestSkeleton from "@/components/loading/DangerRequestSkeleton";
import { formatDate } from "@/lib/DateFormate";
import { getImageUrl } from "@/lib/utils";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ================= TYPES ================= */
export type DangerRequest = {
    id?: string;
    name?: string;
    email?: string;
    joined?: string;
    status?: string;
    phone_number?: string;
    phone?: string;
    avatar: string | null;

    location?: string | null;
    latitude?: number;
    longitude?: number;

    applied_date?: string;
};

function LocationCell({
    latitude,
    longitude,
    location,
}: {
    latitude?: number;
    longitude?: number;
    location?: string | null;
}) {
    const [locationName, setLocationName] = React.useState(
        location || ""
    );

    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        
        if (location) {
            setLocationName(location);
            return;
        }

     
        if (latitude === undefined || longitude === undefined) {
            setLocationName("N/A");
            return;
        }

        const getLocation = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                );

                if (!response.ok) {
                    throw new Error("Failed to get location");
                }

                const data = await response.json();

                const address = data?.address;

                const location =
                    address?.city ||
                    address?.town ||
                    address?.village ||
                    address?.municipality ||
                    address?.county ||
                    "Unknown location";

                const country = address?.country;

                setLocationName(
                    country ? `${location}, ${country}` : location
                );
            } catch (error) {
                console.error("Location error:", error);
                setLocationName("Location unavailable");
            } finally {
                setLoading(false);
            }
        };

        getLocation();
    }, [latitude, longitude, location]);

    const mapUrl =
        latitude !== undefined && longitude !== undefined
            ? `https://www.google.com/maps?q=${latitude},${longitude}`
            : null;

    return (
        <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 shrink-0 text-[#99A1AF]" />

            {mapUrl ? (
                <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#003C80] hover:underline"
                >
                    {loading ? "Loading..." : locationName || "View Location"}
                </a>
            ) : (
                <span className="font-medium">
                    {locationName || "N/A"}
                </span>
            )}
        </div>
    );
}

/* ================= COLUMNS ================= */
const columns: ColumnDef<DangerRequest>[] = [
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
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E0E7FF] text-sm font-semibold text-[#4F39F6]">
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
                            Joined {row.original?.joined && dayjs(row.original.joined).isValid()
                                ? dayjs(row.original.joined).format("MMM D, YYYY")
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

        cell: ({ row }) => {
            const { latitude, longitude, location } = row.original || {};

            const mapUrl =
                latitude !== undefined && longitude !== undefined
                    ? `https://www.google.com/maps?q=${latitude},${longitude}`
                    : null;

            return (
                <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 shrink-0 text-[#99A1AF]" />

                    {mapUrl ? (
                        <a
                            href={mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-[] hover:underline"
                        >
                            View Location
                        </a>
                    ) : (
                        <span className="font-medium">
                            {location || "N/A"}
                        </span>
                    )}
                </div>
            );
        },
    },

    {
        header: "Applied Date",
        cell: ({ row }) => (
            <div>
                <span className="font-medium">
                    {row.original?.applied_date ? formatDate(row.original.applied_date) : "N/A"}
                </span>
            </div>
        ),
    },

    {
        header: "Status",
        cell: ({ row }) => {
            const status = (row.original?.status || "UNKNOWN").toUpperCase();

            const styles = {
                COMPLETED: "bg-green-100 text-green-700",
                REJECTED: "bg-yellow-100 text-yellow-700",
                PENDING: "bg-yellow-100 text-yellow-600",
            };

            return (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || "bg-gray-100 text-gray-600"}`}
                >
                    {status}
                </span>
            );
        },
    }
];

/* ================= COMPONENT ================= */
export default function CleanerRequest() {

    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(8);
    const [search, setSearch] = React.useState("");
    const [sortBy, setSortBy] = React.useState("");

    const { data, isLoading, isError, refetch } = useGetDangerRequestQuery({});
    const dangerRequest = React.useMemo(() => {
        const res = data?.data;
        const rows = Array.isArray(res) ? res :
            Array.isArray(res?.data) ? res.data :
            Array.isArray(res?.items) ? res.items : [];

        return rows.filter(
            (row: unknown): row is DangerRequest =>
                typeof row === "object" && row !== null,
        );
    }, [data]);

    /* search filter */
    const filteredData = React.useMemo(() => {
        if (!search) return dangerRequest;

        return dangerRequest.filter((e: DangerRequest) =>
            `${e?.name ?? ""} ${e?.email ?? ""}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [dangerRequest, search]);

    const sortedData = React.useMemo(() => {
        const data = [...filteredData];

        if (sortBy === "name") {
            return data.sort((a, b) =>
                (a?.name ?? "").localeCompare(b?.name ?? "")
            );
        }

        return data;
    }, [filteredData, sortBy]);

    /* pagination */
    const paginatedData = React.useMemo(() => {
        const start = (page - 1) * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, page, pageSize]);

    const handleView = (employee: DangerRequest) => {

        // apnar logic
    };

    const handleEdit = (employee: DangerRequest) => {

    };

    const handleDelete = (employee: DangerRequest) => {

    };

    if (isLoading) {
        return <DangerRequestSkeleton />;
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
                <p className="text-sm text-red-600">Unable to load danger requests. Please try again.</p>
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
                        value={sortBy || undefined}
                        onValueChange={(value) => setSortBy(value)}
                    >
                        <SelectTrigger className="h-10 w-full rounded-lg border px-3 py-2.5 text-[12px] shadow-none focus:ring-0">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name">Name</SelectItem>
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
                renderAction={(row) => (
                    <div className="flex gap-2 cursor-pointer">
                        <DangerDetails employee={row} />
                        {/* <button onClick={() => handleEdit(row)} className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                            <Check size={16} />
                        </button>
                        <button onClick={() => handleDelete(row)} className="p-1 hover:bg-red-100 rounded cursor-pointer text-red-600">
                            <X size={16} />
                        </button> */}
                    </div>
                )}
            />


        </div>
    );
}
