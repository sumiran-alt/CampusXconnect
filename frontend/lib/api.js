import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  signup: (userData) => api.post("/auth/signup", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  adminSignup: (userData) => api.post("/auth/admin/signup", userData),
  adminLogin: (credentials) => api.post("/auth/admin/login", credentials),
  sendOTP: (email) => api.post("/auth/send-otp", { email }),
  verifyOTP: (email, otp) => api.post("/auth/verify-otp", { email, otp }),
};

// User endpoints
export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  getUserById: (id) => api.get(`/users/${id}`),
  setUserType: (userType) => api.put("/users/user-type", { userType }),
  completeProfileSetup: (data) => api.put("/users/profile/complete", data),
  updateProfile: (data) => api.put("/users/profile/update", data),
  follow: (id) => api.post(`/users/follow/${id}`),
  unfollow: (id) => api.post(`/users/unfollow/${id}`),
};

// Post endpoints
export const postAPI = {
  createPost: (data) => api.post("/posts/createPost", data),
  getFeed: (page = 1) => api.get(`/posts/feed?page=${page}`),
  getUserPosts: (page = 1) => api.get(`/posts/my-posts?page=${page}`),
  getUserPostsById: (userId, page = 1) => api.get(`/posts/user/${userId}?page=${page}`),
  getPostById: (id) => api.get(`/posts/${id}`),
  like: (id) => api.post(`/posts/like/${id}`),
  unlike: (id) => api.post(`/posts/unlike/${id}`),
  comment: (id, comment) => api.post(`/posts/comment/${id}`, comment),
  getComments: (id) => api.get(`/posts/comments/${id}`),
  deletePost: (id) => api.delete(`/posts/${id}`),
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
};

// Coding endpoints
export const codingAPI = {
  getProblems: (page = 1, difficulty = "") =>
    api.get(`/coding/problems?page=${page}&difficulty=${difficulty}`),
  getProblemBySlug: (slug) => api.get(`/coding/problems/slug/${slug}`),
  getProblemById: (id) => api.get(`/coding/problems/id/${id}`),
  runCode: (data) => api.post("/coding/run", data),
  submit: (data) => api.post("/coding/submit", data),
  getUserSubmissions: (page = 1) => api.get(`/coding/submissions?page=${page}`),
  getProblemSubmissions: (problemId) =>
    api.get(`/coding/submissions/problem/${problemId}`),
  getUserProgress: () => api.get("/coding/progress"),
  getLeaderboard: (type = "global") =>
    api.get(`/coding/leaderboard?type=${type}`),
};

