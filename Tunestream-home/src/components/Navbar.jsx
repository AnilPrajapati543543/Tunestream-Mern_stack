import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PlayerContext } from "../context/PlayerContext";
import API from "../api/axios";
import FeedbackModal from "./FeedbackModal.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { setIsAuthModalOpen } = useContext(PlayerContext);

  const [ripple, setRipple] = useState({ x: 0, y: 0, show: false });
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const handleLogout = (e) => {
    // Ripple effect position
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      show: true,
    });

    setTimeout(() => {
      setRipple({ x: 0, y: 0, show: false });
    }, 500);

    // Open feedback modal instead of immediate session kill
    setIsFeedbackModalOpen(true);
  };

  const completeLogout = async () => {
    try {
      await API.post("/user/logout");
      localStorage.removeItem("accessToken");
      setUser(null);
      setIsFeedbackModalOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed");
      setIsFeedbackModalOpen(false);
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-2 md:p-4 text-white">
      <FeedbackModal 
        isOpen={isFeedbackModalOpen} 
        onClose={() => setIsFeedbackModalOpen(false)} 
        onSuccess={completeLogout} 
      />

      {/* LEFT SIDE */}
      <div className="flex items-center gap-2">
        {user ? (
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-black shadow-lg">
                {user.name[0]}
             </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs md:text-sm font-semibold text-gray-400 hover:text-white transition-colors"
            >
              Sign up
            </button>
            <button 
              id="onboarding-login-btn"
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 md:py-2.5 bg-white text-black rounded-full font-bold text-[10px] sm:text-xs md:text-sm hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              Log in
            </button>
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3 relative">
        <button 
          id="onboarding-admin-portal"
          onClick={() => window.open(import.meta.env.VITE_ADMIN_URL || "https://www-tunestream-admin.vercel.app", "_blank")}
          className="items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500 hover:text-black transition-all hidden sm:flex"
        >
          <span>Creator Portal</span>
        </button>

        {user ? (
          <button
            onClick={handleLogout}
            className="relative overflow-hidden bg-emerald-800 hover:bg-emerald-900 active:scale-95 transition-all duration-200 px-3 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-md"
          >
            Logout

            {/* Ripple Effect */}
            {ripple.show && (
              <span
                className="absolute bg-white/40 rounded-full animate-ping"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: 20,
                  height: 20,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
          </button>
        ) : (
          <div className="flex gap-4">
             {/* Add any other guest buttons here if needed */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;