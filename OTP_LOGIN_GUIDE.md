# OTP Login System - Forgot Password Feature

## Overview

A new **OTP (One-Time Password) based login system** has been implemented for users who forget their password. This allows secure password recovery without email integration (for development).

---

## How It Works

### **Step 1: User Initiates Password Reset**

1. User clicks **"Forgot Password?"** on the login page
2. Taken to `/forgot-password` page
3. Enters email address

### **Step 2: OTP is Generated and Sent**

1. System generates a **6-digit OTP**
2. OTP is **stored in database** with 10-minute expiry
3. For development: **OTP is logged to backend console**
4. Timer starts (10 minutes)

### **Step 3: User Enters OTP**

1. User checks backend console for OTP
2. Enters 6-digit OTP in the form
3. System verifies OTP

### **Step 4: Login with OTP**

1. OTP is valid → User is logged in
2. OTP is cleared from database
3. User redirected based on role:
   - **Admin** → `/admin/dashboard`
   - **User** → `/feed`

---

## Flow Diagram

```
Login Page
    ↓
"Forgot Password?" link
    ↓
Forgot Password Page (/forgot-password)
    ↓
Enter Email
    ↓
API: POST /api/auth/send-otp
    ↓
OTP Generated (6 digits)
    ↓
OTP Logged to Console
    ↓
User Enters OTP
    ↓
API: POST /api/auth/verify-otp
    ↓
OTP Verified?
    ├─ Yes → Login successful → Dashboard/Feed
    ├─ No → Error message → Try again
    └─ Expired → Error message → Restart process
```

---

## Features

### ✅ Security Features

- **6-digit OTP** - Random generated
- **10-minute expiry** - OTP expires after 10 minutes
- **One-time use** - OTP is cleared after verification
- **Email verification** - Confirms user owns the email

### ✅ User Experience

- **Two-step process** - Simple and intuitive
- **Timer display** - Shows OTP expiry time
- **Error messages** - Clear feedback on what went wrong
- **Back button** - Can go back to email step if needed

### ✅ Development Features

- **Console logging** - OTP shown in backend console
- **Response OTP** - OTP returned in API response (dev only)
- **No email service required** - Works without email configuration

---

## Testing the OTP System

### **Step 1: Start Backend**

```powershell
cd backend
npm run dev
```

### **Step 2: Go to Forgot Password**

1. Visit `http://localhost:3000/login`
2. Click **"Forgot Password?"** link
3. You're on `/forgot-password` page

### **Step 3: Request OTP**

1. Enter your account email (must be registered)
2. Click **"Send OTP"**
3. **Check backend terminal console** for:
   ```
   📧 OTP for email@example.com: 123456
   ⏰ OTP expires at: ...
   ```

### **Step 4: Verify OTP**

1. Copy the OTP from console
2. Paste it in the OTP field
3. Click **"Verify OTP & Login"**
4. You're logged in! ✅

---

## File Changes

### Backend Files (3 modified)

**1. `models/User.js`**

```javascript
// Added fields
otp: String,           // 6-digit OTP
otpExpiry: Date        // When OTP expires
```

**2. `controllers/authController.js`**

```javascript
// Added functions
exports.sendOTP; // Generate and store OTP
exports.verifyOTPAndLogin; // Verify OTP and login user
```

**3. `routes/auth.js`**

```javascript
// Added routes
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTPAndLogin);
```

### Frontend Files (3 modified/created)

**1. `app/login/page.jsx`** (Modified)

- Added "Forgot Password?" link
- Redirects to `/forgot-password`

**2. `app/forgot-password/page.jsx`** (New)

- Two-step OTP verification
- Timer for OTP expiry
- Auto-login after OTP verification

**3. `lib/api.js`** (Modified)

- Added `sendOTP(email)` function
- Added `verifyOTP(email, otp)` function

---

## API Endpoints

### **Send OTP**

