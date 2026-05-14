import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const OnboardingGesture = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user should see the onboarding gesture
    const hasSeenGesture = localStorage.getItem('hasSeenGesture');
    const isNewUserOrAdmin = !hasSeenGesture || user?.role === 'admin';

    if (isNewUserOrAdmin) {
      // Small delay before showing the gesture to let the app load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenGesture', 'true');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm sm:items-end sm:pb-32 sm:justify-center md:items-center"
          onClick={handleDismiss}
        >
          <div className="relative flex flex-col items-center pointer-events-none">
            {/* Gesture text */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-2xl mb-8 shadow-2xl"
            >
              <p className="text-sm font-medium tracking-wide">Tap anywhere to start exploring</p>
            </motion.div>

            {/* Hand animation */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                scale: [1, 0.9, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              {/* Ripple effect */}
              <motion.div
                animate={{
                  scale: [1, 2.5],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 1,
                }}
                className="absolute top-2 left-2 w-12 h-12 bg-white/30 rounded-full"
              />
              
              {/* Hand Icon SVG */}
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-2xl opacity-90"
              >
                <path
                  d="M9 11V6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6V10.5M15 10.5V11M15 10.5C15.636 10.1583 16.3533 10 17.0691 10.0212C18.666 10.0686 19.9881 11.3653 20 12.9634V15C20 18.3137 17.3137 21 14 21H10.871C9.69749 21 8.55294 20.6274 7.61864 19.9406L3.89669 17.2025C3.26871 16.7405 3.12328 15.8458 3.56839 15.1818L3.63351 15.0847C4.1207 14.3582 5.11181 14.1687 5.86015 14.658L9 16.7163V11"
                  stroke="rgba(255, 255, 255, 0.9)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="rgba(255, 255, 255, 0.2)"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingGesture;
