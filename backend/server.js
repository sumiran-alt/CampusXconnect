require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");
const { initSocket } = require("./socket");

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Create HTTP server with Express app
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Middleware
// Parse allowed CORS origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      "http://localhost:3000",
      "http://localhost:3001",
      process.env.FRONTEND_URL || "http://localhost:3000"
    ];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Increase body size limit for image uploads (50MB max)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded files as static assets
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/coding", require("./routes/coding"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/connections", require("./routes/connections"));
app.use("/api/search", require("./routes/search"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/suggestions", require("./routes/suggestions"));
app.use("/api/private-messages", require("./routes/privateMessages"));
app.use("/api/education", require("./routes/education"));
app.use("/api/experience", require("./routes/experience"));
app.use("/api/certification", require("./routes/certification"));

// New Feature Routes
app.use("/api/verification", require("./routes/verification"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/ideas", require("./routes/ideas"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/leaderboard", require("./routes/leaderboard"));
app.use("/api/resume", require("./routes/resume"));
app.use("/api/hackathons", require("./routes/hackathons"));
app.use("/api/communities", require("./routes/communities"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running!" });
});

// Start server
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io initialized and listening for connections`);
});

// Handle port already in use error
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use`);
    console.log(`💡 Trying to find an available port...`);
    
    // Try next port
    const nextPort = PORT + 1;
    const newServer = http.createServer(app);
    initSocket(newServer);
    
    newServer.listen(nextPort, () => {
      console.log(`✅ Server running on port ${nextPort} instead`);
    });
    
    newServer.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${nextPort} is also in use`);
        console.error("Please kill existing Node processes and try again");
        process.exit(1);
      }
    });
  } else {
    console.error("Server error:", err);
    process.exit(1);
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
