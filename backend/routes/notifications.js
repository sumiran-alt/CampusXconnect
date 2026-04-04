const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getUnreadNotifications,
  getAllNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} = require("../controllers/notificationController");

// All routes require authentication
router.use(protect);

// Get unread notifications
router.get("/unread", getUnreadNotifications);

// Get unread count
router.get("/unread-count", getUnreadCount);

// Get all notifications with pagination
router.get("/", getAllNotifications);

// Mark single notification as read
router.put("/:notificationId/read", markAsRead);

// Mark all notifications as read
router.put("/read/all", markAllAsRead);

// Delete notification
router.delete("/:notificationId", deleteNotification);

module.exports = router;
