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
    <div className={`min-h-screen flex items-center justify-center bg-[var(--bg-color)] relative overflow-hidden transition-colors duration-500`}>

      {/* Decorative Glows */}
      <div className="absolute w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full -top-40 -left-40 animate-pulse"></div>
      <div className="absolute w-[400px] h-[400px] bg-rose-500/5 blur-[100px] rounded-full -bottom-20 -right-20"></div>

      <div className="max-w-md w-full mx-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-panel p-10 md:p-12"
        >
          {/* Logo Area */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] mb-6 shadow-2xl shadow-indigo-500/20" style={{ background: 'var(--accent-gradient)' }}>
              <span className="text-white text-4xl font-black">T</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Admin <span className="logo-text">Access</span>
            </h1>
            <p className="text-[var(--text-secondary)] mt-2 font-medium opacity-60">
              TuneStream Management Panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest px-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tunestream.com"
                className="premium-input w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest px-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="premium-input w-full pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="flex justify-end pt-2">
                <Link to="/forgot-password" className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="premium-button w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying Access...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              Need an admin account?{' '}
              <Link to="/signup" className="text-[var(--accent-color)] hover:underline font-bold transition-all">
                Create Account
              </Link>
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;