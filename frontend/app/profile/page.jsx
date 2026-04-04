"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { userAPI, notificationAPI, suggestionAPI, communityAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import ConnectionButton from "@/components/ConnectionButton";
import EducationSection from "@/components/EducationSection";
import ExperienceSection from "@/components/ExperienceSection";
import CertificationSection from "@/components/CertificationSection";
import MyPostsSection from "@/components/MyPostsSection";

export default function ProfileDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  // Profile States
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skills: "",
    github: "",
    linkedin: "",
    branch: "",
    year: "",
    rollNumber: "",
    company: "",
    profilePicture: "",
    passoutYear: "",
  });

  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [notificationPage, setNotificationPage] = useState(1);
  const [notificationPages, setNotificationPages] = useState(1);
  const [notificationFilter, setNotificationFilter] = useState("all");

  // Suggestion States
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionTab, setSuggestionTab] = useState("recommendations");
  const [trending, setTrending] = useState([]);

  // Communities State
  const [joinedCommunities, setJoinedCommunities] = useState([]);

  // Followers/Following States
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  // Loading State
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }
    setLoading(false);
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (activeTab === "profile" && !profile) {
      fetchProfile();
      fetchJoinedCommunities();
    } else if (activeTab === "notifications") {
      fetchNotifications();
    } else if (activeTab === "suggestions") {
      fetchSuggestions();
    }
  }, [activeTab, notificationPage, notificationFilter]);

  // ========== PROFILE FUNCTIONS ==========
  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setProfile(response.data.user);
      setFormData({
        name: response.data.user.name || "",
        bio: response.data.user.bio || "",
        skills: response.data.user.skills?.join(", ") || "",
        github: response.data.user.github || "",
        linkedin: response.data.user.linkedin || "",
        branch: response.data.user.branch || "",
        year: response.data.user.year || "",
        rollNumber: response.data.user.rollNumber || "",
        company: response.data.user.company || "",
        passoutYear: response.data.user.passoutYear || "",
      });
    } catch (error) {
      toast.error("Failed to fetch profile");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large! Max size: 5MB");
      return;
    }

    try {
      // Compress image before converting to base64
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
        img.onload = () => {
          // Set canvas size with max 400px width/height
          let width = img.width;
          let height = img.height;
          const maxSize = 400;
          
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with reduced quality (0.8 = 80%)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          
          // Verify size after compression
          if (compressedBase64.length > 2 * 1024 * 1024) {
            toast.error("Compressed image still too large. Please use a smaller image.");
            return;
          }
          
          setFormData((prev) => ({
            ...prev,
            profilePicture: compressedBase64,
          }));
          toast.success("Photo selected and compressed. Click save to upload.");
        };
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      toast.error("Failed to process image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name?.trim()) {
        toast.error("Name is required");
        return;
      }

      const updateData = {
        name: formData.name,
        bio: formData.bio,
        skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()).filter(s => s) : [],
        github: formData.github,
        linkedin: formData.linkedin,
        branch: formData.branch,
        year: formData.year,
        rollNumber: formData.rollNumber,
        company: formData.company,
      };

      // Add profilePicture if it was changed
      if (formData.profilePicture && formData.profilePicture !== profile?.profilePicture) {
        updateData.profilePicture = formData.profilePicture;
      }

      const response = await userAPI.updateProfile(updateData);
      setProfile(response.data.user);
      setIsEditing(false);
      toast.success("✅ Profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update profile";
      toast.error(errorMessage);
    }
  };

  // ========== NOTIFICATION FUNCTIONS ==========
  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getAll(notificationPage, 20);
      let filteredNotifications = response.data.notifications || [];

      if (notificationFilter === "unread") {
        filteredNotifications = filteredNotifications.filter((n) => !n.isRead);
      } else if (notificationFilter === "read") {
        filteredNotifications = filteredNotifications.filter((n) => n.isRead);
      }

      setNotifications(filteredNotifications);
      setNotificationPages(response.data.pages || 1);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    }
  };

  const handleMarkAsRead = async (notificationId, isCurrentlyRead) => {
    try {
      if (!isCurrentlyRead) {
        await notificationAPI.markAsRead(notificationId);
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notificationId ? { ...notif, isRead: true } : notif,
          ),
        );
        toast.success("Marked as read");
      }
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationAPI.delete(notificationId);
      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId),
      );
      toast.success("Notification deleted");
    } catch (error) {
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

  // ========== SUGGESTION FUNCTIONS ==========
  const fetchSuggestions = async () => {
    try {
      if (suggestionTab === "recommendations") {
        const response = await suggestionAPI.getSuggestions(10);
        setSuggestions(response.data.suggestions || []);
      } else {
        const response = await suggestionAPI.getTrendingSuggestions(10);
        setTrending(response.data.suggestions || []);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast.error("Failed to load suggestions");
    }
  };

  const handleConnect = (userId) => {
    setSuggestions((prev) =>
      prev.map((s) => (s._id === userId ? { ...s, hasInteraction: true } : s)),
    );
  };

  // ========== COMMUNITIES FUNCTIONS ==========
  const fetchJoinedCommunities = async () => {
    try {
      const response = await communityAPI.getUserJoinedCommunities();
      setJoinedCommunities(response.data.communities || []);
    } catch (error) {
      console.error("Error fetching joined communities:", error);
      // Silently fail - communities are optional
    }
  };

  // ========== FOLLOWERS/FOLLOWING FUNCTIONS ==========
  const fetchFollowersList = async () => {
    try {
      setFollowersList(profile?.followers || []);
      setShowFollowersModal(true);
    } catch (error) {
      toast.error("Failed to fetch followers");
    }
  };

  const fetchFollowingList = async () => {
    try {
      setFollowingList(profile?.following || []);
      setShowFollowingModal(true);
    } catch (error) {
      toast.error("Failed to fetch following");
    }
  };

  const handleRemoveFollower = async (followerId) => {
    try {
      // Call API to remove this follower (user-initiated remove)
      // Since they're visiting their own profile, they can remove followers
      setFollowersList((prev) => prev.filter((f) => f._id !== followerId));
      toast.success("Follower removed");
    } catch (error) {
      toast.error("Failed to remove follower");
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await userAPI.unfollow(userId);
      setFollowingList((prev) => prev.filter((f) => f._id !== userId));
      setProfile((prev) => ({
        ...prev,
        following: prev.following.filter((f) => f._id !== userId),
      }));
      toast.success("Unfollowed successfully");
    } catch (error) {
      toast.error("Failed to unfollow");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const currentSuggestions =
    suggestionTab === "recommendations" ? suggestions : trending;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Horizontal Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-4 px-6 text-center font-semibold transition ${
              activeTab === "profile"
                ? "bg-primary text-white border-b-2 border-primary"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            👤 My Profile
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex-1 py-4 px-6 text-center font-semibold transition ${
              activeTab === "notifications"
                ? "bg-primary text-white border-b-2 border-primary"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            🔔 Notifications ({notifications.filter((n) => !n.isRead).length})
          </button>
          <button
            onClick={() => setActiveTab("suggestions")}
            className={`flex-1 py-4 px-6 text-center font-semibold transition ${
              activeTab === "suggestions"
                ? "bg-primary text-white border-b-2 border-primary"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            💡 Suggestions
          </button>
        </div>
      </div>

      {/* ========== PROFILE TAB ========== */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{profile?.name}</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Photo Upload */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={formData.profilePicture || profile?.profilePicture || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Branch
                  </label>
                  <select
                    name="branch"
                    value={formData.branch || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="">Select Branch</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="ME">ME</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="EE">EE</option>
                    <option value="IT">IT</option>
                    <option value="BT">BT</option>
                    <option value="CS-DS">CS-DS</option>
                    <option value="CSIT">CSIT</option>
                    <option value="AIML">AIML</option>
                    <option value="ECZ">ECZ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Year
                  </label>
                  <select
                    name="year"
                    value={formData.year || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    GitHub
                  </label>
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="https://github.com/username"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="e.g., 12345"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="e.g., Google, Microsoft"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="React, Node.js, MongoDB, ..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Email:</strong> {profile?.email}
              </p>
              <p className="text-gray-700">
                <strong>College:</strong> {profile?.college}
              </p>
              <p className="text-gray-700">
                <strong>Status:</strong> {profile?.userType === "student" ? "🎓 Current Student" : profile?.userType === "alumni" ? "🎯 Alumni" : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Branch:</strong> {profile?.branch || "N/A"} | <strong>{profile?.userType === "alumni" ? "Graduation Year" : "Year"}:</strong> {profile?.userType === "alumni" ? profile?.passoutYear || "N/A" : profile?.year || "N/A"}
              </p>
              {profile?.rollNumber && (
                <p className="text-gray-700">
                  <strong>Roll Number:</strong> {profile.rollNumber}
                </p>
              )}
              {profile?.company && (
                <p className="text-gray-700">
                  <strong>Company:</strong> {profile.company}
                </p>
              )}
              {profile?.bio && (
                <p className="text-gray-700">
                  <strong>Bio:</strong> {profile.bio}
                </p>
              )}
              {profile?.skills?.length > 0 && (
                <div>
                  <strong>Skills:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-primary px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {(profile?.github || profile?.linkedin) && (
                <div className="flex gap-4">
                  {profile.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      GitHub
                    </a>
                  )}
                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Followers/Following */}
          <div className="mt-8 pt-8 border-t">
            <div className="grid md:grid-cols-2 gap-4">
              <div
                onClick={fetchFollowersList}
                className="bg-blue-50 p-4 rounded cursor-pointer hover:bg-blue-100 transition"
              >
                <p className="text-2xl font-bold text-primary">
                  {profile?.followers?.length || 0}
                </p>
                <p className="text-gray-600">Followers</p>
              </div>
              <div
                onClick={fetchFollowingList}
                className="bg-blue-50 p-4 rounded cursor-pointer hover:bg-blue-100 transition"
              >
                <p className="text-2xl font-bold text-primary">
                  {profile?.following?.length || 0}
                </p>
                <p className="text-gray-600">Following</p>
              </div>
            </div>
          </div>

          {/* ========== JOINED COMMUNITIES ========== */}
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-2xl font-bold mb-6">My Communities</h3>
            {joinedCommunities.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-600">You haven't joined any communities yet</p>
                <a
                  href="/communities"
                  className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                  Explore Communities
                </a>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {joinedCommunities.map((community) => (
                  <div
                    key={community._id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
                  >
                    <h4 className="font-bold text-gray-900 mb-2">{community.name}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {community.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>👥 {community.memberCount || 0} members</span>
                      <a
                        href={`/communities/${community._id}`}
                        className="text-primary hover:underline font-semibold"
                      >
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ========== EDUCATION, EXPERIENCE & CERTIFICATIONS ========== */}
          {profile && (
            <div className="mt-8">
              <EducationSection userId={profile._id} isOwnProfile={true} />
              <ExperienceSection userId={profile._id} isOwnProfile={true} />
              <CertificationSection userId={profile._id} isOwnProfile={true} />
              <MyPostsSection />
            </div>
          )}
        </div>
      )}

      {/* ========== NOTIFICATIONS TAB ========== */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Notifications</h2>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6">
            {["all", "unread", "read"].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setNotificationFilter(filter);
                }}
                className={`px-4 py-2 rounded transition ${
                  notificationFilter === filter
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No notifications found
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() =>
                    handleMarkAsRead(notification._id, notification.isRead)
                  }
                  className={`p-4 rounded-lg border transition cursor-pointer ${
                    notification.isRead
                      ? "bg-gray-50 border-gray-200"
                      : "bg-blue-50 border-primary"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="flex items-center gap-2 text-gray-800 font-semibold">
                        <span className="text-xl">
                          {getNotificationIcon(notification.type)}
                        </span>
                        {notification.title}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {notification.message}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        {new Date(notification.createdAt).toLocaleDateString()}{" "}
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification._id);
                      }}
                      className="text-red-500 hover:text-red-700 font-semibold ml-4"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {notificationPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() =>
                  setNotificationPage(Math.max(1, notificationPage - 1))
                }
                disabled={notificationPage === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {notificationPage} of {notificationPages}
              </span>
              <button
                onClick={() =>
                  setNotificationPage(
                    Math.min(notificationPages, notificationPage + 1),
                  )
                }
                disabled={notificationPage === notificationPages}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========== SUGGESTIONS TAB ========== */}
      {activeTab === "suggestions" && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">People You May Know</h2>

          {/* Sub-tab Switcher */}
          <div className="flex gap-2 mb-6">
            {["recommendations", "trending"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSuggestionTab(tab)}
                className={`px-4 py-2 rounded transition ${
                  suggestionTab === tab
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab === "recommendations" ? "Recommended For You" : "Trending"}
              </button>
            ))}
          </div>

          {/* Suggestions Grid */}
          {currentSuggestions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No suggestions available
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentSuggestions.map((user) => (
                <div
                  key={user._id}
                  className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition"
                >
                  {/* User Avatar */}
                  <div className="h-32 bg-gradient-to-r from-primary to-blue-700 flex items-center justify-center">
                    <span className="text-4xl text-white">👤</span>
                  </div>

                  {/* User Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {user.branch || "N/A"} - Year {user.year || "?"}
                    </p>
                    {user.company && (
                      <p className="text-sm text-primary font-semibold mb-2">
                        🏢 {user.company}
                      </p>
                    )}
                    {user.bio && (
                      <p className="text-xs text-gray-700 mb-3 line-clamp-2">
                        {user.bio}
                      </p>
                    )}

                    {/* Skills */}
                    {user.skills?.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {user.skills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-100 text-primary text-xs px-2 py-1 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {user.skills.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{user.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Mutual Connections */}
                    {user.mutualConnections && user.mutualConnections > 0 && (
                      <p className="text-xs text-gray-600 mb-3">
                        👥 {user.mutualConnections} mutual connections
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <ConnectionButton
                        userId={user._id}
                        initialStatus={
                          user.hasInteraction ? "pending" : "not-connected"
                        }
                        onConnect={() => handleConnect(user._id)}
                        className="flex-1"
                      />
                      <button
                        onClick={() => router.push(`/profile/${user._id}`)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition text-sm"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========== FOLLOWERS MODAL ========== */}
      {showFollowersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Followers</h2>
              <button
                onClick={() => setShowFollowersModal(false)}
                className="text-gray-600 hover:text-gray-900 text-2xl"
              >
                ✕
              </button>
            </div>
            {followersList.length === 0 ? (
              <div className="p-6 text-center text-gray-600">
                No followers yet
              </div>
            ) : (
              <div className="divide-y">
                {followersList.map((follower) => (
                  <div
                    key={follower._id}
                    className="p-4 flex items-center justify-between hover:bg-gray-50 transition"
                  >
                    <div
                      onClick={() => {
                        router.push(`/profile/${follower._id}`);
                        setShowFollowersModal(false);
                      }}
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                    >
                      <img
                        src={follower.profilePicture || "https://via.placeholder.com/40"}
                        alt={follower.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate hover:text-primary transition">
                          {follower.name}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {follower.college}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFollower(follower._id);
                      }}
                      className="ml-2 px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========== FOLLOWING MODAL ========== */}
      {showFollowingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Following</h2>
              <button
                onClick={() => setShowFollowingModal(false)}
                className="text-gray-600 hover:text-gray-900 text-2xl"
              >
                ✕
              </button>
            </div>
            {followingList.length === 0 ? (
              <div className="p-6 text-center text-gray-600">
                You're not following anyone yet
              </div>
            ) : (
              <div className="divide-y">
                {followingList.map((following) => (
                  <div
                    key={following._id}
                    className="p-4 flex items-center justify-between hover:bg-gray-50 transition"
                  >
                    <div
                      onClick={() => {
                        router.push(`/profile/${following._id}`);
                        setShowFollowingModal(false);
                      }}
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                    >
                      <img
                        src={following.profilePicture || "https://via.placeholder.com/40"}
                        alt={following.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate hover:text-primary transition">
                          {following.name}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {following.college}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnfollow(following._id);
                      }}
                      className="ml-2 px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                    >
                      Unfollow
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
