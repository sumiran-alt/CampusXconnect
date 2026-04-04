# Profile & Connection System - Deployment & Testing Guide

## 🚀 Deployment Checklist

### Pre-Deployment Verification

- [ ] All 10 features tested locally
- [ ] No console errors in browser
- [ ] No server errors in backend logs
- [ ] Database migrations completed
- [ ] Environment variables configured
- [ ] API endpoints responding correctly
- [ ] Frontend builds successfully
- [ ] Mobile responsive design tested

### Deployment Steps

#### 1. Backend Deployment

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Verify environment variables
cat .env  # Should have DATABASE_URL, JWT_SECRET, etc.

# Run database migrations if needed
npm run migrate

# Start server
npm start  # or npm run dev for development

# Verify on http://localhost:5000
curl http://localhost:5000/api/users/profile  # Should require auth token
```

#### 2. Frontend Deployment

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build optimized version
npm run build

# Verify build succeeded
ls .next

# Start production server
npm start  # or npm run dev for development
```

#### 3. Verify API Integration

```bash
# Test user profile endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/users/SOME_USER_ID

# Test connection endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/connections/SOME_USER_ID/status

# Test posts endpoint
curl http://localhost:5000/api/posts/user/SOME_USER_ID
```

---

## 🧪 Comprehensive Testing Guide

### Test Setup

1. **Create Test Accounts**
   ```
   User A: testuser1@example.com
   User B: testuser2@example.com
   User C: testuser3@example.com
   ```

2. **Create Test Data**
   - Have each user create 2-3 posts
   - Create some connections between users
   - Set up mutual connections

### Test Scenarios

#### Scenario 1: Profile Navigation
```
Step 1: Login as User A
Step 2: Go to /feed
Step 3: Click on User B's profile icon
Step 4: VERIFY: Redirected to /profile/userB_id
Step 5: VERIFY: User B's profile data loads
Step 6: VERIFY: All sections visible (posts, skills, etc.)
```

#### Scenario 2: Connection Request Flow
```
Step 1: Login as User A
Step 2: Navigate to User B's profile
Step 3: Click "Send Connection Request"
Step 4: VERIFY: Button changes to "Pending - Cancel Request"
Step 5: VERIFY: Toast shows "Connection request sent!"

Step 6: Login as User B (new session)
Step 7: Navigate to User A's profile (or check notifications)
Step 8: VERIFY: User A's button shows "Send Connection Request"
Step 9: VERIFY: User A is in pending connections

Step 10: Click Accept (if notification, or go to User A's profile)
Step 11: VERIFY: Toast shows "Connection accepted successfully"
Step 12: VERIFY: User A's profile shows "Connected"

Step 13: Login as User A
Step 14: Navigate to User B's profile
Step 15: VERIFY: Button shows "Remove Connection"
```

#### Scenario 3: Mutual Connections
```
Step 1: Create connections between users:
        A ↔ B, B ↔ C, A ↔ C
Step 2: Login as User A
Step 3: Navigate to User B's profile
Step 4: VERIFY: "Mutual Connections" section visible
Step 5: VERIFY: User C shown in mutual connections
Step 6: Click on User C's thumbnail
Step 7: VERIFY: Navigated to User C's profile
```

#### Scenario 4: Message Button
```
Step 1: Ensure Users A and B are connected
Step 2: Login as User A
Step 3: Navigate to User B's profile
Step 4: VERIFY: "Message" button visible (only if connected)
Step 5: Click "Message" button
Step 6: VERIFY: Navigated to /messages/userB_id
Step 7: VERIFY: Chat interface loads
```

#### Scenario 5: Edit Profile Security
```
Step 1: Login as User A
Step 2: Go to own profile (/profile)
Step 3: VERIFY: "Edit Profile" button visible
Step 4: VERIFY: Can edit profile information

Step 5: Navigate to User B's profile
Step 6: VERIFY: "Edit Profile" button NOT visible
Step 7: VERIFY: Only "Connect", "Follow", "Message" buttons shown

Step 8: Try to navigate to /profile/settings (if exists)
Step 9: VERIFY: Proper authorization check
```

#### Scenario 6: Posts Display
```
Step 1: Login as User A
Step 2: Go to own profile
Step 3: Create a new post

Step 4: Login as User B
Step 5: Navigate to User A's profile
Step 6: VERIFY: User A's post visible in Posts section
Step 7: VERIFY: Post title, description, tech stack visible
Step 8: VERIFY: Likes and comments count shown

Step 9: Create a PRIVATE post as User A
Step 10: Login as User B
Step 11: Navigate to User A's profile
Step 12: VERIFY: Private post NOT visible
```

#### Scenario 7: Follow User
```
Step 1: Login as User A
Step 2: Navigate to User B's profile
Step 3: Click "Follow" button
Step 4: VERIFY: Button changes to "Following"
Step 5: VERIFY: Toast shows "Following user!"
Step 6: Click "Following" to unfollow
Step 7: VERIFY: Button changes back to "Follow"
```

#### Scenario 8: Profile Not Found
```
Step 1: Navigate to /profile/invalid_id_12345
Step 2: VERIFY: Shows "Profile not found" message
Step 3: Does NOT crash
Step 4: VERIFY: Can navigate back/home
```

#### Scenario 9: Authentication Check
```
Step 1: Logout/Clear localStorage
Step 2: Try to navigate to /profile/someuser_id
Step 3: VERIFY: Redirected to /login page
```

#### Scenario 10: Loading States
```
Step 1: Login
Step 2: Navigate to new profile
Step 3: VERIFY: Skeleton loader shows while loading
Step 4: VERIFY: Smooth animation
Step 5: VERIFY: Replaces with actual content when loaded
```

---

