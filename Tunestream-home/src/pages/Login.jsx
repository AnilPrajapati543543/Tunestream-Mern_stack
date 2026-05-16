import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import OTPInput from "../components/OTPInput";
import { toast } from "react-toastify";

const Login = ({ switchToSignup, switchToForgot, isModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please fill all required fields");
    }

    setLoading(true);

    try {
      const res = await API.post("/user/login", {
        email,
        password
      });

      setUser(res.data.user);
      toast.success("Welcome back!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <motion.form
      initial={isModal ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={submitHandler}
      className={`${isModal ? "bg-transparent border-none p-4 shadow-none w-full" : "backdrop-blur-xl bg-white/5 border border-white/10 sm:p-12 p-8 rounded-2xl shadow-2xl w-[92%] max-w-[400px] z-10"}`}
    >
        <h2 className="text-white sm:text-3xl text-2xl font-black sm:mb-8 mb-6 tracking-tight text-center">
          Sign In
        </h2>

        <div className="space-y-5">
            <motion.input
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full p-3.5 rounded-md bg-[#121212] text-white border border-[#333] focus:border-emerald-500 hover:border-[#555] outline-none transition-all placeholder:text-gray-500 text-sm font-medium"
              placeholder="Email Address"
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />

          <div className="relative">
            <input
              className="w-full p-3.5 rounded-md bg-[#121212] text-white border border-[#333] focus:border-emerald-500 hover:border-[#555] outline-none transition-all placeholder:text-gray-500 text-sm font-medium"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
          
          <div className="flex justify-end">
            <span 
              className="text-sm text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors"
              onClick={switchToForgot}
            >
              Forgot password?
            </span>
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] p-3.5 rounded-full text-black text-sm font-bold mt-8 transition-all disabled:opacity-50"
        >
          {loading ? "Processing..." : "Sign In"}
        </button>


      <p className="text-gray-400 text-sm mt-6 text-center font-medium">
        New here?{" "}
        <span 
          className="text-emerald-400 hover:text-emerald-300 cursor-pointer font-semibold underline underline-offset-4"
          onClick={switchToSignup}
        >
          Create account
        </span>
      </p>
    </motion.form>
  );

  if (isModal) {
    return formContent;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-black to-emerald-900 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-green-500/10 rounded-full blur-3xl opacity-50"></div>
      {formContent}
    </div>
  );
};

export default Login;