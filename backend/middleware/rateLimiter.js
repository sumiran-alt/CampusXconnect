/**
 * Rate Limiting Middleware
 * Prevents abuse by limiting requests per IP
 */

const rateLimitStore = new Map();

// Simple in-memory rate limiter
const rateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxRequests = 100, // max 100 requests per window
    message = "Too many requests, please try again later",
  } = options;

  const cleanup = () => {
    const now = Date.now();
    for (let [key, data] of rateLimitStore.entries()) {
      // If window has passed, remove the entry
      if (now - data.resetTime > windowMs) {
        rateLimitStore.delete(key);
      }
    }
  };

  // Cleanup every 5 minutes
  setInterval(cleanup, 5 * 60 * 1000);

  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    const data = rateLimitStore.get(key);

    // Reset if window has passed
    if (now > data.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    // Increment count
    data.count++;

    // Check if limit exceeded
    if (data.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil((data.resetTime - now) / 1000),
      });
    }

    // Add rate limit info to response headers
    res.setHeader("X-RateLimit-Limit", maxRequests);
    res.setHeader("X-RateLimit-Remaining", maxRequests - data.count);
    res.setHeader(
      "X-RateLimit-Reset",
      new Date(data.resetTime).toISOString()
    );

    next();
  };
};

// Strict rate limiter for sensitive endpoints (auth, etc)
const strictRateLimiter = (options = {}) => {
  return rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // only 5 requests per window
    message: "Too many login attempts, please try again later",
    ...options,
  });
};

// Moderate rate limiter for normal endpoints
const moderateRateLimiter = (options = {}) => {
  return rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    ...options,
  });
};

// Lenient rate limiter for public endpoints
const lenientRateLimiter = (options = {}) => {
  return rateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
    ...options,
  });
};

module.exports = {
  rateLimiter,
  strictRateLimiter,
  moderateRateLimiter,
  lenientRateLimiter,
};
