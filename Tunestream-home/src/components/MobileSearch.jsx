import React, { useContext, useState, useMemo } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const MobileSearch = () => {
  const { songsData, playWithId, track, openArtistProfile } = useContext(PlayerContext);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSongs = songsData.filter((song) =>
    song.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Extract unique artist names dynamically from songsData
  const allArtists = useMemo(() => {
    const artists = new Set();
    songsData.forEach(song => {
      if (song.desc) {
        const parts = song.desc.split(/[,&]/);
        parts.forEach(p => {
          const name = p.trim();
          if (name && name.length > 1 && name.length < 30 && !name.toLowerCase().includes("hits")) {
            artists.add(name);
          }
        });
      }
    });
    // Add default high-quality artists if empty
    if (artists.size === 0) {
      artists.add("Diljit Dosanjh");
      artists.add("Arijit Singh");
      artists.add("Pritam");
      artists.add("Badshah");
    }
    return Array.from(artists);
  }, [songsData]);

  // Browse category cards (Spotify style)
  const categories = [
    { title: "Podcasts", color: "bg-[#27856a]" },
    { title: "Made For You", color: "bg-[#1e3264]" },
    { title: "New Releases", color: "bg-[#e81156]" },
    { title: "Hindi", color: "bg-[#477d95]" },
    { title: "Punjabi", color: "bg-[#b02897]" },
    { title: "Discover", color: "bg-[#8d67ab]" },
    { title: "Live Events", color: "bg-[#8400e7]" },
    { title: "Charts", color: "bg-[#8d67ab]" }
  ];

  return (
    <div className="flex flex-col h-full bg-[#121212] text-white">
      {/* Search input header */}
      <div className="p-4 bg-[#121212] sticky top-0 z-20">
        <h1 className="text-3xl font-black mb-4 tracking-tight">Search</h1>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What do you want to listen to?"
            className="w-full py-3 px-11 rounded-xl bg-[#242424] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold transition"
          />
          <img 
            src={assets.search_icon} 
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 opacity-60" 
            alt="Search Icon" 
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24 no-scrollbar">
        {searchQuery ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Songs</h2>
            {filteredSongs.length > 0 ? (
              filteredSongs.map((song) => {
                const isActive = track?._id === song._id;
                return (
                  <div
                    key={song._id}
                    onClick={() => playWithId(song._id)}
                    className={`flex items-center gap-3 p-2 rounded-lg ${isActive ? 'bg-emerald-500/10' : 'active:bg-white/10'}`}
                  >
                    <img src={song.image} className="w-12 h-12 rounded object-cover" alt="" />
                    <div className="flex-1 overflow-hidden">
                      <p className={`font-medium truncate ${isActive ? 'text-emerald-400' : ''}`}>{song.name}</p>
                      <p className="text-xs text-gray-400 truncate">{song.desc}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-center mt-10">No songs found for "{searchQuery}"</p>
            )}
          </div>
        ) : (
          <div className="space-y-8 mt-2">
            {/* Suggested Artist Profiles section */}
            <div>
              <h2 className="text-lg font-black tracking-tight text-white mb-4">Top Suggested Artists</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {allArtists.map(artistName => {
                  // Find a song image by this artist to represent them
                  const artistSong = songsData.find(s => s.desc && s.desc.includes(artistName));
                  const imageUrl = artistSong?.image || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=60";
                  return (
                    <div 
                      key={artistName}
                      onClick={() => openArtistProfile(artistName)}
                      className="flex flex-col items-center flex-shrink-0 cursor-pointer active:scale-95 transition"
                    >
                      <div className="w-20 h-20 rounded-full overflow-hidden border border-white/5 shadow-xl mb-2.5 relative group">
                        <img src={imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" alt="" />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition" />
                      </div>
                      <span className="text-[11px] font-bold text-gray-300 hover:text-white text-center max-w-[85px] truncate leading-tight">
                        {artistName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Browse Categories section */}
            <div>
              <h2 className="text-lg font-black tracking-tight text-white mb-4">Browse All</h2>
              <div className="grid grid-cols-2 gap-4">
                {categories.map((cat, idx) => (
                  <motion.div
                    whileTap={{ scale: 0.96 }}
                    key={cat.title}
                    className={`${cat.color} aspect-video rounded-xl p-4 relative overflow-hidden shadow-md cursor-pointer`}
                  >
                    <span className="text-sm font-black tracking-tight text-white leading-tight block max-w-[70%]">
                      {cat.title}
                    </span>
                    {/* Tiny visual representation card at bottom right of category card */}
                    <div className="absolute -right-4 -bottom-2 w-14 h-14 bg-white/10 rounded-lg rotate-[25deg] shadow-lg flex-shrink-0" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileSearch;
