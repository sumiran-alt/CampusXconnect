# CampusXConnect Onboarding Flow - Quick Testing Guide

## Pre-Testing Setup

### 1. Start Backend Server
```bash
cd backend
npm install  # if needed
npm start    # or npm run dev
```
**Expected**: Server running on http://localhost:5000

### 2. Start Frontend Server
```bash
cd frontend
npm install  # if needed
npm run dev
```
**Expected**: Next.js app running on http://localhost:3000

### 3. Verify MongoDB Connection
- Ensure MongoDB is running
- Check backend console for "Connected to MongoDB" message

## Test Scenario 1: Fresh Student Signup & Onboarding

### Step 1: Navigate to Signup
1. Go to `http://localhost:3000/signup`
2. Fill in form:
   - Name: `John Student`
   - Email: `john.student@test.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click "Sign Up"

**Expected Result**: 
- ✅ Success toast: "Signup successful!"
- ✅ Redirect to `/onboarding` (not /profile-setup)

### Step 2: Role Selection Modal
1. Page displays with gradient background
2. Modal shows with title: "Welcome to CampusXConnect! 🎓"
3. Two role cards visible: Student (blue) and Alumni (green)

**Test Interactions**:
- [ ] Click Student card → Shows checkmark, "Continue" button enabled
- [ ] Click Alumni card → Shows checkmark, "Continue" button enabled
- [ ] Click Continue without selecting → Toast error: "Please select your role to continue"

**Action**: Select Student role and click Continue

**Expected Result**:
- ✅ Continue button shows loading spinner
- ✅ Role saved to backend
- ✅ Student Profile Form displays

### Step 3: Student Profile Form
**Verify Form Fields**:
- [ ] Name field pre-filled with "John Student"
- [ ] College field shows "Dronacharya Group of Institutions" (disabled)
- [ ] Degree dropdown (required)
- [ ] Branch dropdown (required)
- [ ] Year of Study dropdown (required)
- [ ] Skills field (optional)
- [ ] Interests field (optional)
- [ ] Progress bar shows "Step 2 of 2"

**Fill Form**:
1. Degree: Select "B.Tech"
2. Branch: Select "CSE"
3. Year of Study: Select "2nd Year"
4. Skills: Enter "React, Python, JavaScript"
5. Interests: Enter "Web Development, AI/ML"
6. Leave Profile Picture empty (optional)

**Submit**:
- Click "Complete Profile Setup" button
- Should show loading spinner

**Expected Result**:
- ✅ Success toast: "Profile setup complete! Welcome to CampusXConnect 🎓"
- ✅ Success screen shows with checkmark
- ✅ Auto-redirect to `/profile` after 2 seconds

### Step 4: Verify Database
```javascript
// In MongoDB shell or MongoDB Compass
db.users.findOne({ email: "john.student@test.com" })

// Should show:
{
  name: "John Student",
  email: "john.student@test.com",
  userType: "student",
  degree: "B.Tech",
  branch: "CSE",
  year: 2,
  skills: ["React", "Python", "JavaScript"],
  interests: ["Web Development", "AI/ML"],
  profileCompletionStatus: true,
  // ... other fields
}
```

---

## Test Scenario 2: Alumni Signup & Onboarding

### Step 1: Navigate to Signup
1. Go to `http://localhost:3000/signup`
2. Fill in form:
   - Name: `Jane Alumni`
   - Email: `jane.alumni@test.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click "Sign Up"

**Expected Result**: Redirect to `/onboarding`

### Step 2: Role Selection
1. Select **Alumni** card (green theme)
2. Click Continue

**Expected Result**: Alumni Profile Form displays

### Step 3: Alumni Profile Form
**Verify Form Fields**:
- [ ] Name field pre-filled with "Jane Alumni"
- [ ] College field shows "Dronacharya Group of Institutions" (disabled)
- [ ] Degree dropdown (required)
- [ ] Branch dropdown (required)
- [ ] Year of Passing dropdown showing years (required)
- [ ] Current Company field (optional)
- [ ] Job Role field (optional)
- [ ] Skills field (optional)
- [ ] Green theme (not blue)

**Fill Form**:
1. Degree: Select "B.Tech"
2. Branch: Select "ECE"
3. Year of Passing: Select "2020"
4. Company: Enter "Google"
5. Job Role: Enter "Senior Software Engineer"
6. Skills: Enter "C++, System Design, Leadership"

**Submit**:
- Click "Complete Profile Setup"

**Expected Result**:
- ✅ Success toast and screen
- ✅ Redirect to `/profile`

### Step 4: Verify Database
```javascript
db.users.findOne({ email: "jane.alumni@test.com" })

