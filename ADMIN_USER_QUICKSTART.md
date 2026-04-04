# Admin & User Authentication - Quick Start Guide

## System Overview

CampusXConnect now has a **role-based authentication system** with two types of users:

### 👤 User (Student)

- Uses the main application
- Can post, follow, solve coding problems
- Access: Login via `/login`

### 👨‍💼 Admin

- Controls all application data
- Can manage users, posts, problems, comments
- Access: Login via `/admin/login`

---

## Getting Started

### Step 1: Backend Setup

Your backend already has MongoDB Atlas configured. The admin system is ready to use with:

**Environment Variable (already added to `.env`):**

```
ADMIN_KEY=admin_secret_key_2024
```

### Step 2: Create First Admin Account

You have two options:

#### Option A: Using API (Recommended)

```bash
curl -X POST http://localhost:5000/api/auth/admin/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@example.com",
    "password": "adminpass123",
    "adminKey": "admin_secret_key_2024"
  }'
```

**Response:**

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "admin_id",
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### Option B: Direct Database Insert

If the API call fails, directly insert into MongoDB:

```javascript
db.users.insertOne({
  name: "Admin",
  email: "admin@example.com",
  password: "hashed_password_here", // Use bcrypt
  role: "admin",
  college: "Dronacharya Group of Institutions",
  branch: "CSE",
  year: 1,
  createdAt: new Date(),
});
```

### Step 3: Test Admin Login

**Backend Running:**

```bash
cd backend
npm run dev
```

**Frontend Running (New Terminal):**

```bash
cd frontend
npm run dev
```

**Login Flow:**

1. Visit `http://localhost:3000/login`
2. You'll see "Are you an admin?" section
3. Click "Admin Login"
4. Enter admin email and password
5. Redirected to `/admin/dashboard`

---

## Admin Dashboard Features

### 📊 Overview Tab

Displays statistics:

- Total Users
- Total Admins
- Total Posts
- Coding Problems
- Submissions
- Comments

### 👥 Users Tab

- View all users and their roles
- Change user role (user ↔️ admin)
- Delete users

### 📝 Posts Tab

- View all posts
- Delete inappropriate posts
- See post author info

### 🧠 Coding Problems Tab

- View all coding problems
- Create new problems
- Edit existing problems
- Delete problems

---

## User Login Flow

### Regular User Signup/Login

```
1. Visit http://localhost:3000/signup
2. Fill in: Name, Email, Password, College, Branch, Year
3. Submit → Account created as "user" role
4. Login via http://localhost:3000/login
5. Redirected to /feed
```

---

## API Endpoints Summary

### User Authentication

```
POST /api/auth/signup              - User registration
POST /api/auth/login               - User login
```

### Admin Authentication

```
POST /api/auth/admin/signup        - Admin registration (requires adminKey)
POST /api/auth/admin/login         - Admin login
```

### Admin Management Endpoints (All protected by admin middleware)

```
GET    /api/admin/stats            - Dashboard statistics
GET    /api/admin/users            - List all users
DELETE /api/admin/users/:id        - Delete user
PUT    /api/admin/users/:id/role   - Change user role
```

---

## Important Notes

⚠️ **Change Admin Key in Production:**
Before deploying to production, change the `ADMIN_KEY` in `.env`:

```
ADMIN_KEY=your_secret_admin_key_here
```

🔐 **Keep Tokens Secure:**
Tokens are stored in localStorage. Consider:

- Using secure cookies in production
- Implementing token refresh mechanism
- Setting up HTTPS

---

## Role Implementation Details

### In Database

```javascript
{
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  role: "user",  // or "admin"
  // ... other fields
}
```

### In Frontend State (Zustand)

```javascript
const { user, role, isAuthenticated } = useAuthStore();
// role = "user" or "admin"
```

### Navigation Based on Role

```
User (role = "user"):      /feed, /coding, /leaderboard, /profile
Admin (role = "admin"):    /admin/dashboard
Not logged in:             /login, /signup
```

---

## Testing Checklist

- [ ] Create admin account via API
- [ ] Admin can login at `/admin/login`
- [ ] Admin can view dashboard statistics
- [ ] Admin can view all users
- [ ] Admin can delete a user
- [ ] User can register via `/signup`
- [ ] User can login via `/login`
- [ ] User can see different navigation than admin
- [ ] Regular user cannot access `/admin/dashboard`

---

## Troubleshooting

| Problem                         | Solution                                              |
| ------------------------------- | ----------------------------------------------------- |
| Admin signup fails              | Verify `adminKey` matches `.env` value                |
| Can't login as admin            | Check email/password and ensure role is "admin" in DB |
| Admin dashboard shows 403 error | Ensure token is valid and user role is "admin"        |
| User sees admin navigation      | Refresh page or clear localStorage                    |
| MongoDB connection error        | Ensure MongoDB Atlas cluster is running               |

---

## File Structure

```
campusxconnect/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      (updated)
│   │   └── adminController.js     (new)
│   ├── middleware/
│   │   ├── auth.js
│   │   └── adminAuth.js           (new)
│   ├── routes/
│   │   ├── auth.js                (updated)
│   │   └── admin.js               (new)
│   ├── models/
│   │   └── User.js                (updated)
│   └── .env                       (updated)
└── frontend/
    ├── app/
    │   ├── login/
    │   │   └── page.jsx           (updated)
    │   ├── admin/
    │   │   ├── login/
    │   │   │   └── page.jsx       (new)
    │   │   └── dashboard/
    │   │       └── page.jsx       (new)
    │   ├── components/
    │   │   └── Navigation.jsx     (updated)
    ├── lib/
    │   ├── api.js                 (updated)
    │   └── store.js               (updated)
    └── styles/
        └── globals.css            (was missing, now created)
```

---

## Next Steps

1. **Test the system** using the checklist above
2. **Create test users** (both admin and regular users)
3. **Explore admin dashboard** to see all management features
4. **Update MongoDB credentials** if needed
5. **Deploy to production** with updated security keys

---

For detailed information, see `ADMIN_AUTHENTICATION.md`

**Questions?** Check the documentation or troubleshooting section above.

---

**Last Updated**: March 12, 2026
**Version**: 1.0
