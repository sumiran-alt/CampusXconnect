"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/store";
import axios from "axios";

export default function UserTypeSelection() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isAuthenticated, router]);

  const handleSelectType = async (type) => {
    setSelectedType(type);
    setLoading(true);

    try {
      // Save user type to backend
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001"}/api/users/user-type`,
        { userType: type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`You've selected as ${type}`);
      
      // Redirect to profile setup
      router.push("/profile-setup");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save user type");
      console.error("User type selection error:", error);
      setSelectedType(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white p-8 rounded-xl shadow-xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome, {user?.name}!
            </h1>
            <p className="text-lg text-gray-600">
              Let us know your current status to customize your experience
            </p>
          </div>

          {/* Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Card */}
            <button
              onClick={() => handleSelectType("student")}
              disabled={loading}
              className={`relative p-8 rounded-xl border-2 transition-all duration-300 ${
                selectedType === "student"
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-gray-200 hover:border-blue-300 hover:shadow-md"
              } ${loading && selectedType !== "student" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {/* Selected Indicator */}
              {selectedType === "student" && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              {/* Loading Spinner */}
              {loading && selectedType === "student" && (
                <div className="absolute inset-0 rounded-xl bg-white bg-opacity-50 flex items-center justify-center">
                  <div className="animate-spin">
                    <svg
                      className="w-8 h-8 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Icon and Text */}
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="text-5xl">🎓</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Current Student
                  </h3>
                  <p className="text-gray-600 text-sm">
                    I'm currently studying at the college
                  </p>
                </div>
              </div>

              {/* Description List */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
                  Tell us your current year of study
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
                  Connect with classmates & seniors
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
                  Access learning resources
                </p>
              </div>
            </button>

            {/* Alumni Card */}
            <button
              onClick={() => handleSelectType("alumni")}
              disabled={loading}
              className={`relative p-8 rounded-xl border-2 transition-all duration-300 ${
                selectedType === "alumni"
                  ? "border-green-500 bg-green-50 shadow-lg"
                  : "border-gray-200 hover:border-green-300 hover:shadow-md"
              } ${loading && selectedType !== "alumni" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {/* Selected Indicator */}
              {selectedType === "alumni" && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              {/* Loading Spinner */}
              {loading && selectedType === "alumni" && (
                <div className="absolute inset-0 rounded-xl bg-white bg-opacity-50 flex items-center justify-center">
                  <div className="animate-spin">
                    <svg
                      className="w-8 h-8 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Icon and Text */}
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="text-5xl">🎯</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Alumni
                  </h3>
                  <p className="text-gray-600 text-sm">
                    I've graduated and moved on
                  </p>
                </div>
              </div>

              {/* Description List */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                  Tell us your graduation year
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                  Connect with alumni network
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                  Share career updates & opportunities
                </p>
              </div>
            </button>
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-900">
              📝 <strong>Note:</strong> You can always update this information later in your profile settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
