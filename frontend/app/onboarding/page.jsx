"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/store";
import { userAPI } from "@/lib/api";
import RoleSelectionModal from "@/components/Onboarding/RoleSelectionModal";
import StudentProfileForm from "@/components/Onboarding/StudentProfileForm";
import AlumniProfileForm from "@/components/Onboarding/AlumniProfileForm";

const STEPS = {
  ROLE_SELECTION: "role_selection",
  PROFILE_FORM: "profile_form",
  SUCCESS: "success",
};

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [currentStep, setCurrentStep] = useState(STEPS.ROLE_SELECTION);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/auth");
    }
  }, [user, router]);

  // Handle role selection
  const handleRoleSelected = async (role) => {
    setIsLoading(true);
    try {
      // Save role to backend
      await userAPI.setUserType(role);
      setSelectedRole(role);
      setCurrentStep(STEPS.PROFILE_FORM);
    } catch (error) {
      console.error("Error setting user type:", error);
      toast.error(error.response?.data?.message || "Failed to select role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile form submission
  const handleProfileSubmit = async (profileData) => {
    setIsLoading(true);
    try {
      // Combine role with profile data
      const completeData = {
        degree: profileData.degree,
        branch: profileData.branch,
        ...(selectedRole === "student" && {
          year: profileData.year,
        }),
        ...(selectedRole === "alumni" && {
          passoutYear: profileData.passoutYear,
          company: profileData.company,
          jobRole: profileData.jobRole,
        }),
        skills: profileData.skills,
        ...(selectedRole === "student" && {
          interests: profileData.interests,
        }),
        ...(profileData.profilePicture && {
          profilePicture: profileData.profilePicture,
        }),
      };

      // Submit to backend
      await userAPI.completeProfileSetup(completeData);
      
      toast.success("Profile setup complete! Welcome to CampusXConnect 🎓");
      setCurrentStep(STEPS.SUCCESS);
      
      // Redirect to profile or home after 2 seconds
      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    } catch (error) {
      console.error("Error completing profile setup:", error);
      toast.error(error.response?.data?.message || "Failed to complete profile setup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to CampusXConnect 🎓</h1>
          <p className="text-gray-600">Let's get your profile set up in just a few steps</p>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          {currentStep === STEPS.ROLE_SELECTION && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <RoleSelectionModal 
                onRoleSelected={handleRoleSelected}
                isLoading={isLoading}
                isOpen={true}
              />
            </div>
          )}

          {currentStep === STEPS.PROFILE_FORM && selectedRole === "student" && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <StudentProfileForm 
                onSubmit={handleProfileSubmit}
                isLoading={isLoading}
                user={user}
              />
            </div>
          )}

          {currentStep === STEPS.PROFILE_FORM && selectedRole === "alumni" && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <AlumniProfileForm 
                onSubmit={handleProfileSubmit}
                isLoading={isLoading}
                user={user}
              />
            </div>
          )}

          {currentStep === STEPS.SUCCESS && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Setup Complete!</h2>
              <p className="text-gray-600 mb-6">
                Your profile is all set up. You're ready to connect with students and alumni on CampusXConnect.
              </p>
              <div className="text-sm text-gray-500">
                Redirecting to your profile...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
