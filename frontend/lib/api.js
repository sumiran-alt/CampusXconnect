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
};

// User endpoints
export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  getUserById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put("/users/profile/update", data),
  follow: (id) => api.post(`/users/follow/${id}`),
  unfollow: (id) => api.post(`/users/unfollow/${id}`),
};

// Post endpoints
export const postAPI = {
  createPost: (data) => api.post("/posts/createPost", data),
  getFeed: (page = 1) => api.get(`/posts/feed?page=${page}`),
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
  getProblemById: (id) => api.get(`/coding/problems/${id}`),
  submit: (data) => api.post("/coding/submit", data),
  getUserSubmissions: (userId) => api.get(`/coding/submissions/${userId}`),
  getLeaderboard: () => api.get("/coding/leaderboard"),
};

export default api;
