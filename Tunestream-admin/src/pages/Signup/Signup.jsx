import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
        return toast.error("Please fill all required fields");
    }

    setLoading(true);

    try {
      await signup(formData);
      toast.success('Admin account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-500/10 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-md w-full mx-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 sm:p-12 rounded-3xl shadow-2xl"
        >
          {/* Logo Area */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-emerald-500/20 mb-6 shadow-2xl shadow-emerald-500/20 border border-emerald-500/20">
              <span className="text-emerald-500 text-4xl font-black italic">T</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Create <span className="text-emerald-500">Admin</span>
            </h1>
            <p className="text-gray-400 mt-2 font-medium opacity-60 text-sm">
              Join the management team
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full p-4 rounded-xl bg-[#121212] text-white border border-[#333] focus:border-emerald-500 hover:border-[#555] outline-none transition-all placeholder:text-gray-600 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="youremail.com"
                className="w-full p-4 rounded-xl bg-[#121212] text-white border border-[#333] focus:border-emerald-500 hover:border-[#555] outline-none transition-all placeholder:text-gray-600 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] py-4 rounded-2xl text-black text-sm font-black mt-6 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </div>
              ) : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center space-y-3">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold transition-all underline underline-offset-4 decoration-2">
                Sign In
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

export default AdminSignup;
