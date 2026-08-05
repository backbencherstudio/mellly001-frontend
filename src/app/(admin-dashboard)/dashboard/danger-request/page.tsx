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
import { formatDate } from "@/lib/DateFormate";

/* ================= TYPES ================= */
export type DangerRequest = {
    id: string;
    name: string;
    email: string;
    joined: string;
    status: string;
    phone_number: string;
    phone: string;
    avatar: string | null;
    location: string;
    applied_date: string;
};

/* ================= COLUMNS ================= */
const columns: ColumnDef<DangerRequest>[] = [
    {
        header: "Cleaner",
        cell: ({ row }) => {
            const name = row.original.name;
            const initials = name
                .split(" ")
                .map((n) => n[0])
                .join("");

            return (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#E0E7FF] text-[#4F39F6] flex items-center justify-center text-sm font-semibold">
                        {initials}
                    </div>
                    <div>
                        <p className="font-medium leading-none">{name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            Joined {row.original.joined}
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
                    <Mail size={14} /> {row.original.email}
                </p>
                <p className="flex items-center gap-2">
                    <Phone size={14} /> {row.original.phone_number}
                </p>
            </div>
        ),
    },
    {
        header: "location",
        cell: ({ row }) => (
            <div className="flex items-center gap-1 text-sm">
                <MapPin className="h-4 w-4 text-[#99A1AF]" />
                <span className="font-medium">{row.original.location}</span>

            </div>
        ),
    },
    {
        header: "Applied Date",
        cell: ({ row }) => (
            <div>
                <span className="font-medium">{formatDate(row.original.applied_date)}</span>
            </div>
        ),
    },

    {
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status as
                | "COMPLETED"
                | "REJECTED"
                | "PENDING";

            const styles = {
                COMPLETED: "bg-green-100 text-green-700",
                REJECTED: "bg-yellow-100 text-yellow-700",
                PENDING: "bg-gray-100 text-gray-600",
            };

            return (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
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

    const { data, isLoading } = useGetDangerRequestQuery({});
    const dangerRequest = React.useMemo(() => {
        const res = data?.data;

        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res?.items)) return res.items;

        return [];
    }, [data]);

    /* search filter */
    const filteredData = React.useMemo(() => {
        if (!search) return dangerRequest;

        return dangerRequest.filter((e: DangerRequest) =>
            `${e.name} ${e.email}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [dangerRequest, search]);

    const sortedData = React.useMemo(() => {
        const data = [...filteredData];

        if (sortBy === "name") {
            return data.sort((a, b) =>
                a.name.localeCompare(b.name)
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
        console.log("View:", employee);
        // apnar logic
    };

    const handleEdit = (employee: DangerRequest) => {
        console.log("Edit:", employee);
    };

    const handleDelete = (employee: DangerRequest) => {
        console.log("Delete:", employee);
    };

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
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="h-full w-full rounded-lg border px-3 py-2 text-[12px]"
                    >
                        <option value="">Sort by</option>
                        <option value="name">Name</option>

                    </select>
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
                        <button onClick={() => handleEdit(row)} className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                            <Check size={16} />
                        </button>
                        <button onClick={() => handleDelete(row)} className="p-1 hover:bg-red-100 rounded cursor-pointer text-red-600">
                            <X size={16} />
                        </button>
                    </div>
                )}
            />


        </div>
    );
}
