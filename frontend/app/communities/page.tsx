'use client';

import React from 'react';
import { CommunitiesBrowser } from '@/components/Communities';
import { Users } from 'lucide-react';

export default function CommunitiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Users className="text-purple-600" size={32} />
            <h1 className="text-5xl font-bold text-gray-900">College Communities</h1>
          </div>
          <p className="text-xl text-gray-600">
            Join topic-based communities and connect with like-minded students
          </p>
        </div>

        {/* Communities Browser */}
        <CommunitiesBrowser />

        {/* Featured Communities */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Popular Communities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'AI & Machine Learning',
                emoji: '🤖',
                description: 'Learn and discuss latest trends in AI/ML',
                members: 2400,
              },
              {
                name: 'Web Development',
                emoji: '🌐',
                description: 'Frontend, Backend, Full-stack development discussions',
                members: 3100,
              },
              {
                name: 'Competitive Programming',
                emoji: '🎯',
                description: 'Master DSA and competitive coding',
                members: 1800,
              },
              {
                name: 'Startups & Entrepreneurship',
                emoji: '🚀',
                description: 'Build and launch your startup ideas',
                members: 1400,
              },
              {
                name: 'Mobile Development',
                emoji: '📱',
                description: 'iOS, Android, Cross-platform development',
                members: 1600,
              },
              {
                name: 'Cloud & DevOps',
                emoji: '☁️',
                description: 'Learn AWS, GCP, Azure, Docker, Kubernetes',
                members: 1200,
              },
            ].map((community, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 space-y-3"
              >
                <div className="text-4xl mb-2">{community.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900">{community.name}</h3>
                <p className="text-gray-600 text-sm">{community.description}</p>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-500">{community.members.toLocaleString()} members</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Benefits */}
        <div className="bg-white rounded-lg shadow p-8 space-y-6 mt-12">
          <h2 className="text-2xl font-bold text-gray-900">Why Join Communities?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📚</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Learn & Grow</h3>
                <p className="text-gray-600 text-sm">Access resources, tutorials, and knowledge from experts</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🤝</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Network</h3>
                <p className="text-gray-600 text-sm">Connect with peers, find mentors, and collaborate</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💡</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Get Inspired</h3>
                <p className="text-gray-600 text-sm">Share ideas and get feedback from the community</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Gain Recognition</h3>
                <p className="text-gray-600 text-sm">Earn badges and leaderboard points from participation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
