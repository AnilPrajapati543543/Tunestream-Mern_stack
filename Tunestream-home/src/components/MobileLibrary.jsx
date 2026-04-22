import React, { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { assets } from "../assets/assets";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

const MobileLibrary = ({ open, setOpen }) => {
  const { songsData, playWithId, track } = useContext(PlayerContext);

  const y = useMotionValue(600);

  const backdropOpacity = useTransform(y, [0, 600], [0.5, 0]);

  const SNAP_TOP = 0;
  const SNAP_MID = 320;
  const SNAP_CLOSE = 650;

  const handleDragEnd = (_, info) => {
    const offset = info.offset.y;
    const velocity = info.velocity.y;

    // 🔥 FAST SWIPE DOWN = CLOSE
    if (velocity > 800) {
      animate(y, SNAP_CLOSE, { type: "spring", stiffness: 200, damping: 25 });
      setTimeout(() => setOpen(false), 200);
      return;
    }

    // 🔥 SNAP LOGIC
    if (offset > 250) {
      animate(y, SNAP_CLOSE, { type: "spring", stiffness: 200, damping: 25 });
      setTimeout(() => setOpen(false), 200);
    } else if (offset > 80) {
      animate(y, SNAP_MID, { type: "spring", stiffness: 180, damping: 22 });
    } else {
      animate(y, SNAP_TOP, { type: "spring", stiffness: 180, damping: 20 });
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 🔥 BACKDROP */}
          <motion.div
            style={{ opacity: backdropOpacity }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black backdrop-blur-md z-40"
          />

          {/* 🔥 BOTTOM SHEET */}
          <motion.div
            drag="y"
            style={{ y }}
            dragConstraints={{ top: 0, bottom: SNAP_CLOSE }}
            dragElastic={0.25}
            initial={{ y: SNAP_CLOSE }}
            animate={{ y: SNAP_MID }}
            exit={{ y: SNAP_CLOSE }}
            onDragEnd={handleDragEnd}
            transition={{ type: "spring", stiffness: 160, damping: 20 }}
            className="fixed bottom-0 left-0 w-full h-[88vh] 
                       bg-[#0f0f0f] rounded-t-3xl z-50 
                       shadow-[0_-10px_40px_rgba(0,0,0,0.8)] 
                       flex flex-col overflow-hidden"
          >

            {/* HANDLE */}
            <div className="flex justify-center py-2">
              <div className="w-10 h-1.5 bg-gray-500 rounded-full" />
            </div>

            {/* 🔥 HEADER (sticky) */}
            <div className="sticky top-0 z-10 bg-[#0f0f0f]/80 backdrop-blur-md">
              <div className="px-5 py-3 flex items-center gap-3 border-b border-white/5">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black text-sm font-semibold">
                  {songsData.length}
                </div>
                <h1 className="text-lg font-semibold tracking-tight">
                  Your Library
                </h1>
              </div>

              {/* FILTER */}
              <div className="px-5 py-3 flex gap-3">
                <div className="bg-[#282828] px-4 py-1.5 rounded-full text-sm">
                  Songs
                </div>
                <div className="border border-white/20 px-4 py-1.5 rounded-full text-sm text-gray-400">
                  Playlists
                </div>
                <div className="border border-white/20 px-4 py-1.5 rounded-full text-sm text-gray-400">
                  Artists
                </div>
              </div>
            </div>

            {/* 🔥 LIST */}
            <div className="flex-1 overflow-y-auto px-4 pb-28 space-y-2">
              {songsData.map((song) => {
                const isActive = track?._id === song._id;

                return (
                  <motion.div
                    key={song._id}
                    onClick={() => playWithId(song._id)}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                      isActive
                        ? "bg-emerald-500/10"
                        : "active:bg-white/5"
                    }`}
                  >
                    {/* IMAGE */}
                    <div className="relative shrink-0">
                      <img
                        src={song.image}
                        className="w-12 h-12 rounded-md object-cover shadow"
                        alt=""
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-md">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                        </div>
                      )}
                    </div>

                    {/* TEXT */}
                    <div className="flex-1 overflow-hidden">
                      <p
                        className={`text-sm font-medium truncate ${
                          isActive
                            ? "text-emerald-400"
                            : "text-white"
                        }`}
                      >
                        {song.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-[2px]">
                        {song.desc}
                      </p>
                    </div>

                    {/* ICON */}
                    <img
                      src={assets.play_icon}
                      className="w-4 opacity-40"
                      alt=""
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileLibrary;
