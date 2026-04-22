import React, { useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/user/login", { email, password });

      if (res.data.success && res.data.user.role === "admin") {
        localStorage.setItem("adminToken", res.data.accessToken);
        setUser(res.data.user);
        toast.success("Welcome, Admin");
        onLoginSuccess && onLoginSuccess();
      } else {
        toast.error("Access denied");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] via-[#0a0a0a] to-black relative overflow-hidden">

      {/* Ambient Glow */}
      <div className="absolute w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-gray-400/10 blur-[100px] rounded-full bottom-[-120px] right-[-120px]" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md mx-4"
      >
        {/* Gradient Border */}
        <div className="p-[1px] rounded-3xl bg-gradient-to-br from-white/20 to-transparent">

          {/* Glass Card */}
          <div className="bg-[#121212]/80 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] hover:shadow-[0_30px_90px_rgba(255,255,255,0.08)] transition-all duration-500">

            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-semibold text-white tracking-tight">
                Admin Panel
              </h1>
              <p className="text-gray-400 mt-2 text-sm">
                Secure access to Tunestream
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white
                  focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30
                  transition-all duration-300 placeholder:text-gray-500"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label className="text-sm text-gray-400 mb-2 block">
                  Password
                </label>

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-5 py-4 pr-14 rounded-2xl bg-white/5 border border-white/10 text-white
                  focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30
                  transition-all duration-300 placeholder:text-gray-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[42px] text-gray-400 hover:text-white text-sm transition"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-4 rounded-2xl font-semibold text-white
                  transition-all duration-300 transform
                  ${loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-white/10 hover:bg-white/20 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-white/10"
                  }
                `}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  "Log In to Panel"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500 italic">
                Authorized personnel only
              </p>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
