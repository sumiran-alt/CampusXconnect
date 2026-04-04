/**
 * Error Fix Guide - Backend API Issues
 * 
 * This document identifies and fixes all 400 Bad Request errors
 */

## 7 ERRORS IDENTIFIED & SOLUTIONS

### Error 1 & 2: "Failed to fetch leaderboard" + "Failed to fetch stats"
**Location:** Leaderboard API endpoint
**Root Cause:** Backend not running (MongoDB not connected)
**Fix:** See steps below


### Errors 3-6: "Request failed with status code 400" 
**Endpoints Affected:**
- handleSendRequest (messaging)
- loadEducations
- loadExperiences
- loadCertifications

**Root Cause:** These endpoints require authentication and proper request body
**Fix:** Ensure auth token is sent + validate request body


### Error 7: "Class constructor cannot be invoked without 'new'"
**Location:** Chat/Messaging component
**Root Cause:** Dynamic import of class component incorrectly
**Fix:** Update component import


## STEP-BY-STEP FIXES

### STEP 1: Start MongoDB (CRITICAL)

```
1. Go to: https://www.mongodb.com/cloud/atlas
2. Login
3. Go to: Network Access (left menu)
4. Click: + Add IP Address
5. Enter: 0.0.0.0/0
6. Click: Confirm
7. Wait 1-2 minutes
```


### STEP 2: Start Backend

```powershell
cd f:\major project last year\campusxconnect\backend
npm run dev

# Should see:
# ✅ Server running on port 5000
# ✅ Connected to MongoDB
```


### STEP 3: Verify Backend is Running

```powershell
# In another terminal:
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should get user data or "unauthorized" error
# NOT "network error"
```


### STEP 4: Start Frontend

```powershell
cd f:\major project last year\campusxconnect\frontend
npm run dev

# Should see:
# ✅ ready - started server on 0.0.0.0:3000
```


### STEP 5: Test Each Error

**Test Error 1 (Leaderboard):**
```
- Go to http://localhost:3000/leaderboard
- Should load without "Failed to fetch leaderboard" error
```

**Test Errors 3-6 (400 errors):**
```
- Go to Profile page
- Click "Education", "Experience", "Certifications"
- Should load your saved data (or show empty, not 400 error)
- If you haven't saved any, add one
```

**Test Error 7 (Class constructor):**
```
- Go to http://localhost:3000/messages
- Should load chat page without crashing
```


## WHY THESE ERRORS HAPPEN

1. **"Failed to fetch"** = Backend not running
   - Solution: Start backend with npm run dev
   - Check: http://localhost:5000 should respond

2. **"400 Bad Request"** = Validation failed
   - Solution: Ensure token is sent + body is valid
   - Backend is checking required fields

3. **"Class constructor cannot be invoked"** = Wrong import
   - Solution: Use dynamic import with ssr: false
   - Or convert to functional component

4. **"Network Error"** = Can't reach backend
   - Solution: Start backend
   - Check NEXT_PUBLIC_API_URL is correct


## QUICK CHECKLIST

- [ ] MongoDB IP whitelisted (0.0.0.0/0)
- [ ] Wait 1-2 minutes after whitelisting
- [ ] Backend started: npm run dev
- [ ] Backend shows "Server running on port 5000"
- [ ] Backend shows "Connected to MongoDB"
- [ ] Frontend started: npm run dev
- [ ] Frontend shows "ready - started server"
- [ ] http://localhost:3000 loads without errors
- [ ] Try leaderboard page
- [ ] Try education/experience/certifications
- [ ] Try messages page

If all above are done, errors should disappear!
