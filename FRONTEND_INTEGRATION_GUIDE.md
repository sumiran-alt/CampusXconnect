# CampusXConnect - Frontend Integration Guide

## Overview
Complete guide to using the CampusXConnect frontend components and pages.

---

## Quick Start

### Setup
```bash
cd frontend
npm install
npm run dev
```

Visit: `http://localhost:3000`

### Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## File Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with navbar
│   ├── page.tsx                 # Home page
│   ├── verification/            # Verification flows
│   │   └── page.tsx
│   ├── projects/                # Project showcase
│   │   └── page.tsx
│   ├── ideas/                   # Startup ideas
│   │   └── page.tsx
│   ├── jobs/                    # Job board
│   │   └── page.tsx
│   ├── leaderboard/             # Rankings
│   │   └── page.tsx
│   ├── resume/                  # Resume builder
│   │   └── page.tsx
│   ├── hackathons/              # Hackathon hub
│   │   └── page.tsx
│   └── communities/             # Community hub
│       └── page.tsx
├── components/                   # Reusable components
│   ├── Verification.tsx
│   ├── Projects.tsx
│   ├── StartupIdea.tsx
│   ├── Jobs.tsx
│   ├── Leaderboard.tsx
│   ├── Resume.tsx
│   ├── Hackathons.tsx
│   └── Communities.tsx
├── lib/
│   ├── api.ts                   # API utilities (43 functions)
│   └── utils.ts                 # Helper functions (20+ functions)
└── styles/
    └── globals.css              # Tailwind CSS
```

---

## Using API Utilities

### Import and Use

```typescript
// Import specific API namespace
import { projects, jobs, ideas } from '@/lib/api';

// Use API functions
const allProjects = await projects.getAll();
const trending = await projects.getTrending();
const job = await jobs.getById(jobId);
```

### API Structure

All API calls are organized by feature:

#### Verification
```typescript
verification.request(data)         // Request verification
verification.getStatus()           // Get current status
verification.getPendingList()      // Admin: Get pending
verification.approve(id, notes)    // Admin: Approve
verification.reject(id, reason)    // Admin: Reject
```

#### Projects
```typescript
projects.getAll(page, limit)       // Get all projects
projects.getTrending()             // Get trending
projects.getById(id)               // Get single
projects.create(data)              // Create project
projects.update(id, data)          // Update project
projects.delete(id)                // Delete project
projects.like(id)                  // Toggle like
```

#### Jobs
```typescript
jobs.getAll(page, limit, filters)  // Get with filters
jobs.getById(id)                   // Get single job
jobs.create(data)                  // Post job
jobs.update(id, data)              // Update job
jobs.delete(id)                    // Delete job
jobs.apply(id, data)               // Apply to job
jobs.getMyApplications()           // Get my applications
jobs.getApplications(jobId)        // Get job applications
jobs.updateStatus(appId, status)   // Update application
```

#### Leaderboard
```typescript
leaderboard.getGlobal(page, limit) // Global leaderboard
leaderboard.getUserRank(userId)    // Get user rank
leaderboard.getCollege(college)    // College-specific
leaderboard.getStats()             // Global stats
leaderboard.updateScore(userId, type, amount)  // Admin
```

#### Resume
```typescript
resume.get()                       // Get/create resume
resume.updatePersonal(data)        // Update personal info
resume.addEducation(data)          // Add education
resume.addExperience(data)         // Add experience
resume.addProject(data)            // Add project
resume.addSkill(data)              // Add skills
resume.getCertifications()         // Get certificates
resume.getAISuggestions()          // Get AI suggestions
resume.exportPDF(template)         // Generate PDF
resume.togglePublic()              // Make public/private
resume.getPublic(userId)           // Get public resume
```

#### Hackathons
```typescript
hackathons.getAll(status)          // Get all hackathons
hackathons.getById(id)             // Get single
hackathons.register(id, data)      // Register team
hackathons.joinTeam(teamId)        // Join team
hackathons.submit(id, data)        // Submit project
hackathons.getLeaderboard(id)      // Get leaderboard
hackathons.scoreSubmission(id, score) // Judge submission
```

#### Communities
```typescript
communities.getAll(page, category) // Get all communities
communities.getBySlug(slug)        // Get community
communities.create(data)           // Create community
communities.join(id)               // Join community
communities.leave(id)              // Leave community
communities.getPosts(id, page)     // Get posts
communities.createPost(id, data)   // Create post
communities.likePost(postId)       // Like post
communities.getComments(postId)    // Get comments
communities.addComment(postId, data) // Add comment
```

---

## Using Utility Functions

### Import Utilities

```typescript
import { 
  formatDate, 
  timeAgo, 
  slugify,
  isValidEmail,
  storage
} from '@/lib/utils';
```

### Date Formatting

```typescript
// Format date to readable string
formatDate('2024-03-20T10:00:00Z')  // "Mar 20, 2024"
formatDateTime('2024-03-20T10:00:00Z')  // "Mar 20, 2024 10:00 AM"

