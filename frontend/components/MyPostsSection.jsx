"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { postAPI } from "@/lib/api";

export default function MyPostsSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [expandedPost, setExpandedPost] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    techStack: "",
    githubLink: "",
    privacy: "public",
  });

  useEffect(() => {
    fetchMyPosts();
  }, [page]);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const response = await postAPI.getUserPosts(page);
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load your posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await postAPI.deletePost(postId);
      toast.success("Post deleted successfully!");
      setPosts(posts.filter((p) => p._id !== postId));
      setDeleteConfirm(null);
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const handleStartEdit = (post) => {
    setEditingId(post._id);
    setEditForm({
      title: post.title,
      description: post.description,
      techStack: post.techStack?.join(", ") || "",
      githubLink: post.githubLink || "",
      privacy: post.privacy || "public",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async (postId) => {
    try {
      if (!editForm.title.trim() || !editForm.description.trim()) {
        toast.error("Title and description are required");
        return;
      }

      const updateData = {
        title: editForm.title,
        description: editForm.description,
        techStack: editForm.techStack
          .split(",")
          .map((tech) => tech.trim())
          .filter((tech) => tech),
        githubLink: editForm.githubLink,
        privacy: editForm.privacy,
      };

      await postAPI.updatePost(postId, updateData);
      toast.success("Post updated successfully!");
      setEditingId(null);
      fetchMyPosts();
    } catch (error) {
      toast.error("Failed to update post");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-600">Loading your posts...</div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">📝 My Posts</h3>

      {posts.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
          <p className="text-gray-600">
            You haven't created any posts yet.{" "}
            <a href="/create-post" className="text-primary hover:underline">
              Create your first post
            </a>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary hover:shadow-lg transition"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    {post.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    post.privacy === "public"
                      ? "bg-green-100 text-green-800"
                      : post.privacy === "connections"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {post.privacy === "public"
                    ? "🌐 Public"
                    : post.privacy === "connections"
                    ? "👥 Connections"
                    : "🔒 Private"}
                </span>
              </div>

              {/* Post Description */}
              <p className="text-gray-700 mb-3">{post.description}</p>

              {/* Tech Stack */}
              {post.techStack?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
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
                  className="text-primary hover:underline text-sm mb-3 block"
                >
                  View on GitHub →
                </a>
              )}

              {/* Stats */}
              <div className="flex gap-6 pt-3 border-t text-sm text-gray-600 mb-3">
                <span>👍 {post.likes?.length || 0} Likes</span>
                <span>💬 {post.comments?.length || 0} Comments</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() =>
                    setExpandedPost(expandedPost === post._id ? null : post._id)
                  }
                  className="flex-1 bg-primary text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition"
                >
                  {expandedPost === post._id ? "Hide Comments" : "View Comments"}
                </button>
                <button
                  onClick={() => handleStartEdit(post)}
                  className="bg-yellow-500 text-white px-3 py-2 rounded text-sm hover:bg-yellow-600 transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(post._id)}
                  className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition"
                >
                  🗑️ Delete
                </button>
              </div>

              {/* Comments Section */}
              {expandedPost === post._id && (
                <div className="mt-4 pt-4 border-t">
                  {post.comments?.length === 0 ? (
                    <p className="text-gray-500 text-sm">No comments yet</p>
                  ) : (
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {post.comments.map((comment) => (
                        <div key={comment._id} className="pb-2 border-b text-sm">
                          <p className="font-semibold text-gray-900">
                            {comment.author?.name}
                          </p>
                          <p className="text-gray-700">{comment.content}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Delete Confirmation Modal */}
              {deleteConfirm === post._id && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Delete Post?
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Are you sure you want to delete this post? This action
                      cannot be undone.
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

              {/* Edit Modal */}
              {editingId === post._id && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">✏️ Edit Post</h3>

                    <div className="space-y-4">
                      {/* Title */}
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={editForm.title}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                          placeholder="Post title"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={editForm.description}
                          onChange={handleEditChange}
                          rows="5"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary resize-none"
                          placeholder="Post description"
                        />
                      </div>

                      {/* Tech Stack */}
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Tech Stack (comma-separated)
                        </label>
                        <input
                          type="text"
                          name="techStack"
                          value={editForm.techStack}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                          placeholder="e.g., React, Node.js, MongoDB"
                        />
                      </div>

                      {/* GitHub Link */}
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          GitHub Link
                        </label>
                        <input
                          type="url"
                          name="githubLink"
                          value={editForm.githubLink}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                          placeholder="https://github.com/..."
                        />
                      </div>

                      {/* Privacy */}
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Privacy
                        </label>
                        <select
                          name="privacy"
                          value={editForm.privacy}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        >
                          <option value="public">🌐 Public</option>
                          <option value="connections">👥 Connections</option>
                          <option value="private">🔒 Private</option>
                        </select>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end mt-6">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(post._id)}
                        className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
