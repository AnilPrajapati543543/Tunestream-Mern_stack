import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const steps = [
  {
    id: 'add-song',
    targetId: 'onboarding-admin-portal',
    title: 'Publish Songs via Link',
    description: 'Simply paste any audio link to instantly publish a song to the platform via the Creator Portal.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    placement: 'left' // Tooltip points left on desktop
  },
  {
    id: 'account',
    targetId: 'onboarding-login-btn',
    title: 'Create & Sync Account',
    description: 'Sign up or login to keep your library and history synced across devices.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    placement: 'left'
  },
  {
    id: 'playlist',
    targetId: 'onboarding-playlist-btn',
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
    placement: 'right' // Tooltip points right (adjacent to sidebar button)
  },
  {
    id: 'albums',
    targetId: 'onboarding-album-card',
    title: 'Explore Albums',
    description: 'Open full albums to experience the complete vision of your favorite artists.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    placement: 'above' // Tooltip floats above Featured Charts card
  }
];

const OnboardingGesture = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  // Enforce single onboarding life-cycle ONLY on new user first visit
  useEffect(() => {
    const hasSeenGesture = localStorage.getItem('hasSeenGesture');
    if (!hasSeenGesture) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500); // 1.5s delay for smooth welcome transition
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Dynamically calculate coordinate bounds of target elements
  useEffect(() => {
    if (!isVisible) return;

    const updatePosition = () => {
      const step = steps[currentStep];
      const element = document.getElementById(step.targetId);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) {
          setTargetRect(null);
        } else {
          setTargetRect(rect);
        }
      } else {
        setTargetRect(null); // Fallback to centered card overlay if target is hidden/absent
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    // Keep polling target element status to react to sidebar expands/navigation shifts
    const pollInterval = setInterval(updatePosition, 300);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      clearInterval(pollInterval);
    };
  }, [currentStep, isVisible]);

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
  const isMobile = window.innerWidth <= 768;

  // Compute layout offsets for the pointing tooltip
  let tooltipStyle = {};
  let placement = 'center';

  if (targetRect && !isMobile) {
    placement = step.placement;
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    if (placement === 'right') {
      tooltipStyle = {
        position: 'fixed',
        left: `${targetRect.right + 24}px`,
        top: `${Math.max(20, targetRect.top + targetRect.height / 2 - 160)}px`,
        width: '320px',
      };
    } else if (placement === 'left') {
      tooltipStyle = {
        position: 'fixed',
        left: `${targetRect.left - 344}px`,
        top: `${Math.max(20, targetRect.top + targetRect.height / 2 - 160)}px`,
        width: '320px',
      };
    } else if (placement === 'above') {
      tooltipStyle = {
        position: 'fixed',
        left: `${targetRect.left + targetRect.width / 2 - 160}px`,
        top: `${targetRect.top - 330}px`,
        width: '320px',
      };
    }
  } else {
    // Elegant bottom-centered overlay layout on mobile viewports
    tooltipStyle = {
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '360px',
    };
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[9999] pointer-events-none select-none">
          {/* Dimmed Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-auto"
            onClick={handleDismiss}
          />

          {/* Dynamic Spotlight Halo Ring */}
          {targetRect && (
            <motion.div
              layoutId="spotlight"
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              className="fixed border-2 border-emerald-500 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.6)] z-[10000] pointer-events-none"
              style={{
                left: targetRect.left - 8,
                top: targetRect.top - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
              }}
            />
          )}

          {/* Dynamic Tapping Gesture Finger */}
          {targetRect && (
            <div
              className="fixed z-[10002] pointer-events-none transition-all duration-300"
              style={{
                left: `${targetRect.left + targetRect.width / 2 - 24}px`,
                top: `${targetRect.top + targetRect.height / 2 - 24}px`,
              }}
            >
              {/* Tap Ripple Effect */}
              <motion.div
                animate={{
                  scale: [1, 2.4],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
                className="absolute left-6 top-6 w-12 h-12 -ml-6 -mt-6 bg-emerald-400/40 rounded-full"
              />

              {/* Fingertip SVG */}
              <motion.div
                animate={{
                  y: [8, -3, 8],
                  scale: [1, 0.92, 1],
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9 11V6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6V10.5M15 10.5V11M15 10.5C15.636 10.1583 16.3533 10 17.0691 10.0212C18.666 10.0686 19.9881 11.3653 20 12.9634V15C20 18.3137 17.3137 21 14 21H10.871C9.69749 21 8.55294 20.6274 7.61864 19.9406L3.89669 17.2025C3.26871 16.7405 3.12328 15.8458 3.56839 15.1818L3.63351 15.0847C4.1207 14.3582 5.11181 14.1687 5.86015 14.658L9 16.7163V11"
                    stroke="rgba(16, 185, 129, 0.95)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="rgba(16, 185, 129, 0.25)"
                    className="drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                  />
                </svg>
              </motion.div>
            </div>
          )}

          {/* Floating Onboarding Tooltip Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            style={tooltipStyle}
            className={`
              bg-[#181818]/95 backdrop-blur-xl border border-white/15 p-6 rounded-[2rem] 
              shadow-2xl z-[10001] pointer-events-auto flex flex-col text-center
              ${placement === 'right' ? 'after:content-[""] after:absolute after:right-full after:top-[150px] after:-mt-2 after:border-8 after:border-transparent after:border-r-[#181818]' : ''}
              ${placement === 'left' ? 'after:content-[""] after:absolute after:left-full after:top-[150px] after:-mt-2 after:border-8 after:border-transparent after:border-l-[#181818]' : ''}
              ${placement === 'above' ? 'after:content-[""] after:absolute after:top-full after:left-1/2 after:-ml-2 after:border-8 after:border-transparent after:border-t-[#181818]' : ''}
            `}
          >
            {/* Top Linear Progress Indicator */}
            <div className="absolute top-0 left-0 w-full h-1 bg-white/10 rounded-t-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>

            {/* Step Icon Badge */}
            <div className="mb-4 mt-2 flex justify-center">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                {step.icon}
              </div>
            </div>

            {/* Title & Desc */}
            <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
              {step.title}
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed mb-6 font-medium">
              {step.description}
            </p>

            {/* Hand tap graphic for mobile centering fallback */}
            {(!targetRect || isMobile) && (
              <div className="relative h-14 mb-4 flex justify-center items-center">
                <motion.div
                  animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute w-8 h-8 bg-emerald-400/20 rounded-full"
                />
                <motion.div animate={{ y: [4, -4, 4] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                    <path d="M12 3v12M9 6v9M6 9v6M15 6v9M18 9v6M12 15c2.5 0 6 1.5 6 4v2H6v-2c0-2.5 3.5-4 6-4z" />
                  </svg>
                </motion.div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex gap-2.5">
              <button
                onClick={handleDismiss}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-bold transition-all active:scale-95"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                className="flex-[2] py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                {currentStep === steps.length - 1 ? 'Got it!' : 'Next'}
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="mt-5 flex gap-1.5 justify-center">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-5 bg-emerald-500' : 'w-1.5 bg-white/20'}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingGesture;