// Time ago format
timeAgo('2024-03-20T10:00:00Z')  // "2 hours ago"

// Days until deadline
daysUntil('2024-04-20T23:59:59Z')  // "31 days"
```

### Text Manipulation

```typescript
// Truncate long text
truncateText('Very long text...', 50)  // "Very long text..."

// Create URL slug
slugify('Machine Learning Enthusiasts')  // "machine-learning-enthusiasts"

// Get initials for avatar
getInitials('John Doe')  // "JD"
```

### Validation

```typescript
// Email validation
isValidEmail('user@college.edu')  // true

// URL validation
isValidURL('https://github.com/user/project')  // true

// Phone validation
isValidPhoneNumber('+1 234 567 8900')  // true
```

### Currency Formatting

```typescript
// Format currency
formatCurrency(120000, 'USD')  // "$120,000"
formatCurrency(1500, 'USD', true)  // "$1,500/month"
```

### Local Storage

```typescript
// Store data
storage.set('token', 'jwt_token_here');
storage.set('user', { id: '...', name: 'John' });

// Retrieve data
const token = storage.get('token');
const user = storage.get('user');

// Remove data
storage.remove('token');
```

### Notifications

```typescript
// Show toast notification
showToast('Success', 'Profile updated successfully', 'success');
showToast('Error', 'Something went wrong', 'error');
showToast('Info', 'Please verify your email', 'info');
showToast('Warning', 'Are you sure?', 'warning');
```

---

## Component Usage Examples

### Verification Component

```typescript
import { VerificationForm, VerificationStatus } from '@/components/Verification';

export default function VerificationPage() {
  return (
    <div>
      <VerificationStatus />
      <VerificationForm />
    </div>
  );
}
```

**Props:**
```typescript
// VerificationStatus
<VerificationStatus userId={userId} />

