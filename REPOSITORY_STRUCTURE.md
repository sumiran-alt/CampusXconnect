# CampusXConnect - Repository Structure Guide

## Complete File Tree

```
campusxconnect/
│
├── 📄 README.md                      (Main documentation)
├── 📄 SETUP.md                       (Setup instructions)
├── 📄 QUICK_REFERENCE.md             (Quick commands)
├── 📄 ENV_SETUP.md                   (Environment variables)
├── 📄 API_TESTING.md                 (API documentation)
├── 📄 FEATURES.md                    (Feature details)
├── 📄 PROJECT_COMPLETE.md            (Completion summary)
├── .gitignore                        (Git ignore rules)
│
│
├─ 🔷 BACKEND
│  │
│  └─ backend/
│     │
│     ├── 📄 server.js                        # Express server entry point
│     ├── 📄 package.json                     # Dependencies configuration
│     ├── 📄 .env.example                     # Environment variables template
│     │
│     ├── 📁 config/
│     │  └── 📄 db.js                         # MongoDB connection setup
│     │
│     ├── 📁 models/                          # Database schemas
│     │  ├── 📄 User.js                       # User schema with validation
│     │  ├── 📄 Post.js                       # Post schema
│     │  ├── 📄 Comment.js                    # Comment schema
│     │  ├── 📄 CodingProblem.js              # Coding problem schema
│     │  └── 📄 Submission.js                 # Submission schema
│     │
│     ├── 📁 controllers/                     # Business logic
│     │  ├── 📄 authController.js             # Auth: signup, login
│     │  ├── 📄 userController.js             # Users: profile, follow
│     │  ├── 📄 postController.js             # Posts: CRUD, like, comment
│     │  └── 📄 codingController.js           # Coding: problems, submissions
│     │
│     ├── 📁 routes/                          # API routes
│     │  ├── 📄 auth.js                       # /api/auth routes
│     │  ├── 📄 users.js                      # /api/users routes
│     │  ├── 📄 posts.js                      # /api/posts routes
│     │  └── 📄 coding.js                     # /api/coding routes
│     │
│     ├── 📁 middleware/
│     │  └── 📄 auth.js                       # JWT verification middleware
│     │
│     └── 📁 scripts/
│        └── 📄 seed.js                       # Database seeding script
│
│
├─ 🔵 FRONTEND
│  │
│  └─ frontend/
│     │
│     ├── 📄 package.json                     # Dependencies
│     ├── 📄 next.config.js                   # Next.js config
│     ├── 📄 tailwind.config.js               # Tailwind CSS config
│     ├── 📄 postcss.config.js                # PostCSS config
│     ├── 📄 .env.example                     # Environment template
│     │
│     ├── 📁 app/                             # Next.js App Router
│     │  │
│     │  ├── 📄 layout.tsx                    # Root layout wrapper
│     │  ├── 📄 RootLayout.jsx                # Layout component
│     │  ├── 📄 page.jsx                      # Home page (/)
│     │  │
│     │  ├── 📁 login/
│     │  │  └── 📄 page.jsx                   # Login page
│     │  │
│     │  ├── 📁 signup/
│     │  │  └── 📄 page.jsx                   # Signup page
│     │  │
│     │  ├── 📁 profile/
│     │  │  └── 📄 page.jsx                   # User profile with edit
│     │  │
│     │  ├── 📁 feed/
│     │  │  └── 📄 page.jsx                   # Project feed (paginated)
│     │  │
│     │  ├── 📁 create-post/
│     │  │  └── 📄 page.jsx                   # Create new project post
│     │  │
│     │  ├── 📁 coding/
│     │  │  ├── 📄 page.jsx                   # Coding problems list
│     │  │  └── 📁 [id]/
│     │  │     └── 📄 page.jsx                # Problem detail with editor
│     │  │
│     │  └── 📁 leaderboard/
│     │     └── 📄 page.jsx                   # Student leaderboard
│     │
│     ├── 📁 components/
│     │  └── 📄 Navigation.jsx                # Main navigation bar
│     │
│     ├── 📁 lib/
│     │  ├── 📄 api.js                        # Axios API client
│     │  └── 📄 store.js                      # Zustand auth store
│     │
│     └── 📁 styles/
│        └── 📄 globals.css                   # Global Tailwind styles
│
│
└─ 📊 ROOT FILES
   ├── 📄 README.md                           ← START HERE
   ├── 📄 SETUP.md                            ← Setup instructions
   ├── 📄 PROJECT_COMPLETE.md                 ← Project summary
   ├── 📄 QUICK_REFERENCE.md                  ← Quick commands
   ├── 📄 API_TESTING.md                      ← API reference
   ├── 📄 FEATURES.md                         ← Feature details
   ├── 📄 ENV_SETUP.md                        ← Environment guide
   └── .gitignore                             ← Git configuration
```

---

## 📊 File Count Summary

```
Backend:
  ├── Server & Config:        2 files
  ├── Models:                 5 files
  ├── Controllers:            4 files
  ├── Routes:                 4 files
  ├── Middleware:             1 file
  ├── Scripts:                1 file
  └── Total:                 17 files

Frontend:
  ├── Pages:                  9 files (9 page components)
  ├── Components:             1 file
  ├── Config:                 4 files (config files)
  ├── Library:                2 files (api, store)
  ├── Styles:                 1 file
  └── Total:                 17 files

Documentation:
  └── Total:                  7 files

GRAND TOTAL:               41 files + 1 .gitignore
```

---

## 🔍 Key Files at a Glance

### Must-Read Documentation

- **README.md** - Everything about the project
- **SETUP.md** - How to set up locally
- **API_TESTING.md** - How to test APIs
- **QUICK_REFERENCE.md** - Common commands

### Backend Entry Points

