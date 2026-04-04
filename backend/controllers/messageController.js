const Chat = require("../models/Chat");
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const User = require("../models/User");

// Get or create chat between two users
exports.getOrCreateChat = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const userId = req.user.id;

    if (userId === recipientId) {
      return res.status(400).json({ message: "Cannot chat with yourself" });
    }

    // Find existing chat
    let chat = await Chat.findOne({
      participants: { $all: [userId, recipientId] },
    }).populate("lastMessage");

    // Create new chat if doesn't exist
    if (!chat) {
      chat = new Chat({
        participants: [userId, recipientId],
      });
      await chat.save();
    }

    res.status(200).json({ chat });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting chat", error: error.message });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { text } = req.body;
    const senderId = req.user.id;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    // Verify user is participant in chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (id) => id.toString() === senderId,
    );
    if (!isParticipant) {
      return res
        .status(403)
        .json({ message: "Not authorized to send message" });
    }

    // Get recipient
    const recipient = chat.participants.find(
      (id) => id.toString() !== senderId,
    );

    // Create message
    const message = new Message({
      chatId,
      sender: senderId,
      recipient,
      text: text.trim(),
    });
    await message.save();

    // Update chat with last message
    chat.lastMessage = message._id;
    chat.lastMessageTime = message.createdAt;
    await chat.save();

    // Populate sender info
    await message.populate("sender", "name");

    // Create notification for recipient
    try {
      const recipientUser = await User.findById(recipient);
      if (recipientUser) {
        const notif = new Notification({
          recipient,
          sender: senderId,
          type: "NEW_MESSAGE",
          title: `New message from ${req.user.name}`,
          message: text.substring(0, 100),
        });
        await notif.save();
      }
    } catch (notifError) {
      console.error("Error creating notification:", notifError);
    }

    res.status(201).json({ message });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending message", error: error.message });
  }
};

// Get messages for a chat with pagination
exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user.id;

    // Verify user is participant
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (id) => id.toString() === userId,
    );
    if (!isParticipant) {
      return res
        .status(403)
        .json({ message: "Not authorized to view messages" });
    }

    const messages = await Message.find({
      chatId,
      deletedBy: { $ne: userId },
    })
      .populate("sender", "name email")
      .populate("recipient", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Message.countDocuments({
      chatId,
      deletedBy: { $ne: userId },
    });

    const pages = Math.ceil(total / limit);

    res.status(200).json({
      messages: messages.reverse(),
      page,
      pages,
      total,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching messages", error: error.message });
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only recipient can mark as read
    if (message.recipient.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to mark this message" });
    }

    if (!message.isRead) {
      message.isRead = true;
      message.readAt = new Date();
      await message.save();
    }

    res.status(200).json({ message });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking message as read", error: error.message });
  }
};

// Mark all messages in chat as read
exports.markChatAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (id) => id.toString() === userId,
    );
    if (!isParticipant) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Message.updateMany(
      {
        chatId,
        recipient: userId,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      },
    );

    res.status(200).json({ message: "All messages marked as read" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking chat as read", error: error.message });
  }
};

// Delete message (soft delete)
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only sender can delete their own message
    if (message.sender.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Can only delete your own messages" });
    }

    message.deletedBy.push(userId);
    await message.save();

    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting message", error: error.message });
  }
};

// Get all chats for user
exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const chats = await Chat.find({
      participants: userId,
      isActive: true,
    })
      .populate("participants", "name email")
      .populate({
        path: "lastMessage",
        populate: [
          { path: "sender", select: "name" },
          { path: "recipient", select: "name" },
        ],
      })
      .sort({ lastMessageTime: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Chat.countDocuments({
      participants: userId,
      isActive: true,
    });

    const pages = Math.ceil(total / limit);

    res.status(200).json({
      chats,
      page,
      pages,
      total,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching chats", error: error.message });
  }
};

// Get unread message count for user
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadCount = await Message.countDocuments({
      recipient: userId,
      isRead: false,
    });

    res.status(200).json({ unreadCount });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching unread count", error: error.message });
  }
};

// Get unread messages by chat
exports.getUnreadByChat = async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadByChat = await Message.aggregate([
      {
        $match: {
          recipient: { $oid: userId },
          isRead: false,
        },
      },
      {
        $group: {
          _id: "$chatId",
          count: { $sum: 1 },
        },
      },
    ]);

    const chatUnreadMap = {};
    unreadByChat.forEach((item) => {
      chatUnreadMap[item._id.toString()] = item.count;
    });

    res.status(200).json({ chatUnreadMap });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching unread counts", error: error.message });
  }
};

// Search chats or users to start conversation
exports.searchChatsOrUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user.id;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: "Search query required" });
    }

    // Search for users to start new conversation
    const users = await User.find(
      {
        _id: { $ne: userId },
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
          { rollNumber: { $regex: query, $options: "i" } },
        ],
      },
      "name email branch year rollNumber -_id",
    ).limit(15);

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Error searching", error: error.message });
  }
};
