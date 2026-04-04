const express = require("express");
const {
  sendRequest,
  getPendingRequests,
  getSentRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  getConnections,
  getMyConnections,
  removeConnection,
  checkConnectionStatus,
  getMutualConnections,
} = require("../controllers/connectionController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All connection routes require authentication
router.use(protect);

// Send connection request to a user
router.post("/request/:toUserId", sendRequest);

// Get pending requests (requests received)
router.get("/pending", getPendingRequests);

// Get sent requests (requests sent by user)
router.get("/sent", getSentRequests);

// Accept connection request
router.put("/request/:requestId/accept", acceptRequest);

// Reject connection request
router.put("/request/:requestId/reject", rejectRequest);

// Cancel sent connection request
router.delete("/request/:requestId/cancel", cancelRequest);

// Get my connections
router.get("/my", getMyConnections);

// Get mutual connections with a user
router.get("/mutual/:userId", getMutualConnections);

// Get a user's connections
router.get("/:userId", getConnections);

// Check connection status with another user
router.get("/:userId/status", checkConnectionStatus);

// Remove a connection
router.delete("/:userId", removeConnection);

module.exports = router;
