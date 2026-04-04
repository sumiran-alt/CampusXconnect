"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { experienceAPI } from "@/lib/api";

export default function ExperienceSection({ userId, isOwnProfile }) {
  const [experiences, setExperiences] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (userId) {
      loadExperiences();
    }
  }, [userId]);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    type: "Job",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    description: "",
    skills: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        skills: formData.skills.split(",").map((s) => s.trim()).filter((s) => s),
      };

      if (editingId) {
        await experienceAPI.updateExperience(editingId, submitData);
        toast.success("Experience updated successfully");
      } else {
        await experienceAPI.addExperience(submitData);
        toast.success("Experience added successfully");
      }

      setFormData({
        title: "",
        company: "",
        type: "Job",
        location: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        description: "",
        skills: "",
      });
      setShowForm(false);
      setEditingId(null);
      loadExperiences();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save experience");
    } finally {
      setLoading(false);
    }
  };

  const loadExperiences = async () => {
    try {
      if (!userId) return;
      const res = await experienceAPI.getUserExperience(userId);
      setExperiences(res.data.experience);
    } catch (error) {
      // Silently handle errors - user may not have any experience data yet
      console.error("Error loading experiences:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      try {
        await experienceAPI.deleteExperience(id);
        toast.success("Experience deleted successfully");
        loadExperiences();
      } catch (error) {
        toast.error("Failed to delete experience");
      }
    }
  };

  const handleEdit = (exp) => {
    setFormData({
      title: exp.title,
      company: exp.company,
      type: exp.type,
      location: exp.location,
      startDate: exp.startDate?.split("T")[0] || "",
      endDate: exp.endDate?.split("T")[0] || "",
      currentlyWorking: exp.currentlyWorking,
      description: exp.description,
      skills: exp.skills?.join(", ") || "",
    });
    setEditingId(exp._id);
    setShowForm(true);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">💼 Experience</h2>
        {isOwnProfile && (
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                title: "",
                company: "",
                type: "Job",
                location: "",
                startDate: "",
                endDate: "",
                currentlyWorking: false,
                description: "",
                skills: "",
              });
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "+ Add Experience"}
          </button>
        )}
      </div>

      {showForm && isOwnProfile && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Job">Full-time</option>
            <option value="Internship">Internship</option>
            <option value="Freelance">Freelance</option>
            <option value="Contract">Contract</option>
            <option value="Part-time">Part-time</option>
          </select>
          <input
            type="text"
            name="location"
            placeholder="Location (Optional)"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="currentlyWorking"
              checked={formData.currentlyWorking}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label className="text-gray-700">Currently Working</label>
          </div>
          {!formData.currentlyWorking && (
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <textarea
            name="description"
            placeholder="Description (Optional)"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="skills"
            placeholder="Skills (comma-separated, e.g., React, Node.js, MongoDB)"
            value={formData.skills}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : editingId ? "Update Experience" : "Add Experience"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {experiences.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No experience added yet</p>
        ) : (
          experiences.map((exp) => (
            <div key={exp._id} className="border-l-4 border-green-600 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{exp.title}</h3>
                  <p className="text-gray-700">{exp.company} • {exp.type}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(exp.startDate).toLocaleDateString()} - {exp.currentlyWorking ? "Present" : new Date(exp.endDate).toLocaleDateString()}
                  </p>
                  {exp.location && <p className="text-sm text-gray-600">📍 {exp.location}</p>}
                  {exp.description && <p className="text-gray-600 mt-2">{exp.description}</p>}
                  {exp.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {exp.skills.map((skill, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {isOwnProfile && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
