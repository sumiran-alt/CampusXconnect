"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { userAPI, connectionAPI, messageAPI, postAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import toast from "react-hot-toast";
import ConnectionButton from "@/components/ConnectionButton";
import FollowButton from "@/components/FollowButton";
import SuggestButton from "@/components/SuggestButton";
import SuggestionsSection from "@/components/SuggestionsSection";
import ProfileSkeleton from "@/components/ProfileSkeleton";
import Link from "next/link";

export default function UserProfilePage() {
  const router = useRouter();
  const { id } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [connectionCount, setConnectionCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [mutualConnections, setMutualConnections] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    if (id) {
      fetchUserProfile();
    }
  }, [id, isAuthenticated]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUserById(id);
      setProfile(response.data.user);

      // Get connection count
      const connResponse = await connectionAPI.getUserConnections(id);
      setConnectionCount(connResponse.data.count || 0);

      // Get user's posts
      await fetchUserPosts();

      // Get mutual connections
      await fetchMutualConnections();
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("User not found");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      setPostsLoading(true);
      const response = await postAPI.getUserPostsById(id, 1);
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchMutualConnections = async () => {
    try {
      const response = await connectionAPI.getMutualConnections(id);
      setMutualConnections(response.data.mutualConnections || []);
    } catch (error) {
      console.error("Error fetching mutual connections:", error);
    }
  };

  const handleSendMessage = () => {
    if (isOwnProfile) {
      toast.error("Cannot message yourself");
      return;
    }
    router.push(`/messages/${id}`);
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Profile not found</p>
      </div>
    );
  }

  const isOwnProfile = user?.id === id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header with background */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>

          {/* Profile Content */}
          <div className="px-8 py-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-6">
                {/* Profile Picture */}
                <div className="relative -mt-20">
                  <img
                    src={profile.profilePicture}
                    alt={profile.name}
                    className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                  />
                </div>

                {/* Basic Info */}
                <div className="flex-1 pt-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile.name}
                  </h1>
                  <p className="text-gray-600 mt-1">{profile.email}</p>
                  <p className="text-gray-700 mt-2">
                    {profile.branch} | Year {profile.year} | {profile.college}
                  </p>
                  {profile.rollNumber && (
                    <p className="text-gray-600 mt-1">
                      🎓 Roll Number: {profile.rollNumber}
                    </p>
                  )}
                  {profile.company && (
                    <p className="text-gray-600 mt-1">
                      🏢 Company: {profile.company}
                    </p>
                  )}
                  {profile.bio && (
                    <p className="text-gray-600 mt-2 max-w-md">{profile.bio}</p>
                  )}
                </div>
              </div>

              {/* Connection Button or Edit */}
              <div className="w-48 flex flex-col gap-2">
                {isOwnProfile ? (
                  <button
                    onClick={() => router.push("/profile")}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <ConnectionButton userId={id} />
                    <FollowButton userId={id} />
                    <SuggestButton userId={id} userName={profile.name} />
                    <button
                      onClick={handleSendMessage}
                      className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium flex items-center justify-center gap-2"
                    >
                      💬 Message
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {connectionCount}
                </p>
                <p className="text-gray-600 text-sm">Connections</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {profile.followers?.length || 0}
                </p>
                <p className="text-gray-600 text-sm">Followers</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {profile.following?.length || 0}
                </p>
                <p className="text-gray-600 text-sm">Following</p>
              </div>
            </div>

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {(profile.github || profile.linkedin) && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Connect
                </h2>
                <div className="flex gap-4">
                  {profile.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      GitHub
                    </a>
                  )}
                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Mutual Connections */}
            {mutualConnections.length > 0 && !isOwnProfile && (
              <div className="mb-8 pb-8 border-b">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Mutual Connections ({mutualConnections.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {mutualConnections.slice(0, 8).map((connection) => (
                    <Link
                      key={connection._id}
                      href={`/profile/${connection._id}`}
                      className="text-center p-4 hover:bg-gray-50 rounded-lg transition cursor-pointer"
                    >
                      <img
                        src={connection.profilePicture}
                        alt={connection.name}
                        className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                      />
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {connection.name}
                      </p>
                      <p className="text-xs text-gray-500">Connected</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* User Posts */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Posts</h2>
              {postsLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No posts yet
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post._id}
                      className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition"
                    >
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-700 mb-3">{post.description}</p>

                      {post.techStack?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.techStack.map((tech, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {post.githubLink && (
                        <a
                          href={post.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-sm"
                        >
                          View on GitHub →
                        </a>
                      )}

                      <div className="flex gap-4 mt-4 pt-4 border-t text-gray-600 text-sm">
                        <span>👍 {post.likes?.length || 0} Likes</span>
                        <span>💬 {post.comments?.length || 0} Comments</span>
                        <span className="text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Suggestions Section - Only for own profile */}
            {isOwnProfile && (
              <div className="mt-8 pt-8 border-t">
                <SuggestionsSection userId={id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
