"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { userAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

const DEGREES = ["B.Tech", "MBA", "BCA", "B.Sc", "M.Tech", "M.Sc", "B.A", "M.A", "B.Com", "M.Com", "Other"];

const BRANCHES = ["CSE", "ECE", "ME", "CIVIL", "EE", "IT", "BT", "CS-DS", "CSIT", "AIML", "ECZ", "Other"];

const YEARS = [1, 2, 3, 4];

export default function ProfileSetup() {
  const router = useRouter();
  const { user, isAuthenticated, setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    degree: "",
    branch: "",
    year: "",
    profilePicture: "",
    github: "",
    linkedin: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }
  }, [isAuthenticated, router]);

  // Handle image file select and convert to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2097152) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData((prev) => ({
          ...prev,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.degree || !formData.branch || !formData.year) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await userAPI.completeProfileSetup({
        degree: formData.degree,
        branch: formData.branch,
        year: parseInt(formData.year),
        profilePicture: formData.profilePicture || undefined,
        github: formData.github || undefined,
        linkedin: formData.linkedin || undefined,
      });

      const { user: updatedUser } = response.data;
      
      // Update auth store with new user data
      const token = localStorage.getItem("token");
      setAuth(updatedUser, token);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile setup completed!");
      router.push("/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to complete profile setup");
      console.error("Profile setup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const isStudent = user?.userType === "student";
  const isAlumni = user?.userType === "alumni";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
        <p className="text-gray-600 mb-6">
          {isStudent && "Help us learn more about your academic journey"}
          {isAlumni && "Help us know about your graduation and career path"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Display (Read-only) */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              value={user?.name || ""}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Auto-detected from signup</p>
          </div>

          {/* Email Display (Read-only) */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Auto-detected from signup</p>
          </div>

          {/* Degree Selection */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Education Degree <span className="text-red-500">*</span>
            </label>
            <select
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              required
            >
              <option value="">Select your degree</option>
              {DEGREES.map((degree) => (
                <option key={degree} value={degree}>
                  {degree}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Selection */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Branch/Specialization <span className="text-red-500">*</span>
            </label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              required
            >
              <option value="">Select your branch</option>
              {BRANCHES.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          {/* Year Selection */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Year of Study <span className="text-red-500">*</span>
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              required
            >
              <option value="">Select your year</option>
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  Year {year}
                </option>
              ))}
            </select>
          </div>

          {/* Profile Photo Upload */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Profile Photo <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-xs text-center p-2">
                    Photo Preview
                  </span>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max size: 2MB
                </p>
              </div>
            </div>
          </div>

          {/* GitHub Profile */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              GitHub Profile <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          {/* LinkedIn Profile */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              LinkedIn Profile <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Setting up profile..." : "Complete Profile Setup"}
          </button>

          {/* Skip Button */}
          <button
            type="button"
            onClick={() => router.push("/profile")}
            disabled={loading}
            className="w-full text-primary py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Skip for now
          </button>
        </form>
      </div>
    </div>
  );
}
