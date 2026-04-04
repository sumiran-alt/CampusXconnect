# Suggestions Feature - Test Execution Checklist

## Quick Start Guide

### What to Do NOW ✅

1. **Ensure Servers Are Running**
   ```
   Backend:  npm start (in /backend directory, port 5000)
   Frontend: npm run dev (in /frontend directory, port 3000)
   Database: MongoDB running and connected
   ```

2. **Verify All Files Exist**
   - [ ] `frontend/components/SuggestButton.jsx`
   - [ ] `frontend/components/SuggestionModal.jsx`
   - [ ] `frontend/components/SuggestionsSection.jsx`
   - [ ] `backend/models/Suggestion.js`
   - [ ] `backend/controllers/suggestionController.js`
   - [ ] `backend/routes/suggestions.js`
   - [ ] `frontend/lib/api.js` (with suggestionAPI methods)
   - [ ] `frontend/app/profile/[id]/page.jsx` (with imports)

3. **Check Browser for Errors**
   - [ ] Open Developer Tools (F12)
   - [ ] Go to Console tab
   - [ ] Verify NO red error messages
   - [ ] Go to Network tab (ready to watch API calls)

---

## Testing Execution Plan

### Phase 1: Smoke Test (5 min) ✅

**Objective:** Verify basic functionality works

```
STEP 1: Navigate to another user's profile
[ ] 1a. Log in to your account
[ ] 1b. Find another test user
[ ] 1c. Click on their profile

EXPECTED RESULT:
- User profile loads
- You see buttons: Connect, Follow, SUGGEST, Message
- Suggest button is visible

STEP 2: Click Suggest button
[ ] 2a. Click "Suggest" button
[ ] 2b. Wait for modal to appear

EXPECTED RESULT:
- Modal opens with smooth animation
- Title: "Share a Suggestion"
- Textarea with placeholder text
- Category dropdown
- Character counter showing "0/500"
- Send button (might be disabled)
- Close (X) button in top right

STEP 3: Type in suggestion
[ ] 3a. Click textarea
[ ] 3b. Type: "Learn React for better frontend skills"

EXPECTED RESULT:
- Text appears in textarea
- Character counter updates to "42/500"
- Send button enables

STEP 4: Select category
[ ] 4a. Click category dropdown
[ ] 4b. Select "Skill Improvement"

EXPECTED RESULT:
- Dropdown shows 5 options
- Selected category displays in input area

STEP 5: Send suggestion
[ ] 5a. Click "Send Suggestion" button
[ ] 5b. Watch for spinner/loading state

EXPECTED RESULT:
- Loading spinner appears
- API call shows in Network tab → POST /suggestions/send
- Response status: 201
- Toast message: "Suggestion sent successfully!" (green)
- Modal closes automatically
- No console errors

RESULT: ✅ PASS or ❌ FAIL
NOTES: _______________________________________________________________
```

---

### Phase 2: Receiver Verification (5 min) ✅

**Objective:** Verify receiver sees the suggestion

```
STEP 1: Log in as the receiver
[ ] 1a. Open new browser window or new tab (in private/incognito)
[ ] 1b. Log in as the user who received the suggestion

STEP 2: Go to own profile
[ ] 2a. Click "My Profile" or navigate to your profile
[ ] 2b. Scroll down below "Posts" section

EXPECTED RESULT:
- New section appears: "Suggestions (1 new)"
- Shows suggestion card with:
  * Sender's name (clickable link)
  * Sender's profile picture
  * Time: "Just now" or similar
  * Category badge: "Skill Improvement" (blue color)
  * Suggestion text you just sent
  * Blue underline at bottom (unread indicator)
  * Action buttons: "✓ Mark as read" and "🗑️ Delete"

STEP 3: Click sender's name
[ ] 3a. Click on sender's name link

EXPECTED RESULT:
- Navigates to sender's profile
- Go back to your profile

RESULT: ✅ PASS or ❌ FAIL
NOTES: _______________________________________________________________
```

---

### Phase 3: Mark as Read (3 min) ✅

**Objective:** Verify read functionality works

```
STEP 1: Still on your own profile with suggestion visible
[ ] 1a. Find the suggestion card
[ ] 1b. Click "✓ Mark as read" button

EXPECTED RESULT:
- Loading spinner briefly shows
- Toast message: "Marked as read"
- Blue underline disappears
- Card background changes from blue-50 to gray-50
- "Mark as read" button disappears
- "Unread count" changes from "1 new" to "0 new"

STEP 2: Refresh page (F5)
[ ] 2a. Press F5 to reload page

EXPECTED RESULT:
- Page reloads
- Suggestion still shows (not deleted)
- Blue underline is GONE (stays marked as read)
- Confirm changes persisted

RESULT: ✅ PASS or ❌ FAIL
NOTES: _______________________________________________________________
```

---

