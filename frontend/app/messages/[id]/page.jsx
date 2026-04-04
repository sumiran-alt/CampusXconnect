"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { messageAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import Link from "next/link";
import { io } from "socket.io-client";
import dynamic from "next/dynamic";

// Dynamically import Picker to avoid Turbopack bundling issues
// Use direct dynamic import with proper default export
const Picker = dynamic(
  () => import("emoji-mart").then(mod => mod.Picker),
  {
    ssr: false,
    loading: () => <div className="p-4 text-gray-500">Loading emojis...</div>
  }
);

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const recipientId = params.id;
  const { user, isAuthenticated, token, initialize } = useAuthStore();

  // ==== STATE ====
  const [messages, setMessages] = useState([]);
  const [recipientUser, setRecipientUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [authReady, setAuthReady] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [deleteMenuOpen, setDeleteMenuOpen] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  // Refs
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const deleteMenuRef = useRef(null);
  const emojiPickerRef = useRef(null);  // ✅ FIX: Container for emoji picker
  const emojiButtonRef = useRef(null);   // ✅ FIX: Reference to emoji button for click-outside

  // ==== AUTH INIT & CHECK ====
  useEffect(() => {
    // Initialize auth from localStorage on component mount
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Wait for auth to be ready, then redirect if not authenticated
    const checkAuth = async () => {
      // Give auth store time to initialize
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if user is authenticated
      const currentState = useAuthStore.getState();
      
      if (!currentState.isAuthenticated || !currentState.user || !currentState.user._id) {
        console.log("🔐 Not authenticated, redirecting to login...");
        router.push("/auth");
        return;
      }
      
      console.log("✅ Auth ready, user ID:", currentState.user._id);
      setAuthReady(true);
    };
    
    checkAuth();
  }, [router]);

  // ==== FETCH INITIAL MESSAGES ====
  useEffect(() => {
    if (!authReady || !user) {
      return;
    }
    
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await messageAPI.getConversation(recipientId);
        const msgs = response.data.messages || [];

        // Sort by timestamp (oldest first)
        const sortedMessages = msgs.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        setMessages(sortedMessages);

        // Extract recipient user info from first message
        if (msgs.length > 0) {
          const firstMsg = msgs[0];
          const recipient =
            firstMsg.sender._id === user._id
              ? firstMsg.recipient
              : firstMsg.sender;
          setRecipientUser(recipient);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages");
        setLoading(false);
      }
    };

    fetchMessages();
  }, [recipientId, user, authReady]);

  // ==== SOCKET.IO SETUP ====
  useEffect(() => {
    if (!authReady || !user || !token) {
      console.log("⏳ Waiting for auth to load...", { authReady, user: !!user, token: !!token });
      return;
    }

    if (!user._id) {
      console.error("❌ User ID is missing from auth store", { user });
      toast.error("User ID not found. Please log in again.");
      return;
    }

    console.log("🔌 Connecting to Socket.io with:", {
      token: token ? "✓ present" : "✗ missing",
      userId: user?._id ? `✓ ${user._id}` : "✗ missing",
    });

    // Initialize Socket.io
    const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000", {
      auth: {
        token,
        userId: user._id,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Connection events
    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      toast.success("Connected to chat");
      // Join conversation room
      newSocket.emit("join_room", {
        userId1: user._id,
        userId2: recipientId,
      });
    });

    // Listen for incoming messages
    newSocket.on("receive_message", (data) => {
      const { senderId, senderName, senderAvatar, recipientId: recId, text, timestamp } = data;

      // Only add if it's from this conversation
      if ((senderId === recipientId && recId === user._id) || (senderId === user._id)) {
        const newMessage = {
          _id: `${senderId}_${timestamp}`,
          sender: {
            _id: senderId,
            name: senderName,
            profilePicture: senderAvatar,
          },
          recipient: { _id: recId },
          text,
          createdAt: new Date(timestamp).toISOString(),
          isRead: false,
        };

        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m._id === newMessage._id)) {
            return prev;
          }
          return [...prev, newMessage].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
        });

        scrollToBottom();
      }
    });

    // Listen for typing indicator
    newSocket.on("user_typing", (data) => {
      const { userId, isTypingFlag } = data;
      if (userId === recipientId) {
        setIsTyping(isTypingFlag);
      }
    });

    // Connection error - show detailed error message
    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      toast.error(`Connection failed: ${error.message}`);
    });

    // Disconnect
    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      toast.error("Disconnected from chat");
    });

    setSocket(newSocket);

    // Cleanup
    return () => {
      if (newSocket) {
        newSocket.emit("leave_room", {
          userId1: user._id,
          userId2: recipientId,
        });
        newSocket.disconnect();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [user, token, recipientId, authReady]);

  // ==== AUTO SCROLL ====
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ==== CLOSE EMOJI PICKER ON OUTSIDE CLICK ====
  useEffect(() => {
    const handleClickOutside = (event) => {
      // ✅ FIX: Check if click is on emoji button (don't close) or emoji picker (don't close)
      if (
        emojiButtonRef.current && 
        emojiButtonRef.current.contains(event.target)
      ) {
        // Click is on the emoji button - let the button handler toggle it
        return;
      }

      // If click is NOT on emoji picker, close it
      if (
        emojiPickerRef.current && 
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    // ✅ FIX: Add keyboard support - ESC key closes picker
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && showEmojiPicker) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showEmojiPicker]);

  // ==== SEND MESSAGE ====
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageInput.trim() && attachedFiles.length === 0) {
      toast.error("Please type a message or attach files");
      return;
    }

    if (!user) {
      toast.error("Please log in to send messages");
      return;
    }

    setSending(true);
    const messageContent = messageInput.trim();

    try {
      // Prepare FormData for file upload if files are attached
      if (attachedFiles.length > 0) {
        const formData = new FormData();
        formData.append("recipientId", recipientId);
        formData.append("text", messageContent || "[File]");
        attachedFiles.forEach((fileObj) => {
          formData.append("files", fileObj.file);
        });

        // Send with files (pass formData as third parameter)
        const response = await messageAPI.sendMessage(recipientId, messageContent, formData);
        const savedMessage = response.data.message;

        // Add optimistic message with attachments from server
        const optimisticMessage = {
          _id: savedMessage._id,
          sender: {
            _id: user._id,
            name: user.name,
            profilePicture: user.profilePicture,
          },
          recipient: { _id: recipientId },
          text: messageContent || `[Sent ${attachedFiles.length} file(s)]`,
          attachments: savedMessage.attachments || [], // Include attachments from server
          createdAt: new Date().toISOString(),
          isRead: false,
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        setMessageInput("");
        setAttachedFiles([]);

        // Note: Socket.io handled by server, don't emit here to avoid duplicates
      } else {
        // Send text-only message
        const response = await messageAPI.sendMessage(recipientId, messageContent);
        const savedMessage = response.data.message;

        // Add optimistic message
        const optimisticMessage = {
          _id: savedMessage._id,
          sender: {
            _id: user._id,
            name: user.name,
            profilePicture: user.profilePicture,
          },
          recipient: { _id: recipientId },
          text: messageContent,
          createdAt: new Date().toISOString(),
          isRead: false,
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        setMessageInput("");

        // Note: Socket.io handled by server, don't emit here to avoid duplicates
      }

      scrollToBottom();
      toast.success("Message sent!");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // ==== TYPING INDICATOR ====
  const handleInputChange = (e) => {
    setMessageInput(e.target.value);

    // Emit typing event
    if (socket && !isTyping) {
      socket.emit("typing", {
        userId: user._id,
        recipientId,
        isTyping: true,
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Emit stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (socket) {
        socket.emit("typing", {
          userId: user._id,
          recipientId,
          isTyping: false,
        });
      }
    }, 2000);
  };

  // ==== EMOJI PICKER ====
  const handleEmojiSelect = (emoji) => {
    try {
      // ✅ FIX: Handle different emoji-mart versions and properties
      // emoji-mart v5 structure: emoji can be { native, name, ... }
      const emojiChar = emoji.native || emoji || "";
      
      if (!emojiChar) {
        console.warn("⚠️ Emoji character not found:", emoji);
        return;
      }

      setMessageInput((prev) => prev + emojiChar);
      
      // Close picker after selection (better UX)
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("❌ Error selecting emoji:", error);
      toast.error("Failed to select emoji");
    }
  };

  // ==== FILE UPLOAD ====
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 5;

    if (files.length + attachedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max size is 10MB.`);
        return false;
      }
      return true;
    });

    const newFiles = validFiles.map((file) => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      type: file.type,
      file,
    }));

    setAttachedFiles((prev) => [...prev, ...newFiles]);
    toast.success(`${validFiles.length} file(s) selected`);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ==== DELETE MESSAGE ====
  const handleDeleteMessage = async (messageId, deleteFor) => {
    console.log("🗑️ Delete handler called:", { messageId, deleteFor });
    setDeleting(true);
    try {
      console.log("📤 Calling API to delete message...");
      const response = await messageAPI.deleteMessage(messageId, deleteFor);
      console.log("✅ Delete response:", response);
      
      // Remove from local state
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg._id !== messageId);
        console.log("📝 Messages after filter:", filtered.length);
        return filtered;
      });
      
      setDeleteMenuOpen(null);
      
      if (deleteFor === "everyone") {
        toast.success("Message deleted for everyone");
      } else {
        toast.success("Message deleted for you");
      }
    } catch (error) {
      console.error("❌ Error deleting message:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to delete message");
    } finally {
      setDeleting(false);
    }
  };

  // ==== CLOSE DELETE MENU ON OUTSIDE CLICK ====
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (deleteMenuRef.current && !deleteMenuRef.current.contains(event.target)) {
        setDeleteMenuOpen(null);
      }
    };

    if (deleteMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [deleteMenuOpen]);

  // ==== HELPER: Check if avatar should show ====
  const shouldShowAvatar = (index) => {
    if (index === 0) return true;
    const currentMsg = messages[index];
    const prevMsg = messages[index - 1];
    return currentMsg.sender._id !== prevMsg.sender._id;
  };

  // ==== HELPER: Check if date separator should show ====
  const shouldShowDate = (index) => {
    if (index === 0) return true;
    const currentMsg = messages[index];
    const prevMsg = messages[index - 1];
    const currentDate = new Date(currentMsg.createdAt).toDateString();
    const prevDate = new Date(prevMsg.createdAt).toDateString();
    return currentDate !== prevDate;
  };

  // ==== FORMAT TIME ====
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==== FORMAT DATE ====
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: new Date(timestamp).getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  };

  // ==== RENDER ====
  if (!authReady || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">{authReady ? "Loading messages..." : "Initializing..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* ==== HEADER ==== */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/messages"
            className="hover:bg-blue-500 p-2 rounded-full transition"
            title="Back to messages"
          >
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
              <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xl font-bold">
                {recipientUser?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="font-bold text-lg">{recipientUser?.name || "User"}</h1>
              <p className="text-sm text-blue-100">Online</p>
            </div>
          </div>
        </div>
        {recipientUser && (
          <Link
            href={`/profile/${recipientUser._id}`}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-full text-sm font-semibold transition"
          >
            Profile
          </Link>
        )}
      </div>

      {/* ==== MESSAGES CONTAINER ==== */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <p className="text-5xl mb-3">💬</p>
              <p className="text-lg font-semibold">No messages yet</p>
              <p className="text-sm mt-2">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isSender = message.sender._id === user?._id;
              const showAvatar = shouldShowAvatar(index);
              const showDate = shouldShowDate(index);

              return (
                <div 
                  key={message._id} 
                  className="animate-fadeIn"
                  onMouseEnter={() => isSender && setHoveredMessageId(message._id)}
                  onMouseLeave={() => setHoveredMessageId(null)}
                >
                  {/* Date Separator */}
                  {showDate && (
                    <div className="flex items-center gap-4 my-6">
                      <div className="flex-1 border-t border-gray-300"></div>
                      <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full">
                        {formatDate(message.createdAt)}
                      </span>
                      <div className="flex-1 border-t border-gray-300"></div>
                    </div>
                  )}

                  {/* Message Row */}
                  <div
                    className={`flex gap-2 mb-2 ${
                      isSender ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Avatar (left side for receiver) */}
                    {!isSender && showAvatar && (
                      <img
                        src={
                          message.sender?.profilePicture ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            message.sender?.name || "User"
                          )}&background=random`
                        }
                        alt={message.sender?.name}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1 shadow-sm"
                      />
                    )}
                    {!isSender && !showAvatar && <div className="w-8 flex-shrink-0"></div>}

                    {/* Message Bubble */}
                    <div
                      className={`flex flex-col max-w-xs lg:max-w-md ${
                        isSender ? "items-end" : "items-start"
                      }`}
                    >
                      {/* Sender name (for received messages) */}
                      {!isSender && showAvatar && (
                        <p className="text-xs font-semibold text-gray-700 mb-1 ml-2">
                          {message.sender?.name}
                        </p>
                      )}

                      {/* Bubble Container */}
                      <div className="group relative">
                        <div
                          className={`px-4 py-2.5 rounded-2xl shadow-sm transition-all duration-200 ${
                            isSender
                              ? "bg-blue-600 text-white rounded-br-none hover:shadow-md"
                              : "bg-gray-200 text-gray-900 rounded-bl-none hover:shadow-md"
                          }`}
                        >
                          <p className="break-words text-sm leading-relaxed">
                            {message.text}
                          </p>

                        {/* Display attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-3 space-y-2 pt-2 border-t border-opacity-30 border-white">
                            {message.attachments.map((attachment, idx) => {
                              const fileExtension = attachment.originalName.split(".").pop()?.toUpperCase() || "FILE";
                              const isImage = attachment.mimetype.startsWith("image/");
                              const fileSizeMB = (attachment.size / 1024 / 1024).toFixed(2);

                              return (
                                <div key={idx} className="flex items-center gap-2">
                                  {isImage ? (
                                    <img
                                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}${attachment.path}`}
                                      alt={attachment.originalName}
                                      className={`rounded-lg max-w-xs max-h-64 cursor-pointer hover:opacity-80 transition ${
                                        isSender ? "border border-blue-300" : "border border-gray-300"
                                      }`}
                                      onClick={() => {
                                        const a = document.createElement("a");
                                        a.href = `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}${attachment.path}`;
                                        a.download = attachment.originalName;
                                        a.click();
                                      }}
                                    />
                                  ) : (
                                    <a
                                      href={`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}${attachment.path}`}
                                      download={attachment.originalName}
                                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-xs font-semibold ${
                                        isSender
                                          ? "bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
                                          : "bg-white hover:bg-gray-100 text-gray-700"
                                      }`}
                                      title={`${attachment.originalName} (${fileSizeMB}MB)`}
                                    >
                                      <span className="text-lg">📎</span>
                                      <div className="text-left">
                                        <div className="line-clamp-1">{attachment.originalName}</div>
                                        <div className={`text-xs ${isSender ? "text-blue-100" : "text-gray-500"}`}>
                                          {fileSizeMB}MB
                                        </div>
                                      </div>
                                    </a>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Timestamp & Status */}
                        <div
                          className={`flex items-center gap-1.5 mt-1.5 px-2 text-xs ${
                            isSender ? "justify-end text-gray-500" : "justify-start text-gray-500"
                          }`}
                        >
                          <span>{formatTime(message.createdAt)}</span>
                          {isSender && (
                            <>
                              <span 
                                className={`font-bold ${message.isRead ? "text-blue-600" : "text-gray-400"}`}
                                title={message.isRead ? "Seen" : "Sent"}
                              >
                                {message.isRead ? "✓✓" : "✓"}
                              </span>
                              
                              {/* Delete Button - Show on Hover */}
                              {hoveredMessageId === message._id && (
                                <div className="relative ml-2">
                                  <button
                                    onClick={() => setDeleteMenuOpen(deleteMenuOpen === message._id ? null : message._id)}
                                    className="text-gray-400 hover:text-red-500 transition"
                                    title="Delete message"
                                  >
                                    ⋯
                                  </button>

                                  {/* Delete Menu */}
                                  {deleteMenuOpen === message._id && (
                                    <div
                                      ref={deleteMenuRef}
                                      className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48"
                                    >
                                      <button
                                        onClick={() => handleDeleteMessage(message._id, "me")}
                                        disabled={deleting}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 rounded-t-lg transition"
                                      >
                                        {deleting ? "Deleting..." : "Delete for me"}
                                      </button>
                                      <button
                                        onClick={() => handleDeleteMessage(message._id, "everyone")}
                                        disabled={deleting}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 rounded-b-lg border-t border-gray-200 transition"
                                      >
                                        {deleting ? "Deleting..." : "Delete for everyone"}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        </div>
                      </div>
                    </div>

                    {/* Avatar (right side for sender) */}
                    {isSender && showAvatar && (
                      <img
                        src={
                          user?.profilePicture ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user?.name || "User"
                          )}&background=random`
                        }
                        alt={user?.name}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1 shadow-sm"
                      />
                    )}
                    {isSender && !showAvatar && <div className="w-8 flex-shrink-0"></div>}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 mb-4 animate-fadeIn">
                <img
                  src={
                    recipientUser?.profilePicture ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      recipientUser?.name || "User"
                    )}&background=random`
                  }
                  alt={recipientUser?.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="bg-gray-300 rounded-2xl rounded-bl-none px-4 py-2 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></span>
                    <span
                      className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* ==== MESSAGE INPUT ==== */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
        {/* File Preview */}
        {attachedFiles.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              📎 {attachedFiles.length} file(s) attached
            </p>
            <div className="flex flex-wrap gap-2">
              {attachedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700"
                >
                  <span>{file.name.length > 20 ? file.name.substring(0, 20) + "..." : file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="text-gray-400 hover:text-red-500 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="relative">
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-16 left-0 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
              role="region"
              aria-label="Emoji picker"
            >
              {/* ✅ FIX: Add loading and error boundary */}
              <div className="max-h-96 overflow-y-auto">
                <Picker
                  theme="light"
                  onEmojiSelect={handleEmojiSelect}
                  autoFocus
                  perLine={8}
                  emojiSize={24}
                />
              </div>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.docx,.doc,.txt,.zip"
            />

            {/* File Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={sending}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2.5 rounded-full transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
              title="Attach files"
            >
              ➕
            </button>

            {/* Emoji Button */}
            <button
              ref={emojiButtonRef}
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={sending}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2.5 rounded-full transition-colors duration-200 disabled:opacity-50 flex items-center justify-center hover:shadow-md"
              title="Add emoji (Press ESC to close)"
              aria-label="Emoji picker toggle"
            >
              😊
            </button>

            {/* Message Input */}
            <input
              type="text"
              value={messageInput}
              onChange={handleInputChange}
              placeholder="Type a message..."
              disabled={sending}
              className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full border-2 border-transparent focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-sm disabled:bg-gray-100 disabled:opacity-60"
              autoFocus
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={sending || (!messageInput.trim() && attachedFiles.length === 0)}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-200 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center"
            >
              {sending ? (
                <span className="animate-pulse">⏳</span>
              ) : (
                <span>➤</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
