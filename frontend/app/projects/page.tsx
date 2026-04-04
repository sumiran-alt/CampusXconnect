'use client';

import React, { useState, useEffect } from 'react';
import { ProjectForm, ProjectCard } from '@/components/Projects';
import { Sparkles, TrendingUp } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('latest'); // latest, trending
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const endpoint = activeTab === 'trending' ? '/api/projects/trending' : '/api/projects';
        const response = await fetch(endpoint);
        const data = await response.json();
        setProjects(data.projects || data || []);
      } catch (error) {
        console.error('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="text-blue-600" size={32} />
            <h1 className="text-5xl font-bold text-gray-900">Project Showcase</h1>
          </div>
          <p className="text-xl text-gray-600">
            Share your amazing projects and get recognized by the community
          </p>
        </div>

        {/* Create Project Section */}
        <div>
          <ProjectForm />
        </div>

        {/* Projects Gallery */}
        <div className="space-y-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('latest')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === 'latest'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === 'trending'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <TrendingUp size={18} />
              Trending
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project: any) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
