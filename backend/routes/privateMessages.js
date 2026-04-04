const express = require("express");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/fileUpload");
const {
  sendMessage,
  getConversation,
  getInbox,
  deleteMessage,
  markAsRead,
  getUnreadCount,
} = require("../controllers/privateMessageController");

const router = express.Router();

// All routes require authentication
router.use(protect);

// Send a message (with optional file uploads)
router.post("/send", upload.array("files", 5), sendMessage);

// Get conversations/inbox
router.get("/inbox", getInbox);

// Get unread count
router.get("/unread-count", getUnreadCount);

// Get conversation with a specific user
router.get("/:userId", getConversation);

// Mark message as read
router.put("/:messageId/read", markAsRead);

// Delete message (POST for better compatibility)
router.post("/:messageId/delete", deleteMessage);

// Delete message (also support DELETE for backwards compatibility)
router.delete("/:messageId", deleteMessage);

module.exports = router;
