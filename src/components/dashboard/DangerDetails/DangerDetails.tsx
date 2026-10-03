"use client"

import { DangerRequest } from "@/app/(admin-dashboard)/dashboard/danger-request/page";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { formatDate } from "@/lib/DateFormate";
import { useUpdateDangerRequestMutation } from "@/redux/features/dashboardOverView/dashboardOverView";
import { Eye } from "lucide-react";
import { toast } from "sonner";

export function DangerDetails({
    employee,
}: {
    employee: DangerRequest;
}) {
    const [updateStatus, { isLoading }] =
        useUpdateDangerRequestMutation();

    if (!employee) {
        return <div>No data found</div>;
    }

    const handleUpdateStatus = async (status: string) => {
        const employeeId = employee?.id;
        if (!employeeId) {
            toast.error("Unable to update danger request: missing request ID");
            return;
        }

        try {
            const response = await updateStatus({
                id: employeeId,
                status,
            }).unwrap();

            if (response?.success === false) {
                toast.error(response?.message || "Failed to update status");
                return;
            }

            toast.success(response?.message || "Danger request updated successfully");
        } catch (error: unknown) {
            const message =
                typeof error === "object" && error !== null && "data" in error &&
                typeof error.data === "object" && error.data !== null && "message" in error.data &&
                typeof error.data.message === "string"
                    ? error.data.message
                    : "Failed to update status. Please try again.";
            toast.error(message);
        }
    };

    return (
        <Dialog >
            <DialogTrigger asChild >
                <button className="p-1 hover:bg-gray-100 rounded">
                    <Eye size={16} />
                </button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto !max-w-[90vw] !w-[800px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold ">Danger Request Details</DialogTitle>
                </DialogHeader>
                <p className="text-sm font-normal text-[#6A7282]">Review incident details, location, booking, and response status.</p>

                <div className="space-y-4 mt-4">

                    <p className="text-[#03652B] font-bold text-lg">Incident Information</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-[#6A7282]">Full Name</p>
                            <p className="font-medium text-[#101828] text-sm">{employee?.name || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium text-[#101828] text-sm">{employee?.email || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium text-[#101828] text-sm">{employee?.phone_number || "N/A"}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Applied Date</p>
                            <p className="font-medium">{employee?.applied_date ? formatDate(employee.applied_date) : "N/A"}</p>
                        </div>



                        {/* <div>

                            <div className="text-[#03652B] font-bold text-lg w-full ">Address</div>

                            <p className="text-sm text-gray-500">Street Address</p>
                            <p className="font-medium">{employee.location}</p>

                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-medium text-[#101828] text-sm">{employee.location}</p>
                        </div> */}
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${employee?.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                                employee?.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                                    "bg-gray-100 text-gray-600"
                                }`}>
                                {employee?.status}
                            </span>
                        </div>
                    </div>

                    <div className="gap-4 flex flex-col md:flex-row justify-center items-center">
                        {/* <button className="text-red-500 font-bold text-base py-3.5 border border-red-500 border-2 cursor-pointer whitespace-nowrap text-center md:px-20 lg:px-25 rounded-lg" onClick={() => handleUpdateStatus("REJECTED")}>Reject Application</button> */}
                        <button disabled={isLoading} className="text-white bg-green-800 font-bold text-base py-3.5 whitespace-nowrap cursor-pointer text-center md:px-20 lg:px-25 rounded-lg disabled:cursor-not-allowed disabled:opacity-60" onClick={() => handleUpdateStatus("COMPLETED")}>{isLoading ? "Updating..." : "Approve & Verify"}</button>
                    </div>



                </div>
            </DialogContent>
        </Dialog>
    )
}