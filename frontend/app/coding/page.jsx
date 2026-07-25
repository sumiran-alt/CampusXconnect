"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { codingAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function Coding() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    fetchProblems();
  }, [isAuthenticated, router, difficulty]);

  const fetchProblems = async () => {
    try {
      const response = await codingAPI.getProblems(1, difficulty);
      setProblems(response.data.problems);
    } catch (error) {
      toast.error("Failed to fetch problems");
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Coding Practice</h1>
        <Link
          href="/leaderboard"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          View Leaderboard
        </Link>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Filter by Difficulty
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => setDifficulty("")}
            className={`px-4 py-2 rounded transition ${
              difficulty === ""
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setDifficulty("Easy")}
            className={`px-4 py-2 rounded transition ${
              difficulty === "Easy"
                ? "bg-green-500 text-white"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            Easy
          </button>
          <button
            onClick={() => setDifficulty("Medium")}
            className={`px-4 py-2 rounded transition ${
              difficulty === "Medium"
                ? "bg-yellow-500 text-white"
                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setDifficulty("Hard")}
            className={`px-4 py-2 rounded transition ${
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
        <div className="text-center py-8">Loading problems...</div>
      ) : problems.length === 0 ? (
        <div className="text-center py-8 text-gray-600">No problems found</div>
      ) : (
        <div className="grid gap-4">
          {problems.map((problem) => (
            <Link
              key={problem._id}
              href={`/coding/${problem._id}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{problem.description}</p>
                  <p className="text-sm text-gray-500">
                    Category: {problem.category}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(problem.difficulty)}`}
                >
                  {problem.difficulty}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
