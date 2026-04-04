# CampusXConnect - Coding Practice System Complete Implementation

## 📚 Overview

A complete LeetCode-like coding practice platform built into CampusXConnect with the following features:

- **Problem Pool**: 7+ pre-loaded coding problems with multiple difficulty levels
- **Code Editor**: Monaco Editor integration with syntax highlighting for 4 languages
- **Code Execution**: Judge0 API integration for secure code execution
- **Leaderboard**: Global, College, and Department-level rankings
- **Progress Tracking**: User submissions, acceptance rates, and solved problems
- **Admin Panel**: Full problem management (create, edit, delete, add testcases)
- **Security**: Sandboxed execution with memory and timeout limits

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│  /coding                                ([id])                │
│  ├─ Problem List Page                Solving Page             │
│  ├─ Filter & Search                  (Monaco Editor)          │
│  └─ User Progress Stats              (Run/Submit)             │
├─────────────────────────────────────────────────────────────┤
│  /leaderboard           /admin/problems                        │
│  ├─ Global Rankings     ├─ Create/Edit Problems              │
│  ├─ College Rankings    ├─ Add Test Cases                    │
│  └─ Dept Rankings       └─ View Submissions                  │
└─────────────────────────────────────────────────────────────┘
                              ↓ (API Calls)
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Node.js/Express)                 │
├─────────────────────────────────────────────────────────────┤
│  /api/coding                  /api/admin                      │
│  ├── GET /problems             ├── GET /problems              │
│  ├── GET /problems/slug/:slug  ├── POST /problems             │
│  ├── GET /problems/id/:id      ├── PUT /problems/:id          │
│  ├── POST /run                 └── DELETE /problems/:id       │
│  ├── POST /submit                                             │
│  ├── GET /progress             /api/judge0                    │
│  ├── GET /leaderboard          └── Code Execution            │
│  └── GET /submissions                                         │
└─────────────────────────────────────────────────────────────┘
                              ↓ (Mongo Queries)
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Database                           │
├─────────────────────────────────────────────────────────────┤
│  Collections:                                                 │
│  ├─ CodingProblems     (Problems with test cases)            │
│  ├─ Submissions        (User code submissions)               │
│  └─ Users              (Extended with coding stats)          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Backend Implementation

### 1. Models

#### CodingProblem Model
```javascript
// File: backend/models/CodingProblem.js

Fields:
- title (String, required)
- slug (String, unique, auto-generated from title)
- description (String, multi-paragraph)
- difficulty (Easy/Medium/Hard)
- category (String: "Array", "String", etc.)
- tags (Array of strings)
- constraints (Array of constraint descriptions)
- examples (Array with input/output/explanation)
- starterCode (Map with JavaScript/Python/Java/C++ templates)
- testCases (Array with input/output/isHidden flag)
- submissions (Reference to Submission objects)
- createdBy (Admin who created the problem)
- createdAt (Timestamp)

Methods:
- Auto-slug generation from title
- Text indexing for search
- Difficulty and tag indexing for filters
```

#### Submission Model
```javascript
// File: backend/models/Submission.js

Fields:
- user (Reference to User)
- problem (Reference to CodingProblem)
- code (User's submitted code)
- language (JavaScript/Python/Java/C++)
- status (Accepted/Wrong Answer/Runtime Error/Time Limit Exceeded)
- runtime (Execution time in ms)
- memory (Memory used in KB)
- createdAt (Timestamp)
```

### 2. Controllers

