const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getOrCreateChat,
  sendMessage,
  getMessages,
  markAsRead,
  markChatAsRead,
  deleteMessage,
  getUserChats,
  getUnreadCount,
  getUnreadByChat,
  searchChatsOrUsers,
} = require("../controllers/messageController");

const router = express.Router();
router.use(protect);

// Chat operations
router.get("/chats", getUserChats);
router.get("/search", searchChatsOrUsers);
router.get("/unread-count", getUnreadCount);
router.get("/unread-by-chat", getUnreadByChat);

// Start/get conversation with user
router.get("/or-create/:recipientId", getOrCreateChat);

// Messages in a chat
router.post("/:chatId/send", sendMessage);
router.get("/:chatId", getMessages);
router.put("/:chatId/read", markChatAsRead);

// Individual message operations
router.put("/message/:messageId/read", markAsRead);
router.delete("/message/:messageId", deleteMessage);

module.exports = router;
