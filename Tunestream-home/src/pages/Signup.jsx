import React, { useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import OTPInput from "../components/OTPInput";
import { toast } from "react-toastify";

const Signup = ({ switchToLogin, isModal }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [method, setMethod] = useState("email"); // 'email' or 'phone'
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");

  const sendOTPHandler = async () => {
    if (method === "email" && !form.email) return toast.error("Email is required");
    if (method === "phone" && !form.phoneNumber) return toast.error("Phone Number is required");
    
    try {
      setLoading(true);
      const payload = method === "email" ? { email: form.email } : { phoneNumber: form.phoneNumber };
      const res = await API.post("/user/send-otp", payload);
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

    if (!form.name || !form.password || (method === "email" && !form.email) || (method === "phone" && !form.phoneNumber)) {
      return alert("Please fill all required fields");
    }

    try {
      setLoading(true);

      // Verify OTP first
      const verifyPayload = method === "email" 
        ? { email: form.email, otp } 
        : { phoneNumber: form.phoneNumber, otp };

      const verifyRes = await API.post("/user/verify-otp", verifyPayload);

      if (!verifyRes.data.success) {
        return toast.error("Invalid OTP");
      }

      // Final registration (clear the other field if not used)
      const finalForm = { ...form };
      if (method === "email") finalForm.phoneNumber = "";
      else finalForm.email = "";

      const res = await API.post("/user/register", finalForm);

      if (res.data.success) {
        toast.success("Signup success");
        switchToLogin();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${isModal ? "p-0" : "min-h-screen"} flex items-center justify-center bg-gradient-to-br from-black via-black to-emerald-900 relative overflow-hidden`}>
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-500/10 rounded-full blur-3xl opacity-50"></div>

      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submitHandler}
        className={`${isModal ? "bg-transparent border-none p-4 shadow-none" : "backdrop-blur-xl bg-white/5 border border-white/10 p-12 rounded-2xl shadow-2xl"} w-96 z-10`}
      >
        <h2 className="text-white text-3xl font-bold mb-8 text-center">
          Create Account
        </h2>

        {/* METHOD TOGGLE */}
        <div className="flex bg-white/5 rounded-full p-1 mb-8 border border-white/10">
          <button
            type="button"
            onClick={() => { setMethod("email"); setShowOTP(false); }}
            className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${method === 'email' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => { setMethod("phone"); setShowOTP(false); }}
            className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${method === 'phone' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Phone
          </button>
        </div>

        <div className="space-y-5">
          <input
            className="w-full p-4 rounded-full bg-white/10 text-white border border-white/10 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
            placeholder="Name"
            type="text"
            required
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          {method === "email" ? (
            <motion.input
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full p-4 rounded-full bg-white/10 text-white border border-white/10 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
              placeholder="Email Address"
              type="email"
              required
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          ) : (
            <motion.input
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full p-4 rounded-full bg-white/10 text-white border border-white/10 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
              placeholder="Phone Number (e.g. +91...)"
              type="tel"
              required
              onChange={(e) =>
                setForm({ ...form, phoneNumber: e.target.value })
              }
            />
          )}

          <input
            className="w-full p-4 rounded-full bg-white/10 text-white border border-white/10 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
            placeholder="Invite Code (Optional)"
            type="text"
            onChange={(e) =>
              setForm({ ...form, inviteCode: e.target.value })
            }
          />

          <div className="relative">
            <input
              className="w-full p-4 rounded-full bg-white/10 text-white border border-white/10 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
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
          {loading ? "Processing..." : (showOTP ? "Verify & Sign Up" : "Send OTP")}
        </button>

        <p className="text-gray-400 mt-6 text-center">
          Already have an account?{" "}
          <span 
            onClick={switchToLogin} 
            className="text-emerald-400 hover:text-emerald-300 cursor-pointer font-semibold underline underline-offset-4"
          >
            Sign In
          </span>
        </p>
      </motion.form>
    </div>
  );
};

export default Signup;