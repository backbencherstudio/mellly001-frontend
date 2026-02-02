/** @format */

"use client";

import React, { useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";

type GetStartedModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    name: string;
    clinicName: string;
    speciality: string;
    email: string;
    whatsapp: string;
  }) => void;
};

export default function GetStartedModal({
  open,
  onClose,
  onSubmit,
}: GetStartedModalProps) {
  const [form, setForm] = useState({
    name: "",
    clinicName: "",
    speciality: "",
    email: "",
    whatsapp: "",
  });

  // ESC to close
  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Prevent background scroll when modal open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  const setField = (key: keyof typeof form, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(form);

    // form reset after submit
    setForm({
      name: "",
      clinicName: "",
      speciality: "",
      email: "",
      whatsapp: "",
    });
  };

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center px-4'>
      {/* Overlay */}
      <button
        type='button'
        aria-label='Close modal overlay'
        onClick={onClose}
        className='absolute inset-0 bg-black/40 backdrop-blur-[18px] cursor-pointer'
      />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className='relative w-full max-w-[520px] rounded-2xl bg-white shadow-2xl overflow-hidden'>
        {/* Header */}
        <div className='px-6 pt-6 relative'>
          <button
            type='button'
            aria-label='Close'
            onClick={onClose}
            className='absolute right-5 top-5 rounded-full p-1 hover:bg-gray-100 cursor-pointer'>
            <X className='h-5 w-5 text-gray-700' />
          </button>

          <h2 className='text-3xl font-semibold text-gray-900'>Get Started</h2>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className='px-6 pb-6 pt-4 max-h-[80vh] overflow-y-auto'>
          <div className='space-y-3'>
            {/* Name */}
            <div>
              <label className='text-[18px] text-[#777980]'>Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder='Enter Full Name'
                className='mt-2 w-full h-11 rounded-xl border border-gray-200 px-4 text-[18px] outline-none  focus:border-gray-400'
              />
            </div>

            {/* Clinic Name */}
            <div>
              <label className='text-[18px] text-[#777980]'>Clinic name</label>
              <input
                required
                value={form.clinicName}
                onChange={(e) => setField("clinicName", e.target.value)}
                placeholder='Enter Clinic Name'
                className='mt-2 w-full h-11 rounded-xl border border-gray-200 px-4 text-[18px] outline-none focus:border-gray-400'
              />
            </div>

            {/* Speciality */}
            <div>
              <label className='text-[18px] text-[#777980]'>Speciality</label>
              <div className='relative mt-2'>
                <select
                  required
                  value={form.speciality}
                  onChange={(e) => setField("speciality", e.target.value)}
                  className='w-full h-11 appearance-none rounded-xl border border-gray-200 bg-white px-4 pr-10 text-[18px] outline-none focus:border-gray-400 cursor-pointer'>
                  <option value='' disabled>
                    Select Speciality
                  </option>
                  <option value='Dentistry'>Dentistry</option>
                  <option value='Aesthetic Clinic'>
                    Aesthetics Medicine/Botox
                  </option>
                  <option value='Plastic Surgery'>Plastic Surgery</option>
                  <option value='Dermatology'>
                    Gender-Affirming Procedure
                  </option>
                  <option value='Other'>Body-transformation services</option>
                  <option value='Other'>
                    {" "}
                    <option value='Other'>Body-transformation services</option>
                  </option>
                </select>
                <ChevronDown className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500' />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className='text-[18px] text-[#777980]'>Email</label>
              <input
                required
                type='email'
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder='Enter Email'
                className='mt-2 w-full h-11 rounded-xl border border-gray-200 px-4 text-[18px] outline-none focus:border-gray-400'
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className='text-[18px] text-[#777980]'>Whatsapp</label>
              <input
                required
                value={form.whatsapp}
                onChange={(e) => setField("whatsapp", e.target.value)}
                placeholder='Enter Whatsapp Number'
                className='mt-2 w-full h-11 rounded-xl border border-gray-200 px-4 text-[18px] outline-none focus:border-gray-400'
              />
            </div>
          </div>

          {/* Button */}
          <button
            type='submit'
            className='mt-6 h-12 w-full rounded-xl bg-[#173E43] text-white font-medium cursor-pointer hover:opacity-95'>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
