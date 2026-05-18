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
  const [bgColor, setBgColor] = useState('rgba(0, 0, 0, 0.95)');

  useEffect(() => {
    if (track && playStatus) setCollapsed(false);
  }, [track, playStatus]);

  useEffect(() => {
    if (!track?.image) return;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 1;
      canvas.height = 1;
      ctx.drawImage(img, 0, 0, 1, 1);
      const data = ctx.getImageData(0, 0, 1, 1).data;
      setBgColor(`rgba(${data[0]}, ${data[1]}, ${data[2]}, 0.5)`);
    };

    img.onerror = () => {
      setBgColor('rgba(0, 0, 0, 0.95)');
    };

    img.src = track.image;
  }, [track]);

  if (!track) return null;

  const bars = [0.4, 0.8, 1.2, 0.7, 1];

  return (
    <AnimatePresence>
      {!collapsed && (
        <motion.div
          key="now-playing"
          initial={{ width: 0, opacity: 0, x: 40 }}
          animate={{ width: 320, opacity: 1, x: 0 }}
          exit={{ width: 0, opacity: 0, x: 40 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="h-full p-2 flex overflow-hidden"
        >
          <motion.div
            className="w-full rounded-[2rem] p-5 flex flex-col text-white overflow-hidden relative border border-white/10"
            animate={{
              boxShadow: [
                `0 20px 40px -10px ${bgColor}`,
                `0 20px 60px -5px ${bgColor.replace('0.5', '0.7')}`,
                `0 20px 40px -10px ${bgColor}`
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: `linear-gradient(135deg, ${bgColor}, #09090a)`,
            }}
            whileHover={{
              scale: 1.01,
            }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl rounded-2xl" />

            {/* Background Video (Only if available) */}
            {track.videoUrl && (
              <video
                key={track.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
              >
                <source src={track.videoUrl} type="video/mp4" />
              </video>
            )}

            {/* HEADER */}
            <div className="flex justify-end relative z-10">
              <motion.button
                onClick={() => setCollapsed(true)}
                whileHover={{ scale: 1.2, rotate: -10 }}
                whileTap={{ scale: 0.85 }}
                className="p-1 rounded-full hover:bg-white/10 transition"
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
                className="rounded-2xl w-full h-[220px] object-cover"
                animate={{
                    boxShadow: `0 15px 30px -10px ${bgColor.replace('0.5', '1')}`
                }}
                alt="track"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl" />
            </div>

            {/* TEXT */}
            <div className="mt-4 text-center z-10">
              <h2 className="font-bold text-xl truncate tracking-tight">
                {track.name}
              </h2>
              <p className="text-gray-300 text-sm mt-1 truncate font-medium">
                {track.album || "Unknown Album"}
              </p>
              <p className="text-gray-400 text-xs mt-2 truncate italic opacity-80">
                {track.desc}
              </p>

              <div className="flex justify-center items-end gap-[4px] mt-4 h-6">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    className="w-[3px] bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                    animate={{
                      scaleY: playStatus ? [0.4, h, 0.6, h + 0.2, 0.5] : 0.4,
                      opacity: playStatus ? [0.6, 1, 0.7, 1, 0.6] : 0.4,
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.9 + i * 0.1,
                      ease: "easeInOut",
                    }}
                    style={{
                      height: 16,
                      boxShadow: "0 0 6px rgba(16,185,129,0.7)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* CONTROLS */}
            <div className="mt-auto z-10">
              {/* PROGRESS */}
              <div
                onClick={seekSong}
                className="h-[5px] bg-white/10 rounded-full mt-4 cursor-pointer overflow-hidden relative group"
              >
                <motion.div
                  className="bg-emerald-500 h-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.3 }}
                  style={{
                    boxShadow: "0 0 10px rgba(34,197,94,0.7)",
                  }}
                />
              </div>

              {/* BUTTONS */}
              <div className="flex justify-center gap-6 mt-6 items-center">
                <img
                  onClick={previous}
                  src={assets.prev_icon}
                  className="w-6 cursor-pointer hover:scale-125 transition opacity-80 hover:opacity-100"
                  alt="prev"
                />

                <motion.button
                  onClick={() => (playStatus ? pause() : play())}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  className="w-14 h-14 bg-white rounded-full flex items-center justify-center 
                             shadow-2xl shadow-black/40"
                >
                  <img
                    src={playStatus ? assets.pause_icon : assets.play_icon}
                    className="w-7 h-7 invert"
                    alt="play"
                  />
                </motion.button>

                <motion.img
                  onClick={next}
                  src={assets.next_icon}
                  className="w-6 cursor-pointer hover:scale-125 transition opacity-80 hover:opacity-100"
                  alt="next"
                />
              </div>

              {/* VOLUME */}
              <div className="mt-6 flex justify-center scale-90 opacity-90">
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
