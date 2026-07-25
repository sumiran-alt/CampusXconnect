"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { postAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function CreatePost() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    githubLink: "",
  });

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const postData = {
        title: formData.title,
        description: formData.description,
        techStack: formData.techStack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        githubLink: formData.githubLink,
      };

      await postAPI.createPost(postData);

      toast.success("Post created successfully!");
      router.push("/feed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Create a New Project Post</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              placeholder="e.g., AI-powered Study Platform"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              rows="6"
              placeholder="Describe your project in detail..."
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Tech Stack (comma-separated)
            </label>
            <input
              type="text"
              name="techStack"
              value={formData.techStack}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              placeholder="React, Node.js, MongoDB, TailwindCSS"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              GitHub Link
            </label>
            <input
              type="url"
              name="githubLink"
              value={formData.githubLink}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Publishing..." : "Publish Post"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/feed")}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
