# CampusXConnect - Complete API Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints marked with `(AUTH)` require a JWT token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. College Verification API

### Request Verification
```http
POST /verification/request
Authorization: Bearer <token>
Content-Type: application/json

{
  "collegeName": "Stanford University",
  "collegeEmail": "student@stanford.edu"
}
```
**Response (201):**
```json
{
  "success": true,
  "message": "Verification email sent",
  "data": {
    "_id": "...",
    "userId": "...",
    "collegeName": "Stanford University",
    "collegeEmail": "student@stanford.edu",
    "status": "pending",
    "createdAt": "2024-03-20T10:00:00Z"
  }
}
```

### Get Verification Status (AUTH)
```http
GET /verification/status
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "status": "pending",
    "collegeName": "Stanford University",
    "collegeEmail": "student@stanford.edu"
  }
}
```

### Get User Verification
```http
GET /verification/user/:userId
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "status": "verified",
    "collegeName": "Stanford University"
  }
}
```

### Get Pending Verifications (ADMIN)
```http
GET /verification/pending
Authorization: Bearer <admin_token>
```
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "userId": "...",
      "collegeName": "MIT",
      "collegeEmail": "student@mit.edu",
      "status": "pending"
    }
  ]
}
```

### Approve Verification (ADMIN)
```http
PUT /verification/approve/:verificationId
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "adminNotes": "Email verified successfully"
}
```
**Response (200):**
```json
{
  "success": true,
  "message": "Verification approved"
}
```

### Reject Verification (ADMIN)
```http
PUT /verification/reject/:verificationId
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "reason": "Invalid email format"
}
```
**Response (200):**
```json
{
  "success": true,
  "message": "Verification rejected"
}
```

---

## 2. Projects API

### Get All Projects
```http
GET /projects?page=1&limit=10&sort=latest
```
**Query Params:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sort`: 'latest' or 'trending' (default: latest)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "E-commerce Platform",
      "description": "Full-stack e-commerce platform",
      "techStack": ["React", "Node.js", "MongoDB"],
      "githubLink": "https://github.com/...",
      "demoLink": "https://demo.com",
      "likesCount": 42,
      "views": 156,
      "comments": [],
      "createdAt": "2024-03-20T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 156
  }
}
```

### Get Trending Projects
```http
GET /projects/trending
```
**Response (200):** Same as Get All Projects

### Get Single Project
```http
GET /projects/:projectId
```
**Response (200):** Single project object (increments views)

### Create Project (AUTH)
```http
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "AI Resume Builder",
  "description": "Smart resume building with AI suggestions",
  "techStack": ["Next.js", "OpenAI", "PostgreSQL"],
  "githubLink": "https://github.com/user/project",
  "demoLink": "https://project.com",
  "screenshots": ["https://..."],
  "visibility": "public"
}
```
**Response (201):** Created project object

### Update Project (AUTH)
```http
PUT /projects/:projectId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "techStack": ["Next.js", "OpenAI", "PostgreSQL"]
}
```
**Response (200):** Updated project object

### Delete Project (AUTH)
```http
DELETE /projects/:projectId
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

### Like/Unlike Project (AUTH)
```http
POST /projects/:projectId/like
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "success": true,
  "message": "Project liked",
  "data": { "likesCount": 43 }
}
```

---

## 3. Startup Ideas API

