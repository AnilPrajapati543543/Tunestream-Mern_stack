import React, { useContext, useRef } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { assets } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";

const MobileLibrary = ({ open, setOpen }) => {
  const { songsData, playWithId, track } = useContext(PlayerContext);
  const sheetRef = useRef(null);

  const SNAP_TOP = 0;          // full open
  const SNAP_MID = 300;        // half
  const SNAP_CLOSE = 600;      // close threshold

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 🔥 BLUR BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
          />

          {/* 🔥 BOTTOM SHEET */}
          <motion.div
            ref={sheetRef}
            drag="y"
            dragConstraints={{ top: 0, bottom: SNAP_CLOSE }}
            dragElastic={0.2}
            initial={{ y: 600 }}
            animate={{ y: SNAP_MID }}
            exit={{ y: 600 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            onDragEnd={(e, info) => {
              const y = info.offset.y;

              if (y > 200) {
                // swipe down → close
                setOpen(false);
              } else if (y > 80) {
                // snap to mid
                sheetRef.current?.style.setProperty("transform", `translateY(${SNAP_MID}px)`);
              } else {
                // snap to full
                sheetRef.current?.style.setProperty("transform", `translateY(${SNAP_TOP}px)`);
              }
            }}
            className="fixed bottom-0 left-0 w-full h-[85vh] 
                       bg-[#0f0f0f] rounded-t-3xl z-50 
                       shadow-2xl flex flex-col overflow-hidden"
          >

            {/* 🔥 DRAG HANDLE */}
            <div className="flex justify-center py-2">
              <div className="w-10 h-1.5 bg-gray-500 rounded-full" />
            </div>

            {/* HEADER */}
            <div className="px-5 py-3 flex items-center gap-3 border-b border-white/5">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black text-sm font-semibold">
                {songsData.length}
              </div>
              <h1 className="text-lg font-semibold">Your Library</h1>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 pb-28">

              {/* FILTER */}
              <div className="flex items-center gap-3">
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

              {/* SONG LIST */}
              <div className="space-y-3">
                {songsData.map((song) => {
                  const isActive = track?._id === song._id;

                  return (
                    <div
                      key={song._id}
                      onClick={() => playWithId(song._id)}
                      className={`flex items-center gap-3 px-2.5 py-2 rounded-lg transition ${
                        isActive
                          ? "bg-emerald-500/10"
                          : "active:bg-white/5"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={song.image}
                          className="w-12 h-12 rounded-md object-cover"
                          alt=""
                        />

                        {isActive && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-md">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 overflow-hidden">
                        <p className={`text-sm truncate ${isActive ? "text-emerald-400" : "text-white"}`}>
                          {song.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {song.desc}
                        </p>
                      </div>

                      <img
                        src={assets.play_icon}
                        className="w-4 opacity-40"
                        alt=""
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileLibrary;
