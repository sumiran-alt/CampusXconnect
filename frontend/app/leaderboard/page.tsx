'use client';

import React from 'react';
import { LeaderboardTable, LeaderboardStats } from '@/components/Leaderboard';
import { Trophy } from 'lucide-react';

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-12">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Trophy className="text-yellow-600" size={32} />
            <h1 className="text-5xl font-bold text-gray-900">College Leaderboard</h1>
          </div>
          <p className="text-xl text-gray-600">
            Compete with your peers and climb the rankings
          </p>
        </div>

        {/* Stats */}
        <LeaderboardStats />

        {/* Leaderboard Table */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Global Rankings</h2>
          <LeaderboardTable />
        </div>

        {/* How Scoring Works */}
        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">How Points Are Calculated</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💻</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Coding Problems</h3>
                <p className="text-gray-600 text-sm">10 points per problem solved</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Projects Posted</h3>
                <p className="text-gray-600 text-sm">25 points per project</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">❤️</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Project Likes</h3>
                <p className="text-gray-600 text-sm">2 points per like received</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🤝</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Connections</h3>
                <p className="text-gray-600 text-sm">5 points per accepted connection</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Community Posts</h3>
                <p className="text-gray-600 text-sm">15 points per post, 2 per comment</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Hackathons</h3>
                <p className="text-gray-600 text-sm">100+ points for winning</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