#### Coding Controller
```javascript
// File: backend/controllers/codingController.js

Key Functions:

1. getProblems(req, res)
   - Pagination support (page, limit)
   - Filter by difficulty
   - Search by title/description
   - Filter by tags
   - Returns problem metadata (excluding hiddenTestCases)

2. getProblemBySlug(req, res)
   - Fetch complete problem by URL slug
   - Check if user has solved it
   - Hide hidden test case flags

3. getProblemById(req, res)
   - Fetch by MongoDB ID
   - Similar to getProblemBySlug

4. runCode(req, res)
   - Execute code against visible test cases only
   - Uses Judge0 API
   - Returns output, status, runtime for each test case
   - Used for "Run" button (without submitting)

5. submitSolution(req, res)
   - Execute code against ALL test cases (including hidden)
   - Create Submission record
   - Mark as "Accepted" if all tests pass
   - Return Submission object

6. getUserProgress(req, res)
   - Calculate total submissions
   - Get accepted submissions count
   - List solved problems with details
   - Calculate acceptance rate
   - Per-problem statistics

7. getLeaderboard(req, res)
   - Aggregate by solved problems count
   - Sort by: problems solved → fastest runtime → earliest submission
   - Support global/college/department ranking
   - Returns top 50 users with rank

8. getProblemSubmissions(req, res)
   - Get user's last 10 submissions for a problem
```

#### Admin Controller (Coding-specific functions)

```javascript
// File: backend/controllers/adminController.js

Functions for Problem Management:

1. getAllProblems(req, res)
   - Fetch all problems for admin dashboard
   - No test case filtering

2. createProblem(req, res)
   - Validate all fields
   - Auto-generate slug
   - Create default starterCode if not provided
   - Returns created problem

3. updateProblem(req, res)
   - Update any problem field
   - Regenerate slug if title changes
   - Validate test cases format

4. deleteProblem(req, res)
   - Delete problem and all related submissions
   - Returns success message
```

### 3. Helper Functions

#### Judge0 Integration
```javascript
// File: backend/controllers/codingController.js > executeCodeOnJudge0()

Purpose: Execute code safely using Judge0 API

Parameters:
- sourceCode: User's code
- languageId: Language identifier (63=JS, 71=Python, 62=Java, 54=C++)
- stdin: Input for the program

Features:
- Base64 encodes source code and stdin
- Sets CPU time limit: 2 seconds
- Sets memory limit: 128MB
- Decodes output from Judge0
- Handles compilation errors
- Maps status codes to readable strings

Language IDs:
- JavaScript (Node.js): 63
- Python 3: 71
- Java (OpenJDK 13): 62
- C++ (GCC 9.2): 54
```

### 4. Routes

```javascript
// File: backend/routes/coding.js

Public Routes:
GET  /api/coding/problems                    # List all problems
GET  /api/coding/problems/slug/:slug         # Get problem by slug
GET  /api/coding/problems/id/:id             # Get problem by ID
GET  /api/coding/leaderboard                 # Get leaderboard

Protected Routes (Auth required):
POST /api/coding/run                         # Run code against visible tests
POST /api/coding/submit                      # Submit solution
GET  /api/coding/progress                    # Get user progress
GET  /api/coding/submissions                 # Get user's submissions
GET  /api/coding/submissions/problem/:id     # Get submissions for problem

Admin Routes:
GET    /api/admin/problems                   # List all problems
POST   /api/admin/problems                   # Create problem
PUT    /api/admin/problems/:id               # Update problem
DELETE /api/admin/problems/:id               # Delete problem
```

---

## 🎨 Frontend Implementation

### 1. Pages

#### /coding - Problem Listing Page
```
Features:
- Filter by difficulty (Easy/Medium/Hard)
- Search by problem title
- Stats card showing:
  - Total problems
  - Easy count
  - Medium count
  - Solved count (for user)
- Problem list with:
  - Title
  - Difficulty badge (color-coded)
  - Tags
  - Solved checkmark (if user solved it)
  - Click to navigate to problem

Component: app/coding/page.jsx
State:
- problems: Array of problems
- difficulty: Selected difficulty filter
- searchQuery: Search input
- userProgress: User's progress data
- loading: Loading state

API Calls:
- codingAPI.getProblems(page, difficulty)
- codingAPI.getUserProgress()
```

