/**
 * Logging Service
 * Centralized logging for debugging and monitoring
 */

const fs = require("fs");
const path = require("path");

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logFile = path.join(logsDir, "app.log");
const errorLogFile = path.join(logsDir, "error.log");

// Get current timestamp
const getTimestamp = () => {
  return new Date().toISOString();
};

// Format log message
const formatLog = (level, message, data = null) => {
  let log = `[${getTimestamp()}] [${level}] ${message}`;
  if (data) {
    log += ` | ${JSON.stringify(data)}`;
  }
  return log;
};

// Log to console
const logToConsole = (level, message, data = null) => {
  const colors = {
    INFO: "\x1b[36m", // Cyan
    WARN: "\x1b[33m", // Yellow
    ERROR: "\x1b[31m", // Red
    SUCCESS: "\x1b[32m", // Green
    RESET: "\x1b[0m",
  };

  const color = colors[level] || colors.RESET;
  const log = formatLog(level, message, data);
  console.log(`${color}${log}${colors.RESET}`);
};

// Log to file
const logToFile = (file, message) => {
  try {
    fs.appendFileSync(file, message + "\n");
  } catch (err) {
    console.error("Failed to write to log file:", err);
  }
};

// Export logger functions
const logger = {
  info: (message, data = null) => {
    const log = formatLog("INFO", message, data);
    logToConsole("INFO", message, data);
    logToFile(logFile, log);
  },

  warn: (message, data = null) => {
    const log = formatLog("WARN", message, data);
    logToConsole("WARN", message, data);
    logToFile(logFile, log);
  },

  error: (message, data = null) => {
    const log = formatLog("ERROR", message, data);
    logToConsole("ERROR", message, data);
    logToFile(errorLogFile, log);
  },

  success: (message, data = null) => {
    const log = formatLog("SUCCESS", message, data);
    logToConsole("SUCCESS", message, data);
    logToFile(logFile, log);
  },

  debug: (message, data = null) => {
    if (process.env.NODE_ENV === "development") {
      const log = formatLog("DEBUG", message, data);
      logToConsole("INFO", message, data);
      logToFile(logFile, log);
    }
  },

  // Log API requests
  logRequest: (req) => {
    const log = formatLog("REQUEST", `${req.method} ${req.path}`, {
      ip: req.ip,
      user: req.user?.id,
    });
    logToFile(logFile, log);
  },

  // Log API responses
  logResponse: (res, duration) => {
    const log = formatLog("RESPONSE", `${res.statusCode}`, {
      duration: `${duration}ms`,
    });
    logToFile(logFile, log);
  },

  // Get logs
  getLogs: (limit = 100) => {
    try {
      const logs = fs.readFileSync(logFile, "utf-8").split("\n");
      return logs.slice(-limit).filter((l) => l.trim());
    } catch (err) {
      return ["No logs available"];
    }
  },

  // Get error logs
  getErrorLogs: (limit = 100) => {
    try {
      const logs = fs.readFileSync(errorLogFile, "utf-8").split("\n");
      return logs.slice(-limit).filter((l) => l.trim());
    } catch (err) {
      return ["No error logs available"];
    }
  },

  // Clear logs
  clearLogs: () => {
    try {
      fs.truncateSync(logFile);
      fs.truncateSync(errorLogFile);
      logger.info("Logs cleared");
    } catch (err) {
      logger.error("Failed to clear logs", err.message);
    }
  },
};

module.exports = logger;
