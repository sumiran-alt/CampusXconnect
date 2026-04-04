# User Search - Quick Testing Guide

## Prerequisites

✅ Backend running: `npm run dev` in `/backend`
✅ Frontend running: `npm run dev` in `/frontend`
✅ MongoDB Atlas connected
✅ Multiple test users created with different data

---

## Test Data Setup

Before testing, create at least 3-4 users with diverse data:

### User 1

- Name: John Doe
- Email: john@example.com
- Year: 4
- Branch: CSE
- Roll Number: 12345
- Company: Google

### User 2

- Name: Jane Smith
- Email: jane@example.com
- Year: 3
- Branch: ECE
- Roll Number: 54321
- Company: Microsoft

### User 3

- Name: John Smith
- Email: jsmith@example.com
- Year: 2
- Branch: IT
- Roll Number: 67890
- Company: Google

### User 4

- Name: Bob Johnson
- Email: bob@example.com
- Year: 1
- Branch: ME
- Roll Number: 11111
- Company: (empty)

---

## Quick Search Tests

### Test 1: Search by Name (Exact)

1. [ ] Click "🔍 Search" in navigation
2. [ ] Enter: `John Doe`
3. [ ] Click Search
4. **Expected:** Shows "John Doe" user card

**Success Criteria:**
✅ Results show matching user
✅ Profile picture displays
✅ Name, email, college visible
✅ View Profile and Connect buttons show

---

### Test 2: Search by Name (Partial)

1. [ ] Enter: `john`
2. [ ] Click Search
3. **Expected:** Shows "John Doe", "John Smith", "Bob Johnson"

**Success Criteria:**
✅ All users with "john" in name appear
✅ Case-insensitive search works
✅ Results sorted by relevance

---

### Test 3: Search by Year + Name

1. [ ] Enter: `4-John`
2. [ ] Click Search
3. **Expected:** Shows only "John Doe" (4th year)

**Success Criteria:**
✅ Only 4th year Johns shown
✅ "John Smith" (2nd year) not shown
✅ Year filtering works correctly

---

### Test 4: Search by Year + Name (Reversed)

1. [ ] Enter: `John-4`
2. [ ] Click Search
3. **Expected:** Same as Test 3 - Show "John Doe"

**Success Criteria:**
✅ Works in both directions
✅ Reversed format recognized

---

### Test 5: Search by Company + Name

1. [ ] Enter: `Google-John`
2. [ ] Click Search
3. **Expected:** Shows "John Doe" and "John Smith" (both at Google)

**Success Criteria:**
✅ Company filter works
✅ Only Google employees named John shown
✅ "Jane Smith" (Microsoft) not shown

---

### Test 6: Search by Roll Number + Name

1. [ ] Enter: `12345-John`
2. [ ] Click Search
3. **Expected:** Shows "John Doe" (roll 12345)

**Success Criteria:**
✅ Roll number matching works
✅ Exact roll number found
✅ Correct user returned

---

### Test 7: Search that Returns No Results

1. [ ] Enter: `XYZUnknownPerson123`
2. [ ] Click Search
3. **Expected:** "No users found" message

**Success Criteria:**
✅ Error handling works
✅ Clear "no results" message shown
✅ Suggestions to refine search

---

## Advanced Search Tests

### Test 8: Advanced Search - Single Filter

1. [ ] Click "Advanced Search" tab
2. [ ] Name field: `john`
3. [ ] Leave other fields empty
4. [ ] Click Search
5. **Expected:** Shows all Johns

**Success Criteria:**
✅ Advanced search works
✅ Single field filtering works
✅ Results match simple search

---

### Test 9: Advanced Search - Multiple Filters

1. [ ] Name: `john`
2. [ ] Batch: `4`
3. [ ] Branch: `CSE`
4. [ ] Company: `Google`
5. [ ] Click Search
6. **Expected:** Shows "John Doe" (only match)

**Success Criteria:**
✅ Multiple filters applied
✅ Only user matching ALL filters shown
✅ Correct complex filtering

---

### Test 10: Advanced Search - Clear Filters

1. [ ] Fill some filters
2. [ ] Click "Clear Filters" button
3. **Expected:** All fields become empty

**Success Criteria:**
✅ Clear button clears all filters
✅ Form resets properly

---

## Browse All Users Test

### Test 11: Browse All Users

1. [ ] Go to `/search` (without searching)
2. [ ] Page should load with all users
3. [ ] Pagination controls visible
4. **Expected:** Shows 20 users per page

**Success Criteria:**
✅ Default shows all users
✅ Pagination visible
✅ User count shown
✅ Next/Previous buttons work

---

### Test 12: Pagination

1. [ ] From browse view, click "Next" button
2. [ ] Should load page 2
3. [ ] Click "Previous" button
4. [ ] Should return to page 1

**Success Criteria:**
✅ Next button works
✅ Previous button works
✅ Page indicator updates
✅ User list changes

---

## Result Card Tests

### Test 13: View Profile from Results

1. [ ] Search for any user
2. [ ] Click "View Profile" button on card
3. **Expected:** Navigate to user's profile page

**Success Criteria:**
✅ Link works
✅ Profile page loads
✅ Profile has Edit button (if own)
✅ Profile has Connect button (if not own)

---

### Test 14: Connect from Results

1. [ ] Search for a user
2. [ ] Click "Send Connection Request" button
3. **Expected:** Button changes to "Pending - Cancel Request"

**Success Criteria:**
✅ Connection request sent
✅ Button state changes
✅ Toast notification appears
✅ Request stored in database

---

### Test 15: View User Profile Info on Card

