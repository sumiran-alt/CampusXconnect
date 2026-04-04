"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { suggestionAPI, connectionAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import ConnectionButton from "@/components/ConnectionButton";

export default function SuggestionsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("recommendations"); // 'recommendations', 'trending'
  const [suggestions, setSuggestions] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    if (activeTab === "recommendations") {
      fetchSuggestions();
    } else {
      fetchTrendingSuggestions();
    }
  }, [isAuthenticated, activeTab]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await suggestionAPI.getSuggestions(10);
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast.error("Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingSuggestions = async () => {
    try {
      setLoading(true);
      const response = await suggestionAPI.getTrendingSuggestions(10);
      setTrending(response.data.suggestions || []);
    } catch (error) {
      console.error("Error fetching trending suggestions:", error);
      toast.error("Failed to load trending");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (userId) => {
    setSuggestions((prev) =>
      prev.map((s) => (s._id === userId ? { ...s, hasInteraction: true } : s)),
    );
  };

  const currentSuggestions =
    activeTab === "recommendations" ? suggestions : trending;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            People You May Know
          </h1>
          <p className="text-gray-600 mt-2">
            Expand your network with suggested connections
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("recommendations")}
            className={`pb-4 font-medium transition-colors ${
              activeTab === "recommendations"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Recommendations
          </button>
          <button
            onClick={() => setActiveTab("trending")}
            className={`pb-4 font-medium transition-colors ${
              activeTab === "trending"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Trending in Your Branch
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : currentSuggestions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab === "trending"
                ? "No trending users in your branch"
                : "No recommendations at the moment"}
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === "trending"
                ? "Connect with more people to see trending users."
                : "Connect with more people to get better recommendations."}
            </p>
            <Link
              href="/search"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explore Users
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSuggestions.map((suggestion) => (
              <div
                key={suggestion._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Profile Picture */}
                <Link href={`/profile/${suggestion._id}`}>
                  <div className="relative h-40 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center cursor-pointer">
                    <div
                      className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-3xl"
                      style={{
                        backgroundImage: `url('${suggestion.profilePicture}')`,
                        backgroundSize: "cover",
                      }}
                    >
                      {!suggestion.profilePicture && suggestion.name.charAt(0)}
                    </div>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-4">
                  {/* Name and Title */}
                  <Link href={`/profile/${suggestion._id}`}>
                    <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 cursor-pointer">
                      {suggestion.name}
                    </h3>
                  </Link>

                  {/* Bio */}
                  {suggestion.bio && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {suggestion.bio}
                    </p>
                  )}

                  {/* Info */}
                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    {suggestion.year && (
                      <div className="flex items-center gap-2">
                        <span>📚</span> Year {suggestion.year}
                      </div>
                    )}
                    {suggestion.branch && (
                      <div className="flex items-center gap-2">
                        <span>🏢</span> {suggestion.branch}
                      </div>
                    )}
                    {suggestion.company && (
                      <div className="flex items-center gap-2">
                        <span>💼</span> {suggestion.company}
                      </div>
                    )}
                    {suggestion.mutualConnections &&
                      suggestion.mutualConnections > 0 && (
                        <div className="flex items-center gap-2 text-blue-600 font-medium">
                          <span>🤝</span> {suggestion.mutualConnections} mutual{" "}
                          {suggestion.mutualConnections === 1
                            ? "connection"
                            : "connections"}
                        </div>
                      )}
                    {suggestion.connectionCount && (
                      <div className="flex items-center gap-2">
                        <span>👥</span> {suggestion.connectionCount} connections
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  {suggestion.skills && suggestion.skills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {suggestion.skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {suggestion.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            +{suggestion.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex gap-2">
                    <ConnectionButton
                      userId={suggestion._id}
                      onConnect={handleConnect}
                    />
                    <Link
                      href={`/profile/${suggestion._id}`}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
