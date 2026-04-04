# CampusXConnect - Feature Implementation Guide

Complete documentation of all implemented features and how to use them.

## 📋 Table of Contents

1. [Authentication System](#authentication-system)
2. [User Profile System](#user-profile-system)
3. [Project Posting Feed](#project-posting-feed)
4. [Collaboration Features](#collaboration-features)
5. [Coding Practice](#coding-practice)
6. [Database Relationships](#database-relationships)
7. [Error Handling](#error-handling)

---

## Authentication System

### Features Implemented

✅ **User Registration (Signup)**

- College email validation
- Password strength requirements (minimum 6 characters)
- Duplicate email prevention
- Automatic password hashing with bcryptjs
- JWT token generation upon signup

✅ **User Login**

- Email and password validation
- Secure password comparison
- Session token generation (valid for 30 days)
- User data returned without password

✅ **Protected Routes**

- JWT middleware validates all protected endpoints
- Token stored in localStorage on client
- Automatic token injection in API headers
- Token expiration handling

### Implementation Details

**Backend:**

- Auth controller: `backend/controllers/authController.js`
- Auth routes: `backend/routes/auth.js`
- Auth middleware: `backend/middleware/auth.js`

**Frontend:**

- Signup page: `frontend/app/signup/page.jsx`
- Login page: `frontend/app/login/page.jsx`
- Auth store: `frontend/lib/store.js`

### How to Use

1. **Signup**

```javascript
const response = await fetch("/api/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    password: "securepassword123",
  }),
});
const { token, user } = await response.json();
localStorage.setItem("token", token);
```

2. **Login**

```javascript
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "john@example.com",
    password: "securepassword123",
  }),
});
const { token } = await response.json();
localStorage.setItem("token", token);
```

---

## User Profile System

### Features Implemented

✅ **Profile Creation**

- Automatic profile creation upon signup
- Default profile picture (placeholder)
- Default college: Dronacharya Group of Institutions
- Default branch: CSE

✅ **Profile Management**

- View complete profile with all details
- Edit profile information
- Update skills (stored as array)
- Add GitHub and LinkedIn links
- Change branch and academic year
- Add personalized bio

✅ **Social Features**

- Follow/Unfollow system
- Followers count
- Following count
- View other users' profiles

### Profile Fields

```javascript
{
  name: String,              // Full name
  email: String,             // College email
  profilePicture: String,    // URL to profile image
  college: String,           // Default: Dronacharya Group of Institutions
  branch: String,            // CSE, ECE, ME, CIVIL, EE, IT, BT
  year: Number,              // 1-4
  bio: String,               // Personal description
  skills: [String],          // List of technical skills
  github: String,            // GitHub profile URL
  linkedin: String,          // LinkedIn profile URL
  followers: [ObjectId],     // Array of follower user IDs
  following: [ObjectId],     // Array of following user IDs
}
```

### Implementation Details

**Backend:**

- User model: `backend/models/User.js`
- User controller: `backend/controllers/userController.js`
- User routes: `backend/routes/users.js`

**Frontend:**

- Profile page: `frontend/app/profile/page.jsx`
- API client: `frontend/lib/api.js`
- State management: `frontend/lib/store.js`

### How to Use

1. **Get Profile**

```javascript
const response = await userAPI.getProfile();
setProfile(response.data.user);
```

2. **Update Profile**

```javascript
await userAPI.updateProfile({
  name: "Updated Name",
  bio: "New bio",
  skills: ["React", "Node.js"],
  github: "https://github.com/username",
  linkedin: "https://linkedin.com/in/username",
});
```

3. **Follow User**

```javascript
await userAPI.follow(userId);
```

---

## Project Posting Feed

### Features Implemented

✅ **Create Projects**

- Title for project
- Detailed description
- Technology stack (multiple tags)
- GitHub repository link
- Automatic author assignment
- Timestamp tracking

✅ **View Feed**

- Paginated feed (10 posts per page)
- Latest posts first
- Author information displayed
- Technology stack badges
- Like and comment counts
- Direct GitHub link access

✅ **Engagement Features**

- Like/Unlike posts
- Comment on posts (with author info)
- View all comments for a post
- Nested author information

✅ **Post Management**

- Edit own posts
- Delete own posts
- Update project details

### Post Data Structure

```javascript
{
  title: String,           // Project title
  description: String,     // Detailed description
  author: ObjectId,        // Reference to User
  techStack: [String],     // Array of technologies
  githubLink: String,      // Repository URL
  likes: [ObjectId],       // Array of user IDs who liked
  comments: [ObjectId],    // Array of comment IDs
  collaborators: [ObjectId], // Array of collaborating users
  createdAt: Date,
  updatedAt: Date
}
```

### Implementation Details

**Backend:**

- Post model: `backend/models/Post.js`
- Comment model: `backend/models/Comment.js`
- Post controller: `backend/controllers/postController.js`
- Post routes: `backend/routes/posts.js`

**Frontend:**

- Feed page: `frontend/app/feed/page.jsx`
- Create post page: `frontend/app/create-post/page.jsx`
- Post API: `frontend/lib/api.js`

### How to Use

1. **Create Post**

```javascript
await postAPI.createPost({
  title: "My Project",
  description: "Project description",
  techStack: ["React", "Node.js"],
  githubLink: "https://github.com/username/repo",
});
```

2. **Get Feed**

```javascript
const response = await postAPI.getFeed(page);
// Returns: { posts: [...], pagination: {...} }
```

3. **Like Post**

```javascript
await postAPI.like(postId);
```

4. **Comment on Post**

```javascript
await postAPI.comment(postId, { content: "Great project!" });
```

---

## Collaboration Features

### Features Implemented

✅ **Discover Projects**

- Browse all project posts
- Filter by technology
- View project details
- See project team

✅ **Join Teams**

- Collaborate on projects
- Multiple team members per project
- Team member management

✅ **Social Network**

- Follow other students
- View follower/following lists
- Network with peers

### How to Use

1. **Browse Projects**
   - Navigate to Feed
   - Click on any project
   - View full details and collaborators

2. **Join Project**

   ```javascript
   // Future feature: Send collaboration request
   // Once implemented, users can request to join
   ```

3. **Follow Student**
   ```javascript
   await userAPI.follow(userId);
   ```

---

## Coding Practice

### Features Implemented

✅ **Problem Bank**

- Multiple coding problems
- Difficulty levels (Easy, Medium, Hard)
- Problem categories (Array, String, Linked List, etc.)
- Detailed problem descriptions
- Test cases for each problem

✅ **Code Submission**

- Write solutions in multiple languages
- JavaScript, Python, Java, C++, Go support
- Submit solutions
- Track submission status
- View runtime metrics

✅ **Leaderboard System**

- Rank students by problems solved
- Display average execution time
- Medal system (🥇 🥈 🥉)
- Real-time ranking updates
- Top 50 students displayed

### Problem Data Structure

```javascript
{
  title: String,           // Problem name
  description: String,     // Problem statement
  difficulty: String,      // Easy, Medium, Hard
  category: String,        // Array, String, etc.
  testCases: [             // Array of test cases
    {
      input: String,
      output: String
    }
  ],
  submissions: [ObjectId]  // Array of submission IDs
}
```

### Submission Data Structure

```javascript
{
  user: ObjectId,          // Reference to User
  problem: ObjectId,       // Reference to CodingProblem
  code: String,            // Source code
  language: String,        // Programming language
  status: String,          // Accepted, Wrong Answer, etc.
  runtime: Number,         // Execution time in ms
  memory: Number,          // Memory used in MB
  createdAt: Date
}
```

### Implementation Details

**Backend:**

- Problem model: `backend/models/CodingProblem.js`
- Submission model: `backend/models/Submission.js`
- Coding controller: `backend/controllers/codingController.js`
- Coding routes: `backend/routes/coding.js`

**Frontend:**

- Problems page: `frontend/app/coding/page.jsx`
- Problem detail: `frontend/app/coding/[id]/page.jsx`
- Leaderboard: `frontend/app/leaderboard/page.jsx`
- Coding API: `frontend/lib/api.js`

### How to Use

1. **Get Problems**

```javascript
const response = await codingAPI.getProblems(1, "Easy");
// Returns: { problems: [...], pagination: {...} }
```

2. **Get Problem Details**

```javascript
const response = await codingAPI.getProblemById(problemId);
// Returns: { problem: {...} }
```

3. **Submit Solution**

```javascript
await codingAPI.submit({
  problemId: "problem_id",
  code: "function solve() { ... }",
  language: "JavaScript",
  status: "Accepted",
});
```

4. **View Leaderboard**

```javascript
const response = await codingAPI.getLeaderboard();
// Returns: { leaderboard: [...] }
```

---

## Database Relationships

### Schema Relationships

```
User (1) ──┬──── (many) Post (author)
           │
           ├──── (many) Comment (author)
           │
           ├──── (many) Submission (user)
           │
           └──── (many) User (followers/following)

Post (1) ──┬──── (many) Comment
           └──── (many) User (likes)

Comment (1) ──── (many) User (likes)

CodingProblem (1) ──── (many) Submission

Submission (1) ──┬──── (1) User
                 └──── (1) CodingProblem
```

### Indexing Strategy

**Recommended MongoDB Indexes:**

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });

// Posts
db.posts.createIndex({ author: 1 });
db.posts.createIndex({ createdAt: -1 });

// Comments
db.comments.createIndex({ post: 1 });
db.comments.createIndex({ author: 1 });

// Submissions
db.submissions.createIndex({ user: 1 });
db.submissions.createIndex({ problem: 1 });
db.submissions.createIndex({ problem: 1, status: 1 });

// Coding Problems
db.codingproblems.createIndex({ difficulty: 1 });
db.codingproblems.createIndex({ category: 1 });
```

---

## Error Handling

### Backend Error Responses

**Format:**

```json
{
  "message": "Error description",
  "error": "Error details (development only)"
}
```

**Common Errors:**

| Status | Message                            | Cause                         |
| ------ | ---------------------------------- | ----------------------------- |
| 400    | Please provide all required fields | Missing required data         |
| 401    | Invalid credentials                | Wrong email/password          |
| 401    | No token provided                  | Missing authorization         |
| 401    | Invalid token                      | Expired or wrong token        |
| 404    | User/Post/Problem not found        | ID doesn't exist              |
| 400    | User already exists                | Duplicate email               |
| 401    | Not authorized                     | Trying to modify other's data |
| 500    | Server error                       | Database or server issue      |

### Frontend Error Handling

```javascript
try {
  const response = await API.call();
  // Handle success
} catch (error) {
  const message = error.response?.data?.message || "An error occurred";
  toast.error(message);
}
```

### Validation

**Backend Validation:**

- Email format validation
- Required field checks
- Data type validation
- Array length validation

**Frontend Validation:**

- Form field validation
- Email format check
- Password confirmation
- Pre-submission checks

---

## Notes and Best Practices

### Security

1. **Passwords**: Always hashed with bcrypt before storage
2. **JWT**: Tokens expire after 30 days
3. **CORS**: Configured for specific origin
4. **Environment**: Sensitive data in .env files only

### Performance

1. **Pagination**: Feed limited to 10 posts per page
2. **Indexing**: Database indexes on frequently queried fields
3. **Lazy Loading**: Images and content loaded on demand
4. **Caching**: Consider Redis for frequently accessed data

### Scalability

1. **Microservices**: Can be split into separate services later
2. **Queue**: Add job queue for heavy operations
3. **CDN**: Store images on CDN for faster delivery
4. **Load Balancing**: Deploy multiple instances

For more information, see the [README.md](./README.md) and [API_TESTING.md](./API_TESTING.md)
