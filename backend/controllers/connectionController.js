const User = require("../models/User");
const ConnectionRequest = require("../models/ConnectionRequest");
const Notification = require("../models/Notification");

// Send connection request
exports.sendRequest = async (req, res) => {
  try {
    const { toUserId } = req.params;
    const fromUserId = req.user.id;

    // Can't send request to self
    if (fromUserId === toUserId) {
      return res
        .status(400)
        .json({ message: "Cannot send connection request to yourself" });
    }

    // Check if recipient exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get sender info
    const fromUser = await User.findById(fromUserId);

    // Check if already connected
    const isConnected = toUser.connections.includes(fromUserId);
    if (isConnected) {
      return res
        .status(400)
        .json({ message: "Already connected with this user" });
    }

    // Check if request already exists (pending or rejected)
    const existingRequest = await ConnectionRequest.findOne({
      from: fromUserId,
      to: toUserId,
      status: { $in: ["pending", "accepted"] },
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Connection request already exists" });
    }

    // Check if reverse request exists (user sent request to us)
    const reverseRequest = await ConnectionRequest.findOne({
      from: toUserId,
      to: fromUserId,
      status: "pending",
    });

    if (reverseRequest) {
      return res
        .status(400)
        .json({
          message:
            "This user has already sent you a request. Accept it instead!",
        });
    }

    // Create new request
    const newRequest = new ConnectionRequest({
      from: fromUserId,
      to: toUserId,
      status: "pending",
    });

    await newRequest.save();

    // Create notification for recipient
    const notification = new Notification({
      recipient: toUserId,
      sender: fromUserId,
      type: "CONNECTION_REQUEST",
      title: `New connection request from ${fromUser.name}`,
      message: `${fromUser.name} sent you a connection request`,
      link: `/connections`,
    });

    await notification.save();

    // Populate sender details
    const populatedRequest = await newRequest.populate(
      "from",
      "name email profilePicture",
    );

    res.status(201).json({
      success: true,
      message: "Connection request sent successfully",
      request: populatedRequest,
    });
  } catch (error) {
    console.error("Error sending connection request:", error);
    res
      .status(500)
      .json({
        message: "Error sending connection request",
        error: error.message,
      });
  }
};

// Get pending connection requests for current user
exports.getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const pendingRequests = await ConnectionRequest.find({
      to: userId,
      status: "pending",
    })
      .populate("from", "name email profilePicture bio")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pendingRequests.length,
      requests: pendingRequests,
    });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res
      .status(500)
      .json({
        message: "Error fetching pending requests",
        error: error.message,
      });
  }
};

// Get sent connection requests
exports.getSentRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const sentRequests = await ConnectionRequest.find({
      from: userId,
      status: "pending",
    })
      .populate("to", "name email profilePicture bio")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: sentRequests.length,
      requests: sentRequests,
    });
  } catch (error) {
    console.error("Error fetching sent requests:", error);
    res
      .status(500)
      .json({ message: "Error fetching sent requests", error: error.message });
  }
};

// Accept connection request
exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    const request =
      await ConnectionRequest.findById(requestId).populate("from");

    if (!request) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    // Verify this request is for current user
    if (request.to.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You cannot accept this request" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "This request has already been processed" });
    }

    // Update request status
    request.status = "accepted";
    request.respondedAt = new Date();
    await request.save();

    // Add connection to both users
    const currentUser = await User.findById(userId);
    const otherUser = await User.findById(request.from._id);

    if (!currentUser.connections.includes(request.from._id)) {
      currentUser.connections.push(request.from._id);
      await currentUser.save();
    }

    if (!otherUser.connections.includes(userId)) {
      otherUser.connections.push(userId);
      await otherUser.save();
    }

    // Create notification for sender (person who sent the original request)
    const notification = new Notification({
      recipient: request.from._id,
      sender: userId,
      type: "CONNECTION_ACCEPTED",
      title: `${currentUser.name} accepted your connection request`,
      message: `${currentUser.name} accepted your connection request`,
      link: `/profile/${userId}`,
    });

    await notification.save();

    // Repopulate for response
    const updatedRequest = await request.populate(
      "to",
      "name email profilePicture",
    );

    res.json({
      success: true,
      message: "Connection accepted successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error accepting connection request:", error);
    res
      .status(500)
      .json({
        message: "Error accepting connection request",
        error: error.message,
      });
  }
};

