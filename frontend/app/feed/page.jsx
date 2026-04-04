"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { postAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import Image from "next/image";

export default function Feed() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [expandedPost, setExpandedPost] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [postComments, setPostComments] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    fetchFeed();
  }, [isAuthenticated, router, page]);

  const fetchFeed = async () => {
    try {
      const response = await postAPI.getFeed(page);
      // Filter out user's own posts from feed - only show other users' posts
      const filteredPosts = response.data.posts.filter(
        (post) => post.author?._id !== user?._id
      );
      setPosts(filteredPosts);
    } catch (error) {
      toast.error("Failed to fetch feed");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await postAPI.like(postId);
      toast.success("Post liked!");
      fetchFeed();
    } catch (error) {
      toast.error("Failed to like post");
    }
  };

  const loadComments = async (postId) => {
    try {
      const response = await postAPI.getComments(postId);
      setPostComments((prev) => ({
        ...prev,
        [postId]: response.data.comments,
      }));
    } catch (error) {
      console.error("Failed to load comments:", error);
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentText[postId]?.trim();
    if (!text) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const response = await postAPI.comment(postId, { content: text });
      setCommentText((prev) => ({ ...prev, [postId]: "" }));
      await loadComments(postId);
      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const toggleComments = async (postId) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      if (!postComments[postId]) {
        await loadComments(postId);
      }
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await postAPI.deletePost(postId);
      toast.success("Post deleted successfully!");
      setPosts(posts.filter(p => p._id !== postId));
      setDeleteConfirm(null);
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Create Post Button */}
      <button
        onClick={() => router.push("/create-post")}
        className="w-full bg-white p-4 rounded-lg shadow-md mb-6 text-left hover:shadow-lg transition"
      >
        <p className="text-gray-600">What's on your mind?</p>
      </button>

      {/* Posts */}
      {loading ? (
        <div className="text-center py-8">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No posts yet. Create one to get started!
        </div>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition"
          >
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <Link href={`/profile/${post.author?._id}`}>
                <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    {post.author?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 hover:text-primary transition">
                      {post.author?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Post Content */}
            <h3 className="text-xl font-bold mb-2 text-gray-900">
              {post.title}
            </h3>
            <p className="text-gray-700 mb-4">{post.description}</p>

            {/* Tech Stack */}
            {post.techStack?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* GitHub Link */}
            {post.githubLink && (
              <a
                href={post.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline mb-4 block"
              >
                View on GitHub →
              </a>
            )}

            {/* Engagement */}
            <div className="flex gap-6 pt-4 border-t text-gray-600">
              <button
                onClick={() => handleLike(post._id)}
                className="flex items-center gap-2 hover:text-primary transition"
              >
                👍 {post.likes?.length || 0} Likes
              </button>
              <button
                onClick={() => toggleComments(post._id)}
                className="flex items-center gap-2 hover:text-primary transition"
              >
                💬 {post.comments?.length || 0} Comments
              </button>
              {post.author?._id === user?._id && (
                <button
                  onClick={() => setDeleteConfirm(post._id)}
                  className="flex items-center gap-2 hover:text-red-600 transition text-red-500"
                >
                  🗑️ Delete
                </button>
              )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm === post._id && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Post?</h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this post? This action cannot be undone.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Comments Section */}
            {expandedPost === post._id && (
              <div className="mt-4 border-t pt-4">
                <div className="mb-4 max-h-64 overflow-y-auto">
                  {postComments[post._id]?.length === 0 ? (
                    <p className="text-gray-500 text-sm">No comments yet</p>
                  ) : (
                    postComments[post._id]?.map((comment) => (
                      <div key={comment._id} className="mb-3 pb-3 border-b">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
                            {comment.author?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-gray-900">
                              {comment.author?.name}
                            </p>
                            <p className="text-sm text-gray-700">
                              {comment.content}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Comment Input */}
                <div className="border-t pt-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentText[post._id] || ""}
                      onChange={(e) =>
                        setCommentText((prev) => ({
                          ...prev,
                          [post._id]: e.target.value,
                        }))
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => handleAddComment(post._id)}
                      className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {/* Pagination */}
      {!loading && (
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
