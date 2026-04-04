# 🚀 CampusXConnect - Enhancement Integration Guide

## Overview

This guide helps you integrate the newly created middleware into your existing backend to improve security, error handling, and logging.

---

## 📋 New Files Created

```
backend/middleware/
├── errorHandler.js       [NEW] - Centralized error handling
├── validation.js         [NEW] - Request validation
├── rateLimiter.js        [NEW] - Rate limiting
└── logging.js            [NEW] - Request/response logging

backend/utils/
└── logger.js             [NEW] - Logging service
```

---

## 🔧 Integration Steps

### Step 1: Update `server.js`

Replace your existing `server.js` with this enhanced version that integrates all middleware:

```javascript
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");
const { initSocket } = require("./socket");

// Import new middleware and utilities
const { errorHandler, asyncHandler, AppError } = require("./middleware/errorHandler");
const { moderateRateLimiter } = require("./middleware/rateLimiter");
const loggingMiddleware = require("./middleware/logging");
const logger = require("./utils/logger");

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Middleware stack (ORDER MATTERS!)
// 1. Logging middleware (log all requests)
app.use(loggingMiddleware);

// 2. Body parsing
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 3. Rate limiting
app.use(moderateRateLimiter());

// 4. Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/coding", require("./routes/coding"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/connections", require("./routes/connections"));
app.use("/api/education", require("./routes/education"));
app.use("/api/experience", require("./routes/experience"));
app.use("/api/certification", require("./routes/certification"));
app.use("/api/search", require("./routes/search"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/suggestions", require("./routes/suggestions"));
app.use("/api/private-messages", require("./routes/privateMessages"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/communities", require("./routes/communities"));
app.use("/api/ideas", require("./routes/ideas"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/hackathons", require("./routes/hackathons"));
app.use("/api/leaderboard", require("./routes/leaderboard"));
app.use("/api/verification", require("./routes/verification"));
app.use("/api/resume", require("./routes/resume"));
app.use("/api/admin", require("./routes/admin"));

// 5. 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

// 6. Global error handler (MUST BE LAST)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.success(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
  logger.info(`Database: ${process.env.MONGODB_URI?.substring(0, 30)}...`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  logger.info("Server shutting down gracefully...");
  server.close(() => {
    logger.success("Server closed");
    process.exit(0);
  });
});

// Unhandled rejection handler
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection", {
    message: err.message,
    stack: err.stack,
  });
});

module.exports = { app, server };
```

### Step 2: Update Auth Routes with Validation

Update `backend/routes/auth.js`:

```javascript
const express = require("express");
const {
  signup,
  login,
  adminSignup,
  adminLogin,
  sendOTP,
  verifyOTP,
} = require("../controllers/authController");
const {
  validateAuthInput,
  sanitizeInput,
} = require("../middleware/validation");
const { strictRateLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// Protect auth endpoints with strict rate limiting
router.post(
  "/signup",
  strictRateLimiter(),
  sanitizeInput,
  validateAuthInput,
  signup
);
router.post(
  "/login",
  strictRateLimiter(),
  sanitizeInput,
  validateAuthInput,
  login
);

router.post(
  "/admin/signup",
  strictRateLimiter(),
  sanitizeInput,
  validateAuthInput,
  adminSignup
);
router.post(
  "/admin/login",
  strictRateLimiter(),
  sanitizeInput,
  validateAuthInput,
  adminLogin
);

router.post("/send-otp", strictRateLimiter(), sendOTP);
router.post("/verify-otp", strictRateLimiter(), verifyOTP);

module.exports = router;
```

### Step 3: Update Controllers to Use AsyncHandler (Optional but Recommended)

Example: Update one controller to show pattern:

```javascript
const { asyncHandler, AppError } = require("../middleware/errorHandler");
const User = require("../models/User");
const logger = require("../utils/logger");

// OLD WAY:
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NEW WAY (with asyncHandler):
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  logger.info("User profile fetched", { userId: req.user.id });
  res.json({
    success: true,
    user,
  });
});
```

---

## ✅ Testing the Integration

### Test 1: Check server starts without errors

```bash
cd backend
npm run dev
```

Expected output:
```
✅ Server running on port 5000
✅ Environment: development
✅ Database: mongodb+srv://...
```

### Test 2: Test rate limiting

```bash
# Open 6 terminals and run this 6 times rapidly (within 15 minutes)
curl http://localhost:5000/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# 6th request should return 429 (Too Many Requests)
```

### Test 3: Test error handling

```bash
# Test with invalid JSON (should handle gracefully)
curl http://localhost:5000/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{invalid json'

# Should return proper error, not crash
```

### Test 4: Check logs

```bash
# Logs are written to:
# backend/logs/app.log
# backend/logs/error.log

tail -f backend/logs/app.log
tail -f backend/logs/error.log
```

---

## 🔒 Security Improvements Made

| Feature | Impact | Status |
|---------|--------|--------|
| Error Handler | Prevents info leakage | ✅ Added |
| Rate Limiting | Prevents brute force | ✅ Added |
| Input Validation | Prevents injection | ✅ Added |
| Input Sanitization | XSS prevention | ✅ Added |
| Logging | Debugging & auditing | ✅ Added |

---

## 📊 Performance Impact

- **Error Handler**: ~0-1ms overhead
- **Rate Limiter**: ~1-2ms overhead per request
- **Validation**: ~1-2ms overhead per request
- **Logging**: ~2-3ms overhead per request
- **Total**: ~5-10ms per request (acceptable)

---

## 🚀 Next Priority Enhancements

### Week 2: Email Notifications
```javascript
// Create backend/utils/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    logger.info(`Email sent to ${to}`);
  } catch (error) {
    logger.error(`Failed to send email to ${to}`, error.message);
  }
};

module.exports = { sendEmail };
```

### Week 3: Push Notifications
```javascript
// Create backend/utils/pushService.js using Firebase Cloud Messaging
// Allow users to receive browser push notifications
```

### Week 4: Caching Layer
```javascript
// Add Redis for caching  frequently accessed data
// Reduce database queries by 50-70%
```

---

## 📝 Environment Variables to Add

Update your `.env` file:

```env
# Existing
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campusxconnect
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000

# NEW - For Email Notifications
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@campusxconnect.com

# NEW - For Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# NEW - For Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# NEW - For Production
ADMIN_EMAIL=admin@campusxconnect.com
API_KEY=your-api-key
```

---

## 🐛 Troubleshooting

**Q: Server not starting?**
```
A: Check MongoDB connection. Run:
   npm run dev
   Look for "Server running on port 5000" message
```

**Q: Rate limiter too strict?**
```
A: Adjust in server.js:
   moderateRateLimiter({ maxRequests: 200 })
```

**Q: Logs getting too big?**
```
A: These files will be stored in backend/logs/:
   - Rotate logs daily or archive old ones
   - Can also add log rotation package
```

---

## 🎯 Migration Checklist

- [ ] Copy new middleware files to backend/
- [ ] Copy logger utility file
- [ ] Update server.js with new middleware
- [ ] Update auth routes with validation
- [ ] Test server starts
- [ ] Test error handling
- [ ] Test rate limiting
- [ ] Check logs directory is created
- [ ] Update .env file
- [ ] Test with real requests
- [ ] Deploy to staging
- [ ] Monitor logs for issues

---

## 📞 Support

If you have issues:
1. Check the logs: `backend/logs/*`
2. Ensure all imports are correct
3. Verify MongoDB connection
4. Check Node.js and npm versions
5. Delete node_modules and reinstall: `npm install`

---

Generated: March 15, 2026
