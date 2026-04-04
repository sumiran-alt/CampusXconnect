"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { messageAPI, searchAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import Link from "next/link";

export default function MessagesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [filter, setFilter] = useState("all"); // all, unread, archived

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [isAuthenticated, router]);

  const fetchConversations = async () => {
    try {
      const response = await messageAPI.getInbox();
      const convos = response.data.conversations || [];
      
      // Filter based on active filter
      let filtered = convos;
      if (filter === "unread") {
        filtered = convos.filter(
          (conv) =>
            conv.lastMessage &&
            !conv.lastMessage.isRead &&
            conv.lastMessage.recipient === user._id
        );
      }
      
      setConversations(filtered);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to load messages");
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await searchAPI.getAllUsers();
      const filtered = response.data.users.filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) &&
          u._id !== user._id
      );
      setSearchResults(filtered);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  const startConversation = (userId) => {
    setShowSearch(false);
    setSearchQuery("");
    router.push(`/messages/${userId}`);
  };

  const getUnreadCount = () => {
    return conversations.filter(
      (conv) =>
        conv.lastMessage &&
        !conv.lastMessage.isRead &&
        conv.lastMessage.recipient === user._id
    ).length;
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const truncateMessage = (text, length = 50) => {
    if (!text) return "(No message)";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-flex animate-spin">💬</div>
          <p className="mt-2 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[70vh]">
        {/* Sidebar - Conversations List */}
        <div className="md:col-span-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary to-blue-600">
            <h1 className="text-2xl font-bold text-white">Chats</h1>
            <p className="text-blue-100 text-sm mt-1">
              {getUnreadCount()} unread
            </p>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-gray-100 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search or start new chat..."
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => setShowSearch(true)}
                className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}

              {/* Search Results */}
              {showSearch && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl mt-1 z-10 max-h-64 overflow-y-auto">
                  {searchResults.map((u) => (
                    <button
                      key={u._id}
                      onClick={() => startConversation(u._id)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 flex items-center gap-3 transition"
                    >
                      <img
                        src={
                          u.profilePicture ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}`
                        }
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{
                          u.name
                        }</p>
                        <p className="text-xs text-gray-500 truncate">
                          {u.branch || "Campus User"}
                        </p>
                      </div>
                      <span className="text-xs text-primary font-semibold">▶</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                filter === "all"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                filter === "unread"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Unread
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="text-center py-12 text-gray-500 px-4">
                <p className="text-2xl mb-2">💬</p>
                <p className="font-semibold">No messages yet</p>
                <p className="text-sm mt-2">
                  Start a new conversation by searching above
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {conversations.map((conv) => {
                  const otherUser = conv.user;
                  const lastMessage = conv.lastMessage;
                  const isUnread =
                    lastMessage &&
                    !lastMessage.isRead &&
                    lastMessage.recipient === user._id;

                  return (
                    <Link
                      key={conv._id}
                      href={`/messages/${otherUser._id}`}
                      className={`block hover:bg-gray-50 transition p-3 cursor-pointer ${
                        isUnread ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex gap-3 items-center">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={
                              otherUser?.profilePicture ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                otherUser?.name || "User"
                              )}`
                            }
                            alt={otherUser?.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {isUnread && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>

                        {/* Message Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline gap-2">
                            <p
                              className={`font-semibold truncate ${
                                isUnread
                                  ? "text-gray-900 font-bold"
                                  : "text-gray-800"
                              }`}
                            >
                              {otherUser?.name}
                            </p>
                            <p className="text-xs text-gray-500 flex-shrink-0">
                              {lastMessage && formatTime(lastMessage.createdAt)}
                            </p>
                          </div>
                          <p
                            className={`text-sm truncate ${
                              isUnread
                                ? "text-gray-700 font-medium text-primary"
                                : "text-gray-600"
                            }}`}
                          >
                            {lastMessage?.sender._id === user._id ? "You: " : ""}
                            {truncateMessage(lastMessage?.text)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area - Empty State */}
        <div className="md:col-span-3 bg-white rounded-lg shadow-lg hidden md:flex flex-col items-center justify-center">
          <div className="text-center text-gray-400">
            <p className="text-6xl mb-4">💬</p>
            <p className="text-xl font-semibold">Select a conversation to start</p>
            <p className="text-sm mt-2">Choose from your existing messages or search to start a new one</p>
          </div>
        </div>
      </div>
    </div>
  );
}
