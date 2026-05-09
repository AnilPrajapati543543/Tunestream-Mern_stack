import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await API.put(`/user/reset-password/${token}`, { password });
      setMessage("Password reset successful. Redirecting...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-black to-emerald-900 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-green-500/10 rounded-full blur-3xl opacity-50"></div>

      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submitHandler}
        className="backdrop-blur-xl bg-white/5 border border-white/10 p-12 rounded-2xl shadow-2xl w-96 z-10"
      >
        <h2 className="text-white text-3xl font-bold mb-4 text-center">
          Reset Password
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Enter your new password below.
        </p>

        {message && <div className="text-emerald-400 mb-4 text-center text-sm">{message}</div>}
        {error && <div className="text-red-400 mb-4 text-center text-sm">{error}</div>}

        <div className="space-y-5">
          <div className="relative">
            <input
              className="w-full p-4 rounded-full bg-white/10 text-white border border-white/10 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
            />
          </div>
          <div className="relative">
            <input
              className="w-full p-4 rounded-full bg-white/10 text-white border border-white/10 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 p-4 rounded-full text-white font-bold mt-8 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

      </motion.form>
    </div>
  );
};

export default ResetPassword;
