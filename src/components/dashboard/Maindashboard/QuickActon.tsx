/** @format */
"use client";

import React from "react";
import { Sparkles, Plus, Users } from "lucide-react";

type QuickActionsProps = {
  onCreateSimulation?: () => void;
  onAddPatient?: () => void;
  onViewLeads?: () => void;
};

export default function QuickActions({
  onCreateSimulation,
  onAddPatient,
  onViewLeads,
}: QuickActionsProps) {
  return (
    <div className='w-full h-full  rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
      {/* Title */}
      <h3 className='mb-4 text-lg font-semibold text-gray-900'>
        Quick Actions
      </h3>

      {/* Actions */}
      <div className='space-y-3'>
        {/* Create Simulation */}
        <button
          onClick={onCreateSimulation}
          className='flex w-full items-center gap-3 rounded-lg bg-[#2D9AAF] px-4 py-3 text-white hover:bg-[#2D9AAF]/90 transition'>
          <Sparkles size={18} />
          <span className='text-sm font-medium'>Create Simulation</span>
        </button>

        {/* Add Patient */}
        <button
          onClick={onAddPatient}
          className='flex w-full items-center gap-3 rounded-lg bg-[#1F3F46] px-4 py-3 text-white hover:bg-[#1F3F46]/90 transition'>
          <Plus size={18} />
          <span className='text-sm font-medium'>Add Patient</span>
        </button>

        {/* View Leads */}
        <button
          onClick={onViewLeads}
          className='flex w-full items-center gap-3 rounded-lg border border-[#2D9AAF] px-4 py-3 text-[#2D9AAF] hover:bg-[#2D9AAF]/5 transition'>
          <Users size={18} />
          <span className='text-sm font-medium'>View Leads</span>
        </button>
      </div>
    </div>
  );
}
