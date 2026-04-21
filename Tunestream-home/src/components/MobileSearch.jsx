import React, { useContext, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const MobileSearch = () => {
  const { songsData, playWithId, track } = useContext(PlayerContext);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSongs = songsData.filter((song) =>
    song.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Search</h1>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What do you want to listen to?"
            className="w-full py-3 px-10 rounded-lg bg-[#1f1f1f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <img 
            src={assets.search_icon} 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 opacity-50" 
            alt="" 
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-20">
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
          <div className="mt-10 flex flex-col items-center text-center opacity-40">
             <img src={assets.search_icon} className="w-16 mb-4" alt="" />
             <p>Search for your favorite songs to start listening.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileSearch;