### Get All Ideas
```http
GET /ideas?page=1&limit=10&status=open
```
**Query Params:**
- `page`: Page number
- `limit`: Items per page
- `status`: 'open', 'closed', 'active', 'funded'

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "AI Tutoring Platform",
      "description": "Personalized learning for students",
      "problemStatement": "Students lack personalized education",
      "solution": "AI tutor that adapts to each student",
      "rolesNeeded": [
        { "role": "Full Stack Dev", "count": 2 },
        { "role": "Designer", "count": 1 }
      ],
      "interestedUsers": [
        {
          "userId": "...",
          "appliedRole": "Full Stack Dev",
          "status": "pending"
        }
      ],
      "fundingStatus": "open",
      "createdAt": "2024-03-20T10:00:00Z"
    }
  ]
}
```

### Get Single Idea
```http
GET /ideas/:ideaId
```

### Create Idea (AUTH)
```http
POST /ideas
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Blockchain Voting System",
  "description": "Secure, transparent voting using blockchain",
  "problemStatement": "Current voting systems lack transparency",
  "solution": "Blockchain-based voting platform",
  "rolesNeeded": [
    { "role": "Blockchain Dev", "count": 2 },
    { "role": "Smart Contract Developer", "count": 1 },
    { "role": "Frontend Dev", "count": 2 }
  ],
  "fundingStatus": "open"
}
```
**Response (201):** Created idea object

### Update Idea (AUTH)
```http
PUT /ideas/:ideaId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "rolesNeeded": [...]
}
```

### Delete Idea (AUTH)
```http
DELETE /ideas/:ideaId
Authorization: Bearer <token>
```

### Express Interest in Idea (AUTH)
```http
POST /ideas/:ideaId/interested
Authorization: Bearer <token>
Content-Type: application/json

{
  "appliedRole": "Full Stack Developer"
}
```
**Response (200):**
```json
{
  "success": true,
  "message": "Interest expressed, waiting for founder approval"
}
```

### Accept Interested User (AUTH)
```http
PUT /ideas/:ideaId/accept/:userId
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "success": true,
  "message": "User accepted to team"
}
```

---

## 4. Jobs API

### Get All Jobs
```http
GET /jobs?page=1&limit=10&type=internship&location=Remote
```
**Query Params:**
- `page`: Page number
- `limit`: Items per page
- `type`: 'internship', 'full-time', 'part-time', 'contract'
- `location`: Filter by location
- `search`: Search title and company

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "Full Stack Developer Intern",
      "company": "TechCorp",
      "description": "Build features using React and Node.js",
      "jobType": "internship",
      "location": "Remote",
      "salary": {
        "min": 1200,
        "max": 1500,
        "currency": "USD/month"
      },
      "requirements": ["React", "Node.js", "MongoDB"],
      "applicationDeadline": "2024-04-30T23:59:59Z",
      "views": 234,
      "applicationsCount": 15,
      "createdAt": "2024-03-20T10:00:00Z"
    }
  ]
}
```

### Get Single Job
```http
GET /jobs/:jobId
```
**Response (200):** Single job object (increments views)

### Create Job (AUTH)
```http
POST /jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Senior React Developer",
  "company": "StartupXYZ",
  "description": "Lead frontend development of SaaS product",
  "jobType": "full-time",
  "location": "San Francisco, CA",
  "salary": {
    "min": 120000,
    "max": 160000,
    "currency": "USD/year"
  },
  "requirements": ["React", "TypeScript", "Node.js", "AWS"],
  "applicationDeadline": "2024-05-20T23:59:59Z"
}
```

### Update Job (AUTH)
```http
PUT /jobs/:jobId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "salary": {...}
}
```

### Delete Job (AUTH)
```http
DELETE /jobs/:jobId
Authorization: Bearer <token>
```

### Apply to Job (AUTH)
```http
POST /jobs/:jobId/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "coverLetter": "I'm excited about this opportunity because...",
  "portfolio": "https://portfolio.com",
  "resume": {
    "url": "https://cloudinary.com/resume.pdf"
  }
}
```
**Response (201):**
```json
{
  "success": true,
  "message": "Application submitted successfully"
}
```

### Get My Applications (AUTH)
```http
GET /jobs/applications/my
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "jobId": "...",
      "jobTitle": "React Developer",
      "company": "TechCorp",
      "status": "applied",
      "appliedAt": "2024-03-20T10:00:00Z",
      "updatedAt": "2024-03-20T10:00:00Z"
    }
  ]
}
```

### Get Job Applications (AUTH - Recruiter)
```http
GET /jobs/:jobId/applications
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "userId": "...",
      "userName": "John Doe",
      "userEmail": "john@college.edu",
      "status": "applied",
      "coverLetter": "...",
      "appliedAt": "2024-03-20T10:00:00Z"
    }
  ]
}
```

### Update Application Status (AUTH)
```http
PUT /jobs/applications/:applicationId
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "shortlisted",
  "adminNotes": "Great profile, proceeding to interview"
}
```
**Status values:** 'applied', 'reviewed', 'shortlisted', 'rejected', 'accepted'

