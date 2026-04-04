'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Calendar, ExternalLink } from 'lucide-react';

interface Job {
  _id: string;
  title: string;
  company: string;
  description: string;
  jobType: 'internship' | 'full-time' | 'part-time' | 'contract';
  location: string;
  salary?: { min: number; max: number };
  requirements: string[];
  applicationDeadline: string;
  views: number;
  postedBy: { name: string; company: string };
}

export const JobCard: React.FC<{ job: Job; onApply?: () => void }> = ({
  job,
  onApply,
}) => {
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    setApplied(true);
    if (onApply) onApply();
  };

  const daysLeft = Math.ceil(
    (new Date(job.applicationDeadline).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
          <p className="text-lg text-blue-600 font-semibold">{job.company}</p>
        </div>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
          {job.jobType}
        </span>
      </div>

      <p className="text-gray-600 line-clamp-2">{job.description}</p>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin size={18} />
          {job.location}
        </div>
        {job.salary && (
          <div>
            ₹{job.salary.min?.toLocaleString()} - ₹{job.salary.max?.toLocaleString()}
          </div>
        )}
      </div>

      {job.requirements.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-2">Requirements:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            {job.requirements.slice(0, 3).map((req, idx) => (
              <li key={idx}>• {req}</li>
            ))}
            {job.requirements.length > 3 && <li className="text-gray-500">...</li>}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          <Calendar size={16} className="inline mr-1" />
          {daysLeft} days left
        </div>
        <button
          onClick={handleApply}
          disabled={applied}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
            applied
              ? 'bg-green-100 text-green-600'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {applied ? 'Applied' : 'Apply Now'}
          <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
};

export const JobBoard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          `/api/jobs?jobType=${filter || ''}`
        );
        const data = await response.json();
        setJobs(data.jobs || []);
      } catch (error) {
        console.error('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filter]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-6">
        {['', 'internship', 'full-time', 'part-time'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {type || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-8">Loading jobs...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};
