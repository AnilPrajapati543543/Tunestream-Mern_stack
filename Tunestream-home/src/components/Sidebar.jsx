import React, { useState, useContext } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PlayerContext } from "../context/PlayerContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { songsData, playWithId, track, showLibrary } =
    useContext(PlayerContext);

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <motion.div
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="h-full flex flex-col text-white bg-black/30 backdrop-blur-xl border-r border-white/10 shadow-lg"
    >
      {/* TOP */}
      <div className="bg-[#121212] rounded-xl p-3 flex flex-col gap-4">
        {/* COLLAPSE BTN */}
        <div className={`flex ${collapsed ? "justify-center" : "justify-end"}`}>
          <motion.button
            onClick={() => setCollapsed(!collapsed)}
            animate={{ rotate: collapsed ? 180 : 0 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 rounded-full hover:bg-[#1f1f1f]"
          >
            <img className="w-5 opacity-80" src={assets.arrow_icon} />
          </motion.button>
        </div>

        {/* HOME */}
        <motion.div
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.03 }}
          className={`flex items-center gap-4 py-2 rounded-lg cursor-pointer
          hover:bg-[#1f1f1f] transition ${
            collapsed ? "justify-center" : "px-3"
          }`}
        >
          <img className="w-5" src={assets.home_icon} />
          <AnimatePresence>
            {!collapsed && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-sm font-medium"
              >
                Home
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* SEARCH */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-2 overflow-hidden"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search songs..."
                className="w-full py-2 px-3 rounded-lg bg-[#1f1f1f] text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* LIBRARY */}
      <div className="bg-[#121212] flex-1 rounded-xl flex flex-col overflow-hidden mt-3">
        {/* HEADER */}
        <div
          onClick={showLibrary}
          className={`p-4 flex items-center cursor-pointer hover:bg-[#1f1f1f]
          ${collapsed ? "justify-center" : "justify-between"}`}
        >
          <div className="flex items-center gap-3">
            <img className="w-5" src={assets.stack_icon} />
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-semibold"
                >
                  Your Top Songs
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* SONG LIST */}
        <div className="flex-1 overflow-y-auto px-2 space-y-2">
          {songsData
            .filter((song) =>
              song.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((song) => {
              const isActive = track?._id === song._id;

              return (
                <motion.div
                  key={song._id}
                  onClick={() => playWithId(song._id)}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center gap-3 py-2 rounded-lg cursor-pointer
                  ${collapsed ? "justify-center" : "px-2"}
                  ${
                    isActive
                      ? "border border-emerald-400 shadow-[0_0_10px_rgba(29,185,84,0.4)]"
                      : "hover:bg-[#1f1f1f]"
                  }`}
                >
                  <img
                    className={`w-11 h-11 rounded object-cover ${
                      isActive ? "shadow-md shadow-emerald-400/50" : ""
                    }`}
                    src={song.image}
                  />

                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex flex-col overflow-hidden"
                      >
                        <p
                          className={`text-sm font-medium truncate ${
                            isActive ? "text-emerald-400" : ""
                          }`}
                        >
                          {song.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {song.desc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;