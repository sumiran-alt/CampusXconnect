# 📋 Notifications & Suggestions Testing Checklist

## Pre-Testing Setup

### Required Setup

- [ ] Start backend: `cd backend && npm run dev`
- [ ] Start frontend: `cd frontend && npm run dev`
- [ ] Have 3+ test user accounts created
- [ ] Ensure MongoDB is connected
- [ ] Clear browser cache if needed
- [ ] Open browser DevTools (F12) to monitor console

### Test Accounts

Create these test accounts:

```
Account 1 (Sender):
- Name: John Doe
- Email: john@test.com
- Branch: CSE
- Year: 4
- Company: Google

Account 2 (Receiver):
- Name: Jane Smith
- Email: jane@test.com
- Branch: CSE
- Year: 4
- Company: Microsoft

Account 3 (Other):
- Name: Bob Wilson
- Email: bob@test.com
- Branch: ECE
- Year: 3
- Company: Meta
```

---

## Notifications System Testing

### Test Set 1: Notification Creation

#### Test 1.1: CONNECTION_REQUEST Notification

- [ ] Login as Account 1 (John)
- [ ] Go to `/search`
- [ ] Search for Jane Smith (Account 2)
- [ ] Click "Connect" button
- [ ] Button changes to "Pending" ✓ Visible?
- [ ] Open new tab/incognito
- [ ] Login as Account 2 (Jane)
- [ ] Check Navigation bar
- [ ] Verify 🔔 badge shows "1" ✓ Shows?
- [ ] Click "🔔 Notifications"
- [ ] Verify notification appears with:
  - [ ] Icon: 👤
  - [ ] Title: "New connection request from John Doe"
  - [ ] Message: "John Doe sent you a connection request"
  - [ ] Unread status (blue highlight)
  - [ ] Timestamp shows
  - [ ] Not yet marked as read

**Expected Result**: ✅ Notification created and visible

#### Test 1.2: CONNECTION_ACCEPTED Notification

- [ ] Stay as Account 2 (Jane)
- [ ] In notifications, see John's request
- [ ] Click on notification card (should become white = read)
- [ ] Click "Accept" in connections
- [ ] In new tab, refresh Account 1 (John) page
- [ ] Check 🔔 badge (should now show "1")
- [ ] Click "🔔 Notifications"
- [ ] Verify:
  - [ ] Icon: ✅
  - [ ] Title: "Jane Smith accepted your connection request"
  - [ ] Message shows acceptance
  - [ ] Type: CONNECTION_ACCEPTED
  - [ ] Unread (blue)

**Expected Result**: ✅ Acceptance notification created

#### Test 1.3: CONNECTION_REMOVED Notification

- [ ] Stay as Account 1 (John)
- [ ] Go to `/connections` → "My Connections"
- [ ] Find Jane Smith
- [ ] Click "Remove Connection"
- [ ] Confirm removal
- [ ] Switch to Account 2 (Jane) tab
- [ ] Refresh page
- [ ] Check 🔔 badge (should show "1")
- [ ] Click "🔔 Notifications"
- [ ] Verify:
  - [ ] Icon: ❌
  - [ ] Title: "John Doe removed the connection"
  - [ ] Message shows removal
  - [ ] Type: CONNECTION_REMOVED
  - [ ] Unread (blue)

**Expected Result**: ✅ Removal notification created

---

### Test Set 2: Notification Features

#### Test 2.1: Mark as Read (Single)

**Setup**: Have 2 unread notifications

- [ ] Go to `/notifications`
- [ ] See 2 notifications with blue background
- [ ] Click first notification
- [ ] Verify:
  - [ ] Background turns white
  - [ ] Unread dot disappears
  - [ ] Badge count decreases to 1
  - [ ] Toast shows "Marked as read"

**Expected Result**: ✅ Single notification marked

#### Test 2.2: Mark All as Read

**Setup**: Have 3+ unread notifications

- [ ] Go to `/notifications`
- [ ] Filter by "Unread"
- [ ] Count shows 3+
- [ ] Click "Mark all as read" button
- [ ] Verify:
  - [ ] All notifications turn white
  - [ ] Filter shows 0 results
  - [ ] Switch to "All" filter
  - [ ] All now show as read (white)
  - [ ] Badge shows "0"

**Expected Result**: ✅ All marked together

