"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { notificationAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function NotificationsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all"); // 'all', 'unread', 'read'

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    fetchNotifications();
  }, [isAuthenticated, currentPage, filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getAll(currentPage, 20);

      let filteredNotifications = response.data.notifications || [];

      // Apply filter
      if (filter === "unread") {
        filteredNotifications = filteredNotifications.filter((n) => !n.isRead);
      } else if (filter === "read") {
        filteredNotifications = filteredNotifications.filter((n) => n.isRead);
      }

      setNotifications(filteredNotifications);
      setTotalPages(response.data.pages || 1);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId, isCurrentlyRead) => {
    try {
      if (!isCurrentlyRead) {
        await notificationAPI.markAsRead(notificationId);
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notificationId
              ? { ...notif, isRead: true, readAt: new Date() }
              : notif,
          ),
        );
        toast.success("Marked as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true })),
      );
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationAPI.delete(notificationId);
      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId),
      );
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "CONNECTION_REQUEST":
        return "👤";
      case "CONNECTION_ACCEPTED":
        return "✅";
      case "CONNECTION_REMOVED":
        return "❌";
      default:
        return "📢";
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.link) {
      router.push(notification.link);
    }
    handleMarkAsRead(notification._id, notification.isRead);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Notifications
              </h1>
              <p className="text-gray-600 mt-2">
                Stay updated with your connections
              </p>
            </div>
          </div>

          {/* Filter and Actions */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => {
                setFilter("all");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setFilter("unread");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "unread"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => {
                setFilter("read");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "read"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Read
            </button>
            {filter === "unread" && notifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="ml-auto px-4 py-2 rounded-lg font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-4xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No notifications
            </h3>
            <p className="text-gray-600">
              {filter === "unread"
                ? "You're all caught up! No unread notifications."
                : filter === "read"
                  ? "No read notifications to show."
                  : "You don't have any notifications yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Notifications List */}
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`rounded-lg border transition-all cursor-pointer ${
                  notification.isRead
                    ? "bg-white border-gray-200"
                    : "bg-blue-50 border-blue-200"
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="p-4 flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-2xl flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification._id);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-red-600"
                          title="Delete notification"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <span>
                        {new Date(notification.createdAt).toLocaleDateString()}{" "}
                        at{" "}
                        {new Date(notification.createdAt).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                      {notification.readAt && (
                        <span>
                          • Read at{" "}
                          {new Date(notification.readAt).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