## 🔍 Performance Testing

### Load Testing

```bash
# Test API response time
time curl http://localhost:5000/api/users/SOME_USER_ID

# Expected: < 100ms for profile
# Expected: < 200ms for profile with posts
```

### Browser Performance

1. Open DevTools (F12)
2. Go to Performance tab
3. Navigate to profile page
4. Record performance
5. VERIFY: FCP < 2s, LCP < 3s

### Memory Usage

1. Open DevTools Memory tab
2. Take heap snapshot before profile nav
3. Navigate to profile
4. Take heap snapshot after
5. VERIFY: Memory increase < 10MB

---

## 📱 Mobile Testing

### Mobile Devices

- [ ] iPhone 12/13/14 (Safari)
- [ ] Android Phone (Chrome)
- [ ] iPad/Tablet (Safari)
- [ ] iPhone SE (smaller screen)

### Mobile Test Cases

```
TEST 1: Profile Navigation
- Click profile icon on small screen
- Verify profile loads
- Verify layout is stacked (not side-by-side on mobile)

TEST 2: Button Layout
- Verify buttons stack vertically on mobile
- Verify buttons are touch-friendly (min 44px height)

TEST 3: Grid Layout
- Verify posts grid is 1 column on mobile
- Verify mutual connections grid adapts to small screen

TEST 4: Scrolling
- Profile can be scrolled smoothly
- No horizontal scroll
- All content accessible

TEST 5: Images
- Profile picture loads and displays correctly
- Images don't exceed viewport width
```

---

## 🐛 Bug Reporting Template

```markdown
### Bug Title: [Brief description]

**Severity:** [Critical/High/Medium/Low]

**Device:** [Browser/Device info]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshots/Videos:**
[If applicable]

**Error Console:**
[Any JavaScript errors from console]
```

---

## 🔧 Troubleshooting Guide

### Problem: Profile not loading
**Solution:**
1. Check network tab in DevTools
2. Verify API endpoint is returning data
3. Check if user ID is valid in database
4. Verify authentication token is present

### Problem: Connection button not working
**Solution:**
1. Check browser console for errors
2. Verify both users exist
3. Check if already connected
4. Try refreshing page
5. Clear cache and try again

### Problem: Posts not showing
**Solution:**
1. Verify user has created posts
2. Check post privacy settings (should be "public")
3. Check database for post records
4. Verify pagination is working

### Problem: Mutual connections empty
**Solution:**
1. Verify you have common connections
2. Check if connections are bidirectional
3. Verify connection acceptance was completed
4. Check database connections field

### Problem: Skeleton loader stuck
**Solution:**
1. Check network tab for failed API calls
2. Verify API is responding
3. Check backend logs for errors
4. Try refreshing page

---

## 📊 Monitoring & Logs

### Backend Logs to Monitor

```
✓ Connection request creation
✓ Connection acceptance
✓ User profile fetch
✓ Posts retrieval
✓ Error messages and stack traces
```

### Frontend Logs to Monitor

```
✓ API call responses
✓ Component render times
✓ State changes
✓ Navigation events
✓ Error catches
```

### Useful Log Commands

```bash
# Backend logs
tail -f backend/debug.log

# Frontend Vue DevTools
npm run dev  # Enables DevTools

# Network monitoring
# Use Chrome DevTools Network tab
```

---

## 🎯 Acceptance Criteria Checklist

### Functional Requirements
- [ ] Users can click profiles in feed
- [ ] Profile page displays all information
- [ ] Connection requests work both ways
- [ ] Posts are visible on profile
- [ ] Mutual connections are shown
- [ ] Follow/Unfollow works
- [ ] Message button navigates correctly
- [ ] Edit profile hidden for other users

### Non-Functional Requirements
- [ ] Page loads in < 3 seconds
- [ ] No console errors
- [ ] Mobile responsive on all devices
- [ ] Accessibility standards met (WCAG)
- [ ] Error handling for edge cases
- [ ] Security checks implemented
- [ ] Database queries optimized

### User Experience
- [ ] Skeleton loaders show while loading
- [ ] Toast notifications appear
- [ ] No jank or stuttering
- [ ] Smooth animations
- [ ] Clear error messages
- [ ] Responsive button states

---

## ✅ Sign-Off Checklist

Before marking as complete:

- [ ] All 10 features tested
- [ ] All test scenarios passed
- [ ] No critical bugs remaining
- [ ] Documentation reviewed
- [ ] Performance acceptable
- [ ] Mobile responsive verified
- [ ] Security checks passed
- [ ] Code reviewed
- [ ] Ready for production

---

## 📋 Rollback Plan

If issues occur in production:

```bash
# Git rollback to previous version
git revert <commit-hash>

# Or revert to last known good version
git checkout <previous-tag>

# Redeploy
npm run build
npm start
```

---

## 🎓 Training Checklist

For team members onboarding:

- [ ] Read PROFILE_CONNECTION_SYSTEM_GUIDE.md
- [ ] Read PROFILE_CONNECTION_QUICK_REFERENCE.md
- [ ] Review code in profile/[id]/page.jsx
- [ ] Review ConnectionButton component
- [ ] Test the entire flow manually
- [ ] Understand API endpoints
- [ ] Review error handling
- [ ] Test on mobile device

---

## 📞 Support Resources

- **Main Docs:** `PROFILE_CONNECTION_SYSTEM_GUIDE.md`
- **Quick Ref:** `PROFILE_CONNECTION_QUICK_REFERENCE.md`
- **API Docs:** `API_REFERENCE_COMPLETE.md`
- **Component Docs:** Review JSX comments in files

---

**Last Updated:** March 15, 2026
**Version:** 1.0.0
**Status:** Ready for Deployment ✅
