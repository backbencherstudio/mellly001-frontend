"use client"

import { Employee } from "@/app/(admin-dashboard)/dashboard/cleaner-request/page";
import { Button } from "@/components/ui/button"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useGetClearnerRequestByIdQuery, useUpdateCleanerRequestMutation } from "@/redux/features/dashboardOverView/dashboardOverView";
import { Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";



export function DialogScrollableContent({ data: employee }: { data: Employee }) {

    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const { data } = useGetClearnerRequestByIdQuery(employee?.id, {
        skip: !employee?.id,
    });

    const [updateCleanerRequest, { isLoading }] =
        useUpdateCleanerRequestMutation();

    if (!employee) {
        return <div>No data found</div>;
    }



    const cleaner = data?.data;

    const status = cleaner?.status?.toUpperCase();





    const resumeUrl = cleaner?.resume_url;
    const handleApprove = async () => {
        try {
            await updateCleanerRequest({
                id: employee.id,
                status: "VERIFIED",
            }).unwrap();

            toast.success("Cleaner approved successfully");
        } catch (error) {
            toast.error("Failed to approve cleaner request");
        }
    };

    const requiredFields = [
        cleaner?.name,
        cleaner?.email,
        cleaner?.phone_number,
        cleaner?.location,
        cleaner?.resume_url,
        cleaner?.id_card_front_url,
        cleaner?.id_card_back_url,
    ];

    const isProfileComplete = requiredFields.every(
        (field) => field !== null && field !== undefined && String(field).trim() !== ""
    );

    const handleReject = async () => {
        try {
            const response = await updateCleanerRequest({
                id: employee.id,
                status: "REJECTED",
                rejected_reason: rejectReason,
            }).unwrap();

            if (response?.success) {
                toast.success(
                    response?.message || "Cleaner rejected successfully"
                );

                setRejectReason("");
                setRejectOpen(false);
            } else {
                toast.error(
                    response?.message || "Cleaner rejection failed"
                );
            }
        } catch (error: any) {
            toast.error(
                error?.data?.message || "Failed to reject cleaner request"
            );
        }
    };


    return (
        <Dialog >
            <DialogTrigger asChild >
                <button className="p-1 hover:bg-gray-100 rounded">
                    <Eye size={16} />
                </button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] max-w-[90vw]! w-200! overflow-y-auto rounded">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold ">Cleaner Application Details</DialogTitle>
                </DialogHeader>
                <p className="text-sm font-normal text-[#6A7282]">Review complete profile information</p>

                <div className="space-y-4 mt-4   ">


                    <p className="text-[#03652B] font-bold text-lg">Personal Information</p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-[#6A7282]">Full Name</p>
                            <p className="font-medium text-[#101828] text-sm">{cleaner?.name || "Not Provided"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium text-[#101828] text-sm">{cleaner?.email || "Not Provided"}</p>
                        </div>


                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium text-[#101828] text-sm">{cleaner?.phone_number || "Not Provided"}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-medium text-[#101828] text-sm">{cleaner?.location || "Not Provided"}</p>
                        </div>

                        {/* <div>
                            <p className="text-sm text-gray-500">Applied Date</p>
                            <p className="font-medium">{cleaner?.applied_date ? new Date(cleaner?.applied_date).toLocaleDateString("en-GB") : "N/A"}</p>
                        </div> */}



                        <div>

                            <div className="text-[#03652B] font-bold text-lg w-full ">Address</div>

                            <p className="text-sm text-gray-500">Street Address</p>
                            <p className="font-medium">{cleaner?.location || "Not Provided"}</p>

                        </div>


                        <div>
                            <p className="text-sm text-gray-500 mb-1">Status</p>
                            <div>
                              

                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${status === "VERIFIED"
                                        ? "bg-green-100 text-green-700"
                                        : status === "REJECTED"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {status || "PENDING"}
                                </span>
                            </div>
                        </div>
                        <div>
                            {/* <a
                                href={cleaner?.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-900 font-medium text-xl underline"
                            >
                                View Resume
                            </a> */}

                            <button
                                onClick={() =>
                                    window.open(cleaner?.resume_url, "_blank", "noopener,noreferrer")
                                }
                                className="rounded-lg bg-green-700 px-4 py-2 text-white cursor-pointer hover:bg-green-800"
                            >
                                View Resume
                            </button>
                        </div>


                    </div>
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-[#6A7282] mb-2">Front Image</p>
                                {cleaner?.id_card_front_url ? (
                                    <img
                                        src={cleaner.id_card_front_url}
                                        crossOrigin="anonymous"
                                        alt="Front ID"
                                        className="w-full h-64 rounded-lg border object-center"
                                    />
                                ) : (
                                    <div className="flex h-64 items-center justify-center rounded-lg border text-sm text-gray-500">
                                        Not Provided
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="text-sm text-[#6A7282] mb-2">Back Image</p>
                                {cleaner?.id_card_back_url ? (
                                    <img
                                        src={cleaner.id_card_back_url}
                                        crossOrigin="anonymous"
                                        alt=""
                                        className="w-full h-64 rounded-lg border object-center"
                                    />
                                ) : (
                                    <div className="flex h-64 items-center justify-center rounded-lg border text-sm text-gray-500">
                                        Not Provided
                                    </div>
                                )}
                            </div>
                        </div>


                    </div>

                    <div className="gap-4 flex flex-col md:flex-row w-full">


                        <button
                            className="text-red-500 font-bold text-base py-3.5 border-2 border-red-500 cursor-pointer text-center w-full md:px-20 lg:px-25 rounded-lg whitespace-nowrap disabled:opacity-50"
                            onClick={() => setRejectOpen(true)}
                            disabled={isLoading}
                        >
                            {isLoading ? "Processing..." : "Reject Application"}
                        </button>
                        <button
                            className="text-white bg-green-800 font-bold text-base py-3.5 cursor-pointer text-center md:px-20 lg:px-25 w-full rounded-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleApprove}
                            disabled={isLoading || !isProfileComplete}
                        >
                            {isLoading ? "Processing..." : "Approve & Verify"}
                        </button>

                    </div>
                </div>
            </DialogContent>

            <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                <DialogContent className="w-87.5 md:w-175">
                    <DialogHeader>
                        <DialogTitle>Reject Application</DialogTitle>
                    </DialogHeader>

                    <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Enter rejection reason..."
                        className="w-full h-32 border rounded-lg p-3 outline-none"
                    />

                    <div className="flex justify-end gap-3 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setRejectOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={!rejectReason.trim() || isLoading}
                        >
                            {isLoading ? "Processing..." : "Confirm Reject"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </Dialog>

    )
}