#### Test 2.3: Delete Notification

**Setup**: Have notifications

- [ ] Go to `/notifications`
- [ ] Hover over notification card
- [ ] Delete button (🗑️) appears
- [ ] Click delete
- [ ] Verify:
  - [ ] Notification disappears
  - [ ] Toast: "Notification deleted"
  - [ ] If was last unread, badge becomes 0
  - [ ] Page count decreases

**Expected Result**: ✅ Notification removed

#### Test 2.4: Filter by Unread

**Setup**: Mix of read and unread notifications

- [ ] Go to `/notifications`
- [ ] Should show all
- [ ] Click "Unread" filter
- [ ] Verify:
  - [ ] Only unread (blue) notifications show
  - [ ] Count matches unread count
  - [ ] Read (white) ones hidden
  - [ ] "Mark all as read" button appears

**Expected Result**: ✅ Filter works

#### Test 2.5: Filter by Read

**Setup**: Mix of read and unread notifications

- [ ] Still on `/notifications`
- [ ] Click "Read" filter
- [ ] Verify:
  - [ ] Only read (white) notifications show
  - [ ] Unread (blue) ones hidden
  - [ ] "Mark all as read" button gone
  - [ ] Count shows read notifications

**Expected Result**: ✅ Filter works

#### Test 2.6: Pagination

**Setup**: 30+ notifications

- [ ] Go to `/notifications`
- [ ] First page shows 20
- [ ] Pagination controls at bottom show:
  - [ ] "Page 1 of 2" ✓
  - [ ] "Previous" button (disabled)
  - [ ] "Next" button (enabled)
- [ ] Click "Next"
- [ ] Verify:
  - [ ] Different 20 notifications shown
  - [ ] "Previous" now enabled
  - [ ] Shows "Page 2 of 2"
  - [ ] "Next" disabled (last page)
- [ ] Click "Previous"
- [ ] Back to first 20

**Expected Result**: ✅ Pagination works correctly

#### Test 2.7: Notification Navigation

**Setup**: Have notification with link

- [ ] Go to `/notifications`
- [ ] See notification (e.g., CONNECTION_REQUEST)
- [ ] Click anywhere on notification card
- [ ] Verify:
  - [ ] Notification marked as read
  - [ ] Redirects to link (/connections)
  - [ ] Shows correct page

**Expected Result**: ✅ Navigation works and marks as read

---

### Test Set 3: Navigation Badge Updates

#### Test 3.1: Badge Updates on Connection Action

- [ ] Have Account 1 and Account 2 logged in (separate tabs)
- [ ] Account 1: Send connection request to Account 2
- [ ] Account 2: Refresh page
- [ ] Badge shows "1" ✓
- [ ] Account 2: Accept request
- [ ] Account 1: Wait 30 seconds or refresh
- [ ] Badge updates to show new "CONNECTION_ACCEPTED" ✓
- [ ] Account 1: Remove connection
- [ ] Account 2: Refresh
- [ ] Badge shows removal notification ✓

**Expected Result**: ✅ Badge updates in real-time

#### Test 3.2: Badge Disappears at 0

- [ ] Have 1 unread notification
- [ ] Badge shows "1"
- [ ] Mark as read
- [ ] Verify:
  - [ ] Badge disappears
  - [ ] Only text "🔔 Notifications" shows
  - [ ] No red circle

**Expected Result**: ✅ Badge hides at 0

#### Test 3.3: Auto-refresh Every 30 Seconds

- [ ] Note time
- [ ] Stay on page without sending new notifications
- [ ] Badge should refresh count automatically
- [ ] Check browser console (no errors)
- [ ] After 30 seconds, counts should refresh

**Expected Result**: ✅ Background refresh works

---

## Suggestions System Testing

### Test Set 4: Recommendations

#### Test 4.1: View Recommendations Page

- [ ] Login as Account 1 (John)
- [ ] Go to `/suggestions`
- [ ] Verify:
  - [ ] Title: "People You May Know" ✓
  - [ ] Two tabs: "Recommendations" (active), "Trending in Your Branch"
  - [ ] Page loads without error
  - [ ] Console shows no errors

**Expected Result**: ✅ Page loads correctly

#### Test 4.2: See Recommendations (Same Year/Branch)

**Setup**: Have 3+ users in CSE, Year 4, not connected