// Admin endpoints
export const adminAPI = {
  getStats: () => api.get("/admin/stats"),
  getUsers: () => api.get("/admin/users"),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/status`),
  getPosts: () => api.get("/admin/posts"),
  deletePost: (id) => api.delete(`/admin/posts/${id}`),
  togglePostFlag: (id) => api.put(`/admin/posts/${id}/flag`),
  getProblems: () => api.get("/admin/problems"),
  createProblem: (data) => api.post("/admin/problems", data),
  updateProblem: (id, data) => api.put(`/admin/problems/${id}`, data),
  deleteProblem: (id) => api.delete(`/admin/problems/${id}`),
  getSubmissions: () => api.get("/admin/submissions"),
  getComments: () => api.get("/admin/comments"),
  deleteComment: (id) => api.delete(`/admin/comments/${id}`),
};

// Connection endpoints
export const connectionAPI = {
  sendRequest: (toUserId) => api.post(`/connections/request/${toUserId}`),
  getPendingRequests: () => api.get("/connections/pending"),
  getSentRequests: () => api.get("/connections/sent"),
  acceptRequest: (requestId) =>
    api.put(`/connections/request/${requestId}/accept`),
  rejectRequest: (requestId) =>
    api.put(`/connections/request/${requestId}/reject`),
  cancelRequest: (requestId) =>
    api.delete(`/connections/request/${requestId}/cancel`),
  getMyConnections: () => api.get("/connections/my"),
  getUserConnections: (userId) => api.get(`/connections/${userId}`),
  removeConnection: (userId) => api.delete(`/connections/${userId}`),
  checkConnectionStatus: (userId) => api.get(`/connections/${userId}/status`),
  getMutualConnections: (userId) => api.get(`/connections/mutual/${userId}`),
};

// Education endpoints
export const educationAPI = {
  addEducation: (data) => api.post("/education", data),
  getMyEducation: () => api.get("/education/my"),
  getUserEducation: (userId) => api.get(`/education/user/${userId}`),
  updateEducation: (id, data) => api.put(`/education/${id}`, data),
  deleteEducation: (id) => api.delete(`/education/${id}`),
};

// Experience endpoints
export const experienceAPI = {
  addExperience: (data) => api.post("/experience", data),
  getMyExperience: () => api.get("/experience/my"),
  getUserExperience: (userId) => api.get(`/experience/user/${userId}`),
  updateExperience: (id, data) => api.put(`/experience/${id}`, data),
  deleteExperience: (id) => api.delete(`/experience/${id}`),
};

// Certification endpoints
export const certificationAPI = {
  addCertification: (data) => api.post("/certification", data),
  getMyCertifications: () => api.get("/certification/my"),
  getUserCertifications: (userId) => api.get(`/certification/user/${userId}`),
  updateCertification: (id, data) => api.put(`/certification/${id}`, data),
  deleteCertification: (id) => api.delete(`/certification/${id}`),
};

// Search endpoints
export const searchAPI = {
  search: (query) =>
    api.get(`/search/search?query=${encodeURIComponent(query)}`),
  advancedSearch: (filters) => {
    const params = new URLSearchParams();
    if (filters.name) params.append("name", filters.name);
    if (filters.batch) params.append("batch", filters.batch);
    if (filters.branch) params.append("branch", filters.branch);
    if (filters.company) params.append("company", filters.company);
    if (filters.rollNumber) params.append("rollNumber", filters.rollNumber);
    return api.get(`/search/advanced?${params.toString()}`);
  },
  getAllUsers: (page = 1) => api.get(`/search/all?page=${page}`),
};

// Notification endpoints
export const notificationAPI = {
  getUnread: () => api.get("/notifications/unread"),
  getAll: (page = 1, limit = 20) =>
    api.get(`/notifications?page=${page}&limit=${limit}`),
  getUnreadCount: () => api.get("/notifications/unread-count"),
  markAsRead: (notificationId) =>
    api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put("/notifications/read/all"),
  delete: (notificationId) => api.delete(`/notifications/${notificationId}`),
};

// Suggestion endpoints
export const suggestionAPI = {
  // Send suggestion to another user
  sendSuggestion: (receiverId, suggestionText, category) =>
    api.post("/suggestions/send", { receiverId, suggestionText, category }),
  
  // Get suggestions received by a user
  getUserSuggestions: (userId, page = 1) =>
    api.get(`/suggestions/received/${userId}?page=${page}`),
  
  // Mark suggestion as read
  markAsRead: (suggestionId) =>
    api.put(`/suggestions/${suggestionId}/read`),
  
  // Delete a suggestion
  deleteSuggestion: (suggestionId) =>
    api.delete(`/suggestions/${suggestionId}`),
  
  // Connection-based suggestions (existing)
  getSuggestions: (limit = 5) => api.get(`/suggestions?limit=${limit}`),
  getSuggestionsForUser: (userId, limit = 5) =>
    api.get(`/suggestions/user/${userId}?limit=${limit}`),
  getTrendingSuggestions: (limit = 10) =>
    api.get(`/suggestions/trending?limit=${limit}`),
};

// Message endpoints
export const messageAPI = {
  sendMessage: (recipientId, text, formData = null) => {
    if (formData) {
      // File upload - use FormData
      return api.post("/private-messages/send", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    // Text-only message
    return api.post("/private-messages/send", { recipientId, text });
  },
  getInbox: () => api.get("/private-messages/inbox"),
  getConversation: (userId, page = 1) =>
    api.get(`/private-messages/${userId}?page=${page}`),
  deleteMessage: (messageId, deleteFor = "me") => {
    console.log("🗑️ API: Delete message", messageId, "deleteFor:", deleteFor);
    return api.post(`/private-messages/${messageId}/delete`, { deleteFor });
  },
  markAsRead: (messageId) => api.put(`/private-messages/${messageId}/read`),
  getUnreadCount: () => api.get("/private-messages/unread-count"),
};

// Community endpoints
export const communityAPI = {
  getAllCommunities: (category = "") =>
    api.get(`/communities${category ? `?category=${category}` : ""}`),
  getCommunityById: (id) => api.get(`/communities/${id}`),
  getUserJoinedCommunities: () => api.get("/communities/user/joined"),
  joinCommunity: (communityId) =>
    api.post(`/communities/${communityId}/join`),
  leaveCommunity: (communityId) =>
    api.post(`/communities/${communityId}/leave`),
};

export default api;
