"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { codingAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function Leaderboard() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    fetchLeaderboard();
  }, [isAuthenticated, router]);

  const fetchLeaderboard = async () => {
    try {
      const response = await codingAPI.getLeaderboard();
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      toast.error("Failed to fetch leaderboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-4 text-primary hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-bold mb-8">🏆 Leaderboard</h1>

      {loading ? (
        <div className="text-center py-8">Loading leaderboard...</div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-8 text-gray-600">No submissions yet</div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-6 py-3 text-left">Rank</th>
                <th className="px-6 py-3 text-left">Student Name</th>
                <th className="px-6 py-3 text-center">Problems Solved</th>
                <th className="px-6 py-3 text-center">Avg Runtime (ms)</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => (
                <tr
                  key={idx}
                  className={`border-b hover:bg-blue-50 transition ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-4">
                    <span className="font-bold text-lg">
                      {idx === 0
                        ? "🥇"
                        : idx === 1
                          ? "🥈"
                          : idx === 2
                            ? "🥉"
                            : `#${idx + 1}`}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {entry.userInfo?.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-blue-100 text-primary px-3 py-1 rounded-full font-semibold">
                      {entry.solvedCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">
                    {entry.avgRuntime?.toFixed(2)} ms
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
