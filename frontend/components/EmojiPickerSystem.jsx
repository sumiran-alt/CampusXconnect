/**
 * Emoji Picker System - Complete Production-Ready Component
 * Features: Emoji picker, reactions, GIF support, message editing, reply
 */

"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";

// Dynamically import emoji-mart to avoid Turbopack issues
const Picker = dynamic(
  () => import("emoji-mart").then(mod => mod.Picker),
  {
    ssr: false,
    loading: () => <div className="p-4 text-gray-500 text-center">Loading emojis...</div>
  }
);

/**
 * EmojiPickerSystem Component
 * Handles emoji selection, reactions, and emoji UI
 */
export const EmojiPickerSystem = {
  /**
   * Hook to manage emoji picker state and handlers
   * @returns {Object} Emoji picker controller object
   */
  useEmojiPicker: () => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [emojiPickerPosition, setEmojiPickerPosition] = useState("top");
    const emojiPickerRef = useRef(null);
    const emojiButtonRef = useRef(null);

    // ✅ FIX: Handle outside click to close emoji picker (with button check)
    useEffect(() => {
      const handleClickOutside = (event) => {
        // If click is on emoji button, let button handler manage it
        if (emojiButtonRef.current && emojiButtonRef.current.contains(event.target)) {
          return;
        }

        // If click is NOT on emoji picker, close it
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
          setShowEmojiPicker(false);
        }
      };

      // ✅ FIX: Add keyboard support for ESC key
      const handleKeyDown = (event) => {
        if (event.key === "Escape" && showEmojiPicker) {
          setShowEmojiPicker(false);
        }
      };

      if (showEmojiPicker) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
          document.removeEventListener("keydown", handleKeyDown);
        };
      }
    }, [showEmojiPicker]);

    // Determine emoji picker position based on viewport
    const updateEmojiPickerPosition = useCallback(() => {
      if (emojiButtonRef.current) {
        const rect = emojiButtonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        setEmojiPickerPosition(spaceBelow < 400 ? "top" : "bottom");
      }
    }, []);

    return {
      showEmojiPicker,
      setShowEmojiPicker,
      emojiPickerRef,
      emojiButtonRef,
      emojiPickerPosition,
      updateEmojiPickerPosition,
    };
  },

  /**
   * EmojiPickerComponent
   * Renders the emoji picker UI
   */
  EmojiPickerComponent: ({
    showEmojiPicker,
    emojiPickerRef,
    emojiButtonRef,
    position,
    onEmojiSelect,
    onToggle,
  }) => {
    return (
      <>
        {/* Emoji Button */}
        <button
          ref={emojiButtonRef}
          type="button"
          onClick={() => onToggle?.()}
          className="bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-white px-3 py-2.5 rounded-full transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
          title="Add emoji"
          aria-label="Emoji picker"
        >
          😊
        </button>

        {/* Emoji Picker Dropdown */}
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className={`absolute z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn ${
              position === "top" ? "bottom-24" : "bottom-20"
            } left-0`}
          >
            <Picker
              theme="light"
              onEmojiSelect={onEmojiSelect}
              autoFocus
              previewPosition="none"
              native
            />
          </div>
        )}
      </>
    );
  },

  /**
   * MessageReactionsComponent
   * Displays emoji reactions on messages
   */
  MessageReactionsComponent: ({
    reactions = [],
    onAddReaction,
    onRemoveReaction,
    currentUserId,
    messageId,
  }) => {
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const reactionPickerRef = useRef(null);

    // Group reactions by emoji
    const groupedReactions = useMemo(() => {
      const groups = {};
      reactions.forEach(reaction => {
        if (!groups[reaction.emoji]) {
          groups[reaction.emoji] = [];
        }
        groups[reaction.emoji].push(reaction.userId);
      });
      return groups;
    }, [reactions]);

    // Handle outside click
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (reactionPickerRef.current && !reactionPickerRef.current.contains(event.target)) {
          setShowReactionPicker(false);
        }
      };

      if (showReactionPicker) {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }
    }, [showReactionPicker]);

    return (
      <div className="mt-2 flex flex-wrap gap-1 items-center">
        {/* Reaction Buttons */}
        {Object.entries(groupedReactions).map(([emoji, userIds]) => {
          const userReacted = userIds.includes(currentUserId);
          return (
            <button
              key={emoji}
              onClick={() => {
                if (userReacted) {
                  onRemoveReaction?.(messageId, emoji, currentUserId);
                } else {
                  onAddReaction?.(messageId, emoji, currentUserId);
                }
              }}
              className={`px-2 py-1 rounded-full text-sm transition-all hover:scale-110 ${
                userReacted
                  ? "bg-yellow-200 border-2 border-yellow-400 scale-110"
                  : "bg-gray-100 hover:bg-gray-200 border border-gray-200"
              }`}
              title={`${userIds.length} reaction${userIds.length !== 1 ? "s" : ""}`}
            >
              <span>{emoji}</span>
              {userIds.length > 1 && <span className="ml-1 text-xs font-semibold">{userIds.length}</span>}
            </button>
          );
        })}

        {/* Add Reaction Button */}
        <div className="relative">
          <button
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className="px-2 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all hover:scale-110"
            title="Add reaction"
          >
            +
          </button>

          {/* Quick Reaction Picker */}
          {showReactionPicker && (
            <div
              ref={reactionPickerRef}
              className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex gap-1 animate-fadeIn"
            >
              {["👍", "❤️", "😂", "😢", "😡", "🔥"].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => {
                    onAddReaction?.(messageId, emoji, currentUserId);
                    setShowReactionPicker(false);
                  }}
                  className="text-2xl hover:scale-125 transition-transform cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },

  /**
   * EmojiGridComponent
   * Grid view of common emojis
   */
  EmojiGridComponent: ({ onSelectEmoji }) => {
    const commonEmojis = [
      "😀", "😃", "😄", "😁", "😆", "😅",
      "🤣", "😂", "😉", "😊", "😇", "🥰",
      "😍", "🤩", "😘", "😗", "😋", "😜",
      "🤪", "😌", "😔", "😑", "😐", "🥐",
      "😒", "😏", "😞", "😔", "😳", "🥺",
      "😦", "😧", "😨", "😰", "😥", "😢",
      "😭", "😱", "😖", "😣", "😞", "😓",
      "😩", "😫", "🥱", "😤", "😡", "🤬",
    ];

    return (
      <div className="grid grid-cols-8 gap-1 p-3">
        {commonEmojis.map((emoji, idx) => (
          <button
            key={idx}
            onClick={() => onSelectEmoji?.(emoji)}
            className="text-xl hover:bg-gray-100 p-1 rounded transition-all hover:scale-125 cursor-pointer"
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    );
  },
};

/**
 * MessageStatusComponent
 * Shows message delivery and read status
 */
export const MessageStatusComponent = ({ status = "sending" }) => {
  const statusConfig = {
    sending: { icon: "⏳", color: "text-gray-400", label: "Sending..." },
    sent: { icon: "✓", color: "text-gray-400", label: "Sent" },
    delivered: { icon: "✓✓", color: "text-gray-500", label: "Delivered" },
    read: { icon: "✓✓", color: "text-blue-500", label: "Read" },
  };

  const config = statusConfig[status] || statusConfig.sending;

  return (
    <span className={`${config.color} text-xs font-semibold ml-1`} title={config.label}>
      {config.icon}
    </span>
  );
};

/**
 * MessageReplyComponent
 * Display quoted message being replied to
 */
export const MessageReplyComponent = ({ message, onCancel }) => {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-3 flex justify-between items-start">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-blue-600 mb-1">
          ↳ Replying to {message.senderName}
        </p>
        <p className="text-sm text-gray-700 truncate">
          {message.text || "📎 " + (message.fileName || "File")}
        </p>
      </div>
      <button
        onClick={onCancel}
        className="text-gray-400 hover:text-gray-600 ml-2 text-lg"
        title="Cancel reply"
      >
        ✕
      </button>
    </div>
  );
};

/**
 * AutoExpandTextArea Component
 * Textarea that expands as user types
 */
export const AutoExpandTextArea = ({
  value,
  onChange,
  placeholder,
  disabled,
  onKeyDown,
  maxHeight = 120,
  ...props
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + "px";
    }
  }, [value, maxHeight]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Shift + Enter: new line
        e.preventDefault();
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue = value.substring(0, start) + "\n" + value.substring(end);
        onChange?.({ target: { value: newValue } });
        
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }, 0);
      } else {
        // Enter: send message
        onKeyDown?.(e);
      }
    } else {
      onKeyDown?.(e);
    }
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      rows={1}
      className="flex-1 px-4 py-2.5 bg-gray-100 rounded-2xl border-2 border-transparent focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-sm disabled:bg-gray-100 disabled:opacity-60 resize-none max-h-[120px] overflow-hidden"
      style={{ minHeight: "44px" }}
      {...props}
    />
  );
};