- [ ] Stay on `/suggestions`
- [ ] Active tab: "Recommendations"
- [ ] Verify:
  - [ ] See user cards for suggested people
  - [ ] Shows profile picture (or placeholder)
  - [ ] Shows name, bio, year, branch
  - [ ] Shows "Mutual connections: X"
  - [ ] Shows skills (first 3)
  - [ ] Has "Connect" button
  - [ ] Has "View Profile" button

**Expected Result**: ✅ Cards show all info

#### Test 4.3: Connect from Suggestions

- [ ] Still on recommendations
- [ ] See a user card
- [ ] Click "Connect" button
- [ ] Verify:
  - [ ] Button changes to "Pending"
  - [ ] Toast appears
  - [ ] Connection request sent
  - [ ] User card might fade/remove

**Expected Result**: ✅ Connect works from page

#### Test 4.4: View Profile from Suggestions

- [ ] Recommendations page visible
- [ ] Click "View Profile" button
- [ ] Verify:
  - [ ] Navigates to `/profile/[userId]`
  - [ ] Shows their full profile
  - [ ] Can see all their details

**Expected Result**: ✅ Navigation works

#### Test 4.5: Exclude Connected Users

**Setup**: Be connected to some users

- [ ] Go to `/suggestions`
- [ ] Verify:
  - [ ] Connected users NOT shown
  - [ ] Only non-connected users in suggestions
  - [ ] Pending requests also not shown

**Expected Result**: ✅ Correctly filtered

---

### Test Set 5: Trending Suggestions

#### Test 5.1: View Trending Tab

- [ ] Stay on `/suggestions`
- [ ] Click "Trending in Your Branch" tab
- [ ] Verify:
  - [ ] Tab becomes underlined (active)
  - [ ] Content changes
  - [ ] Shows different users
  - [ ] Shows no loading spinner (cached or fast)

**Expected Result**: ✅ Tab switches content

#### Test 5.2: Trending Shows Most Connected

**Setup**: Have users with different connection counts

- User A: 50 connections
- User B: 30 connections
- User C: 20 connections

- [ ] On "Trending" tab
- [ ] Verify:
  - [ ] Shows users sorted by connection count
  - [ ] User A listed first (50 connections)
  - [ ] User B second (30 connections)
  - [ ] Shows connection count on cards
  - [ ] Users from your branch only

**Expected Result**: ✅ Sorted correctly by popularity

#### Test 5.3: Same Branch Filter

**Setup**: You're in CSE, have ECE users too

- [ ] Still on trending tab
- [ ] Verify:
  - [ ] Only CSE (your branch) users shown
  - [ ] ECE users not in trending
  - [ ] Cards show branch info

**Expected Result**: ✅ Branch correctly filtered

---

### Test Set 6: Mobile Responsiveness

#### Test 6.1: Notifications on Mobile

- [ ] Open `/notifications` on mobile/tablet
- [ ] Verify:
  - [ ] Headers readable
  - [ ] Filters stack vertically
  - [ ] Notification cards full width
  - [ ] Delete button easily accessible
  - [ ] Pagination controls visible
  - [ ] No horizontal scroll

**Expected Result**: ✅ Mobile layout works

#### Test 6.2: Suggestions on Mobile

- [ ] Open `/suggestions` on mobile
- [ ] Verify:
  - [ ] Cards are 1 column (not 3)
  - [ ] Tabs readable
  - [ ] Profile picture visible
  - [ ] Connect button accessible
  - [ ] All text readable
  - [ ] No overflow issues

**Expected Result**: ✅ Responsive grid works

---

## Edge Cases & Error Handling

### Test Set 7: Edge Cases

#### Test 7.1: No Notifications

- [ ] Fresh account with no activities
- [ ] Go to `/notifications`
- [ ] Verify:
  - [ ] Shows "📭 You don't have any notifications yet"
  - [ ] Helpful message shown
  - [ ] No errors in console

**Expected Result**: ✅ Empty state handled

#### Test 7.2: No Recommendations

- [ ] Account with many connections but no candidates
- [ ] Go to `/suggestions`
- [ ] Verify:
  - [ ] Shows "🎯 No recommendations at the moment"
  - [ ] Link to explore users
  - [ ] No errors

**Expected Result**: ✅ Empty state handled

