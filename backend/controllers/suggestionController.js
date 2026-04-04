const User = require("../models/User");
const ConnectionRequest = require("../models/ConnectionRequest");
const Suggestion = require("../models/Suggestion");
const Notification = require("../models/Notification");

// @desc    Send a suggestion to another user
// @route   POST /api/suggestions/send
// @access  Private
exports.sendSuggestion = async (req, res) => {
  try {
    const { receiverId, suggestionText, category } = req.body;
    const senderId = req.user.id;

    // Validation
    if (!receiverId || !suggestionText) {
      return res.status(400).json({
        success: false,
        message: "Please provide receiverId and suggestion text",
      });
    }

    // Can't send suggestion to yourself
    if (senderId === receiverId) {
      return res.status(400).json({
        success: false,
        message: "Cannot send suggestion to yourself",
      });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Recipient user not found",
      });
    }

    // Check if sender exists
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({
        success: false,
        message: "Sender user not found",
      });
    }

    // Create suggestion
    const suggestion = new Suggestion({
      senderInfo: {
        senderId: senderId,
        senderName: sender.name,
        senderProfilePicture: sender.profilePicture,
      },
      receiverId: receiverId,
      suggestionText: suggestionText.trim(),
      category: category || "other",
      isRead: false,
    });

    console.log("=== SAVE SUGGESTION DEBUG ===");
    console.log("Saving suggestion with data:", {
      senderId,
      receiverId,
      senderName: sender.name,
      suggestionText: suggestionText.trim(),
    });

    await suggestion.save();

    console.log("Suggestion saved with ID:", suggestion._id);
    console.log("Full saved suggestion:", JSON.stringify(suggestion, null, 2));
    console.log("=== END SAVE DEBUG ===");

    // Create notification for receiver
    const notification = new Notification({
      recipient: receiverId,
      sender: senderId,
      type: "SUGGESTION_RECEIVED",
      title: `New suggestion from ${sender.name}`,
      message: `${sender.name} sent you a suggestion`,
      link: `/profile/${senderId}`,
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: "Suggestion sent successfully",
      suggestion,
    });
  } catch (error) {
    console.error("Error sending suggestion:", error);
    res.status(500).json({
      success: false,
      message: "Error sending suggestion",
      error: error.message,
    });
  }
};

// @desc    Get all suggestions for a user
// @route   GET /api/suggestions/received/:userId
// @access  Private
exports.getUserSuggestions = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("=== GET SUGGESTIONS DEBUG ===");
    console.log("Fetching suggestions for userId:", userId);

    const page = req.query.page || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // First, just get raw suggestions without populate
    const rawSuggestions = await Suggestion.find({ receiverId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log("Raw suggestions count:", rawSuggestions.length);
    if (rawSuggestions.length > 0) {
      console.log("First suggestion structure:", JSON.stringify(rawSuggestions[0], null, 2));
    }

    // Now get with populate
    const suggestions = await Suggestion.find({ receiverId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Manually populate the sender info if senderId exists
    const suggestionsWithSender = await Promise.all(
      suggestions.map(async (suggestion) => {
        if (suggestion.senderInfo && suggestion.senderInfo.senderId) {
          const sender = await User.findById(suggestion.senderInfo.senderId)
            .select("name profilePicture email")
            .lean();
          return {
            ...suggestion,
            senderInfo: {
              ...suggestion.senderInfo,
              senderId: sender,
            },
          };
        }
        return suggestion;
      })
    );

    console.log("Populated suggestions with manual fetch:", suggestionsWithSender.length);

    const totalSuggestions = await Suggestion.countDocuments({
      receiverId: userId,
    });

    const unreadCount = await Suggestion.countDocuments({
      receiverId: userId,
      isRead: false,
    });

    console.log("Total suggestions:", totalSuggestions, "Unread:", unreadCount);
    console.log("=== END DEBUG ===");

    res.status(200).json({
      success: true,
      suggestions: suggestionsWithSender,
      totalSuggestions,
      unreadCount,
      totalPages: Math.ceil(totalSuggestions / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching suggestions",
      error: error.message,
    });
  }
};

// @desc    Mark suggestion as read
// @route   PUT /api/suggestions/:suggestionId/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const { suggestionId } = req.params;
    const userId = req.user.id;

    const suggestion = await Suggestion.findById(suggestionId);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: "Suggestion not found",
      });
    }

    // Only the receiver can mark as read
    if (suggestion.receiverId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own suggestions",
      });
    }

    suggestion.isRead = true;
    await suggestion.save();

    res.status(200).json({
      success: true,
      message: "Suggestion marked as read",
      suggestion,
    });
  } catch (error) {
    console.error("Error marking suggestion as read:", error);
    res.status(500).json({
      success: false,
      message: "Error marking suggestion as read",
      error: error.message,
    });
  }
};

// @desc    Delete a suggestion
// @route   DELETE /api/suggestions/:suggestionId
// @access  Private
exports.deleteSuggestion = async (req, res) => {
  try {
    const { suggestionId } = req.params;
    const userId = req.user.id;

    const suggestion = await Suggestion.findById(suggestionId);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: "Suggestion not found",
      });
    }

    // Only the receiver can delete
    if (suggestion.receiverId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own suggestions",
      });
    }

    await Suggestion.findByIdAndDelete(suggestionId);

    res.status(200).json({
      success: true,
      message: "Suggestion deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting suggestion:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting suggestion",
      error: error.message,
    });
  }
};

