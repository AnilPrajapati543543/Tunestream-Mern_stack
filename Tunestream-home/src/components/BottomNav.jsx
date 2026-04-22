import React from "react";
import { assets } from "../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Home", icon: assets.home_icon, path: "/" },
    { name: "Search", icon: assets.search_icon, path: "/search" },
    { name: "Library", icon: assets.stack_icon, path: "/library" },
  ];

  return (
    <div
      className="
        md:hidden fixed bottom-0 left-0 right-0
        bg-black/90 backdrop-blur-xl
        border-t border-white/10
        h-16 z-50
        px-2
        flex items-center justify-between
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
              flex-1 py-1 rounded-xl
              transition-all duration-200
              active:scale-95
              ${
                isActive
                  ? "text-white"
                  : "text-gray-400"
              }
            `}
          >
            {/* ICON WRAP */}
            <div
              className={`
                relative flex items-center justify-center
                w-10 h-10 rounded-xl
                transition-all duration-200
                ${isActive ? "bg-white/10" : ""}
              `}
            >
              <img
                src={item.icon}
                alt={item.name}
                className={`w-6 h-6 transition ${
                  isActive ? "opacity-100" : "opacity-70"
                }`}
              />
            </div>

            {/* LABEL */}
            <span
              className={`
                text-[10px] mt-0.5 font-semibold tracking-wide
                ${isActive ? "text-white" : "text-gray-400"}
              `}
            >
              {item.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
