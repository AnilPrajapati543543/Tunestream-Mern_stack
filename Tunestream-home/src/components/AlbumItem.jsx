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
