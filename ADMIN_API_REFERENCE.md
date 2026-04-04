# Admin API Reference

## Base URL

```
http://localhost:5000/api
```

## Authentication Headers

All admin endpoints require:

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## Authentication Endpoints

### User Signup

**POST** `/auth/signup`

Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response (201):

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "60d5ec49f1b2c72d8c8e4a1f",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### User Login

**POST** `/auth/login`

Request:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response (200):

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "60d5ec49f1b2c72d8c8e4a1f",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "profilePicture": "https://..."
  }
}
```

---

### Admin Signup

**POST** `/auth/admin/signup`

Request:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "secure_password",
  "adminKey": "admin_secret_key_2024"
}
```

Response (201):

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "60d5ec49f1b2c72d8c8e4a20",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

Error (403):

```json
{
  "message": "Invalid admin key"
}
```

---

### Admin Login

**POST** `/auth/admin/login`

Request:

```json
{
  "email": "admin@example.com",
  "password": "secure_password"
}
```

Response (200):

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "60d5ec49f1b2c72d8c8e4a20",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

## User Management Endpoints

### Get All Users

**GET** `/admin/users`

Headers:

```
Authorization: Bearer <admin_token>
```

Response (200):

```json
{
  "success": true,
  "count": 5,
  "users": [
    {
      "_id": "60d5ec49f1b2c72d8c8e4a1f",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "college": "DIT",
      "branch": "CSE",
      "year": 2
    }
  ]
}
```

---

### Get User by ID

**GET** `/admin/users/:id`

Headers:

```
Authorization: Bearer <admin_token>
```

Response (200):

```json
{
  "success": true,
  "user": {
    "_id": "60d5ec49f1b2c72d8c8e4a1f",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "profilePicture": "https://...",
    "github": "https://github.com/johndoe",
    "linkedin": "https://linkedin.com/in/johndoe",
    "skills": ["React", "Node.js"],
    "bio": "Full stack developer"
  }
}
```

---

### Delete User

**DELETE** `/admin/users/:id`

Headers:

```
Authorization: Bearer <admin_token>
```

Response (200):

```json
{
  "success": true,
  "message": "User deleted"
}
```

---

### Update User Role

**PUT** `/admin/users/:id/role`

Headers:

```
Authorization: Bearer <admin_token>
```

Request:

```json
{
  "role": "admin"
}
```

Response (200):