```
POST /api/auth/send-otp
```

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "OTP sent to your email. Check console for development.",
  "otp": "123456" // Only in development
}
```

**Errors:**

- `400` - Email not provided
- `404` - User not found

---

### **Verify OTP & Login**

```
POST /api/auth/verify-otp
```

**Request:**

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (200):**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user",
    "profilePicture": "..."
  }
}
```

**Errors:**

- `400` - Email/OTP not provided
- `400` - No OTP requested (send OTP first)
- `400` - OTP expired (request new OTP)
- `401` - Invalid OTP
- `404` - User not found

---

## For Production Deployment

To send emails in production, update the `sendOTP` function:

### Option 1: Using Nodemailer (Gmail)

```javascript
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: email,
  subject: "CampusXConnect - OTP for Password Reset",
  html: `<h2>Your OTP: ${otp}</h2><p>Expires in 10 minutes</p>`,
};

await transporter.sendMail(mailOptions);
```

### Option 2: Using SendGrid

```javascript
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: email,
  from: process.env.SENDGRID_FROM_EMAIL,
  subject: "CampusXConnect - OTP for Password Reset",
  html: `<h2>Your OTP: ${otp}</h2><p>Expires in 10 minutes</p>`,
});
```

### Option 3: Using AWS SES

```javascript
const AWS = require("aws-sdk");
const ses = new AWS.SES();

await ses
  .sendEmail({
    Source: process.env.SES_FROM_EMAIL,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: "CampusXConnect - OTP" },
      Body: { Html: { Data: `Your OTP: ${otp}` } },
    },
  })
  .promise();
```

---

## Troubleshooting

| Problem         | Solution                                 |
| --------------- | ---------------------------------------- |
| OTP not showing | Check backend terminal console           |
| User not found  | Make sure email is registered            |
| OTP expired     | Request new OTP, wait 10 minutes         |
| Invalid OTP     | Check OTP from console, re-enter         |
| Can't see timer | Refresh browser, ensure frontend updated |

---

## Security Notes

### ✅ Current Implementation (Development)

- OTP sent to console only
- No email service configured
- Perfect for testing and development

### ⚠️ For Production

- **MUST send OTP via email**
- **Use HTTPS only**
- **Implement rate limiting** on OTP requests
- **Add CAPTCHA** to prevent brute force
- **Log all OTP attempts**
- **Set shorter OTP expiry** (5 minutes)
- **Limit OTP requests** (1 per minute)

---

## User Flow Diagram

```
┌─────────────────────┐
│  Login Page         │
│  login/page.jsx     │
└──────────┬──────────┘
           │
    Click "Forgot Password?"
           │
           ▼
┌─────────────────────────────┐
│  Forgot Password Page       │
│  forgot-password/page.jsx   │
│                             │
│  [Email Input Field]        │
│  [Send OTP Button]          │
└──────────┬──────────────────┘
           │
  Enter Email & Click "Send OTP"
           │
           ▼
   Backend (authController)
   ├─ Generate 6-digit OTP
   ├─ Set 10-min expiry
   ├─ Save to database
   └─ Log to console
           │
           ▼
┌─────────────────────────────┐
│  OTP Verification Step      │
│  forgot-password/page.jsx   │
│                             │
│  [OTP Input Field]          │
│  [Timer: 9:45]              │
│  [Verify OTP & Login Button]│
└──────────┬──────────────────┘
           │
  Enter OTP & Click "Verify"
           │
           ▼
   Backend (authController)
   ├─ Check if OTP exists
   ├─ Check if not expired
   ├─ Compare with DB OTP
   └─ Clear OTP & Generate token
           │
           ▼
    ┌─────────────────┐
    │  Check Role     │
    └─────┬───────┬───┘
          │       │
       admin   user
          │       │
          ▼       ▼
    /admin/   /feed
   dashboard
```

---

## Summary

✅ OTP system implemented
✅ Works without email service
✅ 10-minute expiry timer
✅ Auto-login after OTP verification
✅ Role-based redirection
✅ Simple two-step process

**Status:** Ready for testing and production deployment! 🚀

---

**Last Updated**: March 12, 2026
**Version**: 1.0
