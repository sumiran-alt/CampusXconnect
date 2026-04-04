"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function ForgotPassword() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);

  // Handle requesting OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      await authAPI.sendOTP(email);
      toast.success("OTP sent to your email!");
      setStep(2);
      setTimer(600); // 10 minutes timer
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification and login
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.verifyOTP(email, otp);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setAuth(user, token);

      toast.success("Login successful!");

      // Redirect based on role
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/feed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {step === 1 ? "Reset Password" : "Verify OTP"}
        </h2>
        <p className="text-gray-600 mb-6">
          {step === 1
            ? "Enter your email to receive an OTP"
            : "Enter the OTP sent to your email"}
        </p>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="your@email.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: OTP Input */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                maxLength="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-center text-2xl"
                placeholder="000000"
                required
              />
            </div>

            <div className="text-center text-sm text-gray-600">
              {timer > 0 ? (
                <p>
                  OTP expires in:{" "}
                  <span className="font-semibold text-red-600">
                    {formatTimer()}
                  </span>
                </p>
              ) : (
                <p className="text-red-600">OTP expired</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || timer <= 0}
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP & Login"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setTimer(0);
              }}
              className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Back to Email
            </button>
          </form>
        )}

        {/* Back to Login */}
        <p className="text-center text-gray-600 mt-6">
          Remember your password?{" "}
          <Link
            href="/auth"
            className="text-primary font-semibold hover:underline"
          >
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
