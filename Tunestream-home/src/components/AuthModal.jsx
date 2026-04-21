import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import { X } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const [view, setView] = useState('login'); // 'login' or 'signup'
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

          {/* Toggle Buttons (Top) */}
          <div className="flex bg-black/40 p-1 m-6 rounded-full w-fit">
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

          <div className="pb-8 -mt-16">
            {view === 'login' ? (
              <div className="scale-90 origin-top">
                 <Login switchToSignup={() => setView('signup')} isModal />
              </div>
            ) : (
              <div className="scale-90 origin-top">
                <Signup switchToLogin={() => setView('login')} isModal />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
