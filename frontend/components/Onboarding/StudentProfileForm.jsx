"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const DEGREES = ["B.Tech", "MBA", "BCA", "B.Sc", "M.Tech", "M.Sc", "B.A", "M.A", "B.Com", "M.Com", "Other"];
const BRANCHES = ["CSE", "ECE", "ME", "CIVIL", "EE", "IT", "BT", "CS-DS", "CSIT", "AIML", "ECZ", "Other"];
const YEARS = [
  { value: 1, label: "1st Year" },
  { value: 2, label: "2nd Year" },
  { value: 3, label: "3rd Year" },
  { value: 4, label: "4th Year" },
];

export default function StudentProfileForm({ onSubmit, isLoading, user }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    college: "Dronacharya Group of Institutions",
    degree: "",
    branch: "",
    year: "",
    skills: "",
    interests: "",
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(user?.profilePicture || null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) newErrors.name = "Full Name is required";
    if (!formData.degree) newErrors.degree = "Degree is required";
    if (!formData.branch) newErrors.branch = "Branch is required";
    if (!formData.year) newErrors.year = "Year of Study is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    await onSubmit({
      ...formData,
      skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()).filter((s) => s) : [],
      interests: formData.interests ? formData.interests.split(",").map((i) => i.trim()).filter((i) => i) : [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Complete Your Student Profile</h2>
          <span className="text-sm font-medium text-blue-600">Step 2 of 2</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "100%" }}></div>
        </div>
      </div>

      {/* Profile Picture */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Profile Picture (Optional)</label>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
            {previewImage ? (
              <img src={previewImage} alt="Profile preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-3xl">📷</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          required
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* College Name */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          College Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="college"
          value={formData.college}
          onChange={handleChange}
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">Pre-filled with verified college</p>
      </div>

      {/* Degree and Branch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Degree <span className="text-red-500">*</span>
          </label>
          <select
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
              errors.degree ? "border-red-500" : "border-gray-300"
            }`}
            required
          >
            <option value="">Select Degree</option>
            {DEGREES.map((deg) => (
              <option key={deg} value={deg}>
                {deg}
              </option>
            ))}
          </select>
          {errors.degree && <p className="text-red-500 text-sm mt-1">{errors.degree}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Branch <span className="text-red-500">*</span>
          </label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
              errors.branch ? "border-red-500" : "border-gray-300"
            }`}
            required
          >
            <option value="">Select Branch</option>
            {BRANCHES.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
          {errors.branch && <p className="text-red-500 text-sm mt-1">{errors.branch}</p>}
        </div>
      </div>

      {/* Year of Study */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Year of Study <span className="text-red-500">*</span>
        </label>
        <select
          name="year"
          value={formData.year}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
            errors.year ? "border-red-500" : "border-gray-300"
          }`}
          required
        >
          <option value="">Select Year</option>
          {YEARS.map((y) => (
            <option key={y.value} value={y.value}>
              {y.label}
            </option>
          ))}
        </select>
        {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
      </div>

      {/* Skills */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Skills (Optional)</label>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="e.g., React, Python, TypeScript (comma-separated)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Enter skills separated by commas</p>
      </div>

      {/* Interests */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Interests (Optional)</label>
        <input
          type="text"
          name="interests"
          value={formData.interests}
          onChange={handleChange}
          placeholder="e.g., Web Development, AI, Gaming (comma-separated)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Enter interests separated by commas</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Setting up your profile...
          </span>
        ) : (
          "Complete Profile Setup"
        )}
      </button>
    </form>
  );
}
