import React, { useState } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a] relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full mx-4 relative">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Admin Portal</h1>
            <p className="text-gray-400">Secure access to Tunestream Management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                placeholder="admin@tune.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-4 rounded-2xl font-semibold text-white transition-all duration-300
                ${loading 
                  ? 'bg-emerald-500/50 cursor-not-allowed' 
                  : 'bg-emerald-500 hover:bg-emerald-600 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] shadow-lg shadow-emerald-500/20'
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

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 italic">"Only authorized personnel should proceed"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
