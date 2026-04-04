# CampusXConnect - Quick Reference Guide

## 🚀 Start Application in 3 Steps

### Terminal 1: Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

### Terminal 2: Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### Browser

Open `http://localhost:3000`

---

## 📋 API Quick Reference

### Auth Endpoints

```
POST /api/auth/signup
POST /api/auth/login
```

### User Endpoints

```
GET /api/users/profile
PUT /api/users/profile/update
GET /api/users/:id
POST /api/users/follow/:id
POST /api/users/unfollow/:id
```

### Post Endpoints

```
POST /api/posts/createPost
GET /api/posts/feed?page=1
GET /api/posts/:id
POST /api/posts/like/:id
POST /api/posts/unlike/:id
POST /api/posts/comment/:id
GET /api/posts/comments/:id
DELETE /api/posts/:id
PUT /api/posts/:id
```

### Coding Endpoints

```
GET /api/coding/problems?page=1&difficulty=Easy
GET /api/coding/problems/:id
POST /api/coding/submit
GET /api/coding/submissions/:userId
GET /api/coding/leaderboard
```

---

## 🔐 JWT Authentication

Token Format:

```
Authorization: Bearer <token>
```

Getting Token:

```javascript
const response = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "user@example.com", password: "password" }),
});
const { token } = await response.json();
localStorage.setItem("token", token);
```

Using Token:

```javascript
const headers = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};
```

---

## 🗂️ File Structure Quick Guide

```
campusxconnect/
├── backend/
│   ├── server.js              # Entry point
│   ├── models/                # Database schemas
│   ├── controllers/           # Business logic
│   ├── routes/                # API routes
│   ├── middleware/            # Auth middleware
│   ├── config/                # DB config
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── page.jsx           # Home page
    │   ├── login/
    │   ├── signup/
    │   ├── profile/
    │   ├── feed/
    │   ├── create-post/
    │   ├── coding/
    │   └── leaderboard/
    ├── components/
    │   └── Navigation.jsx
    ├── lib/
    │   ├── api.js             # API client
    │   └── store.js           # State management
    └── package.json
```

---

## 🔧 Common Commands

### Backend

```bash
npm run dev              # Start with auto-reload
npm start               # Start production
npm install             # Install dependencies
node scripts/seed.js    # Seed sample data
```

### Frontend

```bash
npm run dev             # Start development
npm run build           # Build for production
npm start               # Start production
npm run lint            # Check code style
```

---

## 🐛 Common Issues & Solutions

| Issue                     | Solution                                |
| ------------------------- | --------------------------------------- |
| Cannot connect to MongoDB | Check MONGODB_URI in .env               |
| Port 5000 already in use  | Change PORT in .env or kill process     |
| CORS errors               | Check FRONTEND_URL matches frontend URL |
| Token invalid             | Clear localStorage and login again      |
| Page blank                | Check browser console for errors        |

---

## 📱 Pages & Routes

| Page            | Route          | Authentication |
| --------------- | -------------- | -------------- |
| Home            | `/`            | Public         |
| Signup          | `/signup`      | Public         |
| Login           | `/login`       | Public         |
| Profile         | `/profile`     | Private        |
| Feed            | `/feed`        | Private        |
| Create Post     | `/create-post` | Private        |
| Coding Practice | `/coding`      | Private        |
| Problem Detail  | `/coding/:id`  | Private        |
| Leaderboard     | `/leaderboard` | Private        |

---

## 💾 Database Models

### User

- name, email, password (hashed)
- profilePicture, bio, skills
- github, linkedin
- followers, following
- branch, year, college

### Post

- title, description
- author (User ref)
- techStack [], githubLink
- likes [], comments []
- collaborators []

### Comment

- content
- author (User ref)
- post (Post ref)
- likes []

### CodingProblem

- title, description
- difficulty, category
- testCases []
- submissions []

### Submission

- user (User ref)
- problem (CodingProblem ref)
- code, language
- status, runtime, memory

---

## 🎨 Styling Guide

### Colors

- Primary: `#0A66C2` (LinkedIn Blue)
- Success: Green (`#22c55e`)
- Error: Red (`#ef4444`)
- Warning: Yellow (`#eab308`)

### Tailwind Classes Used

- `bg-primary` - Primary blue
- `text-primary` - Primary text color
- `hover:bg-blue-700` - Hover states
- `rounded-lg` - Border radius
- `shadow-md` - Shadows

---

## 📊 Data Flow

### Authentication Flow

```
User Input → Login/Signup → Backend Validation →
Hash Password → Save User → Generate JWT →
Return Token → Store in localStorage →
Add to API Headers
```

### Post Creation Flow

```
User Form → Create Post Component →
API Call → Backend Controller →
Mongoose Validation → Save to DB →
Return with populated author →
Update UI
```

### Coding Submission Flow

```
Code Editor → Submit Solution →
API Call with code/language →
Backend stores submission →
Validates against test cases →
Returns status →
Update leaderboard
```

---

## 🚀 Deployment Checklist

- [ ] Change JWT_SECRET
- [ ] Update MONGODB_URI
- [ ] Set NODE_ENV=production
- [ ] Configure CORS origin
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Add error tracking
- [ ] Test all APIs
- [ ] Test all pages
- [ ] Performance check
- [ ] Security audit
- [ ] Deploy to staging
- [ ] Final production deploy

---

## 📚 Useful Links

| Resource      | Link                              |
| ------------- | --------------------------------- |
| MongoDB Docs  | https://docs.mongodb.com          |
| Express Guide | https://expressjs.com             |
| Next.js Docs  | https://nextjs.org/docs           |
| JWT Info      | https://jwt.io                    |
| Tailwind CSS  | https://tailwindcss.com           |
| Zustand       | https://github.com/pmndrs/zustand |

---

For detailed setup, see:

- [README.md](./README.md) - Full documentation
- [SETUP.md](./SETUP.md) - Step-by-step setup
- [ENV_SETUP.md](./ENV_SETUP.md) - Environment variables guide
