import React from "react";
import { assets } from "../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Search, Library } from "lucide-react";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Home", icon: <Home className="w-6 h-6" />, path: "/" },
    { name: "Search", icon: <Search className="w-6 h-6" />, path: "/search" },
    { name: "Library", icon: <Library className="w-6 h-6" />, path: "/library" },
  ];

  return (
    <div
      className="
        md:hidden fixed bottom-0 left-0 right-0
        bg-black/80 backdrop-blur-3xl
        border-t border-white/5
        h-[70px] z-50
        px-4
        flex items-center justify-around
        safe-area-bottom
      "
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`
              flex flex-col items-center justify-center
              w-16 h-full gap-1
              transition-all duration-300
              ${
                isActive
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
              }
            `}
          >
            {/* ICON */}
            <div
              className={`
                transition-transform duration-300
                ${isActive ? "scale-110" : "scale-100"}
              `}
            >
              {React.cloneElement(item.icon, {
                className: `w-6 h-6 ${isActive ? "fill-white" : ""}`
              })}
            </div>

            {/* LABEL */}
            <span
              className={`
                text-[10px] font-bold tracking-tighter
                ${isActive ? "text-white" : "text-gray-500"}
              `}
            >
              {item.name}
            </span>
            
            {/* ACTIVE DOT */}
            {isActive && (
              <div className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
