import React, { useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";

const ForgotPassword = ({ switchToLogin, isModal }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await API.post("/user/forgot-password", { email });
      setMessage(res.data.data || "Password reset link sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${isModal ? "p-0" : "min-h-screen"} flex items-center justify-center bg-gradient-to-br from-black via-black to-emerald-900 relative overflow-hidden`}>
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-green-500/10 rounded-full blur-3xl opacity-50"></div>

      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submitHandler}
        className={`${isModal ? "bg-transparent border-none p-4 shadow-none" : "backdrop-blur-xl bg-white/5 border border-white/10 p-12 rounded-2xl shadow-2xl"} w-96 z-10`}
      >
        <h2 className="text-white text-3xl font-bold mb-4 text-center">
          Forgot Password
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Enter your email and we'll send you a reset link.
        </p>

        {message && <div className="text-emerald-400 mb-4 text-center text-sm">{message}</div>}
        {error && <div className="text-red-400 mb-4 text-center text-sm">{error}</div>}

        <div className="space-y-5">
          <input
            className="w-full p-4 rounded-full bg-white/10 text-white border border-white/10 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
            placeholder="Enter your email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button 
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 p-4 rounded-full text-white font-bold mt-8 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="text-gray-400 mt-6 text-center">
          Remember your password?{" "}
          <span 
            className="text-emerald-400 hover:text-emerald-300 cursor-pointer font-semibold underline underline-offset-4"
            onClick={switchToLogin}
          >
            Login
          </span>
        </p>
      </motion.form>
    </div>
  );
};

export default ForgotPassword;