### Phase 4: Delete Suggestion (3 min) ✅

**Objective:** Verify deletion works

```
STEP 1: Still on your own profile
[ ] 1a. Find the suggestion card
[ ] 1b. Click "🗑️ Delete" button

EXPECTED RESULT:
- Toast message: "Suggestion deleted"
- Suggestion card immediately disappears
- If no other suggestions, shows: "No suggestions yet. Keep an eye out! 👀"

STEP 2: Refresh page (F5)
[ ] 2a. Press F5 to reload page

EXPECTED RESULT:
- Suggestions section still empty
- Deletion is persisted to database

RESULT: ✅ PASS or ❌ FAIL
NOTES: _______________________________________________________________
```

---

### Phase 5: Validation Testing (5 min) ✅

**Objective:** Verify input validation works

```
STEP 1: Open suggest modal on another user's profile
[ ] 1a. Navigate to different user's profile
[ ] 1b. Click "Suggest" button

STEP 2: Test minimum character validation
[ ] 2a. Type "hello" (5 characters)
[ ] 2b. Check character counter (should show "5/500")
[ ] 2c. Try to click "Send Suggestion"

EXPECTED RESULT:
- Submit button is disabled OR
- Toast error: "Suggestion must be at least 10 characters"
- No API call made

STEP 3: Test maximum characters
[ ] 3a. Delete and copy-paste 505 characters
[ ] 3b. Try to add more characters

EXPECTED RESULT:
- Textarea stops accepting input at 500
- Character counter shows "500/500"
- Cannot type beyond 500

STEP 4: Test valid length
[ ] 4a. Type exactly 10-500 characters valid suggestion
[ ] 4b. Select a category
[ ] 4c. Click "Send Suggestion"

EXPECTED RESULT:
- Sends successfully (same as Phase 1)
- Receiver sees it in their profile

RESULT: ✅ PASS or ❌ FAIL
NOTES: _______________________________________________________________
```

---

### Phase 6: Category Testing (3 min) ✅

**Objective:** Verify all 5 categories work

```
STEP 1: Open suggest modal
[ ] 1a. Go to another user's profile
[ ] 1b. Click "Suggest"

STEP 2: Test each category
Repeat 5 times with different categories:

[ ] ATTEMPT 1: Send with "Skill Improvement"
    [ ] Select category dropdown
    [ ] Click "Skill Improvement"
    [ ] Enter suggestion: "Learn TypeScript"
    [ ] Click Send
    [ ] EXPECTED: Toast success, receiver sees BLUE badge

[ ] ATTEMPT 2: Send with "Project Idea"
    [ ] Send suggestion
    [ ] EXPECTED: receiver sees GREEN badge

[ ] ATTEMPT 3: Send with "Career Advice"
    [ ] Send suggestion
    [ ] EXPECTED: receiver sees PURPLE badge

[ ] ATTEMPT 4: Send with "Collaboration"
    [ ] Send suggestion
    [ ] EXPECTED: receiver sees ORANGE badge

[ ] ATTEMPT 5: Send with "Other"
    [ ] Send suggestion
    [ ] EXPECTED: receiver sees GRAY badge

RESULT: ✅ PASS or ❌ FAIL (all categories)
NOTES: _______________________________________________________________
```

---

### Phase 7: Self-Profile Protection (2 min) ✅

**Objective:** Verify users can't suggest to themselves

```
STEP 1: Navigate to OWN profile
[ ] 1a. Click "My Profile" or your name
[ ] 1b. You should NOT see a "Suggest" button

EXPECTED RESULT:
- Only "Edit Profile" button visible
- NO "Suggest" button

STEP 2: Check that suggestions section exists on own profile
[ ] 2a. Scroll down below Posts

EXPECTED RESULT:
- "Suggestions" section visible
- Shows suggestions FROM others
- No way to send suggestions to yourself

RESULT: ✅ PASS or ❌ FAIL
NOTES: _______________________________________________________________
```

---

### Phase 8: Multiple Suggestions (5 min) ✅

**Objective:** Verify handling of multiple suggestions

```
STEP 1: Send 3 suggestions to same receiver
[ ] 1a. From User A, send suggestion to User B
[ ] 1b. Wait for toast success
[ ] 1c. Repeat 2 more times with different text/categories

Suggestions to send:
1. "You should learn Rust" (Skill Improvement)
2. "Let's build a tech startup together" (Collaboration)  
3. "Check out this online course" (Career Advice)

STEP 2: Check receiver's profile
[ ] 2a. Log in as User B
[ ] 2b. Go to own profile
[ ] 2c. Scroll to Suggestions section

EXPECTED RESULT:
- All 3 suggestions visible
- Newest first (reverse chronological)
- Heading shows "Suggestions (3 new)"
- Each has correct sender info
- Each has correct category badge
- Each has correct text

STEP 3: Actions with multiple
[ ] 3a. Mark as read on first 2
[ ] 3b. Delete the 3rd

EXPECTED RESULT:
- "(1 new)" shows in heading
- Third suggestion disappears
- Two marked ones still visible but no blue underline
- 2 unread count shown correctly

RESULT: ✅ PASS or ❌ FAIL
NOTES: _______________________________________________________________
```

