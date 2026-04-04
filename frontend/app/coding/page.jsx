"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { codingAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function Coding() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [userProgress, setUserProgress] = useState({ solvedProblems: [] });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    fetchProblems();
    fetchUserProgress();
  }, [isAuthenticated, router, difficulty]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await codingAPI.getProblems(1, difficulty);
      setProblems(response.data.problems);
    } catch (error) {
      toast.error("Failed to fetch problems");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await codingAPI.getUserProgress();
      setUserProgress(response.data.progress);
    } catch (error) {
      console.error("Failed to fetch user progress");
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const isSolved = (problemId) => {
    return userProgress.solvedProblems?.some(
      (p) => p._id === problemId || p === problemId,
    );
  };

  const filteredProblems = problems.filter((problem) =>
    problem.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coding Practice</h1>
          <p className="text-gray-600 mt-1">
            Solve programming problems and climb the leaderboard
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/leaderboard"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Leaderboard
          </Link>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-6 mb-8 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold">{problems.length}</p>
            <p className="text-blue-100 text-sm">Total Problems</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">
              {problems.filter((p) => p.difficulty === "Easy").length}
            </p>
            <p className="text-blue-100 text-sm">Easy</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">
              {problems.filter((p) => p.difficulty === "Medium").length}
            </p>
            <p className="text-blue-100 text-sm">Medium</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">
              {userProgress.solvedProblems?.length || 0}
            </p>
            <p className="text-blue-100 text-sm">Solved</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setDifficulty("")}
            className={`px-4 py-2 rounded-lg transition ${
              difficulty === ""
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setDifficulty("Easy")}
            className={`px-4 py-2 rounded-lg transition ${
              difficulty === "Easy"
                ? "bg-green-500 text-white"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            Easy
          </button>
          <button
            onClick={() => setDifficulty("Medium")}
            className={`px-4 py-2 rounded-lg transition ${
              difficulty === "Medium"
                ? "bg-yellow-500 text-white"
                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setDifficulty("Hard")}
            className={`px-4 py-2 rounded-lg transition ${
              difficulty === "Hard"
                ? "bg-red-500 text-white"
                : "bg-red-100 text-red-700 hover:bg-red-200"
            }`}
          >
            Hard
          </button>
        </div>
      </div>

      {/* Problems List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading problems...</p>
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-600">No problems found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProblems.map((problem) => (
                <tr
                  key={problem._id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => router.push(`/coding/${problem._id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isSolved(problem._id) ? (
                      <span className="text-green-500 text-xl" title="Solved">
                        ✓
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xl">○</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {problem.title}
                      </span>
                      {isSolved(problem._id) && (
                        <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                          Solved
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                        problem.difficulty,
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {problem.category}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {problem.tags?.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {problem.tags?.length > 3 && (
                        <span className="text-gray-400 text-xs">
                          +{problem.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
