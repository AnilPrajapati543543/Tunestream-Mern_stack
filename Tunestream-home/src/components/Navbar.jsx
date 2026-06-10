import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PlayerContext } from "../context/PlayerContext";
import API from "../api/axios";
import FeedbackModal from "./FeedbackModal.jsx";
import { Sun, Moon, Award } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { setIsAuthModalOpen } = useContext(PlayerContext);

  const [ripple, setRipple] = useState({ x: 0, y: 0, show: false });
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Theme state
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem("tunestream_theme");
      if (stored) {
        document.documentElement.setAttribute("data-theme", stored);
        return stored;
      }
    } catch (_) {}
    return "dark";
  });

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("tunestream_theme", nextTheme);
    } catch (_) {}
  };

  const handleLogout = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      show: true,
    });

    setTimeout(() => {
      setRipple({ x: 0, y: 0, show: false });
    }, 500);

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
             <div 
               onClick={() => navigate(`/profile/${user.id || user._id}`)}
               className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-black text-black shadow-lg relative cursor-pointer hover:scale-105 transition active:scale-95 group"
               title="View Public Profile"
             >
                {user.name[0].toUpperCase()}
                <span className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-black shadow-md">
                  {user.level || 1}
                </span>
             </div>
             <div className="hidden md:flex flex-col">
               <span className="text-xs font-bold text-white leading-none">{user.name}</span>
               <span className="text-[10px] text-gray-400 font-bold mt-0.5 flex items-center gap-0.5">
                 <Award size={10} className="text-yellow-500" />
                 Level {user.level || 1}
               </span>
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
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-full transition-all border border-white/5 active:scale-95 flex items-center justify-center"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? <Sun size={16} className="text-yellow-500 animate-pulse" /> : <Moon size={16} className="text-indigo-400" />}
        </button>

        <button 
          id="onboarding-admin-portal"
          onClick={() => window.open(import.meta.env.VITE_ADMIN_URL || "https://www-tunestream-admin.vercel.app", "_blank")}
          className="items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500 hover:text-black transition-all hidden sm:flex"
        >
          <span>Creator Portal</span>
        </button>

        {user && (
          <button
            onClick={handleLogout}
            className="relative overflow-hidden bg-emerald-800 hover:bg-emerald-900 active:scale-95 transition-all duration-200 px-3 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-md text-white"
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
        )}
      </div>
    </div>
  );
};

export default Navbar;