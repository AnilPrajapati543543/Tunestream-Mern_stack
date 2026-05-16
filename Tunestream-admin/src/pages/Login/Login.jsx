import React, { useState } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please fill all required fields");
    }

    setLoading(true);

    try {
      await login(email, password);
      toast.success('Admin access granted');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-green-500/10 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-md w-full mx-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 sm:p-12 rounded-3xl shadow-2xl"
        >
          {/* Logo Area */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-emerald-500/20 mb-6 shadow-2xl shadow-emerald-500/20 border border-emerald-500/20">
              <span className="text-emerald-500 text-4xl font-black italic">T</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Admin <span className="text-emerald-500">Access</span>
            </h1>
            <p className="text-gray-400 mt-2 font-medium opacity-60 text-sm">
              TuneStream Management Panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tunestream.com"
                className="w-full p-4 rounded-xl bg-[#121212] text-white border border-[#333] focus:border-emerald-500 hover:border-[#555] outline-none transition-all placeholder:text-gray-600 font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-4 rounded-xl bg-[#121212] text-white border border-[#333] focus:border-emerald-500 hover:border-[#555] outline-none transition-all placeholder:text-gray-600 font-medium pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-gray-500 hover:text-white transition-colors tracking-widest"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="flex justify-end pt-1">
                <Link to="/forgot-password" weights="500" className="text-xs text-gray-500 hover:text-emerald-400 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] py-4 rounded-2xl text-black text-sm font-black mt-4 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : "Enter Dashboard"}
            </button>
          </form>

          <div className="mt-10 text-center space-y-4">
            <p className="text-sm text-gray-400">
              Need an admin account?{' '}
              <Link to="/signup" className="text-emerald-400 hover:text-emerald-300 font-bold transition-all underline underline-offset-4 decoration-2">
                Create Account
              </Link>
            </p>
            <div className="pt-6 border-t border-white/5">
               <a href={import.meta.env.VITE_HOME_URL || "https://www-tunestream-home.vercel.app"} className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                 ← Back to Listener Portal
               </a>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;