// Should show:
{
  name: "Jane Alumni",
  email: "jane.alumni@test.com",
  userType: "alumni",
  degree: "B.Tech",
  branch: "ECE",
  passoutYear: 2020,
  company: "Google",
  jobRole: "Senior Software Engineer",
  skills: ["C++", "System Design", "Leadership"],
  profileCompletionStatus: true,
  // NO year field (students only)
  // NO interests field (students only)
  // ... other fields
}
```

---

## Test Scenario 3: Validation Testing

### Test 3A: Missing Required Fields
**Student Form**:
1. Fill only Name and College (skip Degree, Branch, Year)
2. Click "Complete Profile Setup"

**Expected Result**: 
- ✅ Form doesn't submit
- ✅ Error messages show under empty fields:
  - Degree: "Degree is required"
  - Branch: "Branch is required"
  - Year of Study: "Year of Study is required"
- ✅ Fields with errors have red borders
- ✅ Toast error: "Please fill in all required fields"

### Test 3B: Image Size Validation
1. Prepare a large image file (> 2MB)
2. Try to upload as profile picture
3. Select the large image

**Expected Result**:
- ✅ Error toast: "Image size should be less than 2MB"
- ✅ Image not uploaded

### Test 3C: Alumni - Future Year Validation
1. Year of Passing: Try to select a future year
2. If future year prevention works at DB level, try submitting

**Expected Result** (Backend):
- ✅ Validation error for future year
- ✅ Form doesn't submit
- ✅ Error message displayed

### Test 3D: Invalid Image Type
1. Try uploading a text file or non-image file
2. Select .txt or .pdf file

**Expected Result**:
- ✅ Error toast: "Please select a valid image file"
- ✅ File not uploaded

---

## Test Scenario 4: Mobile Responsiveness

### Device: iPhone 12 (390x844)
1. Go to `/onboarding`
2. Load Student Profile Form

**Verify**:
- [ ] Form fields stack vertically (1 column)
- [ ] Buttons full-width
- [ ] Degree and Branch selects are full-width (not side-by-side)
- [ ] Progress bar visible
- [ ] Cannot access onboarding directly without signup

### Device: iPad (768x1024)
1. Load Student Profile Form

**Verify**:
- [ ] Degree and Branch still side-by-side (2 columns)
- [ ] Layout doesn't break
- [ ] All text readable

---

## Test Scenario 5: Authentication & Security

### Test 5A: Unauthorized Access
1. Clear all browser storage (localStorage, cookies)
2. Try to navigate directly to `http://localhost:3000/onboarding`

**Expected Result**:
- ✅ Redirect to `/login` immediately
- ✅ Cannot see onboarding page

### Test 5B: API Security
1. Complete onboarding successfully
2. Open Developer Tools (F12) → Network tab
3. Check the API requests

**Verify**:
- [ ] All requests to `/api/users/*` include `Authorization: Bearer {token}` header
- [ ] Request headers show `Content-Type: application/json`
- [ ] Token present in localStorage

---

## Test Scenario 6: Error Scenarios

### Test 6A: Network Error During Role Selection
1. Open Developer Tools → Network tab → Offline
2. Select role and click Continue

**Expected Result**:
- ✅ Loading spinner shows then stops
- ✅ Error toast: "Failed to proceed. Please try again."
- ✅ Can still interact with form

### Test 6B: Network Error During Profile Submission
1. Offline mode (from Test 6A)
2. Fill student form completely
3. Click "Complete Profile Setup"

**Expected Result**:
- ✅ Loading spinner shows
- ✅ Error toast with message
- ✅ Can retry after going online

### Test 6C: Invalid Degree/Branch Selection
1. Try to submit form with invalid degree/branch

**Expected Result**:
- ✅ Backend rejects with validation error
- ✅ Frontend shows error toast
- ✅ Database not updated

---

## Test Scenario 7: UI/UX Testing

### Test 7A: Loading States
1. During role selection submit
2. During profile form submit

**Verify**:
- [ ] Continue button shows spinner
- [ ] "Complete Profile Setup" button shows spinner
- [ ] Buttons disabled during loading
- [ ] Form inputs disabled during loading
- [ ] Text changes to "Setting up your profile..."

### Test 7B: Transitions & Animations
1. Select role → Role form changes

**Verify**:
- [ ] Modal transitions smoothly
- [ ] Form appears with fade-in effect
- [ ] No jarring page changes
- [ ] Progress bar fills smoothly

