# Connection System - Quick Testing Guide

## Prerequisites

✅ Backend running: `npm run dev` in `/backend` folder
✅ Frontend running: `npm run dev` in `/frontend` folder
✅ MongoDB Atlas connected

---

## Test Scenario 1: Send Connection Request

### Setup

1. Create 2 test accounts:
   - **Account 1:** email: `user1@test.com`, password: `Test123@`
   - **Account 2:** email: `user2@test.com`, password: `Test123@`

### Test

1. [ ] Log in as User 1
2. [ ] Go to `/signup` → Create Account 2 and note the User ID
3. [ ] Log out
4. [ ] Log in as User 1
5. [ ] Go to `/profile/[User2ID]` (replace with actual ID)
6. [ ] Click **"Send Connection Request"** button
7. [ ] Button should change to **"Pending - Cancel Request"** (orange)

**Expected Result:**
✅ Button changes to orange "Pending" state

---

## Test Scenario 2: View Pending Request

### Setup

- From Test Scenario 1, you have 1 pending request

### Test

1. [ ] Log in as User 2
2. [ ] Click **"Connections"** in navigation
3. [ ] Should see 1 badge on Connections link
4. [ ] Click **"Pending Requests"** tab
5. [ ] You should see User 1's request
6. [ ] Request should show:
   - [ ] Profile picture
   - [ ] Name (User 1)
   - [ ] Bio
   - [ ] "Accept" button (blue)
   - [ ] "Reject" button (gray)

**Expected Result:**
✅ Pending request visible with user info and action buttons

---

## Test Scenario 3: Accept Connection Request

### Setup

- From Test Scenario 2, viewing User 1's pending request

### Test

1. [ ] Click **"Accept"** button
2. [ ] Toast shows "Connection accepted successfully!"
3. [ ] Page reloads or refreshes
4. [ ] Request should disappear from "Pending Requests" tab
5. [ ] Click **"My Connections"** tab
6. [ ] User 1 should appear in your connections grid
7. [ ] Click on the connection
8. [ ] Verify you're on User 1's profile

**Expected Result:**
✅ Connection accepted, both users can see each other in "My Connections"

---

## Test Scenario 4: Verify Bidirectional Connection

### Setup

- From Test Scenario 3, User 1 and User 2 are connected

### Test

1. [ ] Log in as User 1
2. [ ] Go to **Connections** → **"My Connections"** tab
3. [ ] User 2 should be visible
4. [ ] Click on User 2's profile
5. [ ] Button should show **"Remove Connection"** (red)
6. [ ] Go back to **Connections**
7. [ ] User 2 should still be in "My Connections"

**Expected Result:**
✅ Both users see each other as connected

---

## Test Scenario 5: Remove Connection

### Setup

- User 1 and User 2 are connected

### Test

1. [ ] Log in as User 1
2. [ ] Go to **Connections** → **"My Connections"**
3. [ ] Find User 2
4. [ ] Click **"Remove Connection"** button
5. [ ] Confirm the dialog (click OK)
6. [ ] Toast shows "Connection removed"
7. [ ] User 2 disappears from "My Connections"
8. [ ] Verify: Log in as User 2
9. [ ] Go to **Connections** → **"My Connections"**
10. [ ] User 1 should be gone

**Expected Result:**
✅ Connection removed for both users

---

## Test Scenario 6: Cancel Sent Request

### Setup

1. Log in as User 1
2. Send a connection request to a different user (User 3)
3. Should see "Pending - Cancel Request" button

### Test

1. [ ] Go to **Connections** → **"Sent Requests"** tab
2. [ ] User 3 should be visible with a "Cancel Request" button
3. [ ] Click **"Cancel Request"**
4. [ ] Toast shows "Connection request cancelled"
5. [ ] User 3 disappears from "Sent Requests"
6. [ ] Go to User 3's profile
7. [ ] Button should show "Send Connection Request" again

**Expected Result:**
✅ Sent request cancelled successfully

---

## Test Scenario 7: Reject Request

### Setup

1. User 1 sends request to User 2
2. Log in as User 2

### Test

1. [ ] Go to **Connections** → **"Pending Requests"**
2. [ ] See User 1's request
3. [ ] Click **"Reject"** button
4. [ ] Toast shows "Connection request rejected"
5. [ ] Request disappears from "Pending Requests"
6. [ ] Go to User 1's profile
7. [ ] Button should show "Send Connection Request" again (not pending)

**Expected Result:**
✅ Request rejected, no connection created

---

## Test Scenario 8: Navigate to Connection Profiles

### Setup

- Users are connected

### Test

