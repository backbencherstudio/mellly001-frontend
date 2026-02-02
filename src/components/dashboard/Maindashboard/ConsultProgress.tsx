/** @format */

"use client";

import React from "react";

type ConsultProgressProps = {
  label: string;
  value: number; // current value (52)
  total?: number; // optional total
  percentage: number; // 43
};

export default function ConsultProgress({
  label,
  value,
  percentage,
}: ConsultProgressProps) {
  return (
    <div className='space-y-2'>
      {/* Top labels */}
      <div className='flex justify-between text-sm text-gray-700'>
        <span>{label}</span>
        <span className='text-gray-600'>
          {value} patients ({percentage}%)
        </span>
      </div>

      {/* Progress bar */}
      <div className='relative h-9 w-full rounded-full bg-[#E5E7EB] overflow-hidden'>
        {/* Filled bar */}
        <div
          className='absolute left-0 top-0 h-full rounded-full flex items-center justify-end pr-4 text-white text-sm font-medium'
          style={{
            width: `${percentage}%`,
            background: "linear-gradient(180deg, #2D9AAF 0%, #1F6F7A 100%)",
          }}>
          {value}
        </div>
      </div>
    </div>
  );
}
