"use client"

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
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "sonner";



export function DialogScrollableContent({ data: employee }: { data: any }) {
    const { data } = useGetClearnerRequestByIdQuery(employee?.id, {
        skip: !employee?.id,
    });

    const [updateCleanerRequest, { isLoading }] =
        useUpdateCleanerRequestMutation();

    if (!employee) {
        return <div>No data found</div>;
    }

    const cleaner = data?.data;

    const resumeUrl = cleaner?.resume_url;
    const isPdf = resumeUrl?.toLowerCase().endsWith(".pdf");
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


    const handleReject = async () => {
        try {
            await updateCleanerRequest({
                id: employee.id,
                status: "REJECTED",
            }).unwrap();

            toast.success("Cleaner rejected successfully");
        } catch (error) {
            toast.error("Failed to reject cleaner request");
        }
    };
    return (
        <Dialog >
            <DialogTrigger asChild >
                <button className="p-1 hover:bg-gray-100 rounded">
                    <Eye size={16} />
                </button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto !max-w-[90vw] !w-[800px] ">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold ">Maid Details</DialogTitle>
                </DialogHeader>
                <p className="text-sm font-normal text-[#6A7282]">Review complete profile information</p>

                <div className="space-y-4 mt-4   ">

                    <p className="text-[#03652B] font-bold text-lg">Personal Information</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-[#6A7282]">Full Name</p>
                            <p className="font-medium text-[#101828] text-sm">{cleaner?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium text-[#101828] text-sm">{cleaner?.email}</p>
                        </div>


                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium text-[#101828] text-sm">{cleaner?.phone_number || "N/A"}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-medium text-[#101828] text-sm">{cleaner?.location}</p>
                        </div>

                        {/* <div>
                            <p className="text-sm text-gray-500">Applied Date</p>
                            <p className="font-medium">{cleaner?.applied_date ? new Date(cleaner?.applied_date).toLocaleDateString("en-GB") : "N/A"}</p>
                        </div> */}



                        <div>

                            <div className="text-[#03652B] font-bold text-lg w-full ">Address</div>

                            <p className="text-sm text-gray-500">Street Address</p>
                            <p className="font-medium">{cleaner?.location}</p>

                        </div>


                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${cleaner?.status === "approved" ? "bg-green-100 text-green-700" :
                                cleaner?.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                    "bg-red-100 text-red-700"
                                }`}>
                                {cleaner?.status}
                            </span>
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
                                <img
                                    src={cleaner?.id_card_front_url}
                                    crossOrigin="anonymous"
                                    alt="Front ID"
                                    className="w-full h-64 rounded-lg border object-center"
                                />
                            </div>

                            <div>
                                <p className="text-sm text-[#6A7282] mb-2">Back Image</p>
                                <img
                                    src={cleaner?.id_card_back_url}
                                    crossOrigin="anonymous"
                                    alt="Back ID"
                                    className="w-full h-64 rounded-lg border object-center"
                                />
                            </div>
                        </div>


                    </div>

                    <div className="gap-4 flex flex-col md:flex-row w-full">
                        <button
                            className="text-red-500 font-bold text-base py-3.5 border border-red-500 border-2 cursor-pointer text-center w-full md:px-20 lg:px-25 rounded-lg whitespace-nowrap disabled:opacity-50"
                            onClick={handleReject}
                            disabled={isLoading}
                        >
                            {isLoading ? "Processing..." : "Reject Application"}
                        </button>
                        <button
                            className="text-white bg-green-800 font-bold text-base py-3.5  cursor-pointer text-center md:px-20 lg:px-25 w-full rounded-lg  whitespace-nowrap disabled:opacity-50"
                            onClick={handleApprove}
                            disabled={isLoading}
                        >
                            {isLoading ? "Processing..." : "Approve & Verify"}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}