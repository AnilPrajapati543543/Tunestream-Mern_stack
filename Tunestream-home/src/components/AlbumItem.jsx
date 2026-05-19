import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

const AlbumItem = ({ image, name, desc, id }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      onClick={() => navigate(`/album/${id}`)}
      whileHover={{ scale: 1.04, y: -6 }}
      whileTap={{ scale: 0.97 }}
      className="
        w-[140px] md:w-[200px] flex-shrink-0
        p-2.5 md:p-3 rounded-xl
        bg-[#181818] hover:bg-[#222]
        cursor-pointer
        transition-all duration-300
        group
        shadow-lg hover:shadow-black/70
        will-change-transform
      "
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden rounded-lg">

        <img
          className="
            w-full aspect-square object-cover
            transition duration-500
            group-hover:scale-105
          "
          src={image}
          alt={name}
        />

        {/* BOTTOM-RIGHT PLAY BUTTON */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="
              absolute bottom-2 right-2
              bg-emerald-500 hover:scale-110 active:scale-95
              w-10 h-10
              rounded-full
              flex items-center justify-center
              shadow-xl
              opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0
              transition-all duration-300
              pointer-events-auto
            "
          >
            <Play size={16} fill="black" className="text-black ml-[2px]" />
          </div>
        </div>

      </div>

      {/* TEXT */}
      <div className="mt-3 space-y-1">
        <p className="font-semibold text-white truncate leading-tight">
          {name}
        </p>

        <p className="text-gray-400 text-xs md:text-sm leading-snug line-clamp-2">
          {desc}
        </p>
      </div>
    </motion.div>
  );
};

export default AlbumItem;
