// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import toast from "react-hot-toast";
// import { authAPI } from "@/lib/api";
// import { useAuthStore } from "@/lib/store";

// export default function AdminLogin() {
//   const router = useRouter();
//   const setAuth = useAuthStore((state) => state.setAuth);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setLoading(true);

//     try {
//       const response = await authAPI.adminLogin({
//         email: formData.email,
//         password: formData.password,
//       });

//       const { token, user } = response.data;

//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));

//       setAuth(user, token);

//       // Clear form data
//       setFormData({ email: "", password: "" });

//       toast.success("Admin login successful!");
//       router.push("/admin/dashboard");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Admin login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
//       <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
//         <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h2>
//         <p className="text-gray-600 text-sm mb-6">Access admin dashboard</p>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-gray-700 font-semibold mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter admin email"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 font-semibold mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter admin password"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gray-800 text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-50"
//           >
//             {loading ? "Logging in..." : "Admin Login"}
//           </button>
//         </form>

//         <p className="text-center text-gray-600 mt-4 text-sm">
//           Not an admin?{" "}
//           <Link
//             href="/login"
//             className="text-blue-600 font-semibold hover:underline"
//           >
//             User Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function AdminLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await authAPI.adminLogin({
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setAuth(user, token);
      setFormData({ email: "", password: "" });

      toast.success("Admin login successful!");
      router.push("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h2>
        <p className="text-gray-600 text-sm mb-6">Access admin dashboard</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gray-800 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter admin password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gray-800 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Admin Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4 text-sm">
          Not an admin?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            User Login
          </Link>
        </p>
      </div>
    </div>
  );
}
