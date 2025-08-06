"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Zod schema for form validation
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call - replace with your actual authentication logic
      console.log("Form data:", data);
      
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo purposes, let's assume login is successful
      // In a real app, you would validate credentials with your backend
      if (data.email && data.password) {
        // Store authentication state (you might want to use a state management solution)
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", data.email);
        
        // Redirect to dashboard
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Section - Illustration */}
        <div className="lg:w-1/2  p-8 lg:p-12 flex items-center justify-center bg-[#F2F2F2]">
          <div className="max-w-3xl w-full">
            <div className="relative">
              <Image src="/login/login.svg" alt="Login" width={900} height={900} className="w-full h-full" />
            </div>
          </div>
        </div>

        {/* Right Section - Sign-in Form */}
        <div className="lg:w-1/2 bg-white p-8 lg:p-12 flex items-center justify-center">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl lg:text-5xl font-bold text-black mb-18 text-center">
                Welcome back!
              </h1>
              <h2 className="text-3xl font-bold text-gray-900">
                Sign In
              </h2>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  name="email"
                  className={`w-full px-4 py-3 border-0 rounded-2xl focus:border-2 focus:outline-0 focus:ring-0 focus:border-green-200 font-semibold bg-gray-100 transition-colors placeholder:font-semibold ${
                    errors.email ? "border-red-200 focus:border-red-300" : ""
                  }`}
                  placeholder="Email address"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <input
                  {...register("password")}
                  type="password"
                  id="password"
                  name="password"
                  className={`w-full px-4 py-3 border-0 rounded-2xl focus:border-2 focus:outline-0 focus:ring-0 focus:border-green-200 font-semibold bg-gray-100 transition-colors placeholder:font-semibold ${
                    errors.password ? "border-red-200 focus:border-red-300" : ""
                  }`}
                  placeholder="Password"
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    {...register("remember")}
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 bg-green-600! focus:ring-0 ring-0 outline-0 focus:outline-0 border-0 rounded"
                    disabled={isLoading}
                  />
                  <label htmlFor="remember" className="ml-2 block font-semibold text-sm text-gray-700">
                    keep me signed in
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm text-green-600 hover:text-green-500 font-medium transition-colors"
                >
                  Forgot password
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-300 disabled:bg-green-300 disabled:cursor-not-allowed text-[#1B512D] font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mt-3"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