// Reject connection request
exports.rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    const request = await ConnectionRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    // Verify this request is for current user
    if (request.to.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You cannot reject this request" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "This request has already been processed" });
    }

    // Update request status
    request.status = "rejected";
    request.respondedAt = new Date();
    await request.save();

    res.json({
      success: true,
      message: "Connection request rejected successfully",
      request,
    });
  } catch (error) {
    console.error("Error rejecting connection request:", error);
    res
      .status(500)
      .json({
        message: "Error rejecting connection request",
        error: error.message,
      });
  }
};

// Cancel sent connection request
exports.cancelRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    const request = await ConnectionRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    // Verify this request is from current user
    if (request.from.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You cannot cancel this request" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending requests can be cancelled" });
    }

    // Delete request
    await ConnectionRequest.deleteOne({ _id: requestId });

    res.json({
      success: true,
      message: "Connection request cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling connection request:", error);
    res
      .status(500)
      .json({
        message: "Error cancelling connection request",
        error: error.message,
      });
  }
};

// Get user's connections
exports.getConnections = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate(
      "connections",
      "name email profilePicture bio",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      count: user.connections.length,
      connections: user.connections,
    });
  } catch (error) {
    console.error("Error fetching connections:", error);
    res
      .status(500)
      .json({ message: "Error fetching connections", error: error.message });
  }
};

// Get current user's connections
exports.getMyConnections = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate(
      "connections",
      "name email profilePicture bio",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      count: user.connections.length,
      connections: user.connections,
    });
  } catch (error) {
    console.error("Error fetching my connections:", error);
    res
      .status(500)
      .json({ message: "Error fetching my connections", error: error.message });
  }
};

// Remove connection
exports.removeConnection = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    // Get current user info for notification
    const currentUser = await User.findById(currentUserId);

    // Remove from both users
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { connections: userId },
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { connections: currentUserId },
    });

    // Create notification for the other user
    const notification = new Notification({
      recipient: userId,
      sender: currentUserId,
      type: "CONNECTION_REMOVED",
      title: `${currentUser.name} removed the connection`,
      message: `${currentUser.name} removed you from their connections`,
      link: `/search`,
    });

    await notification.save();

    res.json({
      success: true,
      message: "Connection removed successfully",
    });
  } catch (error) {
    console.error("Error removing connection:", error);
    res
      .status(500)
      .json({ message: "Error removing connection", error: error.message });
  }
};

// Check connection status between two users
exports.checkConnectionStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    // Check if connected
    const currentUser = await User.findById(currentUserId);
    const isConnected = currentUser.connections.includes(userId);

    // Check for pending requests
    let sentRequest = null;
    let receivedRequest = null;

    if (!isConnected) {
      sentRequest = await ConnectionRequest.findOne({
        from: currentUserId,
        to: userId,
        status: "pending",
      });

      receivedRequest = await ConnectionRequest.findOne({
        from: userId,
        to: currentUserId,
        status: "pending",
      });
    }

    res.json({
      success: true,
      status: isConnected ? "connected" : "not_connected",
      hasSentRequest: !!sentRequest,
      hasReceivedRequest: !!receivedRequest,
      sentRequestId: sentRequest?._id || null,
      receivedRequestId: receivedRequest?._id || null,
    });
  } catch (error) {
    console.error("Error checking connection status:", error);
    res
      .status(500)
      .json({
        message: "Error checking connection status",
        error: error.message,
      });
  }
};

// @desc    Get mutual connections between two users
// @route   GET /api/connections/mutual/:userId
// @access  Private/Public
exports.getMutualConnections = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?.id;

    // Get both users
    const targetUser = await User.findById(userId).populate("connections", "name profilePicture email");
    const currentUser = currentUserId ? await User.findById(currentUserId) : null;

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find mutual connections
    let mutualConnections = [];
    if (currentUser) {
      mutualConnections = targetUser.connections.filter(conn =>
        currentUser.connections.includes(conn._id)
      );
    }

    res.status(200).json({
      success: true,
      mutualConnections,
      count: mutualConnections.length,
    });
  } catch (error) {
    console.error("Error fetching mutual connections:", error);
    res.status(500).json({
      message: "Error fetching mutual connections",
      error: error.message,
    });
  }
};
