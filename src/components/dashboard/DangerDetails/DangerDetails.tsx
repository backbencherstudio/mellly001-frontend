"use client"


import { Danger } from "@/app/(admin-dashboard)/dashboard/danger-request/page";


import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Eye } from "lucide-react";

export function DangerDetails({ id }: { id: string }) {

    const employee = Danger.find(emp => emp.id === id);
    if (!employee) {
        return <div>No data found</div>;
    }

    return (
        <Dialog >
            <DialogTrigger asChild >
                <button className="p-1 hover:bg-gray-100 rounded">
                    <Eye size={16} />
                </button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto !max-w-[90vw] !w-[800px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold ">Maid Details</DialogTitle>
                </DialogHeader>
                <p className="text-sm font-normal text-[#6A7282]">Review complete profile information</p>

                <div className="space-y-4 mt-4">

                    <p className="text-[#03652B] font-bold text-lg">Personal Information</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-[#6A7282]">Full Name</p>
                            <p className="font-medium text-[#101828] text-sm">{employee.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium text-[#101828] text-sm">{employee.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium text-[#101828] text-sm">{employee.phone}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Applied Date</p>
                            <p className="font-medium">{employee.data}</p>
                        </div>



                        <div>

                            <div className="text-[#03652B] font-bold text-lg w-full ">Address</div>

                            <p className="text-sm text-gray-500">Street Address</p>
                            <p className="font-medium">{employee.location}</p>

                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-medium text-[#101828] text-sm">{employee.location}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${employee.status === "active" ? "bg-green-100 text-green-700" :
                                employee.status === "busy" ? "bg-yellow-100 text-yellow-700" :
                                    "bg-gray-100 text-gray-600"
                                }`}>
                                {employee.status}
                            </span>
                        </div>
                    </div>

                    <div className="gap-4 flex flex-col md:flex-row">
                        <button className="text-red-500 font-bold text-base py-3.5 border border-red-500 border-2 cursor-pointer whitespace-nowrap text-center md:px-20 lg:px-25 rounded-lg">Reject Application</button>
                        <button className="text-white bg-green-800 font-bold text-base py-3.5 whitespace-nowrap cursor-pointer text-center md:px-20 lg:px-25 rounded-lg">Approve & Verify</button>
                    </div>



                </div>
            </DialogContent>
        </Dialog>
    )
}