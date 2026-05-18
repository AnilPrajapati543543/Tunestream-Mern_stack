import React, { useContext, useRef, useMemo, useState } from "react";
import Navbar from "./Navbar";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";
import { PlayerContext } from "../context/PlayerContext";
import { ChevronLeft, ChevronRight, Play, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { QuickTilesSkeleton, MusicShelfSkeleton } from "./SkeletonLoaders";

const HorizontalSection = ({ title, data, renderItem }) => {
  const scrollRef = useRef();

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 300;

    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!data || data.length === 0) return null;

  return (
    <section className="mb-6 md:mb-10 relative group">
      {/* Title + Buttons */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl md:text-2xl font-black tracking-tight hover:underline cursor-pointer">{title}</h1>

        <div className="hidden md:flex gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
          <button
            onClick={() => scroll("left")}
            className="p-1.5 bg-[#181818] hover:bg-[#282828] text-gray-400 hover:text-white rounded-full transition"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1.5 bg-[#181818] hover:bg-[#282828] text-gray-400 hover:text-white rounded-full transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="
          flex gap-4 overflow-x-auto pb-4
          snap-x snap-mandatory
          scrollbar-hide
          scroll-smooth
        "
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none"
        }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 snap-start"
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </section>
  );
};

const DisplayHome = () => {
  const navigate = useNavigate();
  const { songsData, albumsData, playWithId, likedSongs, loading } = useContext(PlayerContext);
  const [activeCategory, setActiveCategory] = useState("All");

  // Determine standard greeting based on current time
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  // Construct quick access tiles (Liked Songs, top albums, top songs)
  const quickTiles = useMemo(() => {
    const tiles = [];
    
    // 1. Liked Songs Tile
    tiles.push({
      id: "liked-songs",
      name: "Liked Songs",
      desc: "Your library",
      image: null,
      isLiked: true,
      type: "liked"
    });

    // 2. Slice Albums
    albumsData.slice(0, 5).forEach(album => {
      tiles.push({
        id: album._id,
        name: album.name,
        desc: album.desc,
        image: album.image,
        type: "album"
      });
    });

    // 3. Slice Songs to fill up grid
    if (tiles.length < 8) {
      songsData.slice(0, 8 - tiles.length).forEach(song => {
        tiles.push({
          id: song._id,
          name: song.name,
          desc: song.desc,
          image: song.image,
          type: "song"
        });
      });
    }

    return tiles.slice(0, 8);
  }, [albumsData, songsData]);

  // Click handler for tiles
  const handleTileClick = (tile) => {
    if (tile.type === "liked") {
      navigate("/liked");
    } else if (tile.type === "album") {
      navigate(`/album/${tile.id}`);
    } else if (tile.type === "song") {
      playWithId(tile.id, songsData);
    }
  };

  const handleTilePlayClick = (e, tile) => {
    e.stopPropagation();
    if (tile.type === "liked") {
      const favoriteSongs = songsData.filter(s => likedSongs.includes(s._id));
      if (favoriteSongs.length > 0) {
        playWithId(favoriteSongs[0]._id, favoriteSongs);
      } else {
        toast.info("No liked songs to play yet. Add some!");
      }
    } else if (tile.type === "album") {
      // Find songs belonging to this album and play them
      const albumSongs = songsData.filter(s => s.album === tile.name);
      if (albumSongs.length > 0) {
        playWithId(albumSongs[0]._id, albumSongs);
      } else {
        navigate(`/album/${tile.id}`);
      }
    } else if (tile.type === "song") {
      playWithId(tile.id, songsData);
    }
  };

  return (
    <>
      <Navbar />

      {/* CATEGORY CHIPS */}
      <div className="flex gap-2 px-3 md:px-6 pt-1 pb-3 md:pb-4 overflow-x-auto no-scrollbar">
        {["All", "Music", "Podcasts"].map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wide transition-all border border-white/5
              ${activeCategory === cat 
                ? "bg-white text-black border-white" 
                : "bg-white/10 text-white hover:bg-white/15"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="px-3 md:px-6 py-1 md:py-2 overflow-y-auto flex-1 custom-scrollbar">

        {loading ? (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4">{greeting}</h2>
              <QuickTilesSkeleton />
            </section>
            
            <section className="space-y-6">
              <div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight mb-4">Featured Charts</h2>
                <MusicShelfSkeleton />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight mb-4">Today's Biggest Hits</h2>
                <MusicShelfSkeleton />
              </div>
            </section>
          </div>
        ) : activeCategory !== "Podcasts" ? (
          <>
            {/* GREETING & QUICK TILES GRID */}
            <section className="mb-8">
              <h2 className="text-xl md:text-3xl font-black tracking-tight mb-3 md:mb-4">{greeting}</h2>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-3.5">
                {quickTiles.map((tile, idx) => (
                  <motion.div
                    key={`${tile.id}-${idx}`}
                    onClick={() => handleTileClick(tile)}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex items-center bg-white/5 hover:bg-white/10 transition duration-300 rounded-md overflow-hidden cursor-pointer relative pr-0 md:pr-16 select-none"
                  >
                    {/* Visual */}
                    {tile.isLiked ? (
                      <div className="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                        <Heart fill="white" className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" size={16} />
                      </div>
                    ) : (
                      <img 
                        src={tile.image} 
                        alt={tile.name} 
                        className="w-12 h-12 md:w-20 md:h-20 object-cover flex-shrink-0"
                      />
                    )}

                    {/* Meta */}
                    <div className="pl-2 md:pl-4 pr-1 md:pr-2 py-1.5 md:py-2 overflow-hidden flex-1 min-w-0">
                      <p className="text-[11px] md:text-sm font-black text-white truncate tracking-tight">{tile.name}</p>
                      <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 hidden md:block">{tile.desc || "Playlist"}</p>
                    </div>

                    {/* Floating Play Button */}
                    <div className="absolute right-2 md:right-4 inset-y-0 hidden md:flex items-center justify-center">
                      <button
                        onClick={(e) => handleTilePlayClick(e, tile)}
                        className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center shadow-lg transition duration-300 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 scale-90 hover:scale-105 active:scale-95"
                      >
                        <Play size={16} fill="black" className="text-black ml-0.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* HORIZONTAL SHELVES */}
            {activeCategory === "All" && (
              <HorizontalSection
                title="Featured Charts"
                data={albumsData}
                renderItem={(item) => (
                  <AlbumItem
                    name={item.name}
                    desc={item.desc}
                    id={item._id}
                    image={item.image}
                  />
                )}
              />
            )}

            <HorizontalSection
              title="Today's Biggest Hits"
              data={songsData}
              renderItem={(item) => (
                <SongItem
                  name={item.name}
                  desc={item.desc}
                  id={item._id}
                  image={item.image}
                />
              )}
            />

            <HorizontalSection
              title="Made For You"
              data={songsData.slice(0, 8)}
              renderItem={(item) => (
                <SongItem
                  name={item.name}
                  desc="Personal picks just for you"
                  id={item._id}
                  image={item.image}
                />
              )}
            />

            <HorizontalSection
              title="Suggested For You"
              data={albumsData.slice(0, 8)}
              renderItem={(item) => (
                <AlbumItem
                  name={item.name}
                  desc="Based on your taste"
                  id={item._id}
                  image={item.image}
                />
              )}
            />
          </>
        ) : (
          /* PODCASTS TAB MOCK */
          <div className="flex flex-col items-center justify-center py-20 text-center select-none">
            <span className="text-6xl mb-6 animate-bounce">🎙️</span>
            <h3 className="text-2xl font-black text-white tracking-tight mb-2">Episodes you might like</h3>
            <p className="text-gray-400 text-sm max-w-sm">Podcast channels and audio episodes will appear here once connected to your library.</p>
            <button 
              onClick={() => setActiveCategory("All")}
              className="mt-6 px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-full uppercase tracking-wider transition"
            >
              Back to Music
            </button>
          </div>
        )}

      </div>
    </>
  );
};

export default DisplayHome;