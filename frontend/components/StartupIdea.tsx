'use client';

import React, { useState } from 'react';
import { Users, MessageCircle, Lightbulb } from 'lucide-react';

interface StartupIdea {
  _id: string;
  title: string;
  description: string;
  problemStatement: string;
  rolesNeeded: Array<{ role: string; count: number }>;
  interestedCount: number;
  interestedUsers: any[];
  createdBy: { name: string; profilePicture: string };
}

export const IdeaCard: React.FC<{ idea: StartupIdea; onInterest?: () => void }> = ({
  idea,
  onInterest,
}) => {
  const [interested, setInterested] = useState(false);

  const handleInterest = async () => {
    if (!interested && onInterest) onInterest();
    setInterested(!interested);
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 space-y-4">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">{idea.title}</h3>
        <p className="text-gray-600 text-sm">{idea.description}</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Problem:</span> {idea.problemStatement}
        </p>
      </div>

      {idea.rolesNeeded.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Users size={18} />
            Roles Needed
          </h4>
          <div className="flex flex-wrap gap-2">
            {idea.rolesNeeded.map((role) => (
              <span
                key={role.role}
                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {role.role} ({role.count})
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={handleInterest}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
            interested
              ? 'bg-purple-100 text-purple-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Lightbulb size={18} />
          I'm Interested ({idea.interestedCount})
        </button>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gray-300" />
          <div>
            <p className="text-sm font-medium text-gray-900">{idea.createdBy.name}</p>
            <p className="text-xs text-gray-500">Founder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const IdeaForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    problemStatement: '',
    solution: '',
    targetMarket: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Idea posted successfully!');
        setFormData({
          title: '',
          description: '',
          problemStatement: '',
          solution: '',
          targetMarket: '',
        });
      }
    } catch (error) {
      alert('Error posting idea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Post Your Startup Idea</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Idea Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Give your idea a compelling title"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What's the problem you're solving?
        </label>
        <textarea
          name="problemStatement"
          value={formData.problemStatement}
          onChange={handleChange}
          placeholder="Describe the problem in detail"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Solution</label>
        <textarea
          name="solution"
          value={formData.solution}
          onChange={handleChange}
          placeholder="How does your idea solve the problem?"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="More details about your idea"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Target Market</label>
        <input
          type="text"
          name="targetMarket"
          value={formData.targetMarket}
          onChange={handleChange}
          placeholder="Who would use your product?"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? 'Posting...' : 'Post Idea'}
      </button>
    </form>
  );
};
