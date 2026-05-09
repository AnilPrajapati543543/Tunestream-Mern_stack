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
          className="relative w-full max-w-lg bg-[#121212] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/20 text-white/70 hover:text-white hover:bg-black/40 transition-colors"
          >
            <X size={20} />
          </button>

          {view === 'role_selection' ? (
            <div className="p-10 pt-16 flex flex-col items-center">
              <div className="text-center mb-10">
                <h2 className="text-white text-3xl font-bold mb-2">Welcome to TuneStream</h2>
                <p className="text-gray-400">Choose how you want to continue</p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <button 
                  onClick={() => { setSelectedRole('user'); setView('login'); }}
                  className="group flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/50 rounded-2xl transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🎧</span>
                  </div>
                  <span className="text-white font-bold">Listener</span>
                  <p className="text-[10px] text-gray-500 mt-1 text-center">Stream your favorite music</p>
                </button>

                <button 
                  onClick={() => { setSelectedRole('admin'); setView('login'); }}
                  className="group flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/50 rounded-2xl transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <span className="text-white font-bold">Artist / Admin</span>
                  <p className="text-[10px] text-gray-500 mt-1 text-center">Manage songs & content</p>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Toggle Buttons (Top) */}
              <div className="flex items-center justify-between mx-6 mt-8 mb-4">
                <div className="flex bg-black/40 p-1 rounded-full w-fit">
                  <button
                    onClick={() => setView('login')}
                    className={`px-6 py-2 rounded-full transition-all text-sm font-bold ${
                      view === 'login' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setView('signup')}
                    className={`px-6 py-2 rounded-full transition-all text-sm font-bold ${
                      view === 'signup' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                <button 
                  onClick={() => setView('role_selection')}
                  className="text-xs text-gray-500 hover:text-emerald-500 font-medium transition-colors"
                >
                  Change Role
                </button>
              </div>

              <div className="pb-8">
                {selectedRole === 'admin' ? (
                  <div className="p-10 text-center">
                    <div className="mb-6">
                      <span className="text-4xl mb-4 block">🎨</span>
                      <h3 className="text-white text-xl font-bold mb-2">Admin Portal</h3>
                      <p className="text-gray-400 text-sm">
                        To manage your library, artists and albums, please visit the dedicated Management Panel.
                      </p>
                    </div>
                    
                    <a 
                      href="https://www-tunestream-admin.vercel.app" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full bg-emerald-500 hover:bg-emerald-600 p-4 rounded-full text-white font-bold transition-all shadow-lg shadow-emerald-500/20"
                    >
                      Enter Admin Panel
                    </a>
                    
                    <p className="text-[10px] text-gray-500 mt-4">
                      Opens in a new tab for your security.
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
