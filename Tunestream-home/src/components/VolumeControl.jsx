import React, { useContext, useRef, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { assets } from "../assets/assets.js";
import { motion, AnimatePresence } from "framer-motion";

const VolumeControl = () => {
  const { volume, changeVolume } = useContext(PlayerContext);

  const barRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState(false);

  const getVolumeIcon = () => {
    if (volume === 0) return assets.mute_icon || assets.volume_icon;
    if (volume < 0.4) return assets.low_volume_icon || assets.volume_icon;
    return assets.volume_icon;
  };

  const updateVolume = (e) => {
    const rect = barRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;

    changeVolume({
      currentTarget: {
        getBoundingClientRect: () => rect
      },
      clientX: e.clientX
    });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    let newVolume = volume - e.deltaY * 0.001;
    newVolume = Math.max(0, Math.min(1, newVolume));

    changeVolume({
      currentTarget: {
        getBoundingClientRect: () => ({ left: 0, width: 100 })
      },
      clientX: newVolume * 100
    });
  };

  const volumePercent = Math.round(volume * 100);

  return (
    <div
      className="flex items-center gap-2 select-none relative"
      onMouseMove={(e) => dragging && updateVolume(e)}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => {
        setDragging(false);
        setHover(false);
      }}
      onWheel={handleWheel}
    >
      {/* ICON */}
      <motion.img
        src={getVolumeIcon()}
        className="w-5 cursor-pointer opacity-80"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      />

      {/* SLIDER */}
      <div
        ref={barRef}
        onMouseDown={(e) => {
          setDragging(true);
          updateVolume(e);
        }}
        onMouseEnter={() => setHover(true)}
        className="relative w-24 h-[4px] bg-gray-600 rounded-full cursor-pointer"
      >
        {/* FILL */}
        <motion.div
          className="h-[4px] bg-emerald-400 rounded-full"
          animate={{ width: `${volume * 100}%` }}
          transition={{ type: "spring", stiffness: 120 }}
        />

        {/* HANDLE */}
        <motion.div
          className="w-3 h-3 bg-white rounded-full absolute top-1/2 -translate-y-1/2 shadow"
          animate={{ left: `${volume * 100}%` }}
          transition={{ type: "spring", stiffness: 200 }}
          style={{ marginLeft: "-6px" }}
        />

        {/* TOOLTIP */}
        <AnimatePresence>
          {(hover || dragging) && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: -18, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute text-[10px] px-2 py-[2px] rounded-md bg-black text-white whitespace-nowrap"
              style={{
                left: `${volume * 100}%`,
                transform: "translateX(-50%)"
              }}
            >
              {volumePercent}%
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default VolumeControl;