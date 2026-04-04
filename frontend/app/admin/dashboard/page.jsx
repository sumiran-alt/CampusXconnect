"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { adminAPI, userAPI, postAPI, searchAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, role, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Browse states
  const [allUsers, setAllUsers] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || role !== "admin") {
      router.push("/admin/login");
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, role, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, postsRes, problemsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        adminAPI.getPosts(),
        adminAPI.getProblems(),
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setPosts(postsRes.data.posts);
      setProblems(problemsRes.data.problems);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchBrowseData = async () => {
    try {
      setLoading(true);
      const [usersRes, postsRes] = await Promise.all([
        searchAPI.getAllUsers(),
        postAPI.getFeed(1),
      ]);
      setAllUsers(usersRes.data.users || []);
      setAllPosts(postsRes.data.posts || []);
    } catch (error) {
      toast.error("Failed to fetch browse data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await adminAPI.deleteUser(userId);
        setUsers(users.filter((u) => u._id !== userId));
        toast.success("User deleted successfully");
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await adminAPI.deletePost(postId);
        setPosts(posts.filter((p) => p._id !== postId));
        toast.success("Post deleted successfully");
      } catch (error) {
        toast.error("Failed to delete post");
      }
    }
  };

  const handleDeleteProblem = async (problemId) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      try {
        await adminAPI.deleteProblem(problemId);
        setProblems(problems.filter((p) => p._id !== problemId));
        toast.success("Problem deleted successfully");
      } catch (error) {
        toast.error("Failed to delete problem");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-800 text-white p-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-300 mt-2">Welcome, {user?.name}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics Cards */}
        {activeTab === "overview" && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 font-semibold text-sm mb-2">
                Total Users
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {stats.totalUsers}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 font-semibold text-sm mb-2">
                Total Admins
              </h3>
              <p className="text-3xl font-bold text-purple-600">
                {stats.totalAdmins}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 font-semibold text-sm mb-2">
                Total Posts
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {stats.totalPosts}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 font-semibold text-sm mb-2">
                Coding Problems
              </h3>
              <p className="text-3xl font-bold text-orange-600">
                {stats.totalProblems}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 font-semibold text-sm mb-2">
                Submissions
              </h3>
              <p className="text-3xl font-bold text-red-600">
                {stats.totalSubmissions}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 font-semibold text-sm mb-2">
                Comments
              </h3>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.totalComments}
              </p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b overflow-x-auto">
          {[
            { id: "overview", label: "Overview" },
            { id: "users", label: "Users" },
            { id: "posts", label: "Posts" },
            { id: "problems", label: "Coding Problems" },
            { id: "browse", label: "Browse Users & Posts" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "browse" && allUsers.length === 0) {
                  fetchBrowseData();
                }
              }}
              className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {u.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {u.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            u.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      By {post.author?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-700">{post.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Problems Tab */}
        {activeTab === "problems" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <a
                href="/admin/problems"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Full Problem Management
              </a>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {problems.map((problem) => (
                    <tr key={problem._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {problem.title}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            problem.difficulty === "easy"
                              ? "bg-green-100 text-green-800"
                              : problem.difficulty === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDeleteProblem(problem._id)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        )}

        {/* Browse Users & Posts Tab */}
        {activeTab === "browse" && (
          <div className="space-y-6">
            {/* Users Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Users</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allUsers.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => setSelectedUser(user)}
                    className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg hover:bg-gray-50 transition"
                  >
                    {user.profilePicture && (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-16 h-16 rounded-full mb-4 object-cover"
                      />
                    )}
                    <h4 className="text-black font-semibold text-lg">{user.name}</h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-600">{user.branch}</p>
                    <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Posts Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Posts</h3>
              <div className="space-y-4">
                {allPosts.map((post) => (
                  <div
                    key={post._id}
                    onClick={() => setSelectedPost(post)}
                    className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-black font-semibold text-lg">{post.title}</h4>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                        {post.privacy || "public"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">By {post.author?.name}</p>
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">{post.content}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>👍 {post.likes?.length || 0}</span>
                      <span>💬 {post.comments?.length || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected User Detail Modal */}
            {selectedUser && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h2>
                        <p className="text-gray-600">{selectedUser.email}</p>
                      </div>
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                      >
                        ×
                      </button>
                    </div>

                    {selectedUser.profilePicture && (
                      <img
                        src={selectedUser.profilePicture}
                        alt={selectedUser.name}
                        className="w-32 h-32 rounded-full mb-4 object-cover"
                      />
                    )}

                    <div className="space-y-3 text-gray-700">
                      <p><strong>Branch:</strong> {selectedUser.branch}</p>
                      <p><strong>Role:</strong> {selectedUser.role}</p>
                      <p><strong>Bio:</strong> {selectedUser.bio || "No bio added"}</p>
                      <p><strong>Phone:</strong> {selectedUser.phone || "Not provided"}</p>
                      <p><strong>Location:</strong> {selectedUser.location || "Not provided"}</p>
                      <p><strong>Skills:</strong> {selectedUser.skills?.join(", ") || "Not added"}</p>
                    </div>

                    {/* Admin Actions for User */}
                    <div className="mt-6 flex gap-2">
                      <button
                        onClick={() => handleDeleteUser(selectedUser._id)}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-semibold"
                      >
                        Delete User
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Post Detail Modal */}
            {selectedPost && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-full overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedPost.title}</h2>
                        <p className="text-gray-600">By {selectedPost.author?.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(selectedPost.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedPost(null)}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                      >
                        ×
                      </button>
                    </div>

                    <div className="mb-4 p-3 rounded bg-purple-50">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                        Privacy: {selectedPost.privacy || "public"}
                      </span>
                    </div>

                    <div className="text-gray-700 mb-6 whitespace-pre-wrap">
                      {selectedPost.content}
                    </div>

                    {selectedPost.image && (
                      <img
                        src={selectedPost.image}
                        alt="Post"
                        className="w-full mb-6 rounded max-h-96 object-cover"
                      />
                    )}

                    <div className="flex justify-between text-sm text-gray-600 mb-6 pb-6 border-b">
                      <span>👍 {selectedPost.likes?.length || 0} likes</span>
                      <span>💬 {selectedPost.comments?.length || 0} comments</span>
                    </div>

                    {/* Admin Actions for Post */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeletePost(selectedPost._id)}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-semibold"
                      >
                        Delete Post
                      </button>
                      <button
                        onClick={() => setSelectedPost(null)}
                        className="flex-1 bg-gray-300 text-gray-900 px-4 py-2 rounded hover:bg-gray-400 font-semibold"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
