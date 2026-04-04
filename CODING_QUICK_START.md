# Coding Practice System - Quick Start Guide

## ⚡ Get Started in 5 Minutes

### Step 1: Start the Servers

```bash
# Terminal 1 - Backend
cd backend
npm install  # If not already done
npm run dev
# Runs on http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm install  # If not already done
npm run dev
# Runs on http://localhost:3000
```

### Step 2: Seed Sample Problems

```bash
# Terminal 3 - From backend directory
npm run seed:coding

# Output should show:
# ✅ Successfully seeded 7 coding problems
#   - Easy | Two Sum (two-sum)
#   - Easy | Palindrome Number (palindrome-number)
#   - Medium | Reverse Integer (reverse-integer)
#   - Easy | Merge Sorted Array (merge-sorted-array)
#   - Easy | Binary Search (binary-search)
#   - Hard | Median of Two Sorted Arrays (median-of-two-sorted-arrays)
#   - Easy | Valid Parentheses (valid-parentheses)
```

### Step 3: Access the Platform

1. **View Problems**: http://localhost:3000/coding
   - See all 7 problems
   - Filter by difficulty
   - Search by title

2. **Solve a Problem**: Click any problem
   - Select language (JavaScript/Python/Java/C++)
   - Write code in Monaco Editor
   - Click "Run" to test against sample test cases
   - Click "Submit" to test against hidden test cases

3. **Check Leaderboard**: http://localhost:3000/leaderboard
   - See global rankings
   - Switch to college/department rankings

4. **Admin Dashboard**: http://localhost:3000/admin/problems
   - Create new problems
   - Edit existing problems
   - Add test cases
   - View all submissions

---

## 🎯 User Journey

### For Students

```
1. Login to CampusXConnect
2. Navigate to /coding
3. Browse problems or search
4. Click a problem to solve
5. Write code in Monaco Editor
6. Click "Run" for instant feedback
7. Refactor code based on output
8. Click "Submit" when ready
9. View ranking in /leaderboard
10. Track progress in profile
```

### For Admins

```
1. Login as admin
2. Navigate to /admin/problems
3. Click "Create Problem"
4. Fill problem details:
   - Title, Description, Difficulty
   - Constraints, Examples, Tags
   - Test cases (with hidden flag)
   - Starter code templates
5. Click Save
6. Problem immediately available for students
```

---

## 📚 Problem Structure

Each problem has:

```javascript
{
  title: "Two Sum",
  description: "Find two numbers that add up to target...",
  difficulty: "Easy",  // Easy, Medium, Hard
  category: "Array",
  tags: ["Array", "Hash Table"],
  constraints: [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9"
  ],
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "nums[0] + nums[1] == 9..."
    }
  ],
  starterCode: {
    JavaScript: "function solution(nums, target) { ... }",
    Python: "def solution(nums, target): ...",
    Java: "class Solution { public int[] solution() ... }",
    "C++": "class Solution { vector<int> solution() ... }"
  },
  testCases: [
    { input: "...", output: "...", isHidden: false },  // Visible during Run
    { input: "...", output: "...", isHidden: true }    // Hidden until Submit
  ]
}
```

---

## 🔧 How Code Execution Works

### When User Clicks "RUN"

```
User Code
    ↓
Frontend sends to /api/coding/run
    ↓
Backend fetches problem
    ↓
Gets visible (non-hidden) test cases
    ↓
Calls Judge0 API for each test case
    ↓
Judge0 executes code in sandbox:
  - CPU limit: 2 seconds
  - Memory limit: 128MB
  - No filesystem access
  - Network blocked
    ↓
Backend aggregates results
    ↓
Sends back output, status, runtime
    ↓
Frontend displays in Output panel
```

### When User Clicks "SUBMIT"

