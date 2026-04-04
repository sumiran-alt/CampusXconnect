# Role-Based Authentication System - CampusXConnect

## Overview

CampusXConnect now has a complete role-based authentication system with two user roles:

- **User**: Regular students who use the application for networking, coding problems, and posts
- **Admin**: System administrators who can control and manage all application data

## Architecture

### Backend Changes

#### 1. User Model Update (`backend/models/User.js`)

Added a `role` field to the User schema:

```javascript
role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
}
```

#### 2. Authentication Controller (`backend/controllers/authController.js`)

New endpoints added:

- `POST /api/auth/admin/signup` - Create a new admin (requires admin key)
- `POST /api/auth/admin/login` - Admin login endpoint

Both endpoints return the user's role in the response.

#### 3. Admin Middleware (`backend/middleware/adminAuth.js`)

- Verifies JWT token
- Checks if user role is "admin"
- Protects all admin routes

#### 4. Admin Controller (`backend/controllers/adminController.js`)

Comprehensive admin management features:

**User Management:**

- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user by ID
- `DELETE /api/admin/users/:id` - Delete user
- `PUT /api/admin/users/:id/role` - Change user role
- `PUT /api/admin/users/:id/status` - Block/Unblock user

**Post Management:**

- `GET /api/admin/posts` - Get all posts
- `DELETE /api/admin/posts/:id` - Delete post
- `PUT /api/admin/posts/:id/flag` - Flag/Unflag post

**Coding Problem Management:**

- `GET /api/admin/problems` - Get all problems
- `POST /api/admin/problems` - Create problem
- `PUT /api/admin/problems/:id` - Update problem
- `DELETE /api/admin/problems/:id` - Delete problem

**Other Management:**

- `GET /api/admin/submissions` - Get all submissions
- `GET /api/admin/comments` - Get all comments
- `DELETE /api/admin/comments/:id` - Delete comment
- `GET /api/admin/stats` - Get dashboard statistics

#### 5. Admin Routes (`backend/routes/admin.js`)

All routes are protected by admin middleware and organized by resource type.

#### 6. Environment Variable

Added to `.env`:

```
ADMIN_KEY=admin_secret_key_2024
```

This key is required when creating a new admin account.

### Frontend Changes

#### 1. Updated Store (`frontend/lib/store.js`)

- Added `role` state
- Role is automatically extracted from user data
- Persisted in localStorage

#### 2. API Client (`frontend/lib/api.js`)

New API endpoints:

```javascript
authAPI.adminSignup(userData);
authAPI.adminLogin(credentials);
adminAPI.getStats();
adminAPI.getUsers();
adminAPI.deleteUser(id);
adminAPI.updateUserRole(id, role);
// ... and many more
```

#### 3. Updated Navigation (`frontend/components/Navigation.jsx`)

- Shows different navigation based on user role
- Admin sees "Dashboard" link
- Users see "Feed", "Coding", "Leaderboard", "Profile"
- Non-authenticated users see "Login" and "Sign Up"

#### 4. Admin Login Page (`frontend/app/admin/login/page.jsx`)

- Separate login page for admins
- Different styling (gray theme)
- Link back to user login

#### 5. Admin Dashboard (`frontend/app/admin/dashboard/page.jsx`)

Complete admin interface with:

- **Overview Tab**: Statistics cards showing:
  - Total Users
  - Total Admins
  - Total Posts
  - Coding Problems
  - Submissions
  - Comments

- **Users Tab**:
  - Table of all users
  - View user roles
  - Delete users
- **Posts Tab**:
  - List of all posts
  - Delete posts
  - View post author

- **Problems Tab**:
  - Table of coding problems
  - Difficulty levels
  - Delete problems

#### 6. Updated User Login (`frontend/app/login/page.jsx`)

- Added "Are you an admin?" section
- Link to admin login page

## Usage Guide

### Creating an Admin Account

1. Make a POST request to `/api/auth/admin/signup`:

```bash
curl -X POST http://localhost:5000/api/auth/admin/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "secure_password",
    "adminKey": "admin_secret_key_2024"
  }'
```

Or use the frontend:

1. Go to `/admin/login`
2. Click the "Admin Login" link from user login page
3. The first admin would need to be created via API or direct database insertion

### Admin Login

1. Visit `/admin/login`
2. Enter admin email and password
3. Access admin dashboard at `/admin/dashboard`

### User Login & Signup

1. Visit `/login` for user login
2. Visit `/signup` for user registration
3. Users will be automatically assigned the "user" role

## Security Considerations

1. **Admin Key**: Keep `ADMIN_KEY` in environment variables and change it in production
2. **JWT Token**: Implement token refresh mechanism for production
3. **Role Validation**: Admin middleware checks role on every protected request
4. **Database**: Consider adding indexing to role field for better query performance
5. **Logging**: Add audit logs for all admin actions in production

## API Response Format

### User/Admin Login Response:

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user" | "admin"
  }
}
```

### Admin Stats Response:

```json
{
  "success": true,
  "stats": {
    "totalUsers": 10,
    "totalAdmins": 2,
    "totalPosts": 45,
    "totalProblems": 20,
    "totalSubmissions": 150,
    "totalComments": 200
  }
}
```

## Future Enhancements

1. **Advanced Admin Features**:
   - User activity logs and analytics
   - Content moderation dashboard
   - Performance metrics and charts
   - Bulk operations (export, import)

2. **Role Extensions**:
   - Moderator role with limited admin rights
   - Department admin role
   - Mentor role with special access

3. **Security**:
   - Two-factor authentication for admins
   - Admin action logging and audit trails
   - IP whitelisting
   - Permission-based access control (PBAC)

4. **UI/UX**:
   - Admin theme customization
   - Advanced filtering and search
   - Data export (CSV, PDF)
   - Real-time notifications

## Testing

### Test Admin Creation:

```javascript
// Using the API client from frontend
import { authAPI } from "@/lib/api";

const response = await authAPI.adminSignup({
  name: "Test Admin",
  email: "admin@test.com",
  password: "testpass123",
  adminKey: "admin_secret_key_2024",
});
```

### Test Admin Operations:

```javascript
import { adminAPI } from "@/lib/api";

// Get statistics
const stats = await adminAPI.getStats();

// Get all users
const users = await adminAPI.getUsers();

// Delete a user
await adminAPI.deleteUser(userId);
```

## Troubleshooting

**Issue**: Admin login fails with "Invalid credentials or not an admin"

- **Solution**: Ensure the user account has role set to "admin" in the database

**Issue**: Admin API returns 403 "Access denied"

- **Solution**: Check that the JWT token is valid and user is an admin

**Issue**: Can't create admin account

- **Solution**: Verify the `adminKey` matches the one in `.env`

## Files Modified/Created

### Backend:

- `models/User.js` - Updated with role field
- `controllers/authController.js` - Added admin signup/login
- `controllers/adminController.js` - Created (new file)
- `middleware/adminAuth.js` - Created (new file)
- `routes/admin.js` - Created (new file)
- `routes/auth.js` - Updated with admin routes
- `server.js` - Added admin routes
- `.env` - Added ADMIN_KEY

### Frontend:

- `lib/store.js` - Updated with role management
- `lib/api.js` - Added admin API endpoints
- `components/Navigation.jsx` - Updated with role-based navigation
- `app/login/page.jsx` - Added admin login link
- `app/admin/login/page.jsx` - Created (new file)
- `app/admin/dashboard/page.jsx` - Created (new file)
- `styles/globals.css` - Already created

---

**Last Updated**: March 12, 2026
**Version**: 1.0
