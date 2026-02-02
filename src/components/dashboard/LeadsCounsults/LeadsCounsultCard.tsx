/** @format */
"use client";

import React, { ReactNode } from "react";
import { Facebook, Plus } from "lucide-react";
export type LeadsConsultCardItem = {
  id: number;
  icon: ReactNode;
  total: string;
  desc: string;
  bg: string;
};

const LeadsCard1: LeadsConsultCardItem[] = [
  {
    id: 1,
    icon: <Facebook />,
    total: "50%",
    desc: "Lead → Consult",
    bg: "#EFF6FF",
  },
  {
    id: 2,
    icon: <Facebook />,
    total: "33%",
    desc: "Consult → Won",
    bg: "#F0FDF4",
  },
  {
    id: 3,
    icon: <Facebook />,
    total: "2.5h",
    desc: "Avg Response Time",
    bg: "#FFF7ED",
  },
  {
    id: 4,
    icon: <Facebook />,
    total: "67%",
    desc: "No-Show Rate",
    bg: "#FEF2F2",
  },
];
export type LeadPipeline2 = {
  id: number;
  total: string;
  desc: string;
};

const LeadPipeline: LeadPipeline2[] = [
  {
    id: 1,

    total: "1",
    desc: "New",
  },
  {
    id: 2,

    total: "1",
    desc: "Contacted",
  },
  {
    id: 3,

    total: "1",
    desc: "Interested",
  },
  {
    id: 4,

    total: "1",
    desc: "Consult/Demo Booked",
  },
  {
    id: 5,

    total: "1",
    desc: "Won",
  },
  {
    id: 6,

    total: "1",
    desc: "Lost",
  },
];
export default function LeadsCounsultCard() {
  return (
    <div>
      <div className='flex justify-between'>
        <div>
          {" "}
          <h3 className='text-[#101828] text-lg md:text-2xl lg:text-3xl font-bold leading-120%'>
            Leads & Consults
          </h3>
          <p className='text-[#6A7282] font-normal text-base leading-150% pt-1'>
            Manage your conversion pipeline and track consultations
          </p>
        </div>
        <div>
          {/* <button className='ml-4 mt-2 cursor-pointer inline-flex items-center px-6 py-2.5 gap-2 bg-[#2D9AAF] hover:bg-[#2D9AAF]/90 text-white text-base font-normal rounded-lg shadow-sm'>
            <Plus></Plus> Add Lead
          </button> */}
        </div>
      </div>
      <div className=''>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6'>
          {LeadsCard1.map((item) => (
            <div key={item.id} className='bg-white p-6 rounded-lg border '>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div
                    className=' p-3 rounded-sm '
                    style={{ backgroundColor: item.bg }}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className='text-[#101828] font-bold text-2xl'>
                      {item.total}
                    </h3>
                    <p className='text-[#101828] font-medium text-base'>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='border mt-6 p-6 rounded-lg mb-6'>
          <p>Lead Pipeline</p>
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-6 '>
            {LeadPipeline.map((item) => (
              <div key={item.id} className='bg-white p-6 rounded-lg border '>
                <div className=''>
                  <div className='flex items-center gap-3 justify-center '>
                    <div>
                      <h3 className='text-[#101828] font-bold text-2xl text-center'>
                        {item.total}
                      </h3>
                      <p className='text-[#101828] font-medium text-base'>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