// VerificationForm
<VerificationForm onSuccess={() => refetch()} />
```

### Projects Component

```typescript
import { ProjectForm, ProjectCard } from '@/components/Projects';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  return (
    <div>
      <ProjectForm onSuccess={() => refetch()} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(project => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
}
```

**ProjectCard Props:**
```typescript
interface ProjectCardProps {
  project: {
    _id: string;
    title: string;
    description: string;
    techStack: string[];
    githubLink: string;
    demoLink: string;
    likesCount: number;
    views: number;
  };
  onLike?: (id: string) => void;
  onDelete?: (id: string) => void;
}
```

### Jobs Component

```typescript
import { JobBoard, JobCard } from '@/components/Jobs';

export default function JobsPage() {
  return <JobBoard />;
}
```

### Leaderboard Component

```typescript
import { LeaderboardTable, LeaderboardStats } from '@/components/Leaderboard';

export default function LeaderboardPage() {
  return (
    <div>
      <LeaderboardStats />
      <LeaderboardTable limit={100} />
    </div>
  );
}
```

### Resume Component

```typescript
import { ResumeBuilder, ResumePreview } from '@/components/Resume';

export default function ResumePage() {
  const [resume, setResume] = useState(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ResumeBuilder onUpdate={setResume} />
      <ResumePreview resume={resume} />
    </div>
  );
}
```

### Communities Component

```typescript
import { CommunitiesBrowser, CommunityPostCard } from '@/components/Communities';

export default function CommunitiesPage() {
  return <CommunitiesBrowser />;
}
```

---

## Building a Feature Page

### Example: Custom Job Listing Page

```typescript
'use client';

import { useState, useEffect } from 'react';
import { jobs } from '@/lib/api';
import { JobCard } from '@/components/Jobs';
import { formatDate } from '@/lib/utils';

export default function CustomJobsPage() {
  const [jobsList, setJobsList] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    location: '',
    search: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, [filters]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await jobs.getAll(1, 20, {
        type: filters.type !== 'all' ? filters.type : undefined,
        location: filters.location || undefined,
        search: filters.search || undefined,
      });
      setJobsList(response.data);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Job Board</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search jobs..."
          value={filters.search}
          onChange={e => setFilters({...filters, search: e.target.value})}
          className="px-4 py-2 border rounded"
        />
        <select
          value={filters.type}
          onChange={e => setFilters({...filters, type: e.target.value})}
          className="px-4 py-2 border rounded"
        >
          <option value="all">All Types</option>
          <option value="internship">Internship</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
        </select>
        <input
          type="text"
          placeholder="Location..."
          value={filters.location}
          onChange={e => setFilters({...filters, location: e.target.value})}
          className="px-4 py-2 border rounded"
        />
      </div>

      {/* Job Listings */}
      {loading ? (
        <p className="text-center py-8">Loading jobs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobsList.map(job => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Form Handling Example

```typescript
'use client';

import { useState } from 'react';
import { projects } from '@/lib/api';
import { showToast } from '@/lib/utils';

export default function CreateProjectForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    githubLink: '',
    demoLink: '',
    visibility: 'public',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Parse tech stack from comma-separated string
      const techStack = formData.techStack
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech);

      const payload = {
        ...formData,
        techStack,
      };

      const response = await projects.create(payload);
      
      showToast('Success', 'Project created successfully!', 'success');
      setFormData({
        title: '',
        description: '',
        techStack: '',
        githubLink: '',
        demoLink: '',
        visibility: 'public',
      });
    } catch (error) {
      showToast('Error', 'Failed to create project', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div>
        <label className="block text-sm font-medium mb-1">Project Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tech Stack (comma-separated)</label>
        <input
          type="text"
          name="techStack"
          value={formData.techStack}
          onChange={handleChange}
          placeholder="React, Node.js, MongoDB"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
}
```

---

## Authentication Flow

### Get Token

```typescript
// Token is stored in localStorage after login
const token = localStorage.getItem('token');

// All API calls automatically include token via apiCall function
```

### Check if Logged In

```typescript
import { useEffect, useState } from 'react';
import { storage } from '@/lib/utils';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = storage.get('token');
    const userData = storage.get('user');
    setIsAuthenticated(!!token);
    setUser(userData);
  }, []);

  return { isAuthenticated, user };
}
```

### Protected Route

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/utils';

export default function ProtectedPage() {
  const router = useRouter();

  useEffect(() => {
    const token = storage.get('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div>
      {/* Page content */}
    </div>
  );
}
```

---

## Styling with Tailwind

All components use Tailwind CSS. Common patterns:

```typescript
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Card
<div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">

// Button
<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">

// Badge
<span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">

// Loading state
<div className="animate-spin">Loading...</div>
```

---

## Error Handling

```typescript
import { useCallback } from 'react';
import { showToast } from '@/lib/utils';

async function handleApiCall(apiFunction, successMessage) {
  try {
    const result = await apiFunction();
    showToast('Success', successMessage, 'success');
    return result;
  } catch (error: any) {
    const message = error.message || 'Something went wrong';
    showToast('Error', message, 'error');
    console.error(error);
    throw error;
  }
}
```

---

## Performance Tips

1. **Lazy Loading Components**
   ```typescript
   import dynamic from 'next/dynamic';
   const Component = dynamic(() => import('./Component'), { loading: () => <p>Loading...</p> });
   ```

2. **Memoize Components**
   ```typescript
   export const ProjectCard = memo(({ project }: Props) => {
     return <div>{project.title}</div>;
   });
   ```

3. **Use Image Optimization**
   ```typescript
   import Image from 'next/image';
   <Image src={url} alt="Project" width={300} height={200} />
   ```

4. **Pagination Instead of Infinite Scroll**
   ```typescript
   const [page, setPage] = useState(1);
   const handleLoadMore = () => setPage(p => p + 1);
   ```

---

## Deployment

### Build
```bash
npm run build
npm start
```

### Environment Variables
Set in production:
```
NEXT_PUBLIC_API_URL=https://api.campusxconnect.com
```

### Hosting Options
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- DigitalOcean

---

**Last Updated:** March 2026
**Version:** 2.0