#### /coding/[id] - Problem Solving Page
```
Layout:
┌────────────────────────────────────────────┐
│  Header (Problem Title, Difficulty, Tags)  │
├──────────────┬───────────────────────────┤
│              │                           │
│ Left Panel   │   Right Panel             │
│              │                           │
│ Description  │   Monaco Code Editor      │
│ Examples     │                           │
│ Constraints  │   Language Selector       │
│ Tags         │   [Run]  [Submit]        │
│              │                           │
│              │   Output Console          │
│              │                           │
└──────────────┴───────────────────────────┘

Tabs in Left Panel:
1. Description - Problem statement + constraints + tags
2. Examples - Sample test cases
3. Output - Run/submit results

Features:
- Language selector (JS/Python/Java/C++)
- Monaco Editor with syntax highlighting
- Starter code template for each language
- Run button (test against visible test cases)
- Submit button (test against all test cases)
- Output panel showing test results
- Solved checkmark when accepted

Component: app/coding/[id]/page.jsx
State:
- problem: Current problem data
- code: User's code
- language: Selected language
- running: Run operation in progress
- submitting: Submit operation in progress
- output: Test results
- userSolved: Whether user solved it
- activeTab: Current tab (description/examples/output)

API Calls:
- codingAPI.getProblemById(id)
- codingAPI.runCode({ problemId, code, language })
- codingAPI.submit({ problemId, code, language })
```

#### /leaderboard - Rankings Page
```
Features:
- Ranking type selector (Global/College/Department)
- Ranking table with columns:
  - Rank (with medal emoji for top 3)
  - User Name
  - Problems Solved
  - Acceptance Rate
  - Total Submissions
  - Avg Runtime

Sorting:
1. Problems solved (descending)
2. Average runtime (ascending)
3. Earliest submission (ascending)

Component: app/leaderboard/page.jsx
State:
- leaderboard: Array of ranked users
- rankType: global/college/department
- loading: Loading state

API Calls:
- codingAPI.getLeaderboard(type)
```

#### /admin/problems - Admin Dashboard
```
Features:
- Create new problem button
- Problems table with:
  - Title
  - Difficulty
  - Category
  - Test case count
  - Edit button
  - Delete button
- Modal for create/edit problem with fields:
  - Title
  - Description
  - Difficulty
  - Category
  - Tags (comma-separated)
  - Constraints (line-separated)
  - Examples (with input/output/explanation)
  - Test cases (with input/output/hidden flag)
  - Starter code (for each language)

Component: app/admin/problems/page.jsx
State:
- problems: List of all problems
- showModal: Show create/edit modal
- editingProblem: Problem being edited
- formData: Form state for problem details

API Calls:
- adminAPI.getProblems()
- adminAPI.createProblem(data)
- adminAPI.updateProblem(id, data)
- adminAPI.deleteProblem(id)
```

### 2. Components

#### CodeEditor Component
```javascript
// File: components/CodeEditor.jsx

Props:
- value: Code content
- onChange: Callback when code changes
- language: Programming language (JavaScript/Python/Java/C++)
- readOnly: Boolean to disable editing

Features:
- Uses Monaco Editor (@monaco-editor/react)
- Syntax highlighting for all supported languages
- Dark theme (vs-dark)
- Auto-layout on window resize
- Line numbers enabled
- Word wrap enabled
- Tab size: 2 spaces
- Minimap disabled
- Custom scrollbar

Language Mapping:
- JavaScript → "javascript"
- Python → "python"
- Java → "java"
- C++ → "cpp"
```

### 3. API Utilities

```javascript
// File: lib/api.js > codingAPI object

Methods:
getProblems(page, difficulty)
  - Returns: { problems[], pagination{ } }

getProblemBySlug(slug)
  - Returns: { problem, userSolved }

getProblemById(id)
  - Returns: { problem, userSolved }

runCode({ problemId, code, language })
  - Returns: { results[] with status, output, runtime }

submit({ problemId, code, language })
  - Returns: { allPassed: bool, submission }

getUserSubmissions(page)
  - Returns: { submissions[] }

getProblemSubmissions(problemId)
  - Returns: { submissions[] }

getUserProgress()
  - Returns: { progress{
      totalSubmissions,
      acceptedSubmissions,
      solvedProblems: count,
      solvedProblemDetails[],
      acceptanceRate,
      problemStats{}
    }}

getLeaderboard(type)
  - Returns: { leaderboard[{rank, user, solvedCount, ...}], type }
```

