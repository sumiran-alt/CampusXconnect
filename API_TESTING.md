# CampusXConnect - API Testing Guide

Complete guide for testing all API endpoints.

## Prerequisites

- Backend running on `http://localhost:5000`
- MongoDB connected
- API client (Postman, Insomnia, or curl)

## Base URL

```
http://localhost:5000/api
```

---

## 🔐 Authentication Endpoints

### 1. Signup

**Endpoint:** `POST /auth/signup`

**Request:**

```json
{
  "name": "Raj Kumar",
  "email": "raj@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Raj Kumar",
    "email": "raj@example.com"
  }
}
```

### 2. Login

**Endpoint:** `POST /auth/login`

**Request:**

```json
{
  "email": "raj@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Raj Kumar",
    "email": "raj@example.com",
    "profilePicture": "https://via.placeholder.com/150"
  }
}
```

---

## 👤 User Endpoints

All user endpoints except `GET /users/:id` require authentication.

### Headers for Protected Endpoints

```
Authorization: Bearer <token>
Content-Type: application/json
```

### 1. Get Profile

**Endpoint:** `GET /users/profile`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Raj Kumar",
    "email": "raj@example.com",
    "branch": "CSE",
    "year": 3,
    "skills": ["React", "Node.js"],
    "bio": "Web developer",
    "followers": [],
    "following": []
  }
}
```

### 2. Update Profile

**Endpoint:** `PUT /users/profile/update`

**Headers:**

```
Authorization: Bearer <token>
```

**Request:**

```json
{
  "name": "Raj Kumar",
  "bio": "Full-stack developer",
  "skills": ["React", "Node.js", "MongoDB"],
  "github": "https://github.com/rajkumar",
  "linkedin": "https://linkedin.com/in/rajkumar",
  "branch": "CSE",
  "year": 3
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Raj Kumar",
    "bio": "Full-stack developer",
    "skills": ["React", "Node.js", "MongoDB"],
    "github": "https://github.com/rajkumar",
    "linkedin": "https://linkedin.com/in/rajkumar",
    "branch": "CSE",
    "year": 3
  }
}
```

### 3. Get User by ID

**Endpoint:** `GET /users/:id`

**Parameters:**

- `id` - User ID (MongoDB ObjectId)

**Response:**

```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Raj Kumar",
    "email": "raj@example.com",
    "branch": "CSE",
    "year": 3,
    "skills": ["React", "Node.js"],
    "bio": "Web developer",
    "followers": ["507f1f77bcf86cd799439012"],
    "following": []
  }
}
```

### 4. Follow User

**Endpoint:** `POST /users/follow/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Parameters:**

- `id` - User ID to follow

**Response:**

```json
{
  "success": true,
  "message": "User followed successfully"
}
```

### 5. Unfollow User

**Endpoint:** `POST /users/unfollow/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "User unfollowed successfully"
}
```

---

## 📝 Post Endpoints

### 1. Create Post

**Endpoint:** `POST /posts/createPost`

**Headers:**

```
Authorization: Bearer <token>
```

**Request:**

```json
{
  "title": "AI-Powered Study Assistant",
  "description": "Built a machine learning model that helps students with personalized study recommendations.",
  "techStack": ["Python", "TensorFlow", "React"],
  "githubLink": "https://github.com/rajkumar/study-assistant"
}
```

**Response:**

```json
{
  "success": true,
  "post": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "AI-Powered Study Assistant",
    "description": "Built a machine learning model...",
    "author": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Raj Kumar"
    },
    "techStack": ["Python", "TensorFlow", "React"],
    "likes": [],
    "comments": [],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 2. Get Feed

**Endpoint:** `GET /posts/feed?page=1`

**Query Parameters:**

- `page` (optional) - Page number, default: 1

**Response:**

```json
{
  "success": true,
  "posts": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "AI-Powered Study Assistant",
      "description": "...",
      "author": {...},
      "likes": [],
      "comments": [],
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalPosts": 50
  }
}
```

### 3. Get Post by ID

**Endpoint:** `GET /posts/:id`

**Parameters:**

- `id` - Post ID

**Response:**

```json
{
  "success": true,
  "post": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "AI-Powered Study Assistant",
    "author": {...},
    "likes": [],
    "comments": [...]
  }
}
```

### 4. Like Post

**Endpoint:** `POST /posts/like/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Post liked successfully",
  "likes": 5
}
```

### 5. Unlike Post

**Endpoint:** `POST /posts/unlike/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Post unliked successfully",
  "likes": 4
}
```

### 6. Comment on Post

**Endpoint:** `POST /posts/comment/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Request:**

