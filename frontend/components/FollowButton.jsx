"use client";

import { useEffect, useState } from "react";
import { userAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import toast from "react-hot-toast";

export default function FollowButton({ userId, onFollowChange }) {
  const { user } = useAuthStore();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Don't show button if viewing own profile
  if (user?.id === userId) {
    return null;
  }

  useEffect(() => {
    checkFollowStatus();
  }, [userId]);

  const checkFollowStatus = async () => {
    try {
      const response = await userAPI.getUserById(userId);
      const following = response.data.user.followers?.some(
        (follower) => follower._id === user?.id
      );
      setIsFollowing(!!following);
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const handleFollow = async () => {
    try {
      setLoading(true);
      await userAPI.follow(userId);
      setIsFollowing(true);
      toast.success("Following user!");
      if (onFollowChange) onFollowChange(true);
    } catch (error) {
      console.error("Error following user:", error);
      toast.error(
        error.response?.data?.message || "Error following user"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async () => {
    try {
      setLoading(true);
      await userAPI.unfollow(userId);
      setIsFollowing(false);
      toast.success("Unfollowed user");
      if (onFollowChange) onFollowChange(false);
    } catch (error) {
      console.error("Error unfollowing user:", error);
      toast.error("Error unfollowing user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={isFollowing ? handleUnfollow : handleFollow}
      disabled={loading}
      className={`w-full px-4 py-2 rounded-lg transition font-medium disabled:opacity-50 ${
        isFollowing
          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
          : "bg-purple-500 text-white hover:bg-purple-600"
      }`}
    >
      {loading ? (isFollowing ? "Unfollowing..." : "Following...") : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
