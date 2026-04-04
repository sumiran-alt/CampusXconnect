"use client";

import { useState, useEffect } from "react";
import { suggestionAPI } from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

const categoryColors = {
  skill_improvement: "bg-blue-100 text-blue-800",
  project_idea: "bg-green-100 text-green-800",
  career_advice: "bg-purple-100 text-purple-800",
  collaboration: "bg-orange-100 text-orange-800",
  other: "bg-gray-100 text-gray-800",
};

const categoryLabels = {
  skill_improvement: "Skill Improvement",
  project_idea: "Project Idea",
  career_advice: "Career Advice",
  collaboration: "Collaboration",
  other: "Other",
};

export default function SuggestionsSection({ userId }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchSuggestions();
    }
  }, [userId]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await suggestionAPI.getUserSuggestions(userId);
      if (response.data.success) {
        setSuggestions(response.data.suggestions || []);
        setUnreadCount(response.data.unreadCount || 0);
      } else {
        toast.error("Failed to load suggestions");
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast.error("Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (suggestionId) => {
    try {
      const response = await suggestionAPI.markAsRead(suggestionId);
      if (response.data.success) {
        setSuggestions(
          suggestions.map((s) =>
            s._id === suggestionId ? { ...s, isRead: true } : s
          )
        );
        setUnreadCount(Math.max(0, unreadCount - 1));
        toast.success("Marked as read");
      }
    } catch (error) {
      console.error("Error marking as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  const handleDeleteSuggestion = async (suggestionId) => {
    try {
      const response = await suggestionAPI.deleteSuggestion(suggestionId);
      if (response.data.success) {
        setSuggestions(suggestions.filter((s) => s._id !== suggestionId));
        toast.success("Suggestion deleted");
      }
    } catch (error) {
      console.error("Error deleting suggestion:", error);
      toast.error("Failed to delete suggestion");
    }
  };

  const formatTime = (createdAt) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Suggestions {unreadCount > 0 && <span className="text-red-500">({unreadCount})</span>}
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Suggestions</h2>
        <p className="text-gray-600 text-lg">No suggestions yet. Keep an eye out! 👀</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Suggestions {unreadCount > 0 && <span className="text-red-500">({unreadCount} new)</span>}
        </h2>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion._id}
            className={`border rounded-lg p-4 transition-all ${
              suggestion.isRead ? "bg-gray-50 border-gray-200" : "bg-blue-50 border-blue-200"
            }`}
          >
            {/* Header: Sender Info + Badge */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                {suggestion.senderInfo?.senderProfilePicture && (
                  <img
                    src={suggestion.senderInfo.senderProfilePicture}
                    alt={suggestion.senderInfo?.senderName || "Unknown"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <Link href={`/profile/${suggestion.senderInfo?.senderId}`}>
                    <p className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                      {suggestion.senderInfo?.senderName || "Unknown User"}
                    </p>
                  </Link>
                  <p className="text-sm text-gray-500">
                    {formatTime(suggestion.createdAt)}
                  </p>
                </div>
              </div>

              {/* Category Badge */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                  categoryColors[suggestion.category] || categoryColors.other
                }`}
              >
                {categoryLabels[suggestion.category] || "Other"}
              </span>
            </div>

            {/* Suggestion Text */}
            <p className="text-gray-800 mb-4 leading-relaxed">
              {suggestion.suggestionText}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2 justify-end">
              {!suggestion.isRead && (
                <button
                  onClick={() => handleMarkAsRead(suggestion._id)}
                  className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-100 rounded transition"
                >
                  ✓ Mark as read
                </button>
              )}
              <button
                onClick={() => handleDeleteSuggestion(suggestion._id)}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-100 rounded transition"
              >
                🗑️ Delete
              </button>
            </div>

            {/* Unread Indicator */}
            {!suggestion.isRead && (
              <div className="mt-2 h-1 bg-blue-500 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
