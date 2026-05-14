import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const steps = [
  {
    id: 'add-song',
    title: 'Publish Songs via Link',
    description: 'Simply paste any audio link to instantly publish a song to the platform.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    gesture: 'click'
  },
  {
    id: 'account',
    title: 'Create & Sync Account',
    description: 'Sign up or login to keep your library and history synced across devices.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    gesture: 'click'
  },
  {
    id: 'playlist',
    title: 'Create Playlists',
    description: 'Organize your favorite discoveries into custom playlists for every mood.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
    gesture: 'click'
  },
  {
    id: 'albums',
    title: 'Explore Albums',
    description: 'Open full albums to experience the complete vision of your favorite artists.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    gesture: 'click'
  }
];

const OnboardingGesture = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenGesture = localStorage.getItem('hasSeenGesture');
    const isNewUserOrAdmin = !hasSeenGesture || user?.role === 'admin';

    if (isNewUserOrAdmin) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenGesture', 'true');
  };

  if (!isVisible) return null;

  const step = steps[currentStep];

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6"
        >
          <div className="w-full max-w-sm flex flex-col items-center">
            {/* Feature Card */}
            <motion.div
              key={step.id}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 shadow-2xl w-full text-center relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
                <motion.div 
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>

              <div className="mb-6 flex justify-center">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  {step.icon}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">
                {step.title}
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                {step.description}
              </p>

              {/* Hand Animation Placeholder Container */}
              <div className="relative h-20 mb-8 flex justify-center items-center">
                 {/* Ripple effect */}
                 <motion.div
                    animate={{
                      scale: [1, 2.5],
                      opacity: [0.3, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    className="absolute w-12 h-12 bg-white/20 rounded-full"
                  />
                  
                  {/* Hand Icon */}
                  <motion.div
                    animate={{
                      y: [10, -5, 10],
                      scale: [1, 0.9, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 11V6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6V10.5M15 10.5V11M15 10.5C15.636 10.1583 16.3533 10 17.0691 10.0212C18.666 10.0686 19.9881 11.3653 20 12.9634V15C20 18.3137 17.3137 21 14 21H10.871C9.69749 21 8.55294 20.6274 7.61864 19.9406L3.89669 17.2025C3.26871 16.7405 3.12328 15.8458 3.56839 15.1818L3.63351 15.0847C4.1207 14.3582 5.11181 14.1687 5.86015 14.658L9 16.7163V11"
                        stroke="rgba(255, 255, 255, 0.9)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="rgba(255, 255, 255, 0.15)"
                      />
                    </svg>
                  </motion.div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDismiss}
                  className="flex-1 py-3 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white text-sm font-semibold transition-all"
                >
                  Skip
                </button>
                <button
                  onClick={handleNext}
                  className="flex-[2] py-3 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                >
                  {currentStep === steps.length - 1 ? 'Got it!' : 'Next'}
                </button>
              </div>
            </motion.div>
            
            <div className="mt-8 flex gap-2">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-emerald-500' : 'w-2 bg-white/20'}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingGesture;