1. [ ] Go to **Connections** → **"My Connections"**
2. [ ] Click on a connection
3. [ ] Should navigate to their profile page
4. [ ] Profile shows:
   - [ ] Their profile picture
   - [ ] Their name, email, college, branch
   - [ ] Their bio
   - [ ] Their skills (as tags)
   - [ ] Connection count
   - [ ] Followers/Following counts
   - [ ] GitHub and LinkedIn links
   - [ ] "Remove Connection" button

**Expected Result:**
✅ Profile page loads correctly with all info

---

## Test Scenario 9: Edge Cases

### Test 9a: Can't Request Yourself

1. [ ] Go to your own profile (/profile to edit)
2. [ ] No connection button should appear (hidden)
3. [ ] Go to `/profile/[yourID]`
4. [ ] Should still not show button

**Expected Result:**
✅ Connection button hidden for own profile

---

### Test 9b: Can't Duplicate Requests

1. [ ] User 1 sends request to User 2 (pending)
2. [ ] Try to send another request to User 2
3. [ ] Should show error: "Connection request already exists" or similar

**Expected Result:**
✅ Duplicate request prevented

---

### Test 9c: Mutual Request Handling

1. [ ] User 1 sends request to User 2
2. [ ] Log in as User 2
3. [ ] Try to send request to User 1
4. [ ] Should show error: "This user has already sent you a request. Accept it instead!"

**Expected Result:**
✅ Mutual requests intelligently handled

---

## Test Scenario 10: Pending Count Badge

### Setup

- Multiple pending requests

### Test

1. [ ] Log in as User with pending requests
2. [ ] Look at navigation bar
3. [ ] "Connections" link should show red badge with count
4. [ ] Example: Connections **3** (red badge)
5. [ ] Accept/reject a request
6. [ ] Badge count should update
7. [ ] When all accepted/rejected, badge disappears

**Expected Result:**
✅ Badge updates in real-time with pending count

---

## Browser Console Checks

After each test scenario, verify:

1. [ ] No JavaScript errors in console
2. [ ] Network requests show 200 status
3. [ ] LocalStorage has token and user info
4. [ ] No 500 errors in backend terminal

---

## API Testing (Optional - Using Postman/curl)

### Send Request

```bash
curl -X POST http://localhost:5000/api/connections/request/[USER_B_ID] \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Content-Type: application/json"
```

**Expected:** 201 Created with request object

### Get Pending Requests

```bash
curl http://localhost:5000/api/connections/pending \
  -H "Authorization: Bearer [TOKEN]"
```

**Expected:** 200 OK with requests array

### Check Connection Status

```bash
curl http://localhost:5000/api/connections/[USER_ID]/status \
  -H "Authorization: Bearer [TOKEN]"
```

**Expected:** 200 OK with status field

---

## Checklist Summary

### Functionality Tests

- [ ] Send connection request
- [ ] View pending requests
- [ ] Accept connection request
- [ ] Verify bidirectional connection
- [ ] Remove connection
- [ ] Cancel sent request
- [ ] Reject request
- [ ] Navigate to profiles
- [ ] Can't request yourself
- [ ] Can't duplicate requests
- [ ] Mutual request handling
- [ ] Badge updates count

### UI/UX Tests

- [ ] Buttons show correct states
- [ ] Colors match design (blue/orange/red)
- [ ] Toast notifications appear
- [ ] Grid layout responsive
- [ ] Profile cards look good
- [ ] Navigation links work
- [ ] Loading states appear

### Data Tests

- [ ] Requests stored in DB
- [ ] Connections array updated
- [ ] No duplicate requests
- [ ] Both users see connection
- [ ] Removal works both ways

---

## Success Criteria

✅ **PASS** if:

- All 10 scenarios work without errors
- No console errors
- UI matches expectations
- Data persists correctly
- Bidirectional connections work

❌ **FAIL** if:

- Any error messages appear
- Button states don't change
- Connections don't sync both ways
- API returns status != 200/201

---

## Troubleshooting

| Issue                 | Solution                                 |
| --------------------- | ---------------------------------------- |
| Button doesn't change | Refresh page, check browser console      |
| Connection not synced | Log in as other user, refresh page       |
| Can't see profile     | Check user ID is correct in URL          |
| Badge not showing     | Check authenticated user has requests    |
| API errors            | Check backend console for error messages |

---

**Test Date:** ****\_\_****
**Tested By:** ****\_\_****
**Status:** ✅ PASS / ❌ FAIL
**Notes:** ************************\_\_\_\_************************

---

**Last Updated**: March 12, 2026
**Version**: 1.0
