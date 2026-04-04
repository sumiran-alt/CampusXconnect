'use client';

import React from 'react';
import { JobBoard } from '@/components/Jobs';
import { Briefcase } from 'lucide-react';

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Header with Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Find the right internship or job for you
            </h1>
            <button className="inline-block px-8 py-3 bg-white border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition">
              Find a job →
            </button>
            
            {/* Category Pills */}
            <div className="flex flex-wrap gap-3 pt-4">
              <span className="px-4 py-2 border-2 border-gray-300 rounded-full text-sm font-medium text-gray-700">Engineering</span>
              <span className="px-4 py-2 border-2 border-gray-300 rounded-full text-sm font-medium text-gray-700">Business Development</span>
              <span className="px-4 py-2 border-2 border-gray-300 rounded-full text-sm font-medium text-gray-700">Finance</span>
              <span className="px-4 py-2 border-2 border-gray-300 rounded-full text-sm font-medium text-gray-700">Design</span>
              <span className="px-4 py-2 border-2 border-gray-300 rounded-full text-sm font-medium text-gray-700">Marketing</span>
              <span className="px-4 py-2 border-2 border-gray-300 rounded-full text-sm font-medium text-gray-700">Sales</span>
              <span className="px-4 py-2 border-2 border-gray-300 rounded-full text-sm font-medium text-gray-700">Show more ▼</span>
            </div>
          </div>
          
          {/* Right Side - Image */}
          <div className="flex justify-center">
            <img 
              src="https://i.pinimg.com/736x/ac/86/f1/ac86f183eed2ac3eec808dcb5ea373d2.jpg"
              alt="Job Opportunities - hands holding looking for a job paper"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Job Listings */}
        <JobBoard />

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-lg shadow p-6 space-y-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Verified Companies</h3>
            <p className="text-gray-600 text-sm">Only verified companies can post opportunities</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 space-y-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Track Applications</h3>
            <p className="text-gray-600 text-sm">Monitor your applications and get real-time updates</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 space-y-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Exclusive Offers</h3>
            <p className="text-gray-600 text-sm">Access exclusive internship and job offers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