```json
{
  "success": true,
  "user": {
    "_id": "60d5ec49f1b2c72d8c8e4a1f",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

---

### Toggle User Status

**PUT** `/admin/users/:id/status`

Headers:

```
Authorization: Bearer <admin_token>
```

Response (200):

```json
{
  "success": true,
  "user": {
    "_id": "60d5ec49f1b2c72d8c8e4a1f",
    "isActive": false
  }
}
```

---

## Post Management Endpoints

### Get All Posts

**GET** `/admin/posts`

Headers:

```
Authorization: Bearer <admin_token>
```

Response (200):

```json
{
  "success": true,
  "count": 10,
  "posts": [
    {
      "_id": "60d5ec49f1b2c72d8c8e4a2f",
      "title": "Getting Started with React",
      "description": "A beginner's guide to React...",
      "author": {
        "_id": "60d5ec49f1b2c72d8c8e4a1f",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "likes": 15,
      "comments": 5,
      "createdAt": "2024-03-10T10:30:00Z"
    }
  ]
}
```

---

### Delete Post

**DELETE** `/admin/posts/:id`

Headers:

```
Authorization: Bearer <admin_token>
```

Response (200):

```json
{
  "success": true,
  "message": "Post deleted"
}
```

---

### Flag Post

**PUT** `/admin/posts/:id/flag`

Headers:

```
Authorization: Bearer <admin_token>
```

Response (200):

```json
{
  "success": true,
  "post": {
    "_id": "60d5ec49f1b2c72d8c8e4a2f",
    "title": "Getting Started with React",
    "isFlagged": true
  }
}
```

---

## Coding Problem Management Endpoints

### Get All Problems

**GET** `/admin/problems`

Headers:

```
Authorization: Bearer <admin_token>
```

Response (200):

```json
{
  "success": true,
  "count": 20,
  "problems": [
    {
      "_id": "60d5ec49f1b2c72d8c8e4a3f",
      "title": "Two Sum",
      "description": "Given an array of integers...",
      "difficulty": "easy",
      "testCases": [
        {
          "input": "[2, 7, 11, 15], 9",
          "output": "[0, 1]"
        }
      ]
    }
  ]
}
```

---

### Create Problem

**POST** `/admin/problems`

Headers:

```
Authorization: Bearer <admin_token>
```

Request:

```json
{
  "title": "Two Sum",
  "description": "Given an array of integers nums and an integer target...",
  "difficulty": "easy",
  "testCases": [
    {
      "input": "[2, 7, 11, 15], 9",
      "output": "[0, 1]"
    }
  ]
}
```

Response (201):

```json
{
  "success": true,
  "problem": {
    "_id": "60d5ec49f1b2c72d8c8e4a4f",
    "title": "Two Sum",
    "description": "Given an array of integers...",
    "difficulty": "easy"
  }
}
```

---

### Update Problem

**PUT** `/admin/problems/:id`

Headers:

```
Authorization: Bearer <admin_token>
```

Request:

```json
{
  "title": "Two Sum Updated",
  "difficulty": "medium"
}
```

Response (200):

```json
{
  "success": true,
  "problem": {
    "_id": "60d5ec49f1b2c72d8c8e4a4f",
    "title": "Two Sum Updated",
    "difficulty": "medium"
  }
}
```

---

### Delete Problem

**DELETE** `/admin/problems/:id`

Headers:

```
Authorization: Bearer <admin_token>
```

Response (200):

```json
{
  "success": true,
  "message": "Problem deleted"
}
```

---

## Submission Management Endpoints

### Get All Submissions

**GET** `/admin/submissions`

Headers:

```
Authorization: Bearer <admin_token>
```

Response (200):

```json
{
  "success": true,
  "count": 50,
  "submissions": [
    {
      "_id": "60d5ec49f1b2c72d8c8e4a5f",
      "userId": {
        "_id": "60d5ec49f1b2c72d8c8e4a1f",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "problemId": {
        "_id": "60d5ec49f1b2c72d8c8e4a4f",
        "title": "Two Sum"
      },
      "status": "accepted",
      "language": "python",
      "createdAt": "2024-03-10T10:30:00Z"
    }
  ]
}
```

---

## Comment Management Endpoints

### Get All Comments

**GET** `/admin/comments`

Headers:

```
Authorization: Bearer <admin_token>
```

Response (200):

```json
{
  "success": true,
  "count": 100,
  "comments": [
    {
      "_id": "60d5ec49f1b2c72d8c8e4a6f",
      "userId": {
        "_id": "60d5ec49f1b2c72d8c8e4a1f",
        "name": "John Doe"
      },
      "postId": {
        "_id": "60d5ec49f1b2c72d8c8e4a2f",
        "title": "Getting Started with React"
      },
      "content": "Great tutorial!",
      "likes": 3,
      "createdAt": "2024-03-10T10:30:00Z"
    }
  ]
}
```

---

### Delete Comment

**DELETE** `/admin/comments/:id`

Headers:

```
Authorization: Bearer <admin_token>
```

Response (200):

```json
{
  "success": true,
  "message": "Comment deleted"
}
```

---

## Dashboard Endpoints

### Get Statistics

**GET** `/admin/stats`

Headers:

```
Authorization: Bearer <admin_token>
```

Response (200):

```json
{
  "success": true,
  "stats": {
    "totalUsers": 45,
    "totalAdmins": 3,
    "totalPosts": 120,
    "totalProblems": 25,
    "totalSubmissions": 350,
    "totalComments": 280
  }
}
```

---

## Error Responses

### 401 Unauthorized (Missing or Invalid Token)

```json
{
  "message": "No token provided"
}
```

### 403 Forbidden (Not Admin)

```json
{
  "message": "Access denied. Admin only."
}
```

### 404 Not Found

```json
{
  "message": "User not found"
}
```

### 400 Bad Request

```json
{
  "message": "Invalid role"
}
```

### 500 Server Error

```json
{
  "message": "Error message here"
}
```

---

## Status Codes Reference

| Code | Meaning                                 |
| ---- | --------------------------------------- |
| 200  | OK - Request successful                 |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid input             |
| 401  | Unauthorized - Missing/invalid token    |
| 403  | Forbidden - Admin role required         |
| 404  | Not Found - Resource not found          |
| 500  | Server Error - Internal server error    |

---

## Testing with cURL

### Example: Get Admin Token

```bash
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "secure_password"
  }'
```

### Example: Get All Users

```bash
TOKEN="your_jwt_token_here"

curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Example: Delete User

```bash
TOKEN="your_jwt_token_here"
USER_ID="60d5ec49f1b2c72d8c8e4a1f"

curl -X DELETE http://localhost:5000/api/admin/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

**Last Updated**: March 12, 2026
**Version**: 1.0
