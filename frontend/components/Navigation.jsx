"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { connectionAPI, notificationAPI, messageAPI } from "@/lib/api";
import { useEffect, useState } from "react";

export default function Navigation() {
  const router = useRouter();
  const { user, role, logout } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (user && isClient) {
      fetchPendingRequests();
      fetchUnreadNotifications();
      fetchUnreadMessages();

      // Refresh every 30 seconds
      const interval = setInterval(() => {
        fetchPendingRequests();
        fetchUnreadNotifications();
        fetchUnreadMessages();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user, isClient]);

  const fetchPendingRequests = async () => {
    try {
      const response = await connectionAPI.getPendingRequests();
      setPendingCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };

  const fetchUnreadNotifications = async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      setUnreadNotifications(response.data.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const fetchUnreadMessages = async () => {
    try {
      const response = await messageAPI.getUnreadCount();
      setUnreadMessages(response.data.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching unread messages:", error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  if (!isClient) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <div className="w-full px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="text-lg md:text-xl font-bold text-blue-600 flex-shrink-0 tracking-tight">
            CampusXConnect
          </Link>

          {/* Right side - Navigation + Auth buttons */}
          <div className="flex items-center gap-3 justify-end">
            {/* Navigation Items - Horizontal scroll on mobile */}
            <div className="flex items-center gap-4 md:gap-5 overflow-x-auto flex-shrink-0 whitespace-nowrap scrollbar-hide py-1">
              {user ? (
                <>
                  {/* Admin Navigation */}
                  {role === "admin" ? (
                    <>
                      <Link
                        href="/admin/dashboard"
                        className="text-gray-700 hover:text-blue-600 font-semibold text-xs md:text-sm transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/search"
                        className="text-gray-700 hover:text-blue-600 text-xs md:text-sm font-medium transition-colors"
                      >
                        🔍 Search
                      </Link>
                      <Link
                        href="/messages"
                        className="relative text-gray-700 hover:text-blue-600 flex items-center gap-1 text-xs md:text-sm font-medium transition-colors"
                      >
                        📧 Messages
                        {unreadMessages > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                            {unreadMessages}
                          </span>
                        )}
                      </Link>
                      <Link
                        href="/profile"
                        className="relative text-gray-700 hover:text-blue-600 flex items-center gap-1 text-xs md:text-sm font-medium transition-colors"
                      >
                        👤 Profile
                        {unreadNotifications > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                            {unreadNotifications}
                          </span>
                        )}
                      </Link>
                    </>
                  ) : (
                    /* User Navigation */
                    <>
                      <Link
                        href="/feed"
                        className="text-gray-700 hover:text-blue-600 text-xs md:text-sm font-medium transition-colors"
                      >
                        Feed
                      </Link>
                      <Link
                        href="/coding"
                        className="text-gray-700 hover:text-blue-600 text-xs md:text-sm font-medium transition-colors"
                      >
                        Coding
                      </Link>
                      <Link
                        href="/leaderboard"
                        className="text-gray-700 hover:text-blue-600 text-xs md:text-sm font-medium transition-colors"
                      >
                        Leaderboard
                      </Link>
                      <Link
                        href="/communities"
                        className="text-gray-700 hover:text-blue-600 text-xs md:text-sm font-medium transition-colors"
                      >
                        Communities
                      </Link>
                      <Link
                        href="/search"
                        className="text-gray-700 hover:text-blue-600 text-xs md:text-sm font-medium transition-colors"
                      >
                        🔍 Search
                      </Link>
                      <Link
                        href="/connections"
                        className="relative text-gray-700 hover:text-blue-600 flex items-center gap-1 text-xs md:text-sm font-medium transition-colors"
                      >
                        Connections
                        {pendingCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                            {pendingCount}
                          </span>
                        )}
                      </Link>
                      <Link
                        href="/messages"
                        className="relative text-gray-700 hover:text-blue-600 flex items-center gap-1 text-xs md:text-sm font-medium transition-colors"
                      >
                        Messages
                        {unreadMessages > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                            {unreadMessages}
                          </span>
                        )}
                      </Link>
                      <Link
                        href="/profile"
                        className="relative text-gray-700 hover:text-blue-600 flex items-center gap-1 text-xs md:text-sm font-medium transition-colors"
                      >
                        Profile
                        {unreadNotifications > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                            {unreadNotifications}
                          </span>
                        )}
                      </Link>
                    </>
                  )}
                </>
              ) : null}
            </div>

            {/* Auth Actions - Logout or Sign In/Sign Up */}
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-full text-xs md:text-sm hover:bg-red-600 font-semibold flex-shrink-0 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth"
                className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs md:text-sm hover:bg-blue-700 font-semibold flex-shrink-0 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
}
