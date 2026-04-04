"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { certificationAPI } from "@/lib/api";

export default function CertificationSection({ userId, isOwnProfile }) {
  const [certifications, setCertifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (userId) {
      loadCertifications();
    }
  }, [userId]);

  const [formData, setFormData] = useState({
    name: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    doesNotExpire: false,
    credentialId: "",
    credentialUrl: "",
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
        await certificationAPI.updateCertification(editingId, formData);
        toast.success("Certification updated successfully");
      } else {
        await certificationAPI.addCertification(formData);
        toast.success("Certification added successfully");
      }

      setFormData({
        name: "",
        issuer: "",
        issueDate: "",
        expiryDate: "",
        doesNotExpire: false,
        credentialId: "",
        credentialUrl: "",
        description: "",
      });
      setShowForm(false);
      setEditingId(null);
      loadCertifications();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save certification");
    } finally {
      setLoading(false);
    }
  };

  const loadCertifications = async () => {
    try {
      if (!userId) return;
      const res = await certificationAPI.getUserCertifications(userId);
      setCertifications(res.data.certifications);
    } catch (error) {
      // Silently handle errors - user may not have any certification data yet
      console.error("Error loading certifications:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this certification?")) {
      try {
        await certificationAPI.deleteCertification(id);
        toast.success("Certification deleted successfully");
        loadCertifications();
      } catch (error) {
        toast.error("Failed to delete certification");
      }
    }
  };

  const handleEdit = (cert) => {
    setFormData({
      name: cert.name,
      issuer: cert.issuer,
      issueDate: cert.issueDate?.split("T")[0] || "",
      expiryDate: cert.expiryDate?.split("T")[0] || "",
      doesNotExpire: cert.doesNotExpire,
      credentialId: cert.credentialId,
      credentialUrl: cert.credentialUrl,
      description: cert.description,
    });
    setEditingId(cert._id);
    setShowForm(true);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">🏆 Certifications</h2>
        {isOwnProfile && (
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                name: "",
                issuer: "",
                issueDate: "",
                expiryDate: "",
                doesNotExpire: false,
                credentialId: "",
                credentialUrl: "",
                description: "",
              });
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "+ Add Certification"}
          </button>
        )}
      </div>

      {showForm && isOwnProfile && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Certification Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="issuer"
            placeholder="Issuer Organization"
            value={formData.issuer}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="doesNotExpire"
              checked={formData.doesNotExpire}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label className="text-gray-700">Does not expire</label>
          </div>
          {!formData.doesNotExpire && (
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <input
            type="text"
            name="credentialId"
            placeholder="Credential ID (Optional)"
            value={formData.credentialId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="url"
            name="credentialUrl"
            placeholder="Credential URL (Optional)"
            value={formData.credentialUrl}
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
            {loading ? "Saving..." : editingId ? "Update Certification" : "Add Certification"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {certifications.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No certifications added yet</p>
        ) : (
          certifications.map((cert) => (
            <div key={cert._id} className="border-l-4 border-yellow-600 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{cert.name}</h3>
                  <p className="text-gray-700">{cert.issuer}</p>
                  <p className="text-sm text-gray-600">
                    Issued: {new Date(cert.issueDate).toLocaleDateString()}
                    {!cert.doesNotExpire && cert.expiryDate && ` • Expires: ${new Date(cert.expiryDate).toLocaleDateString()}`}
                    {cert.doesNotExpire && " • No expiration"}
                  </p>
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                      View Credential →
                    </a>
                  )}
                  {cert.description && <p className="text-gray-600 mt-2">{cert.description}</p>}
                </div>
                {isOwnProfile && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(cert)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cert._id)}
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
