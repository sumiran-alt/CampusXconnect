/**
 * Request/Response Logging Middleware
 */

const logger = require("../utils/logger");

const loggingMiddleware = (req, res, next) => {
  const startTime = Date.now();

  // Log incoming request
  logger.logRequest(req);

  // Intercept response.send to log response
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - startTime;
    logger.logResponse(res, duration);
    originalSend.call(this, data);
  };

  next();
};

module.exports = loggingMiddleware;