1. [ ] Search for "John Doe"
2. [ ] On result card, verify visible:
   - [ ] Profile picture
   - [ ] Name (bold)
   - [ ] Email
   - [ ] Bio (if present)
   - [ ] Year 4 & CSE
   - [ ] Roll: 12345
   - [ ] Company: Google
   - [ ] College name
   - [ ] Skills (if any, up to 3)

**Success Criteria:**
✅ All information displays correctly
✅ Formatting looks good
✅ Truncation works for long text
✅ Icons display (if showing)

---

## Edge Case Tests

### Test 16: Search with Special Characters

1. [ ] Enter: `john@`
2. [ ] Click Search
3. **Expected:** Handles gracefully

**Success Criteria:**
✅ No errors
✅ Appropriate results or no results
✅ No crashes

---

### Test 17: Search with Very Long Query

1. [ ] Enter very long random text
2. [ ] Click Search
3. **Expected:** No results or graceful handling

**Success Criteria:**
✅ No server error
✅ Timeout handled
✅ User-friendly error message

---

### Test 18: Rapid Successive Searches

1. [ ] Search for different queries quickly
2. [ ] Don't wait for previous to complete
3. **Expected:** Latest search results shown

**Success Criteria:**
✅ No errors
✅ Results not mixed up
✅ Loading state managed

---

## Navigation Tests

### Test 19: Search Link in Nav

1. [ ] Check navigation bar
2. [ ] Look for "🔍 Search" link
3. **Expected:** Link is present and visible

**Success Criteria:**
✅ Link visible for authenticated users
✅ Link visible for admins
✅ Link functional

---

### Test 20: Search From Different Pages

1. [ ] Go to Feed, Profile, Connections pages
2. [ ] Click Search link from each
3. [ ] Should navigate to `/search`

**Success Criteria:**
✅ Works from all pages
✅ Search page loads correctly
✅ No broken navigation

---

## Browser Console Tests

After completing tests, verify:

1. [ ] No JavaScript errors in console
2. [ ] No 500 errors in network tab
3. [ ] All API requests return 200 status
4. [ ] Results load within 2 seconds

---

## Mobile Responsive Tests

### Test 21: Mobile Layout

1. [ ] Resize browser to 375px width (mobile)
2. [ ] Verify:
   - [ ] Search form fits on screen
   - [ ] User cards stack vertically
   - [ ] Buttons are tappable (min 44px)
   - [ ] No horizontal scrolling

**Success Criteria:**
✅ Mobile layout responsive
✅ Touch-friendly
✅ All features accessible

---

## API Testing (Optional)

### Test 22: API - Simple Search

```bash
curl "http://localhost:5000/api/search/search?query=john"
```

**Expected:** Returns array of results

---

### Test 23: API - Advanced Search

```bash
curl "http://localhost:5000/api/search/advanced?name=john&batch=4&branch=CSE"
```

**Expected:** Returns filtered results

---

### Test 24: API - Get All Users

```bash
curl "http://localhost:5000/api/search/all?page=1"
```

**Expected:** Returns paginated users with metadata

---

## Checklist Summary

### Functionality

- [ ] Simple name search works
- [ ] Year + name search works
- [ ] Company + name search works
- [ ] Roll number + name search works
- [ ] Both dash directions work (A-B and B-A)
- [ ] Advanced search filters work
- [ ] Multiple advanced filters work together
- [ ] Clear filters button works
- [ ] Browse all users works
- [ ] Pagination works

### UI/UX

- [ ] Search page loads quickly
- [ ] Results display in card format
- [ ] All user info visible on cards
- [ ] View Profile button works
- [ ] Connect button works
- [ ] No results message clear
- [ ] Loading spinner appears
- [ ] Format help examples visible
- [ ] Navigation link visible

### Data

- [ ] Results accurate
- [ ] Multiple results shown for broad search
- [ ] Single result shown for specific search
- [ ] Year filtering correct
- [ ] Company filtering correct
- [ ] Roll number filtering correct
- [ ] Results sorted by relevance
- [ ] Limited to 50 results per search
- [ ] Results exclude password field

### Edge Cases

- [ ] Empty search handled
- [ ] Special characters handled
- [ ] Rapid searches handled
- [ ] Very long queries handled
- [ ] Non-existent data returns empty
- [ ] Pagination limits work
- [ ] Previous/Next buttons correct

### Performance

- [ ] Results load < 2 seconds
- [ ] No lag on pagination
- [ ] Smooth transitions
- [ ] No UI freezing
- [ ] Mobile performance good

---

## Success Criteria

✅ **PASS** if:

- All 24 tests pass
- No console errors
- All API calls return 200
- Results accurate and relevant
- UI responsive and intuitive
- Performance acceptable

❌ **FAIL** if:

- Any test fails
- Console shows errors
- Results inaccurate
- Buttons don't work
- Page crashes or hangs

---

## Test Results Summary

**Test Date:** ****\_\_****
**Tested By:** ****\_\_****
**Environment:** Local / Staging / Production
**Browser:** ****\_\_****
**Device:** Desktop / Mobile / Tablet

**Total Tests:** 24
**Passed:** \_**\_ / 24
**Failed:** \_\_** / 24
**Skipped:** \_\_\_\_ / 24

**Overall Status:** ✅ PASS / ❌ FAIL / ⚠️ PARTIAL

**Issues Found:**

```
1. ____________________________
2. ____________________________
3. ____________________________
```

**Notes:**

```
_________________________________
_________________________________
```

---

**Last Updated**: March 12, 2026
**Version**: 1.0