---

## 5. Leaderboard API

### Get Global Leaderboard
```http
GET /leaderboard?page=1&limit=50
```
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "userId": "...",
      "userName": "Alice",
      "totalScore": 1250,
      "rank": 1,
      "scoreBreakdown": {
        "codingProblems": 100,
        "projectsPosted": 400,
        "projectLikes": 150,
        "connections": 100,
        "posts": 300,
        "postEngagement": 100,
        "communityParticipation": 50,
        "hackathonParticipation": 50
      }
    }
  ],
  "pagination": { "page": 1, "limit": 50, "total": 5000 }
}
```

### Get User Rank (AUTH)
```http
GET /leaderboard/rank/:userId
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "...",
    "userName": "John",
    "totalScore": 850,
    "rank": 45,
    "scoreBreakdown": {...}
  }
}
```

### Get College Leaderboard
```http
GET /leaderboard/college/:collegeName?page=1&limit=50
```
**Response (200):** Similar to global leaderboard, filtered by college

### Get Global Statistics
```http
GET /leaderboard/stats/global
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 10000,
    "averageScore": 450,
    "topScore": 5000,
    "scoreBreakdownAvg": {
      "codingProblems": 50,
      "projectsPosted": 100,
      "projectLikes": 80,
      ...
    }
  }
}
```

### Update Leaderboard Score (ADMIN)
```http
POST /leaderboard/update/:userId
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "scoreType": "projectsPosted",
  "amount": 25
}
```
**scoreType values:** 'codingProblems', 'projectsPosted', 'projectLikes', 'connections', 'posts', 'postEngagement', 'communityParticipation', 'hackathonParticipation'

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalScore": 875,
    "scoreBreakdown": {...}
  }
}
```

---

## 6. Resume API

### Get/Create Resume (AUTH)
```http
GET /resume
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "userId": "...",
    "personalInfo": {
      "fullName": "John Doe",
      "email": "john@college.edu",
      "phone": "+1234567890",
      "location": "San Francisco, CA",
      "bio": "Full Stack Developer"
    },
    "education": [...],
    "experience": [...],
    "projects": [...],
    "skills": [...],
    "certifications": [...],
    "isPublic": false,
    "shareLink": "https://campusx.com/resume/abc123"
  }
}
```

### Update Personal Info (AUTH)
```http
PUT /resume/personal
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@college.edu",
  "phone": "+1234567890",
  "location": "San Francisco, CA",
  "bio": "Passionate Full Stack Developer"
}
```

### Add Education (AUTH)
```http
POST /resume/education
Authorization: Bearer <token>
Content-Type: application/json

{
  "schoolName": "Stanford University",
  "degree": "B.S.",
  "fieldOfStudy": "Computer Science",
  "startDate": "2020-09-01",
  "endDate": "2024-05-31",
  "grade": "3.8"
}
```

### Add Experience (AUTH)
```http
POST /resume/experience
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobTitle": "Frontend Developer Intern",
  "company": "TechCorp",
  "location": "San Francisco, CA",
  "startDate": "2023-06-01",
  "endDate": "2023-08-31",
  "description": "Built React components for internal tools",
  "technologies": ["React", "TypeScript", "Tailwind"]
}
```

### Add Project (AUTH)
```http
POST /resume/project
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectName": "E-commerce Platform",
  "description": "Full-stack e-commerce marketplace",
  "link": "https://github.com/user/project",
  "technologies": ["React", "Node.js", "MongoDB"],
  "startDate": "2023-01-01",
  "endDate": "2023-05-01"
}
```

### Add Skills (AUTH)
```http
POST /resume/skills
Authorization: Bearer <token>
Content-Type: application/json

{
  "skills": [
    { "name": "React", "proficiency": "Advanced" },
    { "name": "Node.js", "proficiency": "Intermediate" },
    { "name": "MongoDB", "proficiency": "Intermediate" }
  ]
}
```

### Add Certification (AUTH)
```http
POST /resume/certification
Authorization: Bearer <token>
Content-Type: application/json

{
  "certificationName": "AWS Certified Solutions Architect",
  "issuer": "Amazon Web Services",
  "issueDate": "2023-06-01",
  "credentialId": "AWS-123456",
  "credentialUrl": "https://aws.amazon.com/verification"
}
```

