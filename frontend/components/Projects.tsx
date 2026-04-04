'use client';

import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Eye, Github, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  githubLink?: string;
  demoLink?: string;
  screenshots?: Array<{ url: string; caption?: string }>;
  likes: string[];
  likesCount: number;
  createdBy: { name: string; profilePicture: string };
  views: number;
  createdAt: string;
}

export const ProjectCard: React.FC<{ project: Project; onLike?: () => void }> = ({
  project,
  onLike,
}) => {
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    setLiked(!liked);
    if (onLike) onLike();
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 space-y-4">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
      </div>

      {project.screenshots && project.screenshots.length > 0 && (
        <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={project.screenshots[0].url}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg transition ${
              liked
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
            <span className="text-sm font-semibold">{project.likesCount}</span>
          </button>
          <div className="flex items-center gap-1 text-gray-600">
            <Eye size={18} />
            <span className="text-sm">{project.views}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              <Github size={18} />
            </a>
          )}
          {project.demoLink && (
            <a
              href={project.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition"
            >
              <ExternalLink size={18} className="text-blue-600" />
            </a>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 relative">
            <Image
              src={project.createdBy.profilePicture}
              alt={project.createdBy.name}
              fill
              className="rounded-full"
            />
          </div>
          <span className="text-gray-700 font-medium">{project.createdBy.name}</span>
        </div>
        <span className="text-gray-500">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export const ProjectForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    githubLink: '',
    demoLink: '',
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
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...formData,
          techStack: formData.techStack.split(',').map((t) => t.trim()),
        }),
      });

      if (response.ok) {
        alert('Project created successfully!');
        setFormData({ title: '', description: '', techStack: '', githubLink: '', demoLink: '' });
      }
    } catch (error) {
      alert('Error creating project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Showcase Your Project</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Your amazing project"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="What does your project do?"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tech Stack (comma-separated)
        </label>
        <input
          type="text"
          name="techStack"
          value={formData.techStack}
          onChange={handleChange}
          placeholder="React, Node.js, MongoDB"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Link</label>
          <input
            type="url"
            name="githubLink"
            value={formData.githubLink}
            onChange={handleChange}
            placeholder="https://github.com/..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Demo Link</label>
          <input
            type="url"
            name="demoLink"
            value={formData.demoLink}
            onChange={handleChange}
            placeholder="https://demo...."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
};
