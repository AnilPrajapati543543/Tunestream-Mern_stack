import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import axios from '../../utils/axios';
import OTPInput from '../../components/OTPInput';


const AdminSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const sendOTPHandler = async () => {
    if (!formData.email) return toast.error("Email is required");
    setLoading(true);
    try {
      const res = await axios.post("/user/send-otp", { email: formData.email, type: 'signup' });
      if (res.data.success) {
        setShowOTP(true);
        setResendTimer(30);
        toast.success("OTP sent!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!showOTP) {
        return sendOTPHandler();
    }

    if (!otp) {
        return toast.error("Please enter OTP");
    }

    setLoading(true);

    try {
      await signup({ ...formData, otp });
      toast.success('Admin account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Signup failed');
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
          className="glass-panel p-6 sm:p-10 md:p-12"
        >
          {/* Logo Area */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] mb-6 shadow-2xl shadow-indigo-500/20" style={{ background: 'var(--accent-gradient)' }}>
              <span className="text-white text-4xl font-black">T</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Create <span className="logo-text">Admin</span>
            </h1>
            <p className="text-[var(--text-secondary)] mt-2 font-medium opacity-60 text-sm sm:text-base">
              Join the management team
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest px-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                disabled={showOTP}
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="premium-input w-full disabled:opacity-50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest px-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                disabled={showOTP}
                value={formData.email}
                onChange={handleChange}
                placeholder="youremail.com"
                className="premium-input w-full disabled:opacity-50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest px-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  disabled={showOTP}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="premium-input w-full pr-12 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {showOTP && (
              <div className="mt-8 flex flex-col items-center">
                <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest text-center mb-4 opacity-50">Enter 6-Digit Code</p>
                <OTPInput value={otp} onChange={setOtp} />
                
                <div className="mt-6 text-sm text-[var(--text-secondary)]">
                  {resendTimer > 0 ? (
                    <p>Resend code in <span className="font-mono text-[var(--accent-color)]">{resendTimer}s</span></p>
                  ) : (
                    <p>
                      Didn't receive code?{" "}
                      <button 
                        type="button"
                        onClick={sendOTPHandler}
                        className="text-[var(--accent-color)] hover:opacity-80 font-semibold underline underline-offset-4 transition-colors"
                      >
                        Resend OTP
                      </button>
                    </p>
                  )}
                </div>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="premium-button w-full py-4 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{showOTP ? 'Creating...' : 'Processing...'}</span>
                </div>
              ) : (
                showOTP ? 'Verify & Create Account' : 'Send OTP'
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center space-y-3">
            <p className="text-sm text-[var(--text-secondary)]">
              Already have an account?{' '}
              <Link to="/login" className="text-[var(--accent-color)] hover:underline font-bold transition-all">
                Sign In
              </Link>
            </p>
            <div className="pt-2 border-t border-[var(--border-color)]">
               <a href={import.meta.env.VITE_HOME_URL || "http://localhost:5173"} className="text-xs text-[var(--text-secondary)] hover:text-white transition-colors flex items-center justify-center gap-1">
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

