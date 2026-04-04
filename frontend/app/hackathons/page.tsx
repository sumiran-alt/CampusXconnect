'use client';

import React from 'react';
import { HackathonGallery } from '@/components/Hackathons';
import { Code } from 'lucide-react';

export default function HackathonsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-100 py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Code className="text-red-600" size={32} />
            <h1 className="text-5xl font-bold text-gray-900">Hackathon Hub</h1>
          </div>
          <p className="text-xl text-gray-600">
            Build incredible projects, win prizes, and make an impact
          </p>
        </div>

        {/* Hackathons Gallery */}
        <HackathonGallery />

        {/* Why Participate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="bg-white rounded-lg shadow p-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Why Participate?</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold text-lg">✓</span>
                <span>Build amazing projects and gain real-world experience</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold text-lg">✓</span>
                <span>Network with talented students and industry professionals</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold text-lg">✓</span>
                <span>Win prizes and recognition for your innovative solutions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold text-lg">✓</span>
                <span>Get mentorship from experienced entrepreneurs and engineers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-bold text-lg">✓</span>
                <span>Showcase your portfolio to companies and investors</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Getting Started</h2>
            <ol className="space-y-3 text-gray-600">
              <li className="flex gap-3">
                <span className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</span>
                <span>Browse available hackathons</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</span>
                <span>Form or join a team (1-5 members)</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</span>
                <span>Develop your project during the hackathon</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">4</span>
                <span>Submit your project with demo and code</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">5</span>
                <span>Get judged and celebrate your achievement!</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