#### Test 7.3: Invalid Notification ID

- [ ] Manually POST delete request with fake ID
- [ ] Verify:
  - [ ] Backend returns 404
  - [ ] Frontend shows error toast
  - [ ] Page doesn't crash

**Expected Result**: ✅ Error handled gracefully

#### Test 7.4: Unauthorized Access

- [ ] Logout completely
- [ ] Try to access `/notifications` directly
- [ ] Verify:
  - [ ] Redirects to `/login`
  - [ ] Can't access protected page

**Expected Result**: ✅ Auth protected

#### Test 7.5: Token Expiry

- [ ] Let token expire (30 days or set artificially)
- [ ] Try to fetch notifications
- [ ] Verify:
  - [ ] Redirects to login
  - [ ] Shows auth error
  - [ ] Asks to login again

**Expected Result**: ✅ Token validation works

---

### Test Set 8: Performance

#### Test 8.1: Load Time - Notifications

- [ ] Clear browser cache
- [ ] Go to `/notifications`
- [ ] Time how long it takes to load
- [ ] Target: < 2 seconds

**Expected Result**: ✅ Fast loading

#### Test 8.2: Pagination Performance

- [ ] Have 100+ notifications
- [ ] Navigate between pages 3-4 times
- [ ] Each should load quickly
- [ ] No memory leaks in DevTools

**Expected Result**: ✅ Pagination smooth

#### Test 8.3: Suggestions Grid

- [ ] Load suggestions page
- [ ] Scroll through cards
- [ ] Should be smooth
- [ ] No lag or stuttering

**Expected Result**: ✅ Grid renders smoothly

#### Test 8.4: Badge Refresh

- [ ] Badge refreshes every 30 seconds
- [ ] Multiple tabs open
- [ ] All tabs update simultaneously
- [ ] No excessive API calls in DevTools network tab

**Expected Result**: ✅ Efficient refresh rate

---

## Final Verification

### Pre-Deployment Checklist

#### Backend

- [ ] No console errors in terminal
- [ ] All models created (Notification, etc.)
- [ ] All routes registered
- [ ] Database connections working
- [ ] API responses have correct format
- [ ] Error handling for all endpoints

#### Frontend

- [ ] No build errors
- [ ] No console errors in browser
- [ ] All pages load without errors
- [ ] Navigation links work
- [ ] Badges update correctly
- [ ] Responsive on all screen sizes

#### Database

- [ ] Notification collection exists
- [ ] Sample notifications can be queried
- [ ] Indexes created for performance
- [ ] No duplicate notifications

#### Security

- [ ] Authentication required for all endpoints
- [ ] Users can only see own notifications
- [ ] No sensitive data in APIs
- [ ] Passwords excluded from suggestions

---

## Summary

**Total Test Cases**: 40+
**Required Time**: ~2-3 hours for full test suite
**Critical Tests**: 1.1, 2.1, 4.2, 5.2, 7.4, 8.1

**Pass Criteria**:

- ✅ All critical tests pass
- ✅ No console errors
- ✅ All features work as expected
- ✅ No performance issues

---

## Test Results Template

```
Testing Date: ___________
Tester Name: ___________
Environment: (Dev/Staging/Prod)

Notifications:
✅ Creation Tests: PASS / FAIL
✅ Feature Tests: PASS / FAIL
✅ Badge Tests: PASS / FAIL

Suggestions:
✅ Recommendations: PASS / FAIL
✅ Trending: PASS / FAIL

Mobile:
✅ Notifications: PASS / FAIL
✅ Suggestions: PASS / FAIL

Edge Cases:
✅ Empty States: PASS / FAIL
✅ Error Handling: PASS / FAIL
✅ Auth Protection: PASS / FAIL

Performance:
✅ Load Times: PASS / FAIL (< 2s)
✅ Pagination: PASS / FAIL
✅ Badge Refresh: PASS / FAIL

OVERALL: ✅ PASS / ❌ FAIL

Issues Found:
1. _______________
2. _______________
3. _______________

Recommendations:
1. _______________
2. _______________
```

---

## Support

- Check NOTIFICATIONS_SUGGESTIONS_GUIDE.md for detailed documentation
- Review Network tab in DevTools for API issues
- Check browser console for error messages
- Check backend terminal for server errors
- Verify MongoDB is running and connected
