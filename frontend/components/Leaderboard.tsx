'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Medal, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  _id: string;
  userId: { name: string; profilePicture: string };
  totalScore: number;
  rank: number;
  scoreBreakdown: {
    codingProblems: number;
    projectsPosted: number;
    projectLikes: number;
    connections: number;
  };
}

export const LeaderboardTable: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard?limit=50');
        const data = await response.json();
        setEntries(data.leaderboards || []);
      } catch (error) {
        console.error('Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-500" />;
    return <span className="text-gray-600 font-bold">#{rank}</span>;
  };

  if (loading) return <div className="text-center py-8">Loading leaderboard...</div>;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Student</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Score</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
              Problems
            </th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
              Projects
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {entries.map((entry) => (
            <tr key={entry._id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 flex items-center justify-center">
                {getRankBadge(entry.rank)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300" />
                  <span className="font-semibold text-gray-900">{entry.userId.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="font-bold text-gray-900">{entry.totalScore}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-center text-gray-600">
                {entry.scoreBreakdown.codingProblems}
              </td>
              <td className="px-6 py-4 text-center text-gray-600">
                {entry.scoreBreakdown.projectsPosted}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const LeaderboardStats: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/leaderboard/stats/global');
        const data = await response.json();
        setStats(data.statistics);
      } catch (error) {
        console.error('Failed to fetch stats');
      }
    };

    fetchStats();
  }, []);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <p className="text-sm font-medium opacity-90">Average Score</p>
        <p className="text-3xl font-bold">{Math.round(stats.avgScore || 0)}</p>
      </div>
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
        <p className="text-sm font-medium opacity-90">Highest Score</p>
        <p className="text-3xl font-bold">{stats.maxScore || 0}</p>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
        <p className="text-sm font-medium opacity-90">Lowest Score</p>
        <p className="text-3xl font-bold">{stats.minScore || 0}</p>
      </div>
    </div>
  );
};
