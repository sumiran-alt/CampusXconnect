"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function RoleSelectionModal({ onRoleSelected, isOpen }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (!selectedRole) {
      toast.error("Please select your role to continue");
      return;
    }

    setIsLoading(true);
    try {
      // Call the parent function to proceed
      await onRoleSelected(selectedRole);
    } catch (error) {
      console.error("Error selecting role:", error);
      toast.error("Failed to proceed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome to CampusXConnect! 🎓</h1>
          <p className="text-blue-100 text-lg">Let's personalize your experience</p>
        </div>

        {/* Content */}
        <div className="px-8 py-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">What describes you best?</h2>
          <p className="text-gray-600 mb-8">Select your current status to customize your profile setup</p>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Student Card */}
            <button
              onClick={() => handleRoleSelect("student")}
              className={`relative p-8 rounded-xl border-2 transition-all duration-300 group ${
                selectedRole === "student"
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-gray-200 hover:border-blue-300 hover:shadow-md"
              }`}
            >
              {/* Selected Badge */}
              {selectedRole === "student" && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              <div className="text-center">
                <div className="text-5xl mb-4">🎓</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Current Student</h3>
                <p className="text-gray-600 text-sm">I'm actively studying at a college</p>
              </div>

              {/* Benefits List */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-left">
                <div className="space-y-2 text-xs text-gray-700">
                  <p className="flex items-center gap-2">
                    <span className="text-blue-500">✓</span> Connect with classmates
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-blue-500">✓</span> Find internship opportunities
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-blue-500">✓</span> Track your semester
                  </p>
                </div>
              </div>
            </button>

            {/* Alumni Card */}
            <button
              onClick={() => handleRoleSelect("alumni")}
              className={`relative p-8 rounded-xl border-2 transition-all duration-300 group ${
                selectedRole === "alumni"
                  ? "border-green-500 bg-green-50 shadow-lg"
                  : "border-gray-200 hover:border-green-300 hover:shadow-md"
              }`}
            >
              {/* Selected Badge */}
              {selectedRole === "alumni" && (
                <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full w-7 h-7 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              <div className="text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Alumni</h3>
                <p className="text-gray-600 text-sm">I've graduated and moved on</p>
              </div>

              {/* Benefits List */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-left">
                <div className="space-y-2 text-xs text-gray-700">
                  <p className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Connect with alumni network
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Share career updates
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Mentor current students
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleContinue}
              disabled={!selectedRole || isLoading}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                selectedRole && !isLoading
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                "Continue →"
              )}
            </button>
          </div>

          {/* Info Text */}
          <p className="text-center text-xs text-gray-500 mt-4">
            You can change this anytime in your profile settings
          </p>
        </div>
      </div>
    </div>
  );
}
