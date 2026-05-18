import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PlayerContext } from "../context/PlayerContext";
import API from "../api/axios";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { setIsAuthModalOpen } = useContext(PlayerContext);

  const [ripple, setRipple] = useState({ x: 0, y: 0, show: false });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (e) => {
    try {
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

      // Trigger quantum portal animation
      setIsLoggingOut(true);

      // Wait 2.0s for the portal effect to rotate
      await new Promise(resolve => setTimeout(resolve, 2000));

      await API.post("/user/logout");
      localStorage.removeItem("accessToken");
      setUser(null);
      setIsLoggingOut(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-3 md:p-4 text-white">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-2">
        {user ? (
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-black shadow-lg">
                {user.name[0]}
             </div>
             <p className="hidden md:block text-sm font-semibold">Welcome, {user.name}</p>
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
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 md:py-2.5 bg-white text-black rounded-full font-bold text-[10px] sm:text-xs md:text-sm hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              Log in
            </button>
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="relative">
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

      {isLoggingOut && (
        <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center overflow-hidden">
          {/* Neon spinning portal */}
          <div className="relative w-80 h-80 flex items-center justify-center">
            {/* Outer spinning neon loop */}
            <div className="absolute inset-0 border-8 border-dashed border-emerald-500/30 rounded-full animate-[spin_8s_linear_infinite]" />
            <div className="absolute inset-4 border-4 border-double border-indigo-500/40 rounded-full animate-[spin_6s_linear_infinite_reverse]" />
            <div className="absolute inset-8 border border-dashed border-pink-500/50 rounded-full animate-[spin_4s_linear_infinite]" />
            
            {/* Rotating central neon portal core */}
            <div className="w-40 h-40 bg-gradient-to-tr from-emerald-500 via-indigo-600 to-pink-500 rounded-full animate-spin blur-[2px] shadow-[0_0_50px_rgba(16,185,129,0.6)] flex items-center justify-center">
              <span className="text-white text-2xl font-black tracking-widest animate-pulse">WARP</span>
            </div>

            {/* Orbiting particles */}
            <div className="absolute w-4 h-4 bg-emerald-400 rounded-full animate-ping" style={{ top: '10%', left: '20%' }} />
            <div className="absolute w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{ bottom: '15%', right: '25%' }} />
            <div className="absolute w-5 h-5 bg-indigo-400 rounded-full animate-pulse" style={{ top: '60%', left: '80%' }} />
          </div>

          <div className="text-center mt-12 z-10 space-y-3 px-6">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-indigo-300 to-pink-400 animate-pulse uppercase">
              Quantum Session Warp
            </h2>
            <div className="font-mono text-[10px] md:text-xs text-gray-500 uppercase tracking-widest leading-relaxed">
              <p className="text-emerald-400 animate-[pulse_1s_infinite]">DE-MATERIALIZING SESSION ENCRYPTION STATE...</p>
              <p className="opacity-65 mt-1 font-semibold text-[9px]">Warp portal speed: 4.88 Ly/sec • IP OVER RIPPLE ACTIVE</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;