---

### Phase 9: Mobile Responsiveness (3 min) ✅

**Objective:** Verify mobile layout works

```
STEP 1: Open in mobile view
[ ] 1a. Press F12 (DevTools)
[ ] 1b. Click device toggle (mobile icon)
[ ] 1c. Select "iPhone 12"

STEP 2: Test profile buttons
[ ] 2a. Navigate to another user's profile
[ ] 2b. Check if Suggest button is visible

EXPECTED RESULT:
- Buttons stack vertically
- Full width on mobile
- Text readable
- Touch-friendly sizes

STEP 3: Test suggestion modal
[ ] 3a. Click Suggest button
[ ] 3b. Modal opens and is readable

EXPECTED RESULT:
- Modal is responsive
- Textarea works on mobile
- Keyboard appears when tapping
- Can select category on mobile
- Can submit on mobile

STEP 4: Test suggestions display
[ ] 4a. Go to own profile
[ ] 4b. View suggestions section

EXPECTED RESULT:
- Cards display properly
- Images scale correctly
- Buttons are touch-friendly
- Readable on mobile screen

RESULT: ✅ PASS or ❌ FAIL
NOTES: _______________________________________________________________
```

---

### Phase 10: Error Handling (3 min) ✅

**Objective:** Verify graceful error handling

```
STEP 1: Simulate network error
[ ] 1a. Open DevTools Network tab
[ ] 1b. Click "Offline" checkbox
[ ] 1c. Open suggest modal
[ ] 1d. Try to send suggestion

EXPECTED RESULT:
- Toast error message appears
- No console errors
- Modal stays open for retry
- Graceful failure

STEP 2: Go back online  
[ ] 2a. Click "Offline" again to go online
[ ] 2b. Try sending again

EXPECTED RESULT:
- Works normally again

RESULT: ✅ PASS or ❌ FAIL
NOTES: _______________________________________________________________
```

---

## Final Verification Checklist

### Code Files Present ✅
- [ ] All 3 frontend components exist
- [ ] Backend files created properly
- [ ] API routes configured
- [ ] API service methods added
- [ ] Profile page imports added
- [ ] Components integrated into profile

### Functionality ✅
- [ ] SuggestButton visible on other profiles only
- [ ] Modal opens/closes properly
- [ ] Suggestion submits successfully
- [ ] Receiver sees suggestions in profile
- [ ] Suggestions display with correct info
- [ ] Mark as read works
- [ ] Delete works
- [ ] Validation works (min/max chars)
- [ ] All 5 categories work
- [ ] Mobile responsive
- [ ] Error handling graceful

### Database ✅
- [ ] MongoDB connected
- [ ] Suggestions inserted on send
- [ ] Suggestions retrieved on fetch
- [ ] isRead flag updates
- [ ] Suggestions deleted properly

### Console ✅
- [ ] No red error messages
- [ ] No unhandled promise rejections
- [ ] Debug logs appear when expected
- [ ] API calls show in Network tab

---

## Test Results Summary

| Phase | Test Name | Status | Notes |
|-------|-----------|--------|-------|
| 1 | Smoke Test | ✓ | Modal, send, success |
| 2 | Receiver Display | ✓ | Suggestions appear |
| 3 | Mark as Read | ✓ | Status changes |
| 4 | Delete | ✓ | Removes suggestion |
| 5 | Validation | ✓ | Min/max enforced |
| 6 | Categories | ✓ | All 5 work |
| 7 | Self-Protection | ✓ | Can't self-suggest |
| 8 | Multiple | ✓ | Handles multiple |
| 9 | Mobile | ✓ | Responsive |
| 10 | Error Handling | ✓ | Graceful failures |

**Overall Status:** ___________
**Total Tests Passed:** ___/10
**Ready for Deployment:** YES / NO

---

## Notes & Issues Found

```
Issue #1: 
Description: ___________________________________________________________
Resolution: ___________________________________________________________

Issue #2:
Description: ___________________________________________________________
Resolution: ___________________________________________________________

Issue #3:
Description: ___________________________________________________________
Resolution: ___________________________________________________________
```

---

## Sign-Off

**Tested By:** _________________________ **Date:** ______________

**Approved for Deploy:** YES / NO

**Final Notes:**
_________________________________________________________________________
_________________________________________________________________________
_________________________________________________________________________

---

**Feature Status:** ✅ Complete & Tested (or) ⚠️ Needs Fixes (or) ❌ Not Ready

*Use this checklist to verify all functionality before deploying to production.*
