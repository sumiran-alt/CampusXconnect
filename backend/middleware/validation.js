/**
 * Request Validation Middleware
 * Validates common request patterns
 */

// Validate email format
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate password strength
const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Validate MongoDB ObjectId
const validateObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Middleware to validate email and password for auth
const validateAuthInput = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  next();
};

// Middleware to validate request body is not empty
const validateRequestBody = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Request body cannot be empty",
    });
  }
  next();
};

// Middleware to validate pagination parameters
const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;

  if (page && isNaN(page)) {
    return res.status(400).json({
      success: false,
      message: "Page must be a number",
    });
  }

  if (limit && isNaN(limit)) {
    return res.status(400).json({
      success: false,
      message: "Limit must be a number",
    });
  }

  if (page && page < 1) {
    return res.status(400).json({
      success: false,
      message: "Page must be greater than 0",
    });
  }

  if (limit && limit < 1) {
    return res.status(400).json({
      success: false,
      message: "Limit must be greater than 0",
    });
  }

  next();
};

// Middleware to sanitize user input
const sanitizeInput = (req, res, next) => {
  // Remove potentially harmful scripts
  for (let field in req.body) {
    if (typeof req.body[field] === "string") {
      req.body[field] = req.body[field].trim();
      // Remove HTML tags
      req.body[field] = req.body[field].replace(/<[^>]*>/g, "");
    }
  }
  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateObjectId,
  validateAuthInput,
  validateRequestBody,
  validatePagination,
  sanitizeInput,
};