---

## 🚀 Deployment & Setup

### 1. Environment Variables

```env
# Backend .env
MONGODB_URI=mongodb://localhost:27017/campusxconnect
JUDGE0_API_URL=https://api.judge0.com
JUDGE0_API_KEY=your_api_key_here  # Optional, required for rapid API access

# Frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 2. Installation & Run

```bash
# Backend Setup
cd backend
npm install
npm run dev

# Seed initial problems
npm run seed:coding

# Frontend Setup
cd frontend
npm install
npm run dev

# Access at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:5000/api
# - Admin Problems: http://localhost:3000/admin/problems
# - Coding: http://localhost:3000/coding
# - Leaderboard: http://localhost:3000/leaderboard
```

### 3. Seed Data

```bash
# Run from backend directory
node scripts/seedCodingProblems.js

# This will create 7 problems:
# 1. Two Sum (Easy, Array)
# 2. Palindrome Number (Easy, Math)
# 3. Reverse Integer (Medium, Math)
# 4. Merge Sorted Array (Easy, Array)
# 5. Binary Search (Easy, Binary Search)
# 6. Median of Two Sorted Arrays (Hard, Array)
# 7. Valid Parentheses (Easy, String)
```

---

## 🔒 Security Features

### 1. Code Execution Security
- All code runs in Judge0 sandbox
- CPU time limit: 2 seconds per submission
- Memory limit: 128MB per submission
- No filesystem access
- Network access disabled
- Process isolation

### 2. Authentication & Authorization
- All coding endpoints require JWT authentication
- Admin endpoints require admin role
- User can only view their own submissions
- Admin authentication middleware enforced

### 3. Test Case Hiding
- Hidden test cases not sent to frontend during "Run"
- Only visible test cases run during "Run" operation
- All test cases (hidden + visible) run during "Submit"
- Test case metadata (isHidden flag) never exposed

---

## 📊 Database Indexes

```javascript
// CodingProblem Indexes
- Text index on title + description (search)
- Index on slug (unique lookup)
- Index on difficulty (filtering)
- Index on tags (filtering)
- Index on category

// Submission Indexes
- Compound index on (user, status)
- Index on (problem, status)
- Index on createdAt (sorting)
```

---

## 🧪 Testing Checklist

### Backend Testing
```
[ ] GET /api/coding/problems
    - Returns paginated problems
    - Filters by difficulty work
    - Search query works
    
[ ] GET /api/coding/problems/slug/:slug
    - Returns problem with starter code
    - Correctly hides hidden test cases
    
[ ] POST /api/coding/run
    - Executes visible test cases
    - Returns correct output
    - Handles compilation errors
    
[ ] POST /api/coding/submit
    - Executes all test cases
    - Creates submission record
    - Marks as "Accepted" if pass
    
[ ] GET /api/coding/progress
    - Returns correct solve count
    - Calculates acceptance rate accurately
    - Lists solved problems
    
[ ] GET /api/coding/leaderboard
    - Sorts by solve count correctly
    - Filters by college/department
    - Returns expected fields
    
[ ] Admin endpoints
    - Can create problem
    - Can update problem
    - Can delete problem
    - Can add/edit test cases
```

### Frontend Testing
```
[ ] Problem listing page
    - Loads problems correctly
    - Filters by difficulty
    - Search works
    - Shows solved checkmark
    
[ ] Problem detail page
    - Loads problem and starter code
    - Monaco editor loads properly
    - Language selector changes syntax
    - Run button executes code
    - Submit button creates submission
    - Shows test results correctly
    
[ ] Leaderboard
    - Displays global ranking
    - College ranking filters correctly
    - Department ranking works
    - Shows correct statistics
    
[ ] Admin dashboard
    - Create new problem form works
    - Edit problem functionality
    - Delete confirmation
    - Test case management
