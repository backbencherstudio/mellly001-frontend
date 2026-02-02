"use client"
import Image from "next/image";
import { useForm } from "react-hook-form";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function AdminLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm <LoginFormInputs >();

  const onSubmit = (data :LoginFormInputs ) => {
    console.log("Login Data:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FEF0]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/assets/images/authlogo.png" width={210} height={38} alt="auth logo"/>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Admin Dashboard
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Maid Service Management System
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Email */}
          <div className="relative">
            <label className="text-sm text-gray-600 absolute bg-white left-4 -top-1 px-2">Email Address</label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-2 border border-[#DCDFD3] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              {...register("email", {
                required: "Email is required",
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-sm text-gray-600 absolute bg-white left-4 -top-1 px-2">Password</label>
            <input
              type="password"
              className="w-full mt-1 border-[#DCDFD3] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-full font-semibold transition"
          >
            Sign in
          </button>
        </form>

        {/* Demo Info */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Demo: Use 
          <span className="font-medium">
            admin@example.com / password123
          </span>
        </p>
      </div>
    </div>
  );
}