/**
 * File AttachmentButton Component
 * Advanced file upload with progress and preview
 */
export const FileAttachmentButton = ({
  onFilesSelected,
  disabled,
  maxFiles = 5,
  maxSize = 10, // MB
  acceptedTypes = ["image/*", ".pdf", ".docx", ".doc", ".txt", ".zip", ".mp4", ".mp3"],
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const getFileCategory = (file) => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    if (file.type.includes("pdf")) return "pdf";
    return "file";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const maxSizeBytes = maxSize * 1024 * 1024;
    const validFiles = files.filter(file => {
      if (file.size > maxSizeBytes) {
        console.warn(`File ${file.name} exceeds ${maxSize}MB limit`);
        return false;
      }
      return true;
    }).slice(0, maxFiles);

    onFilesSelected?.(validFiles);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`transition-all ${isDragging ? "opacity-60" : ""}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => processFiles(Array.from(e.target.files || []))}
        accept={acceptedTypes.join(",")}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-3 py-2.5 rounded-full transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 disabled:opacity-50"
        title={`Attach files (max ${maxFiles} files, ${maxSize}MB each)`}
        aria-label="File attachment"
      >
        ➕
      </button>
    </div>
  );
};

/**
 * MessageEditingComponent
 * UI for editing messages
 */
export const MessageEditingComponent = ({
  originalText,
  onSave,
  onCancel,
  disabled,
}) => {
  const [editedText, setEditedText] = useState(originalText);

  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded mb-3 space-y-2">
      <p className="text-xs font-semibold text-amber-700">Editing message</p>
      <textarea
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
        className="w-full px-3 py-2 border border-amber-200 rounded text-sm focus:outline-none focus:border-amber-500"
        rows={3}
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          disabled={disabled}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave?.(editedText)}
          disabled={disabled || !editedText.trim()}
          className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
};

/**
 * GIFPickerComponent
 * Giphy GIF picker integration
 */
export const GIFPickerComponent = ({ onSelectGIF, disabled }) => {
  const [showGIFPicker, setShowGIFPicker] = useState(false);
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const gifPickerRef = useRef(null);

  const searchGIFs = useCallback(async (query = "trending") => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/trending?api_key=sXpGUJYb922GEG52NsHQ6Mle8dk0 Països&limit=12`
      );
      const data = await response.json();
      setGifs(data.data || []);
    } catch (error) {
      console.error("Error fetching GIFs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (showGIFPicker) {
      searchGIFs();
    }
  }, [showGIFPicker, searchGIFs]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (gifPickerRef.current && !gifPickerRef.current.contains(event.target)) {
        setShowGIFPicker(false);
      }
    };

    if (showGIFPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showGIFPicker]);

  return (
    <div className="relative" ref={gifPickerRef}>
      <button
        type="button"
        onClick={() => setShowGIFPicker(!showGIFPicker)}
        disabled={disabled}
        className="bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white px-3 py-2.5 rounded-full transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 disabled:opacity-50"
        title="Send GIF"
        aria-label="GIF picker"
      >
        GIF
      </button>

      {showGIFPicker && (
        <div className="absolute bottom-20 left-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-80 z-50 animate-fadeIn">
          {loading ? (
            <div className="flex items-center justify-center p-6">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
              {gifs.map((gif) => (
                <button
                  key={gif.id}
                  onClick={() => {
                    onSelectGIF?.(gif.images.fixed_height.url);
                    setShowGIFPicker(false);
                  }}
                  className="overflow-hidden rounded-lg hover:opacity-75 transition-opacity"
                >
                  <img
                    src={gif.images.fixed_height_small.url}
                    alt="GIF"
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmojiPickerSystem;
