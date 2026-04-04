"use client";

/**
 * CampusXConnect - Enhanced Chat Page with Full Messaging Features
 * Features:
 * - Fixed emoji picker (emojiPickerRef)
 * - Emoji reactions on messages
 * - Advanced file attachments
 * - Message editing
 * - Message reply
 * - Message status indicators
 * - Auto-expanding textarea
 * - GIF support
 * - Smooth animations
 * - Mobile responsive
 * - Performance optimized
 */

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { messageAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import Link from "next/link";
import { io } from "socket.io-client";
import dynamic from "next/dynamic";
import {
  EmojiPickerSystem,
  MessageStatusComponent,
  MessageReplyComponent,
  AutoExpandTextArea,
  FileAttachmentButton,
  MessageEditingComponent,
  GIFPickerComponent,
} from "@/components/EmojiPickerSystem";

// Dynamically import emoji-mart
const Picker = dynamic(
  () => import("emoji-mart").then(mod => {
    const Picker = mod.Picker;
    return function EmojiPickerWrapper(props) {
      return <Picker {...props} />;
    };
  }),
  {
    ssr: false,
    loading: () => <div className="p-4 text-gray-500 text-center">Loading...</div>
  }
);

/**
 * Enhanced Chat Page Component
 */
export default function EnhancedChatPage() {
  const router = useRouter();
  const params = useParams();
  const recipientId = params.id;
  const { user, isAuthenticated, token, initialize } = useAuthStore();

  // ============ STATE MANAGEMENT ============
  const [messages, setMessages] = useState([]);
  const [recipientUser, setRecipientUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const [sending, setSending] = useState(false);
  const [socket, setSocket] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [replyingToMessage, setReplyingToMessage] = useState(null);
  const [messageReactions, setMessageReactions] = useState({});
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedGIFUrl, setSelectedGIFUrl] = useState(null);

  // ============ EMOJI PICKER HOOK ============
  const {
    showEmojiPicker,
    setShowEmojiPicker,
    emojiPickerRef,
    emojiButtonRef,
    emojiPickerPosition,
    updateEmojiPickerPosition,
  } = EmojiPickerSystem.useEmojiPicker();

  // ============ REFS ============
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messageContainerRef = useRef(null);

  // ============ AUTH INITIALIZATION ============
  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      const currentState = useAuthStore.getState();

      if (!currentState.isAuthenticated || !currentState.user || !currentState.user._id) {
        console.log("🔐 Not authenticated, redirecting...");
        router.push("/login");
        return;
      }

      setAuthReady(true);
    };

    checkAuth();
  }, [router]);

  // ============ FETCH INITIAL MESSAGES ============
  useEffect(() => {
    if (!authReady || !user) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await messageAPI.getConversation(recipientId);
        const msgs = response.data.messages || [];

        const sortedMessages = msgs.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        setMessages(sortedMessages);

        // Fetch recipient user info
        const userResponse = await messageAPI.getUserInfo?.(recipientId);
        if (userResponse?.data?.user) {
          setRecipientUser(userResponse.data.user);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [authReady, user, recipientId]);

  // ============ SOCKET.IO CONNECTION ============
  useEffect(() => {
    if (!authReady || !user) return;

    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
      auth: { token, userId: user._id },
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected");
      newSocket.emit("join-room", recipientId);
    });

    // Receive new messages
    newSocket.on("receive-message", (message) => {
      console.log("📨 Message received:", message);
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    // Typing indicator
    newSocket.on("user-typing", ({ userId, isTyping }) => {
      if (isTyping) {
        setTypingUsers(prev => 
          prev.includes(userId) ? prev : [...prev, userId]
        );
      } else {
        setTypingUsers(prev => prev.filter(id => id !== userId));
      }
    });

    // Message edited
    newSocket.on("message-edited", ({ messageId, newText }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === messageId ? { ...msg, text: newText, edited: true } : msg
        )
      );
    });

    // Message deleted
    newSocket.on("message-deleted", ({ messageId }) => {
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
    });

    // Reactions
    newSocket.on("reaction-added", ({ messageId, emoji, userId }) => {
      setMessageReactions(prev => ({
        ...prev,
        [messageId]: [
          ...(prev[messageId] || []),
          { emoji, userId }
        ]
      }));
    });

    newSocket.on("reaction-removed", ({ messageId, emoji, userId }) => {
      setMessageReactions(prev => ({
        ...prev,
        [messageId]: (prev[messageId] || []).filter(
          r => !(r.emoji === emoji && r.userId === userId)
        )
      }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [authReady, user, recipientId, token]);

  // ============ SCROLL TO BOTTOM ============
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ============ AUTO-EXPAND TEXTAREA ON EMOJI PICKER UPDATE ============
  useEffect(() => {
    updateEmojiPickerPosition();
    window.addEventListener("resize", updateEmojiPickerPosition);
    return () => window.removeEventListener("resize", updateEmojiPickerPosition);
  }, [updateEmojiPickerPosition]);

  // ============ SEND MESSAGE ============
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageInput.trim() && attachedFiles.length === 0 && !selectedGIFUrl) {
      toast.error("Message cannot be empty");
      return;
    }

    if (!user) {
      toast.error("Please log in first");
      return;
    }

    setSending(true);

    try {
      const messageData = {
        text: messageInput.trim() || (selectedGIFUrl ? "Sent a GIF" : "Sent files"),
        recipientId,
        replyTo: replyingToMessage?._id,
        gifUrl: selectedGIFUrl,
      };

      // Handle file attachments
      let formData = null;
      if (attachedFiles.length > 0) {
        formData = new FormData();
        formData.append("recipientId", recipientId);
        formData.append("text", messageData.text);
        if (replyingToMessage) {
          formData.append("replyTo", replyingToMessage._id);
        }
        attachedFiles.forEach(f => {
          formData.append("attachments", f.file);
        });
      }

      const response = await messageAPI.sendMessage(messageData, formData);
      const newMessage = response.data.message;

      // Optimistic update
      setMessages(prev => [...prev, {
        _id: newMessage._id,
        sender: {
          _id: user._id,
          name: user.name,
          profilePicture: user.profilePicture,
        },
        recipient: { _id: recipientId },
        text: newMessage.text,
        attachments: newMessage.attachments || [],
        createdAt: new Date().toISOString(),
        status: "sent",
      }]);

      // Reset form
      setMessageInput("");
      setAttachedFiles([]);
      setReplyingToMessage(null);
      setSelectedGIFUrl(null);
      setShowEmojiPicker(false);

      toast.success("Message sent!");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // ============ HANDLE INPUT CHANGE ============
  const handleInputChange = (e) => {
    setMessageInput(e.target.value);

    // Emit typing indicator
    if (socket && !isTyping) {
      socket.emit("typing", {
        userId: user._id,
        recipientId,
        isTyping: true,
      });
      setIsTyping(true);
    }

    // Clear timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (socket) {
        socket.emit("typing", {
          userId: user._id,
          recipientId,
          isTyping: false,
        });
        setIsTyping(false);
      }
    }, 2000);
  };

  // ============ EMOJI SELECTION ============
  const handleEmojiSelect = useCallback((emoji) => {
    setMessageInput(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  }, []);

  // ============ EDIT MESSAGE ============
  const handleEditMessage = async (messageId, newText) => {
    try {
      await messageAPI.editMessage(messageId, newText);
      setMessages(prev =>
        prev.map(msg =>
          msg._id === messageId
            ? { ...msg, text: newText, edited: true }
            : msg
        )
      );
      setEditingMessageId(null);
      socket?.emit("edit-message", { messageId, newText, recipientId });
      toast.success("Message edited");
    } catch (error) {
      toast.error("Failed to edit message");
    }
  };

  // ============ DELETE MESSAGE ============
  const handleDeleteMessage = async (messageId, deleteFor = "everyone") => {
    try {
      await messageAPI.deleteMessage(messageId, deleteFor);
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
      socket?.emit("delete-message", { messageId, recipientId });
      toast.success("Message deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  };

  // ============ ADD REACTION ============
  const handleAddReaction = (messageId, emoji, userId) => {
    socket?.emit("add-reaction", {
      messageId,
      emoji,
      userId,
      recipientId,
    });

    setMessageReactions(prev => ({
      ...prev,
      [messageId]: [
        ...(prev[messageId] || []),
        { emoji, userId }
      ]
    }));
  };

  // ============ REMOVE REACTION ============
  const handleRemoveReaction = (messageId, emoji, userId) => {
    socket?.emit("remove-reaction", {
      messageId,
      emoji,
      userId,
      recipientId,
    });

    setMessageReactions(prev => ({
      ...prev,
      [messageId]: (prev[messageId] || []).filter(
        r => !(r.emoji === emoji && r.userId === userId)
      )
    }));
  };

  // ============ HELPER FUNCTIONS ============
  const shouldShowAvatar = (index) => {
    if (index === 0) return true;
    return messages[index].sender._id !== messages[index - 1].sender._id;
  };

  const shouldShowDate = (index) => {
    if (index === 0) return true;
    const currentDate = new Date(messages[index].createdAt).toDateString();
    const prevDate = new Date(messages[index - 1].createdAt).toDateString();
    return currentDate !== prevDate;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: new Date(timestamp).getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  };

  // ============ RENDER ============
  if (!authReady || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">{authReady ? "Loading messages..." : "Initializing..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* ========== HEADER ========== */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/messages" className="hover:bg-blue-500 p-2 rounded-full">
              ← Back
            </Link>
            <div className="flex items-center gap-3">
              {recipientUser?.profilePicture ? (
                <img
                  src={recipientUser.profilePicture}
                  alt={recipientUser.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center font-bold">
                  {recipientUser?.name?.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="font-bold">{recipientUser?.name || "User"}</h1>
                <p className="text-xs text-blue-100">Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== MESSAGES CONTAINER ========== */}
      <div
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <p className="text-6xl mb-3">💬</p>
              <p className="text-xl font-semibold">No messages yet</p>
              <p className="text-sm mt-2">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            const isSender = message.sender._id === user?._id;
            const messageReactions_ = messageReactions[message._id] || [];

            return (
              <div
                key={message._id}
                className="animate-fadeIn"
                onMouseEnter={() => setHoveredMessageId(message._id)}
                onMouseLeave={() => setHoveredMessageId(null)}
              >
                {/* Date Separator */}
                {shouldShowDate(index) && (
                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="text-xs font-semibold text-gray-500 px-3 py-1 bg-white rounded-full">
                      {formatDate(message.createdAt)}
                    </span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>
                )}

                {/* Message */}
                <div className={`flex gap-3 mb-2 ${isSender ? "justify-end" : "justify-start"}`}>
                  {!isSender && shouldShowAvatar(index) && (
                    <img
                      src={message.sender.profilePicture || ""}
                      alt={message.sender.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}

                  <div className={`max-w-xs lg:max-w-md group ${isSender ? "items-end" : "items-start"} flex flex-col`}>
                    {/* Message Bubble */}
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm transition-all hover:shadow-md ${
                        isSender
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
                          : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {/* Reply Quote */}
                      {message.replyTo && (
                        <div className={`text-xs mb-2 pb-2 border-b ${isSender ? "border-blue-400" : "border-gray-300"}`}>
                          ↳ Reply quote here
                        </div>
                      )}

                      {/* Message Text */}
                      <p className="text-sm break-words">{message.text}</p>

                      {/* Attachments */}
                      {message.attachments?.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((att, idx) => (
                            <a
                              key={idx}
                              href={att.path}
                              download
                              className={`block text-xs underline ${
                                isSender ? "text-blue-100" : "text-blue-600"
                              }`}
                            >
                              📎 {att.originalName}
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Time & Status */}
                      <div className={`text-xs mt-1 flex items-center justify-end gap-1 ${
                        isSender ? "text-blue-100" : "text-gray-400"
                      }`}>
                        {formatTime(message.createdAt)}
                        {isSender && <MessageStatusComponent status={message.status || "read"} />}
                      </div>
                    </div>

                    {/* Reactions */}
                    {messageReactions_.length > 0 && (
                      <EmojiPickerSystem.MessageReactionsComponent
                        reactions={messageReactions_}
                        messageId={message._id}
                        currentUserId={user?._id}
                        onAddReaction={handleAddReaction}
                        onRemoveReaction={handleRemoveReaction}
                      />
                    )}

                    {/* Action Buttons (on hover) */}
                    {hoveredMessageId === message._id && isSender && (
                      <div className="flex gap-1 mt-1 bg-white border border-gray-200 rounded-lg p-1 shadow-md">
                        <button
                          onClick={() => handleDeleteMessage(message._id, "me")}
                          className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition"
                          title="Delete for you"
                        >
                          🗑️
                        </button>
                        <button
                          onClick={() => handleAddReaction(message._id, "👍", user?._id)}
                          className="px-2 py-1 text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded transition"
                          title="React"
                        >
                          👍
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ========== TYPING INDICATOR ========== */}
      {typingUsers.length > 0 && (
        <div className="px-6 py-2 bg-gray-50">
          <p className="text-xs text-gray-500">
            <span className="font-semibold">Someone</span> is typing
            <span className="animate-bounce">.</span>
            <span className="animate-bounce delay-100">.</span>
            <span className="animate-bounce delay-200">.</span>
          </p>
        </div>
      )}

      {/* ========== MESSAGE INPUT ========== */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
        {/* File Preview */}
        {attachedFiles.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              📎 {attachedFiles.length} file(s)
            </p>
            <div className="flex flex-wrap gap-2">
              {attachedFiles.map((f, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                >
                  <span>{f.name.length > 15 ? f.name.substring(0, 15) + "..." : f.name}</span>
                  <button
                    onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== idx))}
                    className="text-gray-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reply Preview */}
        {replyingToMessage && (
          <MessageReplyComponent
            message={replyingToMessage}
            onCancel={() => setReplyingToMessage(null)}
          />
        )}

        {/* GIF Preview */}
        {selectedGIFUrl && (
          <div className="mb-4 relative inline-block">
            <img src={selectedGIFUrl} alt="GIF" className="max-w-xs h-32 object-cover rounded-lg" />
            <button
              onClick={() => setSelectedGIFUrl(null)}
              className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="relative flex gap-2 items-end">
          {/* Emoji Picker Container */}
          <div className="relative" ref={emojiPickerRef}>
            <EmojiPickerSystem.EmojiPickerComponent
              showEmojiPicker={showEmojiPicker}
              emojiPickerRef={emojiPickerRef}
              emojiButtonRef={emojiButtonRef}
              position={emojiPickerPosition}
              onEmojiSelect={handleEmojiSelect}
              onToggle={() => setShowEmojiPicker(!showEmojiPicker)}
            />
          </div>

          {/* File Upload Button */}
          <FileAttachmentButton
            disabled={sending}
            onFilesSelected={(files) => setAttachedFiles(prev => [...prev, ...files.map(f => ({ file: f, name: f.name }))])}
          />

          {/* GIF Button */}
          <GIFPickerComponent
            disabled={sending}
            onSelectGIF={setSelectedGIFUrl}
          />

          {/* Message Input */}
          <AutoExpandTextArea
            value={messageInput}
            onChange={handleInputChange}
            placeholder="Type a message... (Shift+Enter for new line)"
            disabled={sending}
            maxHeight={120}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={sending || (!messageInput.trim() && attachedFiles.length === 0 && !selectedGIFUrl)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center"
          >
            {sending ? "⏳" : "➤"}
          </button>
        </form>
      </div>
    </div>
  );
}
