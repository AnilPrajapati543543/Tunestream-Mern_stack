import React, { useContext, useState, useEffect } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { assets } from "../assets/assets.js";
import { motion, AnimatePresence } from "framer-motion";
import VolumeControl from "./VolumeControl";

const NowPlayingCard = () => {
  const {
    track,
    playStatus,
    play,
    pause,
    next,
    previous,
    seekSong,
    progress,
  } = useContext(PlayerContext);

  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    if (track && playStatus) setCollapsed(false);
  }, [track, playStatus]);

  if (!track) return null;

  const bars = [0.4, 0.8, 1.2, 0.7, 1];

  return (
    <AnimatePresence>
      {!collapsed && (
        <motion.div
          key="now-playing"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="h-full p-2 flex overflow-hidden"
        >
          <motion.div
            className="w-full rounded-2xl p-4 flex flex-col text-white overflow-hidden shadow-2xl relative"
            style={{
              background: `linear-gradient(135deg, ${
                track.themeColor || "#16b57b43"
              }, #09090a)`,
            }}
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-xl rounded-2xl" />

            {/* HEADER */}
            <div className="flex justify-end relative z-10">
              <motion.button
                onClick={() => setCollapsed(true)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 rounded-full hover:bg-white/10"
              >
                <img className="w-5" src={assets.arrow_icon} alt="collapse" />
              </motion.button>
            </div>

            {/* IMAGE */}
            <div className="relative mt-3 z-10">
              <motion.img
                src={track.image}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl w-full h-[200px] object-cover shadow-lg"
                alt="track"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl" />
            </div>

            {/* TEXT */}
            <div className="mt-3 text-center z-10">
              <h2 className="font-semibold text-lg truncate">
                {track.name}
              </h2>
              <p className="text-gray-300 text-sm mt-1 truncate">
                {track.desc}
              </p>

              <div className="flex justify-center items-end gap-[4px] mt-3 h-6">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    className="w-[3px] bg-emerald-400 rounded-full"
                    animate={{
                      scaleY: playStatus ? [0.4, h, 0.6, h + 0.2, 0.5] : 0.4,
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.9 + i * 0.1,
                      ease: "easeInOut",
                    }}
                    style={{ height: 16 }}
                  />
                ))}
              </div>
            </div>

            {/* CONTROLS */}
            <div className="mt-auto z-10">
              {/* PROGRESS */}
              <div
                onClick={seekSong}
                className="h-[5px] bg-gray-600/60 rounded-full mt-4 cursor-pointer overflow-hidden"
              >
                <motion.div
                  className="bg-green-500 h-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.3 }}
                />
              </div>

              {/* BUTTONS */}
              <div className="flex justify-center gap-6 mt-5 items-center">
                <img
                  onClick={previous}
                  src={assets.prev_icon}
                  className="w-6 cursor-pointer hover:scale-125 transition"
                  alt="prev"
                />

                <motion.button
                  onClick={() => (playStatus ? pause() : play())}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center 
                             shadow-lg"
                >
                  <img
                    src={playStatus ? assets.pause_icon : assets.play_icon}
                    className="w-6 h-6 invert"
                    alt="play"
                  />
                </motion.button>

                <img
                  onClick={next}
                  src={assets.next_icon}
                  className="w-6 cursor-pointer hover:scale-125 transition"
                  alt="next"
                />
              </div>

              {/* VOLUME */}
              <div className="mt-5 flex justify-center">
                <VolumeControl />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NowPlayingCard;
