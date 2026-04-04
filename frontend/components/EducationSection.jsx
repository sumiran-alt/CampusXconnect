"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { educationAPI } from "@/lib/api";

export default function EducationSection({ userId, isOwnProfile }) {
  const [educations, setEducations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (userId) {
      loadEducations();
    }
  }, [userId]);

  const [formData, setFormData] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    currentlyStudying: false,
    grade: "",
    activities: "",
    description: "",
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
      if (editingId) {
        await educationAPI.updateEducation(editingId, formData);
        toast.success("Education updated successfully");
      } else {
        await educationAPI.addEducation(formData);
        toast.success("Education added successfully");
      }

      setFormData({
        school: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        currentlyStudying: false,
        grade: "",
        activities: "",
        description: "",
      });
      setShowForm(false);
      setEditingId(null);
      // Refresh education list
      loadEducations();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save education");
    } finally {
      setLoading(false);
    }
  };

  const loadEducations = async () => {
    try {
      if (!userId) return;
      const res = await educationAPI.getUserEducation(userId);
      setEducations(res.data.education);
    } catch (error) {
      // Silently handle errors - user may not have any education data yet
      console.error("Error loading educations:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this education?")) {
      try {
        await educationAPI.deleteEducation(id);
        toast.success("Education deleted successfully");
        loadEducations();
      } catch (error) {
        toast.error("Failed to delete education");
      }
    }
  };

  const handleEdit = (education) => {
    setFormData({
      school: education.school,
      degree: education.degree,
      fieldOfStudy: education.fieldOfStudy,
      startDate: education.startDate?.split("T")[0] || "",
      endDate: education.endDate?.split("T")[0] || "",
      currentlyStudying: education.currentlyStudying,
      grade: education.grade,
      activities: education.activities,
      description: education.description,
    });
    setEditingId(education._id);
    setShowForm(true);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">🎓 Education</h2>
        {isOwnProfile && (
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                school: "",
                degree: "",
                fieldOfStudy: "",
                startDate: "",
                endDate: "",
                currentlyStudying: false,
                grade: "",
                activities: "",
                description: "",
              });
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "+ Add Education"}
          </button>
        )}
      </div>

      {showForm && isOwnProfile && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
          <input
            type="text"
            name="school"
            placeholder="School/College Name"
            value={formData.school}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="degree"
            placeholder="Degree"
            value={formData.degree}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="fieldOfStudy"
            placeholder="Field of Study"
            value={formData.fieldOfStudy}
            onChange={handleChange}
            required
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
              name="currentlyStudying"
              checked={formData.currentlyStudying}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label className="text-gray-700">Currently Studying</label>
          </div>
          {!formData.currentlyStudying && (
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <input
            type="text"
            name="grade"
            placeholder="Grade (Optional)"
            value={formData.grade}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="activities"
            placeholder="Activities (Optional)"
            value={formData.activities}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="description"
            placeholder="Description (Optional)"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : editingId ? "Update Education" : "Add Education"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {educations.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No education added yet</p>
        ) : (
          educations.map((edu) => (
            <div key={edu._id} className="border-l-4 border-blue-600 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{edu.degree} in {edu.fieldOfStudy}</h3>
                  <p className="text-gray-700">{edu.school}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(edu.startDate).getFullYear()} - {edu.currentlyStudying ? "Present" : new Date(edu.endDate).getFullYear()}
                  </p>
                  {edu.grade && <p className="text-sm text-gray-600">Grade: {edu.grade}</p>}
                  {edu.description && <p className="text-gray-600 mt-2">{edu.description}</p>}
                </div>
                {isOwnProfile && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(edu)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(edu._id)}
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
