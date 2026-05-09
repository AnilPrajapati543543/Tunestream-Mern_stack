import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AlbumItem = ({ image, name, desc, id }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      onClick={() => navigate(`/album/${id}`)}
      whileHover={{ scale: 1.04, y: -6 }}
      whileTap={{ scale: 0.97 }}
      className="
        w-[160px] md:w-[200px] flex-shrink-0
        p-3 rounded-xl
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="
              absolute bottom-2 right-2
              bg-emerald-500
              w-10 h-10
              rounded-full
              flex items-center justify-center
              shadow-xl
              opacity-0 group-hover:opacity-100
              group-hover:translate-y-0
              transition-all duration-300
              pointer-events-auto
            "
          >
            <span className="text-black text-lg ml-0.5">▶</span>
          </motion.div>
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
