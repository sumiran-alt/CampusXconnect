const PrivateMessage = require("../models/PrivateMessage");
const User = require("../models/User");
const Notification = require("../models/Notification");

// Send a private message
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, text } = req.body;
    const senderId = req.user.id;

    // Handle both FormData (with files) and JSON (text-only)
    const files = req.files || [];

    // Validate message content
    if (!text || (text.trim().length === 0 && files.length === 0)) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    if (senderId === recipientId) {
      return res.status(400).json({ message: "Cannot message yourself" });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Build file metadata
    const attachments = files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: `/uploads/${file.filename}`,
    }));

    // Create message
    const message = new PrivateMessage({
      sender: senderId,
      recipient: recipientId,
      text: text ? text.trim() : `Sent ${files.length} file(s)`,
      attachments: attachments,
    });
    await message.save();
    await message.populate("sender", "name email profilePicture");

    // Create notification for recipient
    try {
      const notif = new Notification({
        recipient: recipientId,
        sender: senderId,
        type: "NEW_MESSAGE",
        title: `New message from ${req.user.name}`,
        message: text ? text.substring(0, 100) : `Sent ${files.length} file(s)`,
      });
      await notif.save();
    } catch (notifError) {
      console.error("Error creating notification:", notifError);
    }

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach((file) => {
        const fs = require("fs");
        const path = require("path");
        try {
          fs.unlinkSync(path.join(__dirname, "../uploads", file.filename));
        } catch (err) {
          console.error("Error deleting file:", err);
        }
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// Get conversation between two users
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    const page = req.query.page || 1;
    const limit = 50;
    const skip = (page - 1) * limit;

    // Validate userId is a valid MongoDB ObjectId
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Get messages between current user and userId
    const messages = await PrivateMessage.find({
      $or: [
        { sender: currentUserId, recipient: userId },
        { sender: userId, recipient: currentUserId },
      ],
      deletedForEveryone: false, // Exclude deleted for everyone messages
      $expr: {
        $cond: [
          { $eq: ["$sender", currentUserId] },
          { $eq: ["$deletedBySender", false] }, // For sender, check deletedBySender
          { $eq: ["$deletedByRecipient", false] }, // For recipient, check deletedByRecipient
        ],
      },
    })
      .populate("sender", "name email profilePicture")
      .populate("recipient", "name email profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await PrivateMessage.countDocuments({
      $or: [
        { sender: currentUserId, recipient: userId },
        { sender: userId, recipient: currentUserId },
      ],
    });

    // Mark messages as read where current user is recipient
    await PrivateMessage.updateMany(
      {
        sender: userId,
        recipient: currentUserId,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    res.status(200).json({
      success: true,
      messages: messages.reverse(),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalMessages: total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get inbox (list of conversations)
exports.getInbox = async (req, res) => {
  try {
    const userId = req.user.id;
    const mongoose = require("mongoose");

    // Get unique conversations
    const conversations = await PrivateMessage.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { recipient: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", new mongoose.Types.ObjectId(userId)] },
              "$recipient",
              "$sender",
            ],
          },
          lastMessage: { $first: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $sort: { "lastMessage.createdAt": -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Error fetching inbox:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete message (soft delete)
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { deleteFor } = req.body; // 'me' or 'everyone'
    const userId = req.user.id;

    console.log("🗑️ [DELETE] Request:", { messageId, deleteFor, userId: userId.toString() });

    // Validate input
    if (!messageId) {
      console.log("❌ No messageId provided");
      return res.status(400).json({ success: false, message: "Message ID is required" });
    }

    if (!deleteFor || !["me", "everyone"].includes(deleteFor)) {
      console.log("❌ Invalid deleteFor:", deleteFor);
      return res.status(400).json({ success: false, message: "Invalid deleteFor. Must be 'me' or 'everyone'" });
    }

    const message = await PrivateMessage.findById(messageId);
    if (!message) {
      console.log("❌ Message not found:", messageId);
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    const messageSenderStr = message.sender.toString();
    const currentUserStr = userId.toString();
    
    console.log("📧 Message sender:", messageSenderStr, "Current user:", currentUserStr, "Match:", messageSenderStr === currentUserStr);

    // Verify user is sender (only sender can delete)
    if (messageSenderStr !== currentUserStr) {
      console.log("❌ User is not the sender - Cannot delete");
      return res.status(403).json({ success: false, message: "Only sender can delete this message" });
    }

    console.log("✅ Authorization passed - User is sender");

    if (deleteFor === "everyone") {
      // Delete for everyone - HARD DELETE from database
      console.log("🗑️ Deleting for EVERYONE (hard delete from database)");
      const deletedMessage = await PrivateMessage.findByIdAndDelete(messageId);
      console.log("✅ Message permanently deleted from database");
      return res.status(200).json({ 
        success: true, 
        message: "Message deleted for everyone and removed from database",
        deletedMessage: deletedMessage
      });
    } else if (deleteFor === "me") {
      // Delete for me only - soft delete
      console.log("🗑️ Deleting for ME only (soft delete)");
      message.deletedBySender = true;
      await message.save();
      console.log("✅ Message marked as deletedBySender");
      
      // If both have deleted, hard delete
      if (message.deletedBySender && message.deletedByRecipient) {
        console.log("🗑️ Both sender and recipient deleted, removing message from database");
        await PrivateMessage.findByIdAndDelete(messageId);
        console.log("✅ Message hard deleted from database");
      }
      
      return res.status(200).json({
        success: true,
        message: "Message deleted for you"
      });
    }
  } catch (error) {
    console.error("❌ Delete message error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await PrivateMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.recipient.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.status(200).json({
      success: true,
      message: "Message marked as read",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadCount = await PrivateMessage.countDocuments({
      recipient: userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
