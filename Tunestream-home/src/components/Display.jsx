import React, { useEffect, useRef, useContext, useMemo } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import DisplayHome from "./DisplayHome";
import DisplayAlbum from "./DisplayAlbum";
import DisplayPlaylist from "./DisplayPlaylist";
import MobileSearch from "./MobileSearch";
import MobileLibrary from "./MobileLibrary";
import { PlayerContext } from "../context/PlayerContext";

const Display = () => {
  const { albumsData } = useContext(PlayerContext);
  const displayRef = useRef(null);
  const location = useLocation();

  const isAlbum = location.pathname.includes("/album/");

  const albumId = useMemo(() => {
    return isAlbum ? location.pathname.split("/").pop() : null;
  }, [location.pathname, isAlbum]);

  const currentAlbum = useMemo(() => {
    return albumsData.find((x) => x._id === albumId);
  }, [albumsData, albumId]);

  const bgColor = currentAlbum?.bgColour || "#166230";

  useEffect(() => {
    if (!displayRef.current) return;

    const el = displayRef.current;

    // Smooth transition
    el.style.transition = "background 0.6s ease";

    el.style.background = isAlbum
      ? `linear-gradient(180deg, ${bgColor}, #0a0101 60%)`
      : `linear-gradient(180deg, #10381e, #090909)`;
  }, [bgColor, isAlbum]);

  return (
    <div
      ref={displayRef}
      className="
        flex-1 px-3 sm:px-6 pt-2 md:pt-4 rounded-lg
        bg-[#121212] text-white
        overflow-y-auto scroll-smooth flex flex-col relative
      "
    >
      <Routes>
        <Route path="/" element={<DisplayHome />} />
        <Route path="/search" element={<MobileSearch />} />
        <Route path="/library" element={<MobileLibrary />} />
        <Route
          path="/album/:id"
          element={<DisplayAlbum album={currentAlbum} />}
        />
        <Route path="/playlist/:id" element={<DisplayPlaylist />} />
      </Routes>
    </div>
  );
};

export default Display;