### Get AI Suggestions (AUTH)
```http
GET /resume/ai-suggestions
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      "Add more specific metrics to your experience (e.g., 'Improved page load by 40%')",
      "Your resume is missing recent projects. Consider adding your latest work.",
      "Include more technologies in your skills section"
    ]
  }
}
```

### Export to PDF (AUTH)
```http
POST /resume/export-pdf
Authorization: Bearer <token>
Content-Type: application/json

{
  "template": "modern"
}
```
**Template options:** 'modern', 'classic', 'minimal'

**Response (200):**
```json
{
  "success": true,
  "data": {
    "pdfUrl": "https://cloudinary.com/resume-abc123.pdf"
  }
}
```

### Toggle Public Resume (AUTH)
```http
PUT /resume/visibility
Authorization: Bearer <token>
Content-Type: application/json

{
  "isPublic": true
}
```

### Get Public Resume
```http
GET /resume/public/:userId
```
**Response (200):** Public resume data (without sensitive fields)

---

## 7. Hackathons API

### Get All Hackathons
```http
GET /hackathons?page=1&limit=10&status=upcoming
```
**Query Params:**
- `status`: 'upcoming', 'registration', 'ongoing', 'completed'

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "AI Innovation Hackathon 2024",
      "description": "Build AI solutions for real-world problems",
      "startDate": "2024-04-15T00:00:00Z",
      "endDate": "2024-04-17T23:59:59Z",
      "registrationDeadline": "2024-04-10T23:59:59Z",
      "location": "Virtual",
      "status": "upcoming",
      "maxTeamSize": 5,
      "minTeamSize": 2,
      "prizePool": {
        "total": 50000,
        "distribution": {
          "1st": 30000,
          "2nd": 15000,
          "3rd": 5000
        }
      },
      "registeredTeams": 145,
      "judges": [...],
      "createdAt": "2024-02-20T10:00:00Z"
    }
  ]
}
```

### Get Single Hackathon
```http
GET /hackathons/:hackathonId
```

### Create Hackathon (ADMIN)
```http
POST /hackathons
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Web3 Hackathon",
  "description": "Build the future of decentralized web",
  "startDate": "2024-05-01T00:00:00Z",
  "endDate": "2024-05-03T23:59:59Z",
  "registrationDeadline": "2024-04-25T23:59:59Z",
  "location": "San Francisco, CA",
  "maxTeamSize": 6,
  "minTeamSize": 2,
  "prizePool": {
    "total": 100000,
    "distribution": {
      "1st": 60000,
      "2nd": 30000,
      "3rd": 10000
    }
  },
  "judges": ["userId1", "userId2", "userId3"]
}
```

### Register Team (AUTH)
```http
POST /hackathons/:hackathonId/register-team
Authorization: Bearer <token>
Content-Type: application/json

{
  "teamName": "Code Warriors",
  "description": "Passionate about building innovative solutions",
  "techStack": ["React", "Node.js", "Python", "TensorFlow"]
}
```
**Response (201):**
```json
{
  "success": true,
  "message": "Team registered successfully",
  "data": {
    "_id": "...",
    "teamName": "Code Warriors",
    "leader": "...",
    "members": ["..."],
    "hackathonId": "...",
    "status": "active"
  }
}
```

### Join Team (AUTH)
```http
POST /hackathons/teams/:teamId/join
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "success": true,
  "message": "Joined team successfully"
}
```

### Submit Project (AUTH)
```http
POST /hackathons/:hackathonId/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectName": "EcoTracker",
  "description": "Track and reduce carbon footprint",
  "githubLink": "https://github.com/team/project",
  "demoLink": "https://ecotacker-demo.com",
  "techStack": ["React", "Node.js", "MongoDB"],
  "teamId": "..."
}
```
**Response (201):**
```json
{
  "success": true,
  "message": "Project submitted successfully"
}
```

### Get Leaderboard (AUTH)
```http
GET /hackathons/:hackathonId/leaderboard
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "team": "Code Warriors",
      "members": ["John", "Jane", "Bob"],
      "project": "EcoTracker",
      "totalScore": 95.5,
      "judgeScores": [92, 96, 98],
      "prize": "$30,000"
    }
  ]
}
```

### Score Submission (AUTH - Judge)
```http
PUT /hackathons/submissions/:submissionId/score
Authorization: Bearer <judge_token>
Content-Type: application/json

