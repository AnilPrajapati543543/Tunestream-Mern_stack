import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ForgotPassword from '../pages/ForgotPassword';
import { X } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const [view, setView] = useState('role_selection'); // 'role_selection', 'login', 'signup', 'forgot'
  const [selectedRole, setSelectedRole] = useState('user'); // 'user' or 'admin'
  const { isAuthenticated } = useAuth();

  // Close modal automatically on successful login
  React.useEffect(() => {
    if (isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-[#121212] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10"
        >

          {view === 'role_selection' ? (
            <div className="p-8 sm:p-12 flex flex-col items-center">
              <div className="w-full flex justify-end mb-4 -mt-2">
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="text-center mb-10">
                <motion.h2 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white text-3xl font-extrabold mb-3 tracking-tight"
                >
                  Welcome to <span className="text-emerald-500">TuneStream</span>
                </motion.h2>
                <p className="text-gray-400 text-sm font-medium opacity-80">How would you like to use the platform?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <button 
                  onClick={() => { setSelectedRole('user'); setView('login'); }}
                  className="group flex flex-col items-center justify-center p-8 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/50 rounded-3xl transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-all">
                    <span className="text-3xl">🎧</span>
                  </div>
                  <span className="text-white font-bold text-lg">Listener</span>
                  <p className="text-[10px] text-gray-500 mt-2 text-center leading-relaxed">Listen to unlimited high-quality music</p>
                </button>

                <button 
                  onClick={() => { setSelectedRole('admin'); setView('login'); }}
                  className="group flex flex-col items-center justify-center p-8 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/50 rounded-3xl transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all">
                    <span className="text-3xl">🎨</span>
                  </div>
                  <span className="text-white font-bold text-lg">Artist</span>
                  <p className="text-[10px] text-gray-500 mt-2 text-center leading-relaxed">Upload tracks and manage your albums</p>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header Row */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.02]">
                <div className="flex bg-black/40 p-1 rounded-full">
                  <button
                    onClick={() => setView('login')}
                    className={`px-5 py-1.5 rounded-full transition-all text-xs font-bold ${
                      view === 'login' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setView('signup')}
                    className={`px-5 py-1.5 rounded-full transition-all text-xs font-bold ${
                      view === 'signup' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setView('role_selection')}
                    className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-emerald-500 font-bold transition-colors"
                  >
                    Change Role
                  </button>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="pb-8">
                {selectedRole === 'admin' ? (
                  <div className="p-8 sm:p-12 text-center flex flex-col items-center">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-4xl mb-6 shadow-inner"
                    >
                      🎨
                    </motion.div>
                    <h3 className="text-white text-2xl font-bold mb-3">Artist & Admin Portal</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-[280px]">
                      To manage your library, tracks, and collections, please switch to our professional Management Panel.
                    </p>
                    
                    <a 
                      href="https://www-tunestream-admin.vercel.app" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative flex items-center justify-center w-full bg-emerald-500 hover:bg-emerald-600 p-5 rounded-2xl text-white font-bold transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                    >
                      <span className="mr-2">Enter Dashboard</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                    
                    <p className="text-[10px] font-medium text-gray-600 mt-6 uppercase tracking-[0.2em]">
                      Secure External Access
                    </p>
                  </div>
                ) : (
                  <>
                    {view === 'login' ? (
                      <div className="scale-90 origin-top">
                        <Login switchToSignup={() => setView('signup')} switchToForgot={() => setView('forgot')} isModal />
                      </div>
                    ) : view === 'signup' ? (
                      <div className="scale-90 origin-top">
                        <Signup switchToLogin={() => setView('login')} isModal />
                      </div>
                    ) : (
                      <div className="scale-90 origin-top">
                        <ForgotPassword switchToLogin={() => setView('login')} isModal />
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
