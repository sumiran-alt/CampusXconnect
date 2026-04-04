'use client';

import React, { useState, useEffect } from 'react';
import { IdeaForm, IdeaCard } from '@/components/StartupIdea';
import { Lightbulb } from 'lucide-react';

export default function IdeasPage() {
  const [ideas, setIdeas] = useState([]);
  const [filter, setFilter] = useState('open');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch(`/api/ideas?status=${filter}`);
        const data = await response.json();
        setIdeas(data.ideas || []);
      } catch (error) {
        console.error('Failed to fetch ideas');
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, [filter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Lightbulb className="text-purple-600" size={32} />
            <h1 className="text-5xl font-bold text-gray-900">Startup Idea Hub</h1>
          </div>
          <p className="text-xl text-gray-600">
            Share your startup ideas and find awesome teammates to build with
          </p>
        </div>

        {/* Create Idea Section */}
        <div>
          <IdeaForm />
        </div>

        {/* Ideas Gallery */}
        <div className="space-y-6">
          <div className="flex gap-2">
            {['open', 'closed', 'active', 'funded'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition capitalize ${
                  filter === status
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">Loading ideas...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ideas.map((idea: any) => (
                <IdeaCard key={idea._id} idea={idea} />
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-4xl font-bold text-purple-600">{ideas.length}</p>
            <p className="text-gray-600 mt-2">Active Ideas</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-4xl font-bold text-purple-600">150+</p>
            <p className="text-gray-600 mt-2">Teams Formed</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-4xl font-bold text-purple-600">25+</p>
            <p className="text-gray-600 mt-2">Funded Startups</p>
          </div>
        </div>
      </div>
    </div>
  );
}
