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

      await API.post("/user/logout");
      localStorage.removeItem("accessToken");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed");
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-3 md:p-4 text-white">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-2">
        {user ? (
          <p className="text-xs md:text-base text-gray-300">
            Welcome, <span className="text-white font-semibold">{user.name}</span>
          </p>
        ) : (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3 py-1.5 text-xs md:text-sm font-semibold text-gray-400 hover:text-white transition-colors"
            >
              Sign up
            </button>
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="px-6 md:px-8 py-2 md:py-2.5 bg-white text-black rounded-full font-bold text-xs md:text-sm hover:scale-105 active:scale-95 transition-all"
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
            className="relative overflow-hidden bg-emerald-800 hover:bg-emerald-900 active:scale-95 transition-all duration-200 px-5 py-1.5 rounded-full text-sm font-medium shadow-md"
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