'use client';

import React from 'react';
import { ResumeBuilder } from '@/components/Resume';
import { FileText } from 'lucide-react';

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <FileText className="text-blue-600" size={32} />
            <h1 className="text-5xl font-bold text-gray-900">AI Resume Builder</h1>
          </div>
          <p className="text-xl text-gray-600">
            Create a professional resume with AI suggestions
          </p>
        </div>

        {/* Resume Builder */}
        <ResumeBuilder />

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-lg shadow p-6 space-y-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">AI Suggestions</h3>
            <p className="text-gray-600 text-sm">Get personalized suggestions to improve your resume</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 space-y-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📄</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Professional Templates</h3>
            <p className="text-gray-600 text-sm">Choose from multiple professional resume templates</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 space-y-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📥</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Easy Export</h3>
            <p className="text-gray-600 text-sm">Download your resume as PDF in seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
}