- **server.js** - Start the backend
- **models/** - Database schemas
- **controllers/** - Business logic
- **routes/** - API endpoints

### Frontend Entry Points

- **app/page.jsx** - Home page
- **app/layout.tsx** - Root layout
- **lib/api.js** - API client
- **lib/store.js** - Auth state

---

## 🚀 Quick Navigation

### Backend Development

```
backend/
  ├── server.js          ← Start here
  ├── models/            ← Database schemas
  ├── controllers/       ← Add logic
  ├── routes/            ← Add endpoints
  └── middleware/        ← Auth logic
```

### Frontend Development

```
frontend/
  ├── app/               ← Pages
  ├── components/        ← Reusable components
  ├── lib/               ← API & state
  └── styles/            ← Global CSS
```

### Documentation

```
Root/
  ├── README.md          ← Full docs
  ├── SETUP.md           ← Setup guide
  ├── API_TESTING.md     ← API docs
  └── FEATURES.md        ← Feature guide
```

---

## 📝 File Descriptions

### Backend Files

| File                            | Purpose           | Lines       |
| ------------------------------- | ----------------- | ----------- |
| server.js                       | Express app setup | ~40         |
| models/User.js                  | User schema       | ~80         |
| models/Post.js                  | Post schema       | ~50         |
| models/Comment.js               | Comment schema    | ~35         |
| models/CodingProblem.js         | Problem schema    | ~50         |
| models/Submission.js            | Submission schema | ~45         |
| controllers/authController.js   | Auth logic        | ~100        |
| controllers/userController.js   | User logic        | ~150        |
| controllers/postController.js   | Post logic        | ~250        |
| controllers/codingController.js | Coding logic      | ~150        |
| routes/\*.js                    | Route definitions | ~20-30 each |
| middleware/auth.js              | JWT middleware    | ~25         |
| config/db.js                    | DB connection     | ~20         |
| scripts/seed.js                 | Sample data       | ~100        |

### Frontend Files

| File                      | Purpose        | Lines |
| ------------------------- | -------------- | ----- |
| app/page.jsx              | Home page      | ~80   |
| app/login/page.jsx        | Login page     | ~100  |
| app/signup/page.jsx       | Signup page    | ~120  |
| app/profile/page.jsx      | Profile page   | ~250  |
| app/feed/page.jsx         | Feed page      | ~150  |
| app/create-post/page.jsx  | Create post    | ~130  |
| app/coding/page.jsx       | Coding list    | ~120  |
| app/coding/[id]/page.jsx  | Problem detail | ~200  |
| app/leaderboard/page.jsx  | Leaderboard    | ~100  |
| components/Navigation.jsx | Nav bar        | ~70   |
| lib/api.js                | API client     | ~60   |
| lib/store.js              | Auth store     | ~40   |

---

## 🔗 How Files Connect

### Authentication Flow

```
frontend/app/signup/page.jsx
    ↓
frontend/lib/api.js (authAPI.signup)
    ↓
backend/routes/auth.js
    ↓
backend/controllers/authController.js
    ↓
backend/models/User.js
    ↓
MongoDB
```

### Post Creation Flow

```
frontend/app/create-post/page.jsx
    ↓
frontend/lib/api.js (postAPI.createPost)
    ↓
backend/routes/posts.js
    ↓
backend/controllers/postController.js
    ↓
backend/models/Post.js + User.js
    ↓
MongoDB
```

### Feed Display Flow

```
frontend/app/feed/page.jsx
    ↓
frontend/lib/api.js (postAPI.getFeed)
    ↓
backend/routes/posts.js
    ↓
backend/controllers/postController.js
    ↓
backend/models/Post.js + User.js + Comment.js
    ↓
MongoDB
```

---

## ⚙️ Configuration Files

### Environment Files

- `backend/.env` - Backend configuration
- `frontend/.env.local` - Frontend configuration
- `.env.example` files - Templates

### Build Configuration

- `backend/package.json` - Backend dependencies
- `frontend/package.json` - Frontend dependencies
- `frontend/next.config.js` - Next.js settings
- `frontend/tailwind.config.js` - Tailwind settings
- `frontend/postcss.config.js` - PostCSS settings

### Version Control

- `.gitignore` - Files to ignore

---

## 📈 Project Statistics

```
Total Lines of Code:        ~3000+
Backend Files:              17
Frontend Files:             17
Documentation Files:        7
Database Models:            5
API Endpoints:              21
Page Components:            9
Total Features:             10
```

---

## 🎯 Development Workflow

1. **Make Backend Changes**
   - Edit files in `backend/`
   - Server auto-reloads with nodemon

2. **Make Frontend Changes**
   - Edit files in `frontend/app/`
   - Browser auto-reloads with Next.js

3. **Test APIs**
   - Use API_TESTING.md as reference
   - Test with Postman or curl

4. **Commit Changes**
   - Files in .gitignore won't commit
   - Add new features to models/controllers

---

## 🚀 Getting Started Path

1. Read: **README.md**
2. Setup: **SETUP.md**
3. Understand: **FEATURES.md**
4. Test APIs: **API_TESTING.md**
5. Quick Reference: **QUICK_REFERENCE.md**
6. Deploy: See deployment sections

---

## 📂 Adding New Features

### Add New API Endpoint

1. Create controller method in `backend/controllers/`
2. Create route in `backend/routes/`
3. Add API function in `frontend/lib/api.js`
4. Create page in `frontend/app/`

### Add New Model

1. Create schema in `backend/models/`
2. Import in controllers
3. Update routes
4. Create related endpoints

### Add New Page

1. Create folder in `frontend/app/`
2. Create `page.jsx` file
3. Import API functions
4. Add navigation link

---

For detailed information, start with **README.md** or **SETUP.md**

Happy developing! 🚀