### Test 7C: Tooltips & Helpful Text
1. Hover over optional fields

**Verify**:
- [ ] "This will help us match you with internships" type hints visible
- [ ] College name shows "Pre-filled with verified college"
- [ ] Skills hint shows "Enter skills separated by commas"
- [ ] Instructions clear and helpful

---

## Test Scenario 8: Edge Cases

### Test 8A: Very Long Input
1. Name: Paste 500 character string
2. Try to submit

**Verify**:
- [ ] Frontend may validate length
- [ ] Or backend rejects gracefully
- [ ] Error message shown

### Test 8B: Special Characters in Input
1. Name: "John O'Brien-Smith III"
2. Skills: "C++, C#, .NET"
3. Try to submit

**Expected Result**:
- ✅ Input accepted and stored correctly
- ✅ No XSS vulnerabilities
- [ ] Database shows correct values

### Test 8C: Rapid Form Submission
1. Double-click / rapid-click the submit button

**Expected Result**:
- ✅ Only one API call made
- ✅ Button disabled after first click
- ✅ Spinner shows only once

---

## Browser Compatibility Testing

Test on:
- [ ] Chrome (Latest)
- [ ] Firefox (Latest)
- [ ] Safari (Latest)
- [ ] Edge (Latest)

**Verify** in each:
- Forms render correctly
- Buttons clickable
- CSS styles applied
- No console errors

---

## Performance Testing

### Metrics to Check:
1. **Page Load Time**: `/onboarding` should load < 2 seconds
2. **API Response Time**: 
   - setUserType: < 500ms
   - completeProfileSetup: < 1000ms
3. **Form Responsiveness**: No lag when typing

### Using DevTools:
```
F12 → Performance tab
1. Record
2. Interact with form (select, type, submit)
3. Stop recording
4. Check for slow frames (< 60fps)
```

---

## Common Issues & Solutions

### Issue 1: "onboarding/page.jsx not found"
**Solution**: Ensure directory exists at `frontend/app/onboarding/`

### Issue 2: "userAPI.setUserType is not a function"
**Solution**: Check `frontend/lib/api.js` has setUserType exported in userAPI object

### Issue 3: Redirect not working after signup
**Solution**: 
- Check signup API response
- Verify `router.push("/onboarding")`
- Check auth context/store is set correctly

### Issue 4: Form fields showing but userType is null
**Solution**:
- Verify user authenticated and token in localStorage
- Check setUserType API call succeeded
- Verify backend saved userType to database

### Issue 5: Alumni form not showing after selecting Alumni
**Solution**:
- Check selectedRole state in orchestrator
- Verify conditional rendering logic
- Check browser console for errors

### Issue 6: Images not uploading
**Solution**:
- Check image size < 2MB
- Verify FileReader API works in browser
- Check backend handles base64 image data

---

## Final Verification Checklist

- [ ] New users signup successfully
- [ ] Redirected to `/onboarding` (not old `/profile-setup`)
- [ ] Role selection modal appears
- [ ] Role can be selected (student or alumni)
- [ ] Correct form appears based on role
- [ ] Form validation works
- [ ] Form submission works
- [ ] Success screen shows
- [ ] Redirects to `/profile` after 2 seconds
- [ ] Database updated with all fields
- [ ] User type is correct (student/alumni)
- [ ] Conditional fields present (year vs passoutYear)
- [ ] Mobile responsive
- [ ] No console errors
- [ ] No network errors
- [ ] Authentication redirects work

---

## Quick Test Commands

```bash
# Test Backend Express Server
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer {your_token}" \
  -H "Content-Type: application/json"

# Test User Object Return
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer {token}" | jq .user

# MongoDB Query to Verify Data
# In MongoDB shell:
db.users.find({ email: "test@example.com" }).pretty()
```

---

## Success Criteria

✅ **Complete Onboarding Implementation** when:
1. All 4 test scenarios pass
2. All validation tests pass
3. Mobile responsive on tested devices
4. No console errors or warnings
5. Database updates correctly based on user type
6. User cannot access onboarding without auth
7. All error states handled gracefully
8. Performance acceptable (< 2s load, < 500ms API)
9. UI/UX smooth with no jarring transitions
10. Edge cases handled without crashes

---

**Testing Time Estimate**: 30-45 minutes
**Difficulty**: Intermediate
**Pre-requisites**: Both servers running, MongoDB connected

**Date Started**: [Your Date]
**Date Completed**: [Your Date]
**Tester**: [Your Name]
**Status**: 🟡 Ready for Testing
