"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { postAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import Image from "next/image";

export default function Feed() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    fetchFeed();
  }, [isAuthenticated, router, page]);

  const fetchFeed = async () => {
    try {
      const response = await postAPI.getFeed(page);
      setPosts(response.data.posts);
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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                {post.author?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {post.author?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
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
              <button className="flex items-center gap-2 hover:text-primary transition">
                💬 {post.comments?.length || 0} Comments
              </button>
            </div>
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
