import React, { useState } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/user/login', { email, password });

      if (response.data.success) {
        if (response.data.user.role === 'admin') {
          toast.success('Admin access granted');
          localStorage.setItem('adminToken', response.data.accessToken);
          setUser(response.data.user);
          if (onLoginSuccess) onLoginSuccess();
        } else {
          toast.error('Access denied: Not an admin');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-[#111] to-[#0a0a0a] relative overflow-hidden">

      {/* Glow Background */}
      <div className="absolute w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-gray-400/10 blur-[100px] rounded-full bottom-[-100px] right-[-100px]"></div>

      <div className="max-w-md w-full mx-4 animate-fadeIn">
        <div className="relative p-[1px] rounded-3xl bg-gradient-to-br from-white/20 to-transparent">

          {/* Glass Card */}
          <div className="bg-[#121212]/90 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-all duration-500 hover:shadow-[0_25px_80px_rgba(255,255,255,0.08)]">

            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-white tracking-tight">
                Admin Portal
              </h1>
              <p className="text-gray-400 mt-2">
                Secure access to Tunestream Management
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
                  placeholder="Admin.com"
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white 
                  focus:outline-none focus:ring-2 focus:ring-white/20 
                  transition-all duration-300 hover:border-white/20"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label className="text-sm text-gray-400 mb-2 block">
                  Password
                </label>

                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="xxxxxx."
                  className="w-full px-5 py-4 pr-14 rounded-2xl bg-white/5 border border-white/10 text-white 
                  focus:outline-none focus:ring-2 focus:ring-white/20 
                  transition-all duration-300 hover:border-white/20"
                />

                {/* Show/Hide Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[42px] text-gray-400 hover:text-white transition"
                >
                  {showPassword ? 'Hide' : 'Show'}
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
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-white/10 hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-white/10'
                  }
                `}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  'Log In to Dashboard'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500 italic">
                "Only authorized personnel should proceed"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animation */}
      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 0.8s ease forwards;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default AdminLogin;