```
User Code
    ↓
Frontend sends to /api/coding/submit
    ↓
Backend fetches problem
    ↓
Gets ALL test cases (including hidden)
    ↓
Calls Judge0 for each test case
    ↓
If ALL pass: Status = "Accepted" ✅
If ANY fails: Status = "Wrong Answer" ❌
    ↓
Creates Submission record in database
    ↓
Updates user's solved problems
    ↓
Returns result to frontend
    ↓
Shows "✓ Solved" badge
    ↓
User appears on leaderboard
```

---

## 🏆 Leaderboard Ranking Logic

Ranking is determined by:

```
Priority 1: Problems Solved (descending)
Priority 2: Average Runtime (ascending)
Priority 3: Earliest Submission (ascending)

Example Leaderboard:
Rank | User    | Solved | Avg Runtime | Submissions
-----|---------|--------|-------------|-------------
🥇 1 | Alice   |   7    |   45ms      |    10
🥈 2 | Bob     |   7    |   62ms      |    15
🥉 3 | Charlie |   6    |   38ms      |    8
  4  | David   |   5    |   55ms      |    12
  5  | Eve     |   5    |   71ms      |    20
```

---

## 💾 User Progress Tracking

Each user has progress data showing:

```javascript
{
  totalSubmissions: 15,
  acceptedSubmissions: 7,
  solvedProblems: 7,
  acceptanceRate: "46.67%",
  solvedProblemDetails: [
    { title: "Two Sum", difficulty: "Easy" },
    { title: "Binary Search", difficulty: "Easy" },
    ...
  ],
  problemStats: {
    "problemId1": {
      total: 3,           // Attempts
      accepted: 1,        // Successes
      bestRuntime: 42     // Fastest solution
    }
  }
}
```

---

## 🎨 Supported Languages & IDs

| Language   | ID | Syntax Highlighting | Judge0 Support |
|------------|----|--------------------|-----------------|
| JavaScript | 63 | ✅ Full support     | ✅ Node.js v14 |
| Python     | 71 | ✅ Full support     | ✅ Python 3.8  |
| Java       | 62 | ✅ Full support     | ✅ OpenJDK 13  |
| C++        | 54 | ✅ Full support     | ✅ GCC 9.2     |

---

## 🔐 Safety & Isolation

All code executions are:

- **Sandboxed**: No access to file system
- **Isolated**: Each execution is separate process
- **Time-limited**: 2 second CPU time max
- **Memory-limited**: 128MB max
- **Network-blocked**: No external connections
- **Read-only**: Can't modify judge system

---

## 📊 Sample Problems Included

### 1. Two Sum (Easy)
Find two numbers in array that sum to target.
- Demonstrates: Arrays, Hash Tables
- Visible Tests: 2
- Hidden Tests: 2

### 2. Palindrome Number (Easy)
Check if integer is palindrome.
- Demonstrates: Math, String conversion
- Visible Tests: 3
- Hidden Tests: 2

### 3. Reverse Integer (Medium)
Reverse digits of signed integer.
- Demonstrates: Integer overflow, Edge cases
- Visible Tests: 4
- Hidden Tests: 2

### 4. Merge Sorted Array (Easy)
Merge two sorted arrays in place.
- Demonstrates: Arrays, Two pointers
- Visible Tests: 2
- Hidden Tests: 1

### 5. Binary Search (Easy)
Find target in sorted array in O(log n).
- Demonstrates: Binary search
- Visible Tests: 4
- Hidden Tests: 2

### 6. Median of Two Sorted Arrays (Hard)
Find median of two sorted arrays.
- Demonstrates: Binary search, Edge cases
- Visible Tests: 2
- Hidden Tests: 1

### 7. Valid Parentheses (Easy)
Check if parentheses are balanced.
- Demonstrates: Stack data structure
- Visible Tests: 4
- Hidden Tests: 1

---

## 🛠️ Admin Operations

### Create a New Problem

