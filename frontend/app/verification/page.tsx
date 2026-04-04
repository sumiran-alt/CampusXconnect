'use client';

import React from 'react';
import { VerificationForm, VerificationStatus, VerifiedBadge } from '@/components/Verification';

export default function VerificationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">College Verified Profiles</h1>
          <p className="text-xl text-gray-600">
            Verify your college email and get the official student badge
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Verification Form */}
          <div>
            <VerificationForm />
          </div>

          {/* Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Why Verify?</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-lg">✓</span>
                  <span>Get the coveted Verified Student badge on your profile</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-lg">✓</span>
                  <span>Access exclusive verified-only job postings and opportunities</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-lg">✓</span>
                  <span>Build trust with recruiters and companies looking for real students</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-lg">✓</span>
                  <span>Join verified-only communities and networking groups</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">How it Works</h2>
              <ol className="space-y-3 text-gray-600">
                <li className="flex gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</span>
                  <span>Submit your college email address</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</span>
                  <span>Our admin team verifies your college enrollment status</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</span>
                  <span>Receive your verification badge instantly</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Example Badge */}
        <div className="bg-white rounded-lg shadow p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Profile Badge</h2>
          <div className="flex justify-center">
            <VerifiedBadge />
          </div>
          <p className="text-gray-600">This badge will appear on your profile once verified</p>
        </div>
      </div>
    </div>
  );
}
