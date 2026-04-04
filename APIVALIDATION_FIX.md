/**
 * API Endpoint Request Body Validation Fix
 * 
 * Fixes for 400 Bad Request errors on Education, Experience, Certifications
 */

## Why 400 Errors Occur

When you see "Request failed with status code 400", it means:
1. Backend received your request
2. BUT the request body is missing required fields
3. Backend rejects and returns 400

## Required Fields for Each Endpoint

### Education Endpoint (POST /api/education)
```javascript
REQUIRED:
  - school: "University Name"
  - degree: "Bachelor", "Master", "PhD"
  - fieldOfStudy: "Computer Science"
  - startDate: "2020-01-01"

OPTIONAL:
  - endDate: "2024-05-30"
  - currentlyStudying: true/false
  - grade: "A"
  - activities: "Club president"
  - description: "..."
```

### Experience Endpoint (POST /api/experience)
```javascript
REQUIRED:
  - title: "Software Engineer"
  - company: "Google"
  - startDate: "2020-01-01"

OPTIONAL:
  - endDate: "2024-05-30"
  - currentlyWorking: true/false
  - description: "..."
  - skills: ["JavaScript", "React"]
```

### Certifications Endpoint (POST /api/certification)
```javascript
REQUIRED:
  - name: "AWS Certified Solutions Architect"
  - issuingOrganization: "Amazon Web Services"
  - issueDate: "2023-01-01"

OPTIONAL:
  - expiryDate: "2025-01-01"
  - credentialId: "123456"
  - credentialUrl: "https://..."
```

## How to Fix the 400 Errors

### Fix 1: Ensure Backend is Running
```powershell
# Terminal 1 - Start backend
cd backend
npm run dev

# Should see:
# ✅ Server running on port 5000
# ✅ Connected to MongoDB
```

### Fix 2: Clear Browser Cache
```
1. Open Dev Tools (F12)
2. Go to Application → Local Storage
3. Delete localhost:3000 entry
4. Refresh page
```

### Fix 3: Ensure Token is Sent
The error might be "401 Unauthorized" instead of 400.

Check in browser DevTools:
```
1. Open DevTools (F12)
2. Go to: Network tab
3. Make a request (e.g., add education)
4. Click the request
5. Go to: Headers
6. Look for: Authorization: Bearer <token>
7. If missing, token isn't saved
```

### Fix 4: Validate Form Data
When clicking "Add Education", ensure ALL required fields are filled:
- School name ✓
- Degree level ✓
- Field of study ✓
- Start date ✓

## Testing the Fix

### Step 1: Start Backend
```powershell
cd backend
npm run dev
```

Wait for messages:
```
✅ Server running on port 5000
✅ Connected to MongoDB
```

### Step 2: Start Frontend
```powershell
cd frontend  
npm run dev
```

### Step 3: Test Each Endpoint

**Test Education:**
```
1. Go to: http://localhost:3000/profile
2. Click: "Add Education"
3. Fill form:
   - School: "My University"
   - Degree: "Bachelor"
   - Field: "CS"
   - Start Date: "2020-01-01"
4. Click: "Add"
5. Should see success message
6. NO 400 ERROR
```

**Test Experience:**
```
1. Click: "Add Experience"
2. Fill:
   - Title: "Software Engineer"
   - Company: "Google"
   - Start: "2022-01-01"
3. Click: "Add"
4. Should succeed
5. NO 400 ERROR
```

**Test Certifications:**
```
1. Click: "Add Certification"
2. Fill:
   - Name: "AWS Certified"
   - Organization: "AWS"
   - Date: "2023-01-01"
3. Click: "Add"
4. Should succeed
5. NO 400 ERROR
```

## Troubleshooting 400 Errors

### If you still see 400 error:

1. **Check backend logs:**
   ```powershell
   # Terminal where backend is running
   Look for error messages
   ```

2. **Check network request:**
   ```
   DevTools → Network tab
   Click the failed request
   → Request tab: Check body format (JSON)
   → Response tab: Check error message
   ```

3. **Check field format:**
   ```
   Dates must be: YYYY-MM-DD
   Strings must not be empty
   Numbers must be valid
   ```

4. **Check content-type header:**
   ```
   Headers should include:
   Content-Type: application/json
   Authorization: Bearer <token>
   ```

## API Validation Rules

### School Field
```javascript
// Valid
"school": "MIT"
"school": "Stanford University"

// Invalid
"school": ""           // Empty
"school": null         // Null
```

### Degree Field
```javascript
// Valid options
"degree": "Bachelor"
"degree": "Master"
"degree": "PhD"
"degree": "Associate"
"degree": "Vocational"

// Invalid
"degree": "Bachelors"  // Typo
"degree": ""           // Empty
```

### Date Field
```javascript
// Valid
"startDate": "2020-01-15"
"startDate": "2023-12-31"

// Invalid
"startDate": "01/15/2020"  // Wrong format
"startDate": "invalid"     // Not a date
"startDate": null          // Null/empty
```

## Complete Working Example

### Add Education Success:
```
Request:
  POST /api/education
  
  Headers:
    Content-Type: application/json
    Authorization: Bearer eyJhbGci...

  Body:
  {
    "school": "Stanford University",
    "degree": "Bachelor",
    "fieldOfStudy": "Computer Science",
    "startDate": "2020-09-01",
    "endDate": "2024-05-15",
    "currentlyStudying": false,
    "grade": "A",
    "activities": "Vice President, CS Club",
    "description": "Graduated with honors"
  }

Response (200 OK):
{
  "success": true,
  "message": "Education added successfully",
  "education": {
    "_id": "...",
    "userId": "...",
    "school": "Stanford University",
    ...
  }
}
```

## Prevention

These errors will NOT occur if:

✅ Backend is running (`npm run dev`)
✅ MongoDB is connected
✅ All required fields are filled
✅ Auth token is valid
✅ Date format is correct (YYYY-MM-DD)
✅ You're not submitting empty strings

## Summary

**Most 400 errors are because:**
1. Backend not running ← START: `npm run dev`
2. Missing required field ← CHECK: Form validation
3. Invalid date format ← USE: YYYY-MM-DD format
4. No auth token ← CHECK: Logged in correctly

**All 7 errors will disappear once:**
✅ MongoDB IP is whitelisted
✅ Backend starts successfully
✅ Frontend connects to backend
✅ You're logged in with valid token