```
1. Go to /admin/problems
2. Click "Create Problem"
3. Fill in:
   ✓ Title
   ✓ Description (use markdown)
   ✓ Difficulty (Easy/Medium/Hard)
   ✓ Category (Array, String, etc.)
   ✓ Tags (comma-separated)
   ✓ Constraints (line-separated)
   ✓ Examples (show sample input/output)
   ✓ Starter Code (for each language)
   ✓ Test Cases (input/output/hidden flag)
4. Click Save
5. Problem available for all users
```

### Edit a Problem

```
1. Go to /admin/problems
2. Click "Edit" on problem
3. Modify any fields
4. Click Save
5. Changes effective immediately
```

### Delete a Problem

```
1. Go to /admin/problems
2. Click "Delete" on problem
3. Confirm deletion
4. Problem removed (submissions kept for history)
```

---

## 🚨 Troubleshooting

### Problems not showing on /coding
**Solution**: Run seed script
```bash
npm run seed:coding
```

### "Failed to run code" error
**Possible causes**:
1. Judge0 API not responding
2. Network timeout
3. Invalid syntax in code

**Solution**: 
- Check backend logs
- Verify JUDGE0_API_URL is correct
- Try a simple problem first

### Leaderboard shows no users
**Cause**: No one has submitted solutions yet

**Solution**: Create a test submission:
1. Go to /coding
2. Solve "Two Sum"
3. Click Submit
4. Now appears in leaderboard

### Can't access admin panel
**Cause**: Not logged in as admin

**Solution**:
1. Logout
2. Login with admin credentials
3. Or create admin account in /auth/admin/signup

### Code editor not loading
**Cause**: Monaco Editor failed to load

**Solution**:
```bash
# Clear Next.js cache
rm -rf frontend/.next
npm run dev
```

---

## 📈 Next Steps

After seeding initial problems:

1. **Create more problems**: Use admin dashboard
2. **Teacher assignments**: Assign problem sets
3. **Contest mode**: Weekly coding challenges
4. **Difficulty progression**: Easy → Medium → Hard
5. **Bonus points**: Fastest solution rewards
6. **Hints system**: Add hints for stuck users
7. **Discussion forum**: Per-problem discussion
8. **Peer review**: Code review system

---

## 📞 API Testing

### Test Problem Listing
```bash
curl http://localhost:5000/api/coding/problems
```

### Test Get Problem by Slug
```bash
curl http://localhost:5000/api/coding/problems/slug/two-sum
```

### Test Leaderboard
```bash
curl http://localhost:5000/api/coding/leaderboard?type=global
```

### Test Run Code (requires auth)
```bash
curl -X POST http://localhost:5000/api/coding/run \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "problemId": "PROBLEM_ID",
    "code": "function solution(nums, target) { return [0,1]; }",
    "language": "JavaScript"
  }'
```

---

## 🎓 Learning Path (Suggested)

### Week 1: Fundamentals
- [ ] Two Sum
- [ ] Palindrome Number
- [ ] Valid Parentheses

### Week 2: Data Structures
- [ ] Merge Sorted Array
- [ ] Binary Search
- [ ] Reverse Integer

### Week 3: Advanced
- [ ] Median of Two Sorted Arrays
- [ ] Create custom problems

---

## ✅ Checklist: System Status

- [x] Database models created
- [x] APIs implemented
- [x] Frontend pages built
- [x] Monaco editor integrated
- [x] Judge0 integration done
- [x] Leaderboard functioning
- [x] Admin panel working
- [x] 7 sample problems seeded
- [x] Authentication secured
- [x] Authorization working
- [x] User progress tracking
- [x] Hidden test cases implemented

**STATUS**: 🟢 **PRODUCTION READY**

---

## 📞 Support

For issues or questions:
1. Check CODING_SYSTEM_GUIDE.md for detailed documentation
2. Review backend logs for API errors
3. Check browser console for frontend errors
4. Verify MongoDB connection
5. Test Judge0 connectivity

Happy coding! 🚀
