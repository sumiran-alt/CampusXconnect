"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function Auth() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (isSignUp) {
      if (!formData.name.trim()) {
        toast.error("Name is required");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return;
    }

    setLoading(true);

    try {
      let response;

      if (isSignUp) {
        // Sign up
        response = await authAPI.signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      } else {
        // Sign in
        response = await authAPI.login({
          email: formData.email,
          password: formData.password,
        });
      }

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setAuth(user, token);

      // Clear form data
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      toast.success(isSignUp ? "Signup successful!" : "Login successful!");
      router.push(isSignUp ? "/onboarding" : "/feed");
    } catch (error) {
      toast.error(error.response?.data?.message || (isSignUp ? "Signup failed" : "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .toggle-pill {
          display: inline-flex;
          background: rgba(229, 231, 235, 0.8);
          border-radius: 50px;
          padding: 4px;
          gap: 4px;
          backdrop-filter: blur(10px);
        }

        .toggle-pill button {
          padding: 8px 20px;
          border-radius: 40px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          background: transparent;
          color: #6B7280;
        }

        .toggle-pill button.active {
          background: white;
          color: #2563EB;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #E5E7EB;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #2563EB;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .submit-btn {
          width: 100%;
          padding: 12px 16px;
          background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(37, 99, 235, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .form-label {
          display: block;
          color: #374151;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 0.95rem;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .switch-link {
          color: #2563EB;
          text-decoration: none;
          cursor: pointer;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .switch-link:hover {
          color: #1D4ED8;
          text-decoration: underline;
        }
      `}</style>

      <div className="w-full max-w-md animate-fade-in">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 text-white">
            <h1 className="text-3xl font-bold mb-2">
              {isSignUp ? "Join CampusXConnect" : "Welcome Back"}
            </h1>
            <p className="text-blue-100">
              {isSignUp
                ? "Build your campus network before graduation"
                : "Stay connected with your campus"}
            </p>
          </div>

          {/* Form Container */}
          <div className="px-8 py-8">
            {/* Toggle Mode */}
            <div className="flex justify-center mb-8">
              <div className="toggle-pill">
                <button
                  onClick={() => !loading && !isSignUp && toggleMode()}
                  className={`${!isSignUp ? "active" : ""}`}
                  disabled={loading}
                >
                  Sign In
                </button>
                <button
                  onClick={() => !loading && isSignUp && toggleMode()}
                  className={`${isSignUp ? "active" : ""}`}
                  disabled={loading}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field - Only for Sign Up */}
              {isSignUp && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="form-input"
                    required={isSignUp}
                    disabled={loading}
                  />
                </div>
              )}

              {/* Email Field */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>

              {/* Confirm Password - Only for Sign Up */}
              {isSignUp && (
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="form-input"
                    required={isSignUp}
                    disabled={loading}
                  />
                </div>
              )}

              {/* Forgot Password - Only for Sign In */}
              {!isSignUp && (
                <div className="text-right">
                  <Link href="/forgot-password" className="switch-link text-sm">
                    Forgot password?
                  </Link>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="submit-btn"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isSignUp ? "Creating account..." : "Signing in..."}
                  </span>
                ) : isSignUp ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Switch Mode Link */}
            <p className="text-center text-gray-600 mt-6">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button
                onClick={toggleMode}
                disabled={loading}
                className="switch-link"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>

            {/* Divider */}
            <div className="relative mt-8 mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue as guest</span>
              </div>
            </div>

            {/* Guest Link */}
            <Link
              href="/feed"
              className="block w-full text-center py-2 px-4 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
            >
              Browse as Guest
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-blue-600 hover:underline font-medium">
            Terms of Service
          </Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline font-medium">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