{
  "innovation": 9,
  "functionality": 8,
  "design": 9,
  "presentation": 9,
  "feedback": "Great project with solid innovation"
}
```
**Response (200):**
```json
{
  "success": true,
  "message": "Score submitted",
  "data": {
    "submissionId": "...",
    "averageScore": 93.5
  }
}
```

---

## 8. Communities API

### Get All Communities
```http
GET /communities?page=1&limit=20&category=WebDevelopment
```
**Query Params:**
- `category`: Community category
- `search`: Search by name or description
- `sort`: 'popular' or 'newest'

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "React Developers",
      "slug": "react-developers",
      "description": "Community for React enthusiasts",
      "category": "WebDevelopment",
      "banner": "https://...",
      "members": 5000,
      "posts": 1200,
      "moderators": ["..."],
      "stats": {
        "totalPosts": 1200,
        "totalComments": 8500,
        "weeklyActive": 800
      },
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Get Community by Slug
```http
GET /communities/:slug
```

### Create Community (AUTH)
```http
POST /communities
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Machine Learning Enthusiasts",
  "description": "Learn and discuss ML/AI technologies",
  "category": "AI_ML",
  "rules": [
    "Be respectful to all members",
    "No spam or promotional content",
    "Use English for discussions"
  ]
}
```

### Join Community (AUTH)
```http
POST /communities/:communityId/join
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "success": true,
  "message": "Joined community successfully"
}
```

### Leave Community (AUTH)
```http
POST /communities/:communityId/leave
Authorization: Bearer <token>
```

### Get Community Posts
```http
GET /communities/:communityId/posts?page=1&limit=20&sort=recent
```
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "Best React patterns for 2024",
      "content": "Let's discuss modern React patterns...",
      "author": {
        "_id": "...",
        "name": "John",
        "avatar": "..."
      },
      "type": "discussion",
      "likes": 45,
      "commentsCount": 12,
      "createdAt": "2024-03-20T10:00:00Z"
    }
  ]
}
```

### Create Community Post (AUTH)
```http
POST /communities/:communityId/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Best practices for async/await",
  "content": "Let's discuss best practices...",
  "type": "discussion",
  "tags": ["javascript", "async", "best-practices"]
}
```
**Type options:** 'discussion', 'question', 'resource', 'event', 'announcement'

**Response (201):**
```json
{
  "success": true,
  "message": "Post created successfully"
}
```

### Like Post (AUTH)
```http
POST /communities/posts/:postId/like
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "success": true,
  "data": { "likes": 46 }
}
```

### Get Post Comments
```http
GET /communities/posts/:postId/comments
```
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "content": "Great point! Here's my perspective...",
      "author": {
        "_id": "...",
        "name": "Jane",
        "avatar": "..."
      },
      "isAnswer": false,
      "likes": 8,
      "createdAt": "2024-03-20T10:30:00Z"
    }
  ]
}
```

### Add Comment (AUTH)
```http
POST /communities/posts/:postId/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "I completely agree. In production, we also need to consider...",
  "isAnswer": false
}
```
**Response (201):**
```json
{
  "success": true,
  "message": "Comment added successfully"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Descriptive error message",
  "error": "ERROR_CODE"
}
```

### Common Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | User doesn't have permission |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `DUPLICATE_ENTRY` | 409 | Duplicate record |
| `INTERNAL_ERROR` | 500 | Server error |

### Example Error Response
```json
{
  "success": false,
  "message": "Invalid college email domain",
  "error": "VALIDATION_ERROR"
}
```

---

## Rate Limiting

Endpoints are rate limited to prevent abuse:
- Basic endpoints: 100 requests per minute
- Auth endpoints: 20 requests per minute
- Admin endpoints: 50 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1634567890
```

---

## Pagination

List endpoints support pagination with:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Example response structure:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 156,
    "totalPages": 16
  }
}
```

---

**Last Updated:** March 2026
**API Version:** 2.0