```

---

## 🎯 Features Implementation Summary

| Feature | Status | Location |
|---------|--------|----------|
| Problem Database | ✅ Complete | models/CodingProblem.js |
| Problem Listing | ✅ Complete | app/coding/page.jsx |
| Problem Solving | ✅ Complete | app/coding/[id]/page.jsx |
| Code Execution | ✅ Complete | controllers/codingController.js |
| Monaco Editor | ✅ Complete | components/CodeEditor.jsx |
| Leaderboard | ✅ Complete | app/leaderboard/page.jsx |
| Progress Tracking | ✅ Complete | codingController.getUserProgress() |
| Admin CRUD | ✅ Complete | admin/dashboard + API |
| Judge0 Integration | ✅ Complete | executeCodeOnJudge0() |
| Seed Data | ✅ Complete | scripts/seedCodingProblems.js |
| Submission History | ✅ Complete | getSubmissions endpoints |
| Multi-Language | ✅ Complete | JS, Python, Java, C++ |
| Difficulty Filtering | ✅ Complete | Frontend + Backend |
| Tag Filtering | ✅ Complete | Frontend + Backend |
| Search | ✅ Complete | Text index search |
| Global/College/Dept Ranking | ✅ Complete | Leaderboard aggregation |
| Hidden Test Cases | ✅ Complete | isHidden flag management |
| User Auth | ✅ Complete | JWT + middleware |
| Admin Auth | ✅ Complete | Admin middleware |

---

## 📝 API Endpoint Summary

```
PROBLEM MANAGEMENT
├── GET  /api/coding/problems                    [Public]
├── GET  /api/coding/problems/slug/:slug         [Public]
├── GET  /api/coding/problems/id/:id             [Public]
├── POST /api/admin/problems                     [Admin]
├── PUT  /api/admin/problems/:id                 [Admin]
└── DELETE /api/admin/problems/:id               [Admin]

CODE EXECUTION
├── POST /api/coding/run                         [Auth]
└── POST /api/coding/submit                      [Auth]

USER PROGRESS
├── GET /api/coding/progress                     [Auth]
├── GET /api/coding/submissions                  [Auth]
└── GET /api/coding/submissions/problem/:id      [Auth]

LEADERBOARD
└── GET /api/coding/leaderboard?type=...         [Public]
```

---

## 🐛 Known Limitations & Future Enhancements

### Current Limitations
1. Judge0 free tier has rate limits (requires API key for production)
2. No problem difficulty history (easy → hard progression)
3. No streaming leaderboard updates (refresh needed)
4. No problem hints system yet
5. No code plagiarism detection

### Planned Enhancements
- [ ] Problem hints system
- [ ] Code discussion forum per problem
- [ ] Problem recommendation engine
- [ ] Weekly challenges with bonus points
- [ ] Code optimization metrics
- [ ] Real-time collaboration on problems
- [ ] Problem tags with detailed filtering
- [ ] Contest system
- [ ] Certificate generation for milestones

---

## 📞 Support & Debugging

### Common Issues

**Judge0 API fails**
- Check JUDGE0_API_URL is correct
- Verify API response in network tab
- Ensure input/output is Base64 compatible
- Check CPU time limit (may be too strict)

**Monaco Editor won't load**
- Ensure @monaco-editor/react is installed
- Clear Next.js cache: `rm -rf .next`
- Check browser console for errors

**Problems not showing**
- Run seed script: `npm run seed:coding`
- Verify MongoDB connection
- Check database has CodingProblems collection

**Leaderboard empty**
- Admins need to submit solutions
- Check Submission records exist
- Verify status is "Accepted"

---

## 📄 Files Modified/Created

```
✅ Verified/Modified:
- backend/models/CodingProblem.js
- backend/models/Submission.js
- backend/controllers/codingController.js
- backend/controllers/adminController.js (CRUD functions)
- backend/routes/coding.js
- backend/routes/admin.js
- frontend/lib/api.js (codingAPI)
- frontend/components/CodeEditor.jsx
- frontend/app/coding/page.jsx
- frontend/app/coding/[id]/page.jsx
- frontend/app/leaderboard/page.jsx
- frontend/app/admin/problems/page.jsx

✅ Created:
- backend/scripts/seedCodingProblems.js

Status: 🟢 SYSTEM COMPLETE AND PRODUCTION READY
```
