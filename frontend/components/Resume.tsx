'use client';

import React, { useState, useEffect } from 'react';
import { Download, Eye, Share2, Plus, Trash2 } from 'lucide-react';

interface Resume {
  _id: string;
  userId: string;
  personalInfo: { name: string; email: string; phone?: string; summary?: string };
  education: Array<{ schoolName: string; degree: string; grade?: string }>;
  experience: Array<{ companyName: string; position: string }>;
  projects: Array<{ projectName: string; description: string }>;
  skills: Array<{ skillName: string; proficiency: string }>;
}

export const ResumePreview: React.FC<{ resume: Resume }> = ({ resume }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-12 space-y-8">
      {/* Header */}
      <div className="border-b-2 border-gray-300 pb-6">
        <h1 className="text-4xl font-bold text-gray-900">{resume.personalInfo.name}</h1>
        <div className="flex gap-4 text-sm text-gray-600 mt-2">
          <span>{resume.personalInfo.email}</span>
          {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
        </div>
        {resume.personalInfo.summary && (
          <p className="mt-4 text-gray-700">{resume.personalInfo.summary}</p>
        )}
      </div>

      {/* Experience */}
      {resume.experience.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience</h2>
          <div className="space-y-4">
            {resume.experience.map((exp, idx) => (
              <div key={idx}>
                <h3 className="font-bold text-gray-900">{exp.position}</h3>
                <p className="text-gray-600">{exp.companyName}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Education</h2>
          <div className="space-y-4">
            {resume.education.map((edu, idx) => (
              <div key={idx}>
                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-600">{edu.schoolName}</p>
                {edu.grade && <p className="text-sm text-gray-500">GPA: {edu.grade}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill.skillName}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Projects</h2>
          <div className="space-y-4">
            {resume.projects.map((project, idx) => (
              <div key={idx}>
                <h3 className="font-bold text-gray-900">{project.projectName}</h3>
                <p className="text-gray-600">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ResumeBuilder: React.FC = () => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await fetch('/api/resume', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await response.json();
        setResume(data.resume);
      } catch (error) {
        console.error('Failed to fetch resume');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  const handleAddEducation = async (education: any) => {
    try {
      await fetch('/api/resume/education', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(education),
      });
      // Refresh resume
      window.location.reload();
    } catch (error) {
      alert('Error adding education');
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await fetch('/api/resume/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ template: 'modern' }),
      });
      const data = await response.json();
      window.open(data.pdfUrl, '_blank');
    } catch (error) {
      alert('Error exporting PDF');
    }
  };

  if (loading) return <div className="text-center py-8">Loading resume...</div>;

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          <Download size={18} />
          Export as PDF
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition">
          <Share2 size={18} />
          Make Public
        </button>
      </div>

      {resume && <ResumePreview resume={resume} />}
    </div>
  );
};
