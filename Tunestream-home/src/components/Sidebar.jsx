import React, { useState, useContext, useMemo } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PlayerContext } from "../context/PlayerContext";
import API from "../api/axios";
import { toast } from "react-toastify";
import { Plus, Search, Home, Library, ListMusic, User, FolderPlus, X, Check } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const { 
    songsData, 
    playWithId, 
    track, 
    playlists, 
    setPlaylists,
    playQueue,
    leftSidebarCollapsed: collapsed,
    setLeftSidebarCollapsed: setCollapsed,
    likedSongs,
  } = useContext(PlayerContext);

  const [libSearchQuery, setLibSearchQuery] = useState("");
  const [showLibSearch, setShowLibSearch] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null); // 'playlists' or 'artists'
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // Extract unique artists from song descriptions/metadata
  const uniqueArtists = useMemo(() => {
    const artistSet = new Set();
    songsData.forEach(song => {
      if (song.desc) {
        // Assume description might contain artist names or split by comma
        const parts = song.desc.split(/[,&]/);
        parts.forEach(p => {
          const name = p.trim();
          if (name && name.length > 1 && name.length < 30 && !name.toLowerCase().includes("hits") && !name.toLowerCase().includes("song")) {
            artistSet.add(name);
          }
        });
      }
    });
    // Fallback if none found
    if (artistSet.size === 0) {
      artistSet.add("Vishal-Shekhar");
      artistSet.add("Shreya Ghoshal");
      artistSet.add("Vishal Dadlani");
    }
    return Array.from(artistSet).map((name, index) => ({
      id: `artist-${index}`,
      name,
      image: `https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=60`
    }));
  }, [songsData]);

  // Handle Playlist Creation
  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    setCreateLoading(true);
    try {
      const res = await API.post("/playlist/create", { name: newPlaylistName });
      if (res.data.success) {
        setPlaylists([...playlists, res.data.playlist]);
        setNewPlaylistName("");
        setShowCreateInput(false);
        toast.success(`Playlist "${newPlaylistName}" created!`);
      }
    } catch (error) {
      toast.error("Failed to create playlist");
    } finally {
      setCreateLoading(false);
    }
  };

  // Filter lists based on chips & search query
  const filteredPlaylists = useMemo(() => {
    if (activeFilter === "artists") return [];
    return playlists.filter(p => 
      p.name.toLowerCase().includes(libSearchQuery.toLowerCase())
    );
  }, [playlists, libSearchQuery, activeFilter]);

  const filteredSongs = useMemo(() => {
    if (activeFilter === "playlists" || activeFilter === "artists") return [];
    return songsData.filter(s => 
      s.name.toLowerCase().includes(libSearchQuery.toLowerCase()) ||
      s.desc.toLowerCase().includes(libSearchQuery.toLowerCase())
    );
  }, [songsData, libSearchQuery, activeFilter]);

  const filteredArtists = useMemo(() => {
    if (activeFilter !== "artists") return [];
    return uniqueArtists.filter(a => 
      a.name.toLowerCase().includes(libSearchQuery.toLowerCase())
    );
  }, [uniqueArtists, libSearchQuery, activeFilter]);

  const handleArtistClick = (artistName) => {
    // We can navigate to search with this artist name
    navigate(`/?search=${encodeURIComponent(artistName)}`);
    toast.info(`Filtering by artist: ${artistName}`);
  };

  return (
    <motion.div
      animate={{ width: collapsed ? 76 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-full flex flex-col text-white select-none overflow-hidden"
    >
      {/* NAVIGATION BOX */}
      <div className="bg-[#121212] rounded-lg p-4 flex flex-col gap-4 flex-shrink-0">
        {/* LOGO & COLLAPSE */}
        <div className="flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <img className="w-8 h-8 rounded-full object-contain" src={assets.tunestream_logo} alt="logo" />
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Tunestream
              </span>
            </div>
          ) : (
            <div className="mx-auto cursor-pointer" onClick={() => navigate("/")}>
              <img className="w-8 h-8 rounded-full object-contain" src={assets.tunestream_logo} alt="logo" />
            </div>
          )}
          
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-full hover:bg-[#282828] text-gray-400 hover:text-white transition-colors"
          >
            <motion.img 
              className="w-4" 
              src={assets.arrow_icon} 
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </button>
        </div>

        {/* HOME BUTTON */}
        <div
          onClick={() => navigate("/")}
          className={`flex items-center gap-4 py-2 rounded-md cursor-pointer transition-colors hover:text-white text-gray-400
          ${collapsed ? "justify-center" : "px-2"}`}
        >
          <Home size={22} className="text-gray-400 group-hover:text-white" />
          {!collapsed && <span className="text-sm font-bold">Home</span>}
        </div>
      </div>

      {/* LIBRARY BOX */}
      <div className="bg-[#121212] flex-1 rounded-lg flex flex-col overflow-hidden mt-2 p-2 relative">
        {/* LIBRARY HEADER */}
        <div className={`p-2 flex items-center justify-between border-b border-white/5 pb-3 ${collapsed ? "flex-col gap-3" : ""}`}>
          <div className="flex items-center gap-3 text-gray-400 hover:text-white cursor-pointer transition-colors" onClick={() => setCollapsed(false)}>
            <Library size={22} />
            {!collapsed && <span className="text-sm font-black">Your Library</span>}
          </div>

          {!collapsed && (
            <div className="flex items-center gap-1.5">
              {/* Search Toggle */}
              <button 
                onClick={() => setShowLibSearch(!showLibSearch)}
                className={`p-1.5 rounded-full hover:bg-[#282828] text-gray-400 hover:text-white transition-colors ${showLibSearch ? "bg-[#282828] text-white" : ""}`}
              >
                <Search size={16} />
              </button>
              
              {/* Add Playlist */}
              <button
                onClick={() => setShowCreateInput(!showCreateInput)}
                className={`p-1.5 rounded-full hover:bg-[#282828] text-gray-400 hover:text-white transition-colors ${showCreateInput ? "bg-emerald-500 text-black hover:text-black" : ""}`}
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>

        {/* INLINE PLAYLIST CREATION INPUT */}
        <AnimatePresence>
          {showCreateInput && !collapsed && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-2 border-b border-white/5 overflow-hidden flex flex-col gap-2 bg-emerald-500/5 rounded-md mt-1"
            >
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Create Playlist</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Playlist name..."
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="flex-1 bg-[#282828] text-xs px-2.5 py-1.5 rounded outline-none text-white focus:ring-1 focus:ring-emerald-500 placeholder-gray-500"
                  onKeyDown={(e) => e.key === "Enter" && handleCreatePlaylist()}
                />
                <button 
                  onClick={handleCreatePlaylist}
                  disabled={createLoading || !newPlaylistName.trim()}
                  className="p-1.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded transition disabled:opacity-40"
                >
                  <Check size={14} />
                </button>
                <button 
                  onClick={() => { setShowCreateInput(false); setNewPlaylistName(""); }}
                  className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded transition"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SEARCH BAR (EXPANDED) */}
        <AnimatePresence>
          {showLibSearch && !collapsed && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-2 pt-2 pb-1 overflow-hidden"
            >
              <input 
                type="text"
                placeholder="Search in Library..."
                value={libSearchQuery}
                onChange={(e) => setLibSearchQuery(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-white/5 rounded-md text-xs py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* FILTER CHIPS */}
        {!collapsed && (
          <div className="flex gap-2 p-2 overflow-x-auto scrollbar-hide text-xs mt-1">
            <button 
              onClick={() => setActiveFilter(activeFilter === "playlists" ? null : "playlists")}
              className={`px-3 py-1 rounded-full font-bold transition-all border border-white/5
                ${activeFilter === "playlists" 
                  ? "bg-white text-black border-white" 
                  : "bg-[#282828] text-gray-300 hover:bg-[#333]"}`}
            >
              Playlists
            </button>
            <button 
              onClick={() => setActiveFilter(activeFilter === "artists" ? null : "artists")}
              className={`px-3 py-1 rounded-full font-bold transition-all border border-white/5
                ${activeFilter === "artists" 
                  ? "bg-white text-black border-white" 
                  : "bg-[#282828] text-gray-300 hover:bg-[#333]"}`}
            >
              Artists
            </button>
          </div>
        )}

        {/* LIBRARY LIST CONTAINER */}
        <div className="flex-1 overflow-y-auto mt-2 px-1 space-y-1.5 custom-scrollbar">
          
          {/* LIKED SONGS ITEM (PERSISTENT unless filtering Artists) */}
          {activeFilter !== "artists" && (
            <div 
              onClick={() => navigate("/liked")}
              className={`flex items-center gap-3 p-1.5 rounded-md cursor-pointer hover:bg-[#1a1a1a] transition-all group
              ${collapsed ? "justify-center" : ""}`}
            >
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-500/10 group-hover:scale-105 transition-transform duration-300">
                <span className="text-white text-lg">♥</span>
              </div>
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold truncate text-white">Liked Songs</span>
                  <span className="text-[11px] text-gray-400 font-medium">Playlist • {likedSongs.length} songs</span>
                </div>
              )}
            </div>
          )}

          {/* CUSTOM PLAYLISTS */}
          {filteredPlaylists.map(playlist => (
            <div 
              key={playlist._id}
              onClick={() => navigate(`/playlist/${playlist._id}`)}
              className={`flex items-center gap-3 p-1.5 rounded-md cursor-pointer hover:bg-[#1a1a1a] transition-all group
              ${collapsed ? "justify-center" : ""}`}
            >
              <div className="w-10 h-10 bg-[#282828] text-emerald-500 rounded-md flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-md">
                <ListMusic size={20} />
              </div>
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold truncate text-white group-hover:text-emerald-400 transition-colors">{playlist.name}</span>
                  <span className="text-[11px] text-gray-400 font-medium">Playlist • {playlist.songs?.length || 0} songs</span>
                </div>
              )}
            </div>
          ))}

          {/* SONGS LIST (Standard view) */}
          {filteredSongs.map(song => {
            const isActive = track?._id === song._id;
            return (
              <div 
                key={song._id}
                onClick={() => playWithId(song._id)}
                className={`flex items-center gap-3 p-1.5 rounded-md cursor-pointer transition-all group
                ${collapsed ? "justify-center" : ""}
                ${isActive ? "bg-emerald-500/10" : "hover:bg-[#1a1a1a]"}`}
              >
                <img 
                  className={`w-10 h-10 rounded-md object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-md
                    ${isActive ? "ring-1 ring-emerald-500 shadow-emerald-500/25" : ""}`}
                  src={song.image} 
                  alt={song.name}
                />
                {!collapsed && (
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className={`text-sm font-bold truncate ${isActive ? "text-emerald-400" : "text-white"}`}>
                      {song.name}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium truncate">
                      Song • {song.desc || "Track"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* ARTISTS LIST (When Artists chip is active) */}
          {filteredArtists.map(artist => (
            <div 
              key={artist.id}
              onClick={() => handleArtistClick(artist.name)}
              className={`flex items-center gap-3 p-1.5 rounded-md cursor-pointer hover:bg-[#1a1a1a] transition-all group
              ${collapsed ? "justify-center" : ""}`}
            >
              <div className="w-10 h-10 rounded-full bg-[#282828] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden shadow-md">
                <User size={18} className="text-gray-400" />
              </div>
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold truncate text-white group-hover:text-emerald-400 transition-colors">{artist.name}</span>
                  <span className="text-[11px] text-gray-400 font-medium">Artist</span>
                </div>
              )}
            </div>
          ))}

          {/* EMPTY STATES */}
          {((activeFilter === "playlists" && filteredPlaylists.length === 0) ||
            (activeFilter === "artists" && filteredArtists.length === 0) ||
            (!activeFilter && filteredSongs.length === 0 && filteredPlaylists.length === 0)) && (
            <div className="text-center py-8 opacity-40 flex flex-col items-center justify-center gap-2">
              <span className="text-xl">🔍</span>
              <p className="text-xs font-bold uppercase tracking-wider">No items found</p>
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;