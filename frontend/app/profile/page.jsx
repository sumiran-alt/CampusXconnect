"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { userAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function Profile() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skills: "",
    github: "",
    linkedin: "",
    branch: "",
    year: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    fetchProfile();
  }, [isAuthenticated, router]);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setProfile(response.data.user);
      setFormData({
        name: response.data.user.name,
        bio: response.data.user.bio,
        skills: response.data.user.skills?.join(", ") || "",
        github: response.data.user.github,
        linkedin: response.data.user.linkedin,
        branch: response.data.user.branch,
        year: response.data.user.year,
      });
    } catch (error) {
      toast.error("Failed to fetch profile");
    } finally {
      setLoading(false);
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

    try {
      const updateData = {
        name: formData.name,
        bio: formData.bio,
        skills: formData.skills.split(",").map((s) => s.trim()),
        github: formData.github,
        linkedin: formData.linkedin,
        branch: formData.branch,
        year: formData.year,
      };

      const response = await userAPI.updateProfile(updateData);
      setProfile(response.data.user);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!profile) {
    return <div className="text-center py-8">Profile not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Profile Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Branch
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option>CSE</option>
                  <option>ECE</option>
                  <option>ME</option>
                  <option>CIVIL</option>
                  <option>EE</option>
                  <option>IT</option>
                  <option>BT</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Year
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  GitHub
                </label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                rows="4"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="React, Node.js, MongoDB, ..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-700">
              <strong>Email:</strong> {profile.email}
            </p>
            <p className="text-gray-700">
              <strong>College:</strong> {profile.college}
            </p>
            <p className="text-gray-700">
              <strong>Branch:</strong> {profile.branch} | <strong>Year:</strong>{" "}
              {profile.year}
            </p>
            {profile.bio && (
              <p className="text-gray-700">
                <strong>Bio:</strong> {profile.bio}
              </p>
            )}
            {profile.skills?.length > 0 && (
              <div>
                <strong>Skills:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {(profile.github || profile.linkedin) && (
              <div className="flex gap-4">
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    GitHub
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* Followers/Following */}
        <div className="mt-8 pt-8 border-t">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-2xl font-bold text-primary">
                {profile.followers?.length || 0}
              </p>
              <p className="text-gray-600">Followers</p>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-2xl font-bold text-primary">
                {profile.following?.length || 0}
              </p>
              <p className="text-gray-600">Following</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
