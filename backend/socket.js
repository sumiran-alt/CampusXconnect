const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

// Store active users - maps userId to socketId
const activeUsers = new Map();

// Initialize Socket.io
const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || ["http://localhost:3000", "http://localhost:3001"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Middleware to verify JWT token on connection
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const userId = socket.handshake.auth.userId;

      console.log("🔐 Socket.io auth attempt:", {
        token: token ? "✓ present" : "✗ missing",
        userId: userId ? `✓ ${userId}` : "✗ missing",
        allAuth: socket.handshake.auth
      });

      if (!token || !userId) {
        const errorMsg = `Missing credentials - token: ${!!token}, userId: ${!!userId}`;
        console.error("❌ " + errorMsg);
        return next(new Error(errorMsg));
      }

      // Verify JWT token (optional - can skip for now)
      // jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

      socket.userId = userId;
      console.log(`✅ Auth validated for userId: ${userId}`);
      next();
    } catch (error) {
      console.error("❌ Socket.io auth error:", error.message);
      next(new Error("Authentication failed: " + error.message));
    }
  });

  // Handle socket connections
  io.on("connection", (socket) => {
    const userId = socket.userId;
    console.log(`✅ User ${userId} connected with socket ID: ${socket.id}`);

    // Track active user
    activeUsers.set(userId, socket.id);

    // Broadcast updated online users list
    io.emit("users_online", Array.from(activeUsers.keys()));

    // ==== JOIN CONVERSATION ROOM ====
    socket.on("join_room", (data) => {
      const { userId1, userId2 } = data;
      const roomId = [userId1, userId2].sort().join("_");

      socket.join(roomId);

      console.log(`👥 User ${userId} joined room: ${roomId}`);
    });

    // ==== LEAVE CONVERSATION ROOM ====
    socket.on("leave_room", (data) => {
      const { userId1, userId2 } = data;
      const roomId = [userId1, userId2].sort().join("_");

      socket.leave(roomId);

      console.log(`👋 User ${userId} left room: ${roomId}`);
    });

    // ==== SEND MESSAGE ====
    socket.on("send_message", (data) => {
      const { senderId, senderName, senderAvatar, recipientId, text, timestamp } = data;

      console.log(`📨 Message from ${senderId} to ${recipientId}: ${text}`);

      // Construct room ID
      const roomId = [senderId, recipientId].sort().join("_");

      // Create message object
      const messageData = {
        senderId,
        senderName,
        senderAvatar,
        recipientId,
        text,
        timestamp,
      };

      // Broadcast to the conversation room
      io.to(roomId).emit("receive_message", messageData);

      console.log(`✅ Message delivered to room: ${roomId}`);
    });

    // ==== TYPING INDICATOR ====
    socket.on("typing", (data) => {
      const { userId: typingUserId, recipientId, isTyping } = data;

      // Construct room ID
      const roomId = [typingUserId, recipientId].sort().join("_");

      // Broadcast typing status to the room
      io.to(roomId).emit("user_typing", {
        userId: typingUserId,
        isTypingFlag: isTyping,
      });

      console.log(`⌨️ User ${typingUserId} typing: ${isTyping}`);
    });

    // ==== DISCONNECT ====
    socket.on("disconnect", () => {
      // Remove user from active list
      activeUsers.delete(userId);

      console.log(`❌ User ${userId} disconnected`);
      console.log(`👥 Active users: ${activeUsers.size}`);

      // Broadcast updated online users
      io.emit("users_online", Array.from(activeUsers.keys()));
    });

    // ==== ERROR HANDLING ====
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });

  return io;
};

module.exports = { initSocket };
