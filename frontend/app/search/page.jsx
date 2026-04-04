"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchAPI, connectionAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import toast from "react-hot-toast";
import ConnectionButton from "@/components/ConnectionButton";
import Link from "next/link";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeTab, setActiveTab] = useState("simple"); // simple, advanced
  const [filters, setFilters] = useState({
    name: "",
    batch: "",
    branch: "",
    company: "",
    rollNumber: "",
  });
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load initial query if present
  useEffect(() => {
    if (searchParams.get("q")) {
      performSearch();
    } else {
      loadAllUsers();
    }
  }, [searchParams]);

  const performSearch = async () => {
    try {
      setLoading(true);
      setSearched(true);

      if (activeTab === "simple") {
        const query = searchParams.get("q") || searchQuery;
        if (!query.trim()) {
          toast.error("Please enter a search query");
          return;
        }

        const response = await searchAPI.search(query);
        setResults(response.data.results || []);
      }
    } catch (error) {
      console.error("Error searching:", error);
      toast.error(error.response?.data?.message || "Error searching users");
    } finally {
      setLoading(false);
    }
  };

  const handleSimpleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleAdvancedSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setSearched(true);
      const response = await searchAPI.advancedSearch(filters);
      setResults(response.data.results || []);
    } catch (error) {
      console.error("Error in advanced search:", error);
      toast.error("Error searching users");
    } finally {
      setLoading(false);
    }
  };

  const loadAllUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await searchAPI.getAllUsers(page);
      setAllUsers(response.data.users || []);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      name: "",
      batch: "",
      branch: "",
      company: "",
      rollNumber: "",
    });
    setResults([]);
    setSearched(false);
  };

  const displayResults = searched ? results : allUsers;
  const displayCount = searched
    ? results.length
    : `${(currentPage - 1) * 20 + 1}-${Math.min(currentPage * 20, displayResults.length)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Find Users</h1>
          <p className="text-gray-600 mt-2">
            Search for users by name, batch, company, or roll number
          </p>
        </div>

        {/* Search Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("simple")}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "simple"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Quick Search
          </button>
          <button
            onClick={() => setActiveTab("advanced")}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "advanced"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Advanced Search
          </button>
        </div>

        {/* Simple Search */}
        {activeTab === "simple" && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <form onSubmit={handleSimpleSearch} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Search Query
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search by name, batch, company, or roll number (e.g., "John Doe", "2024-John", "Google-John", "12345-John")'
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Search Format Examples:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    📝 <strong>By Name:</strong> "John Doe" or "john"
                  </li>
                  <li>
                    📅 <strong>By Batch & Name:</strong> "2024-John" or
                    "John-2024" or "4-John" (year)
                  </li>
                  <li>
                    🏢 <strong>By Company & Name:</strong> "Google-John" or
                    "John-Google"
                  </li>
                  <li>
                    🎓 <strong>By Roll Number & Name:</strong> "12345-John" or
                    "John-12345"
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Advanced Search */}
        {activeTab === "advanced" && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <form onSubmit={handleAdvancedSearch} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    placeholder="e.g., John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Batch/Year
                  </label>
                  <select
                    name="batch"
                    value={filters.batch}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All Batches</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Branch
                  </label>
                  <select
                    name="branch"
                    value={filters.branch}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All Branches</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="ME">ME</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="EE">EE</option>
                    <option value="IT">IT</option>
                    <option value="BT">BT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={filters.company}
                    onChange={handleFilterChange}
                    placeholder="e.g., Google, Microsoft"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={filters.rollNumber}
                    onChange={handleFilterChange}
                    placeholder="e.g., 12345"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {displayResults.length > 0 ? (
              <>
                <div className="mb-4">
                  <p className="text-gray-600">
                    Found{" "}
                    <span className="font-bold text-gray-900">
                      {displayResults.length}
                    </span>{" "}
                    {displayResults.length === 1 ? "result" : "results"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayResults.map((user) => (
                    <div
                      key={user._id}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                    >
                      <Link href={`/profile/${user._id}`}>
                        <div className="cursor-pointer">
                          <img
                            src={user.profilePicture}
                            alt={user.name}
                            className="w-full h-48 object-cover hover:opacity-80 transition"
                          />
                        </div>
                      </Link>

                      <div className="p-4">
                        <Link href={`/profile/${user._id}`}>
                          <h3 className="font-bold text-lg text-gray-900 hover:text-blue-600 cursor-pointer">
                            {user.name}
                          </h3>
                        </Link>

                        {user.email && (
                          <p className="text-gray-600 text-sm">{user.email}</p>
                        )}

                        {user.bio && (
                          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                            {user.bio}
                          </p>
                        )}

                        <div className="mt-3 space-y-1 text-sm text-gray-600">
                          {user.year && (
                            <p>
                              📅{" "}
                              <span className="font-semibold">
                                Year {user.year}
                              </span>{" "}
                              • {user.branch}
                            </p>
                          )}
                          {user.rollNumber && (
                            <p>
                              🎓{" "}
                              <span className="font-semibold">
                                Roll: {user.rollNumber}
                              </span>
                            </p>
                          )}
                          {user.company && (
                            <p>
                              🏢{" "}
                              <span className="font-semibold">
                                {user.company}
                              </span>
                            </p>
                          )}
                          {user.college && (
                            <p>
                              🏫{" "}
                              <span className="font-semibold">
                                {user.college}
                              </span>
                            </p>
                          )}
                        </div>

                        {user.skills && user.skills.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {user.skills.slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                            {user.skills.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                                +{user.skills.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="px-4 pb-4 border-t space-y-2">
                        <Link href={`/profile/${user._id}`}>
                          <button className="w-full px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium text-sm">
                            View Profile
                          </button>
                        </Link>
                        {isAuthenticated && (
                          <ConnectionButton userId={user._id} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination for all users view */}
                {!searched && totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <button
                      onClick={() => loadAllUsers(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => loadAllUsers(page)}
                          className={`px-3 py-2 rounded ${
                            currentPage === page
                              ? "bg-blue-500 text-white"
                              : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                    <button
                      onClick={() => loadAllUsers(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : searched ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  No users found
                </h3>
                <p className="text-gray-600 mt-2">
                  Try adjusting your search query or filters
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Browse all users
                </h3>
                <p className="text-gray-600 mt-2">
                  Showing users from page {currentPage}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
