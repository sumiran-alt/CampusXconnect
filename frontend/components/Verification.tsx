'use client';

import React, { useState } from 'react';
import { Check, AlertCircle, Clock } from 'lucide-react';

interface VerificationStatusProps {
  status: 'pending' | 'verified' | 'rejected' | 'not_started';
  collegeName?: string;
  rejectionReason?: string;
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({
  status,
  collegeName,
  rejectionReason,
}) => {
  const getStatusDisplay = () => {
    switch (status) {
      case 'verified':
        return (
          <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
            <Check className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">Verified Student</p>
              <p className="text-sm text-green-700">{collegeName}</p>
            </div>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600 animate-spin" />
            <div>
              <p className="font-semibold text-blue-900">Verification Pending</p>
              <p className="text-sm text-blue-700">Admin review in progress</p>
            </div>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-semibold text-red-900">Verification Rejected</p>
              <p className="text-sm text-red-700">{rejectionReason || 'Please try again'}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="w-full">{getStatusDisplay()}</div>;
};

export const VerificationForm: React.FC = () => {
  const [collegeName, setCollegeName] = useState('');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/verification/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ collegeName, collegeEmail }),
      });

      if (response.ok) {
        alert('Verification request sent!');
        setCollegeName('');
        setCollegeEmail('');
      } else {
        const error = await response.json();
        alert(error.message || 'Verification failed');
      }
    } catch (error) {
      alert('Error sending verification request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-900">Verify Your College</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          College Name
        </label>
        <input
          type="text"
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
          placeholder="e.g., Stanford University"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          College Email
        </label>
        <input
          type="email"
          value={collegeEmail}
          onChange={(e) => setCollegeEmail(e.target.value)}
          placeholder="you@college.edu"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Verifying...' : 'Request Verification'}
      </button>
    </form>
  );
};

export const VerifiedBadge: React.FC = () => (
  <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
    <Check className="w-4 h-4" />
    Verified
  </div>
);
