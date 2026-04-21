import React from "react";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const menuItems = [
  { to: "add-song", icon: assets.add_song, text: "Add Song" },
  { to: "list-songs", icon: assets.song_icon, text: "List Songs" },
  { to: "add-album", icon: assets.add_album, text: "Add Album" },
  { to: "list-albums", icon: assets.album_icon, text: "List Album" },
];

const Sidebar = ({ darkMode }) => {
  return (
    <div
      className={`
        w-[230px] min-h-screen p-4 transition-all duration-300
        ${darkMode ? "bg-[#1a1a2e]" : "bg-white border-r"}
      `}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 mb-10"
      >
        <img src={assets.logo} className="w-10 drop-shadow-md" />
        <h1
          className={`font-semibold text-lg ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Tune<span className="text-gray-400">Stream</span>
        </h1>
      </motion.div>

      {/* Menu */}
      <div className="flex flex-col gap-2">
        {menuItems.map((item, i) => (
          <NavLink key={i} to={item.to}>
            {({ isActive }) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className={`
                  relative flex items-center gap-3 p-3 rounded-xl text-sm cursor-pointer
                  transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white shadow-md"
                      : darkMode
                      ? "text-gray-300 hover:bg-white/10"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                `}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 top-0 h-full w-1 bg-purple-500 rounded-r"
                  />
                )}

                {/* Icon */}
                <motion.img
                  src={item.icon}
                  className="w-5"
                  whileHover={{ rotate: 8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />

                {/* Text */}
                <p>{item.text}</p>
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;