```json
{
  "content": "This looks amazing! Would love to collaborate."
}
```

**Response:**

```json
{
  "success": true,
  "comment": {
    "_id": "507f1f77bcf86cd799439014",
    "content": "This looks amazing!",
    "author": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Priya Singh"
    },
    "createdAt": "2024-01-15T11:00:00Z"
  }
}
```

### 7. Get Comments for Post

**Endpoint:** `GET /posts/comments/:id`

**Parameters:**

- `id` - Post ID

**Response:**

```json
{
  "success": true,
  "comments": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "content": "Amazing project!",
      "author": {...},
      "likes": [],
      "createdAt": "2024-01-15T11:00:00Z"
    }
  ]
}
```

### 8. Update Post

**Endpoint:** `PUT /posts/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Request:**

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "techStack": ["Python", "TensorFlow"],
  "githubLink": "https://github.com/new-link"
}
```

**Response:**

```json
{
  "success": true,
  "post": {...}
}
```

### 9. Delete Post

**Endpoint:** `DELETE /posts/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

## 💻 Coding Endpoints

### 1. Get All Problems

**Endpoint:** `GET /coding/problems?page=1&difficulty=Easy`

**Query Parameters:**

- `page` (optional) - Page number
- `difficulty` (optional) - Easy, Medium, Hard

**Response:**

```json
{
  "success": true,
  "problems": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "title": "Two Sum",
      "description": "Find two numbers that add up to target",
      "difficulty": "Easy",
      "category": "Array",
      "testCases": [...]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalProblems": 25
  }
}
```

### 2. Get Problem by ID

**Endpoint:** `GET /coding/problems/:id`

**Response:**

```json
{
  "success": true,
  "problem": {
    "_id": "507f1f77bcf86cd799439015",
    "title": "Two Sum",
    "description": "...",
    "difficulty": "Easy",
    "category": "Array",
    "testCases": [
      { "input": "[2,7,11,15], target=9", "output": "[0,1]" }
    ],
    "submissions": [...]
  }
}
```

### 3. Submit Solution

**Endpoint:** `POST /coding/submit`

**Headers:**

```
Authorization: Bearer <token>
```

**Request:**

```json
{
  "problemId": "507f1f77bcf86cd799439015",
  "code": "function twoSum(nums, target) { return [0, 1]; }",
  "language": "JavaScript",
  "status": "Accepted"
}
```

**Response:**

```json
{
  "success": true,
  "submission": {
    "_id": "507f1f77bcf86cd799439016",
    "user": {...},
    "problem": "507f1f77bcf86cd799439015",
    "code": "function twoSum(nums, target) { return [0, 1]; }",
    "language": "JavaScript",
    "status": "Accepted",
    "runtime": 45.23,
    "memory": 35.67,
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

### 4. Get User Submissions

**Endpoint:** `GET /coding/submissions/:userId`

**Parameters:**

- `userId` - User ID

**Response:**

```json
{
  "success": true,
  "submissions": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "user": {...},
      "problem": {...},
      "status": "Accepted",
      "runtime": 45.23
    }
  ]
}
```

### 5. Get Leaderboard

**Endpoint:** `GET /coding/leaderboard`

**Response:**

```json
{
  "success": true,
  "leaderboard": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userInfo": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Raj Kumar"
      },
      "solvedCount": 25,
      "avgRuntime": 45.3
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "userInfo": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Priya Singh"
      },
      "solvedCount": 18,
      "avgRuntime": 52.1
    }
  ]
}
```

---

## 🧪 Testing with curl

### Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Raj","email":"raj@example.com","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"raj@example.com","password":"password123"}'
```

### Get Profile (with token)

```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Feed

```bash
curl -X GET "http://localhost:5000/api/posts/feed?page=1"
```

---

## ✅ Testing Checklist

- [ ] Test all signup scenarios
- [ ] Test login with correct/incorrect credentials
- [ ] Test profile update with various fields
- [ ] Test create post with complete data
- [ ] Test like/unlike functionality
- [ ] Test comment on posts
- [ ] Test coding problem retrieval
- [ ] Test solution submission
- [ ] Test leaderboard ranking
- [ ] Test follow/unfollow users
- [ ] Test pagination on feed
- [ ] Test error scenarios

---

For more information, see [README.md](./README.md)