// CONNECTION SUGGESTION FUNCTIONS (existing functionality)

exports.getSuggestions = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;

    const currentUser = await User.findById(userId).populate("connections");

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get list of users current user is already connected to or has pending requests with
    const connectedIds = currentUser.connections.map((c) => c.toString());
    connectedIds.push(userId); // Exclude self

    const pendingRequests = await ConnectionRequest.find({
      $or: [
        { from: userId, status: "pending" },
        { to: userId, status: "pending" },
      ],
    });

    const pendingIds = pendingRequests.map((req) => {
      return req.from.toString() === userId
        ? req.to.toString()
        : req.from.toString();
    });

    const excludeIds = [...connectedIds, ...pendingIds];

    // Get suggestions based on mutual connections
    const suggestions = await User.aggregate([
      {
        $match: {
          _id: {
            $nin: excludeIds.map((id) =>
              require("mongoose").Types.ObjectId(id),
            ),
          },
          isActive: true,
        },
      },
      {
        $addFields: {
          mutualConnections: {
            $size: {
              $filter: {
                input: "$connections",
                as: "conn",
                cond: { $in: ["$$conn", currentUser.connections] },
              },
            },
          },
        },
      },
      {
        $addFields: {
          profileScore: {
            $add: [
              { $cond: [{ $eq: ["$branch", currentUser.branch] }, 2, 0] },
              { $cond: [{ $eq: ["$year", currentUser.year] }, 3, 0] },
              { $multiply: ["$mutualConnections", 5] },
            ],
          },
        },
      },
      {
        $sort: { profileScore: -1, createdAt: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          profilePicture: 1,
          bio: 1,
          branch: 1,
          year: 1,
          skills: 1,
          company: 1,
          rollNumber: 1,
          mutualConnections: 1,
          profileScore: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: suggestions.length,
      suggestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get suggestions based on a specific user (view their profile suggestions)
exports.getSuggestionsForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { profileUserId } = req.params;
    const limit = parseInt(req.query.limit) || 5;

    // Get current user and the profile user
    const currentUser = await User.findById(userId).populate("connections");
    const profileUser =
      await User.findById(profileUserId).populate("connections");

    if (!profileUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create exclude list - connections of current user + pending requests + self
    const connectedIds = currentUser.connections.map((c) => c.toString());
    connectedIds.push(userId);
    connectedIds.push(profileUserId); // Also exclude the profile user itself

    const pendingRequests = await ConnectionRequest.find({
      $or: [
        { from: userId, status: "pending" },
        { to: userId, status: "pending" },
      ],
    });

    const pendingIds = pendingRequests.map((req) => {
      return req.from.toString() === userId
        ? req.to.toString()
        : req.from.toString();
    });

    const excludeIds = [...connectedIds, ...pendingIds];

    // Get mutual connections between current user and profile user
    const mutualConns = profileUser.connections.filter((conn) =>
      currentUser.connections.some((c) => c.toString() === conn.toString()),
    );

    // Find similar users (connected to profile user, not connected to current user)
    const profileUserConnIds = profileUser.connections.map((c) => c.toString());

    const suggestions = await User.aggregate([
      {
        $match: {
          _id: {
            $in: profileUserConnIds.map((id) =>
              require("mongoose").Types.ObjectId(id),
            ),
            $nin: excludeIds.map((id) =>
              require("mongoose").Types.ObjectId(id),
            ),
          },
          isActive: true,
        },
      },
      {
        $addFields: {
          mutualWithProfileUser: {
            $size: {
              $filter: {
                input: "$connections",
                as: "conn",
                cond: { $in: ["$$conn", currentUser.connections] },
              },
            },
          },
        },
      },
      {
        $addFields: {
          relevanceScore: {
            $add: [
              { $cond: [{ $eq: ["$branch", profileUser.branch] }, 2, 0] },
              { $cond: [{ $eq: ["$year", profileUser.year] }, 3, 0] },
              { $multiply: ["$mutualWithProfileUser", 5] },
            ],
          },
        },
      },
      {
        $sort: { relevanceScore: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          profilePicture: 1,
          bio: 1,
          branch: 1,
          year: 1,
          skills: 1,
          company: 1,
          mutualWithProfileUser: 1,
          relevanceScore: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      profileUser: {
        _id: profileUser._id,
        name: profileUser.name,
      },
      mutualConnections: mutualConns.length,
      count: suggestions.length,
      suggestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get trending suggestions (most connected users in same branch/year)
exports.getTrendingSuggestions = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    const currentUser = await User.findById(userId).populate("connections");

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const connectedIds = currentUser.connections.map((c) => c.toString());
    connectedIds.push(userId);

    const trending = await User.aggregate([
      {
        $match: {
          _id: {
            $nin: connectedIds.map((id) =>
              require("mongoose").Types.ObjectId(id),
            ),
          },
          isActive: true,
          branch: currentUser.branch,
        },
      },
      {
        $addFields: {
          connectionCount: { $size: "$connections" },
        },
      },
      {
        $sort: { connectionCount: -1, createdAt: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          profilePicture: 1,
          bio: 1,
          branch: 1,
          year: 1,
          skills: 1,
          connectionCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: trending.length,
      suggestions: trending,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
