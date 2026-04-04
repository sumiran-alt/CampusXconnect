"use client";

import { useState } from "react";
import { suggestionAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function SuggestionModal({ userId, userName, isOpen, onClose }) {
  const [suggestionText, setSuggestionText] = useState("");
  const [category, setCategory] = useState("other");
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: "skill_improvement", label: "Skill Improvement" },
    { value: "project_idea", label: "Project Idea" },
    { value: "career_advice", label: "Career Advice" },
    { value: "collaboration", label: "Collaboration" },
    { value: "other", label: "Other" },
  ];

  const handleSendSuggestion = async (e) => {
    e.preventDefault();

    if (!suggestionText.trim()) {
      toast.error("Please enter a suggestion");
      return;
    }

    if (suggestionText.trim().length < 10) {
      toast.error("Suggestion must be at least 10 characters");
      return;
    }

    try {
      setLoading(true);
      await suggestionAPI.sendSuggestion(
        userId,
        suggestionText,
        category
      );
      toast.success("Suggestion sent successfully! 🎉");
      setSuggestionText("");
      setCategory("other");
      onClose();
    } catch (error) {
      console.error("Error sending suggestion:", error);
      toast.error(
        error.response?.data?.message || "Failed to send suggestion"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            Send Suggestion to {userName}
          </h2>
          <button
            onClick={onClose}
            className="text-white text-2xl hover:opacity-80 transition"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSendSuggestion} className="p-6 space-y-4">
          {/* Category Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Suggestion Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Suggestion
            </label>
            <textarea
              value={suggestionText}
              onChange={(e) => setSuggestionText(e.target.value)}
              placeholder="Write a helpful suggestion... (min 10 characters, max 500)"
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={5}
            />
            <div className="text-xs text-gray-500 mt-1">
              {suggestionText.length}/500 characters
            </div>
          </div>

          {/* Examples */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">Examples:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• "Try learning React hooks for better state management"</li>
              <li>• "You should build a full-stack project together"</li>
              <li>• "Consider applying for internships in tech companies"</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !suggestionText.trim()}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                "Send Suggestion ✨"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
