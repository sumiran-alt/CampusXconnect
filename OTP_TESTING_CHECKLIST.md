# OTP Feature Testing Checklist

Complete this checklist to verify the OTP feature is working correctly.

---

## Prerequisites

- [ ] Backend running: `npm run dev` in `/backend` folder
- [ ] Frontend running: `npm run dev` in `/frontend` folder
- [ ] MongoDB Atlas connected and accessible
- [ ] Admin account created (test with: `Sumiransharmacse@gmail.com`)

---

## Test 1: OTP Request (Send OTP)

**Goal:** Verify that OTP is generated and stored correctly

### Steps:

1. [ ] Navigate to `http://localhost:3000/login`
2. [ ] Click **"Forgot Password?"** link
3. [ ] Verify page shows email input field
4. [ ] Verify page shows "Send OTP" button
5. [ ] Enter email: `Sumiransharmacse@gmail.com`
6. [ ] Click **"Send OTP"**
7. [ ] Check backend terminal for OTP output:
   ```
   📧 OTP for Sumiransharmacse@gmail.com: 123456
   ⏰ OTP expires at: ...
   ```

### Expected Results:

- [ ] Toast notification shows: "OTP sent successfully"
- [ ] Page transitions to Step 2 (OTP input)
- [ ] Timer starts at 10:00 (10 minutes)
- [ ] OTP is logged in backend console

### Issues Encountered:

```
[None yet]
```

---

## Test 2: OTP Verification (Verify OTP)

**Goal:** Verify that OTP verification works and user is logged in

### Steps:

1. [ ] Copy OTP from backend console (from Test 1)
2. [ ] Paste OTP into the 6-digit input field
3. [ ] Verify timer is still running (shows remaining time)
4. [ ] Click **"Verify OTP & Login"**

### Expected Results:

- [ ] Toast shows: "OTP verified! Logging in..."
- [ ] User is redirected to `/admin/dashboard` (admin role) or `/feed` (user role)
- [ ] User is logged in and authenticated
- [ ] JWT token is stored in localStorage
- [ ] Navigation bar shows role-appropriate menu

### Issues Encountered:

```
[None yet]
```

---

## Test 3: Invalid OTP

**Goal:** Verify rejection of incorrect OTP

### Steps:

1. [ ] Click "Forgot Password?" again
2. [ ] Enter email and click "Send OTP"
3. [ ] Check console for correct OTP
4. [ ] **Intentionally enter wrong OTP** (e.g., 000000)
5. [ ] Click "Verify OTP & Login"

### Expected Results:

- [ ] Toast shows: "Invalid OTP" or "OTP does not match"
- [ ] User remains on same page (not redirected)
- [ ] Timer continues running
- [ ] Can try again with correct OTP

### Issues Encountered:

```
[None yet]
```

---

## Test 4: OTP Expiry

**Goal:** Verify OTP expires after 10 minutes

### Steps:

1. [ ] Click "Forgot Password?"
2. [ ] Enter email and click "Send OTP"
3. [ ] **Wait for timer to reach 0:00** (or manually wait, or edit code to test with shorter expiry)
4. [ ] After expiry, try to verify any OTP

### Expected Results:

- [ ] Timer shows "Expired" or "0:00"
- [ ] "Verify OTP & Login" button is disabled
- [ ] Toast shows: "OTP has expired"
- [ ] User must request new OTP

### Issues Encountered:

```
[None yet]
```

---

## Test 5: Back Button (Go Back to Email)

**Goal:** Verify user can go back to Step 1 to change email

### Steps:

1. [ ] Click "Forgot Password?"
2. [ ] Enter email and click "Send OTP"
3. [ ] On Step 2 (OTP verification), click **"Back to Email"** button
4. [ ] Verify email input field is shown again

### Expected Results:

- [ ] Form resets to Step 1
- [ ] Email field is empty or shows previous email
- [ ] Timer is cleared
- [ ] Can enter different email and request new OTP

### Issues Encountered:

```
[None yet]
```

---

## Test 6: User Role Detection

**Goal:** Verify OTP login redirects based on role

### Test 6a: Admin Login via OTP

1. [ ] Request OTP for admin email: `Sumiransharmacse@gmail.com`
2. [ ] Verify OTP and login
3. [ ] Check redirect URL: Should be `/admin/dashboard`
4. [ ] Navigation shows admin menu (Dashboard, Logout)

### Test 6b: User Login via OTP

1. [ ] Create a user account (via `/signup`)
2. [ ] Request OTP for this user email
3. [ ] Verify OTP and login
4. [ ] Check redirect URL: Should be `/feed`
5. [ ] Navigation shows user menu (Feed, Coding, Leaderboard, Profile)

### Expected Results:

- [ ] Admins redirect to `/admin/dashboard`
- [ ] Users redirect to `/feed`
- [ ] Navigation reflects user role

