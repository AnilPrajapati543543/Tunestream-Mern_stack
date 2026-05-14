import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import OTPInput from "../components/OTPInput";
import { toast } from "react-toastify";

const Login = ({ switchToSignup, switchToForgot, isModal }) => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");

  const { setUser } = useAuth();

  const sendOTPHandler = async () => {
    if (!email && !phoneNumber) return alert("Email or Phone required");
    try {
      setLoading(true);
      const res = await API.post("/user/send-otp", { email, phoneNumber });
      if (res.data.success) {
        setShowOTP(true);
        toast.success("OTP sent!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Verify OTP first
      const verifyRes = await API.post("/user/verify-otp", { 
        email, 
        phoneNumber, 
        otp 
      });

      if (!verifyRes.data.success) {
        return toast.error("Invalid OTP");
      }

      const res = await API.post("/user/login", {
        email,
        password,
      });

      setUser(res.data.user);
      toast.success("Welcome back!");
    } catch (error) {
      toast.error("Invalid credentials or OTP");
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
        <h2 className="text-white text-3xl font-bold mb-8 text-center">
          Sign In
        </h2>

        <div className="space-y-5">
          <input
            className="w-full p-4 rounded-full bg-white/10 text-white border border-white/10 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
            placeholder="Email"
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full p-4 rounded-full bg-white/10 text-white border border-white/10 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
            placeholder="Phone Number"
            type="tel"
            required
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <div className="relative">
            <input
              className="w-full p-4 rounded-full bg-white/10 text-white border border-white/10 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white transition-colors"
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

          </div>
        </div>

        {showOTP && (
          <div className="mt-8">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center mb-4">Enter 6-Digit Code</p>
            <OTPInput value={otp} onChange={setOtp} />
          </div>
        )}

        <button 
          type="button"
          onClick={showOTP ? submitHandler : sendOTPHandler}
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 p-4 rounded-full text-white font-bold mt-8 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
        >
          {loading ? "Processing..." : (showOTP ? "Verify & Sign In" : "Send OTP")}
        </button>

        <p className="text-gray-400 mt-6 text-center">
          New here?{" "}
          <span 
            className="text-emerald-400 hover:text-emerald-300 cursor-pointer font-semibold underline underline-offset-4"
            onClick={switchToSignup}
          >
            Create account
          </span>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;