### Issues Encountered:

```
[None yet]
```

---

## Test 7: Non-existent Email

**Goal:** Verify system handles non-registered emails correctly

### Steps:

1. [ ] Click "Forgot Password?"
2. [ ] Enter non-existent email: `nonexistent@example.com`
3. [ ] Click "Send OTP"

### Expected Results:

- [ ] Toast shows: "User not found" or similar error
- [ ] No OTP is sent
- [ ] Page stays on Step 1
- [ ] Error is handled gracefully

### Issues Encountered:

```
[None yet]
```

---

## Test 8: OTP Clear After Use

**Goal:** Verify OTP is cleared from database after successful login

### Steps:

1. [ ] Request OTP for `Sumiransharmacse@gmail.com`
2. [ ] Copy OTP from console
3. [ ] Verify OTP and login successfully
4. [ ] Check MongoDB directly:
   ```javascript
   // In MongoDB Atlas
   db.users.findOne({ email: "Sumiransharmacse@gmail.com" });
   // Check fields: otp and otpExpiry (should be null)
   ```

### Expected Results:

- [ ] Both `otp` and `otpExpiry` fields are `null`
- [ ] OTP cannot be reused (if you request new OTP, it generates different one)

### Issues Encountered:

```
[None yet]
```

---

## Test 9: Multiple OTP Requests

**Goal:** Verify that requesting new OTP replaces old one

### Steps:

1. [ ] Click "Forgot Password?"
2. [ ] Enter email and click "Send OTP"
3. [ ] Check console for **OTP #1**
4. [ ] Click "Back to Email"
5. [ ] Click "Send OTP" again (same email)
6. [ ] Check console for **OTP #2**
7. [ ] Verify **OTP #1 no longer works, only OTP #2 works**

### Expected Results:

- [ ] OTP #2 is different from OTP #1
- [ ] OTP #1 returns "Invalid OTP" error
- [ ] OTP #2 works correctly
- [ ] Only latest OTP is valid

### Issues Encountered:

```
[None yet]
```

---

## Test 10: Login Page (Regular Login Still Works)

**Goal:** Verify that regular email/password login still works

### Steps:

1. [ ] Go to `/login`
2. [ ] Enter credentials: `Sumiransharmacse@gmail.com` / `SamAltman@KPS132077`
3. [ ] Click "Login"

### Expected Results:

- [ ] Regular login works as before
- [ ] User is redirected to appropriate dashboard
- [ ] OTP feature doesn't interfere with regular login

### Issues Encountered:

```
[None yet]
```

---

## API Testing (Using Postman or curl)

### Test API Endpoint: Send OTP

```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"Sumiransharmacse@gmail.com"}'
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "OTP sent to your email",
  "otp": "123456"
}
```

- [ ] Status code is 200
- [ ] Response contains OTP
- [ ] Backend console shows OTP

### Test API Endpoint: Verify OTP

```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"Sumiransharmacse@gmail.com","otp":"123456"}'
```

**Expected Response (200):**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "...",
    "email": "Sumiransharmacse@gmail.com",
    "role": "admin"
  }
}
```

- [ ] Status code is 200
- [ ] Response contains JWT token
- [ ] User object includes role

---

## Browser Console Checks

1. [ ] No JavaScript errors in browser console
2. [ ] Network tab shows:
   - [ ] POST request to `/api/auth/send-otp` (200)
   - [ ] POST request to `/api/auth/verify-otp` (200)
3. [ ] LocalStorage contains:
   - [ ] `token: "..."` (JWT)
   - [ ] `user: "{...}"` (User object with role)

---

## Performance Checks

1. [ ] OTP request completes in < 1 second
2. [ ] OTP verification completes in < 1 second
3. [ ] Timer countdown runs smoothly (no lag)
4. [ ] Page transitions are smooth

---

## Summary

### Tests Passed: \_\_ / 10

### Overall Status:

- [ ] **All tests passed** ✅
- [ ] **Some tests failed** ⚠️
- [ ] **Major issues** ❌

### Issues Found:

```
[List any issues encountered]
```

### Notes:

```
[Additional notes or observations]
```

---

**Tested By:** ******\_\_\_\_******
**Date:** ******\_\_\_\_******
**Environment:** Local Development
**Backend Version:** Node.js (specified in package.json)
**Frontend Version:** Next.js 16.1.6
**Browser:** ******\_\_\_\_****** (specified browser used for testing)

---

## Next Steps After Testing

1. [ ] All tests pass locally
2. [ ] Deploy to staging environment
3. [ ] Test with email service configured
4. [ ] Test on production environment
5. [ ] Monitor OTP error logs
6. [ ] Gather user feedback

---

**Last Updated**: March 12, 2026
**Version**: 1.0
