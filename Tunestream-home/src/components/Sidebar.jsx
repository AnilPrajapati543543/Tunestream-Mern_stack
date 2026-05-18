import React, { useState, useContext, useMemo } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PlayerContext } from "../context/PlayerContext";
import API from "../api/axios";
import { toast } from "react-toastify";
import { Plus, Search, Home, Library, ListMusic, User, FolderPlus, X, Check, ChevronLeft, ChevronRight, LayoutGrid, Grid3X3, List, Maximize2, Minimize2, Play } from "lucide-react";
import { SidebarSkeleton } from "./SkeletonLoaders";

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
    leftSidebarExpanded,
    setLeftSidebarExpanded,
    likedSongs,
    loading
  } = useContext(PlayerContext);

  const [libSearchQuery, setLibSearchQuery] = useState("");
  const [showLibSearch, setShowLibSearch] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null); // 'playlists' or 'artists'
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // Custom premium sort and view layout states
  const [sortBy, setSortBy] = useState("recents");
  const [viewAs, setViewAs] = useState("list");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const handleLogoClick = () => {
    if (leftSidebarExpanded) {
      setLeftSidebarExpanded(false);
      setCollapsed(false);
    } else {
      setCollapsed(!collapsed);
    }
  };

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

  // Unified search, filter, and sort list builder
  const unifiedItems = useMemo(() => {
    let items = [];

    // 1. Liked Songs
    if (activeFilter !== "artists" && !libSearchQuery.trim()) {
      items.push({
        id: "liked-songs",
        name: "Liked Songs",
        desc: `Playlist • ${likedSongs.length} songs`,
        image: null,
        type: "liked",
        raw: { _id: "liked-songs" }
      });
    }

    // 2. Custom Playlists
    if (activeFilter !== "artists") {
      playlists.forEach(p => {
        items.push({
          id: p._id,
          name: p.name,
          desc: `Playlist • ${p.songs?.length || 0} songs`,
          image: null,
          type: "playlist",
          raw: p
        });
      });
    }

    // 3. Songs List
    if (activeFilter !== "playlists" && activeFilter !== "artists") {
      songsData.forEach(s => {
        items.push({
          id: s._id,
          name: s.name,
          desc: `Song • ${s.desc || "Track"}`,
          image: s.image,
          type: "song",
          raw: s
        });
      });
    }

    // 4. Artists List
    if (activeFilter !== "playlists") {
      uniqueArtists.forEach(a => {
        items.push({
          id: a.id,
          name: a.name,
          desc: "Artist",
          image: a.image,
          type: "artist",
          raw: a
        });
      });
    }

    // Apply inline text search
    if (libSearchQuery.trim()) {
      const q = libSearchQuery.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(q) || 
        (item.desc && item.desc.toLowerCase().includes(q))
      );
    }

    // Sort by criteria
    if (sortBy === "alphabetical") {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "recently-added") {
      items.sort((a, b) => {
        if (a.id === "liked-songs") return -1;
        if (b.id === "liked-songs") return 1;
        // String sort descending by ID
        return String(b.id).localeCompare(String(a.id));
      });
    } else if (sortBy === "creator") {
      const weights = { liked: 1, playlist: 2, song: 3, artist: 4 };
      items.sort((a, b) => weights[a.type] - weights[b.type]);
    }

    return items;
  }, [playlists, songsData, uniqueArtists, likedSongs, activeFilter, libSearchQuery, sortBy]);

  const handleArtistClick = (artistName) => {
    navigate(`/?search=${encodeURIComponent(artistName)}`);
    toast.info(`Filtering by artist: ${artistName}`);
  };

  const renderTableRowItem = (item) => {
    const isSong = item.type === "song";
    const isPlaylist = item.type === "playlist";
    const isLiked = item.type === "liked";
    const isArtist = item.type === "artist";

    const isActive = isSong && track?._id === item.id;
    
    // Simulate dates for "Date Added"
    const dates = {
      "liked-songs": "May 17, 2024",
      "DESPACITO": "May 17, 2024",
      "RIZIVI": "Apr 26, 2024",
      "LOMBERGHINI": "Apr 6, 2024",
      "Let's": "Mar 18, 2024",
      "XXCCVV": "Feb 3, 2024"
    };
    const dateAdded = dates[item.name] || "Jan 12, 2024";

    // Simulate "Played" time
    const playStatus = {
      "liked-songs": "2 days ago",
      "DESPACITO": "2 days ago",
      "RIZIVI": "3 days ago",
      "LOMBERGHINI": "5 days ago",
      "Let's": "1 week ago",
      "XXCCVV": "2 weeks ago"
    };
    const played = playStatus[item.name] || "1 month ago";

    const handleClick = () => {
      if (isLiked) navigate("/liked");
      else if (isPlaylist) navigate(`/playlist/${item.id}`);
      else if (isSong) playWithId(item.id);
      else if (isArtist) handleArtistClick(item.name);
    };

    return (
      <div
        key={item.id}
        onClick={handleClick}
        className={`grid grid-cols-12 items-center px-4 py-2.5 rounded-md cursor-pointer transition-all duration-200 group
          ${isActive ? "bg-emerald-500/10" : "hover:bg-white/5 active:bg-white/10"}`}
      >
        {/* Title column (col-span-6 / col-span-7) */}
        <div className="col-span-6 md:col-span-7 flex items-center gap-3 min-w-0">
          {isLiked ? (
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white text-lg">♥</span>
            </div>
          ) : isPlaylist ? (
            <div className="w-10 h-10 bg-[#282828] text-emerald-500 rounded-md flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-md">
              <ListMusic size={20} />
            </div>
          ) : isSong ? (
            <img 
              className={`w-10 h-10 rounded-md object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-md
                ${isActive ? "ring-1 ring-emerald-500 shadow-emerald-500/25" : ""}`}
              src={item.image} 
              alt={item.name}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#282828] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden shadow-md">
              {item.image ? (
                <img className="w-full h-full object-cover" src={item.image} alt={item.name} />
              ) : (
                <User size={18} className="text-gray-400" />
              )}
            </div>
          )}

          <div className="flex flex-col min-w-0">
            <span className={`text-sm font-bold truncate group-hover:text-emerald-400 transition-colors ${isActive ? "text-emerald-400 font-extrabold" : "text-white"}`}>
              {item.name}
            </span>
            <span className="text-[11px] text-gray-400 font-medium truncate mt-0.5">
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)} {isSong && `• ${item.desc}`}
            </span>
          </div>
        </div>

        {/* Date Added column (col-span-4 / col-span-3) */}
        <div className="col-span-4 md:col-span-3 text-xs text-gray-400 truncate pr-2 font-medium">
          {dateAdded}
        </div>

        {/* Played column (col-span-2) */}
        <div className="col-span-2 text-right text-xs text-gray-400 pr-2 font-medium">
          {played}
        </div>
      </div>
    );
  };

  const renderListItem = (item, isCompact) => {
    const isSong = item.type === "song";
    const isPlaylist = item.type === "playlist";
    const isLiked = item.type === "liked";
    const isArtist = item.type === "artist";

    const isActive = isSong && track?._id === item.id;
    const imgSize = isCompact ? "w-6 h-6" : "w-10 h-10";
    const padding = isCompact ? "p-1 gap-2.5" : "p-1.5 gap-3";
    const titleSize = isCompact ? "text-xs" : "text-sm";
    const subtitleSize = isCompact ? "text-[10px]" : "text-[11px]";

    const handleClick = () => {
      if (isLiked) navigate("/liked");
      else if (isPlaylist) navigate(`/playlist/${item.id}`);
      else if (isSong) playWithId(item.id);
      else if (isArtist) handleArtistClick(item.name);
    };

    return (
      <div
        key={item.id}
        onClick={handleClick}
        className={`flex items-center rounded-md cursor-pointer transition-all group
          ${collapsed ? "justify-center" : padding}
          ${isActive ? "bg-emerald-500/10" : "hover:bg-[#1a1a1a]"}`}
      >
        {/* IMAGE / VISUAL PANEL */}
        {isLiked ? (
          <div className={`${imgSize} rounded-md bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md`}>
            <span className="text-white" style={{ fontSize: isCompact ? "10px" : "16px" }}>♥</span>
          </div>
        ) : isPlaylist ? (
          <div className={`${imgSize} bg-[#282828] text-emerald-500 rounded-md flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-md`}>
            <ListMusic size={isCompact ? 14 : 20} />
          </div>
        ) : isSong ? (
          <img 
            className={`${imgSize} rounded-md object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-md
              ${isActive ? "ring-1 ring-emerald-500 shadow-emerald-500/25" : ""}`}
            src={item.image} 
            alt={item.name}
          />
        ) : (
          <div className={`${imgSize} rounded-full bg-[#282828] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden shadow-md`}>
            {item.image ? (
              <img className="w-full h-full object-cover" src={item.image} alt={item.name} />
            ) : (
              <User size={isCompact ? 12 : 18} className="text-gray-400" />
            )}
          </div>
        )}

        {/* DETAILS COLUMN (HIDDEN IF COLLAPSED) */}
        {!collapsed && (
          <div className="flex flex-col min-w-0 flex-1">
            <span className={`font-bold truncate ${isActive ? "text-emerald-400" : "text-white"} ${titleSize}`}>
              {item.name}
            </span>
            <span className={`text-gray-400 font-medium truncate ${subtitleSize}`}>
              {item.desc}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderGridItem = (item, isLarge) => {
    const isSong = item.type === "song";
    const isPlaylist = item.type === "playlist";
    const isLiked = item.type === "liked";
    const isArtist = item.type === "artist";

    const isActive = isSong && track?._id === item.id;
    const titleSize = isLarge ? "text-xs font-black mt-1.5" : "text-[10px] font-bold mt-1";
    const subtitleSize = "text-[9px] text-gray-400 font-bold mt-0.5 truncate";

    const handleClick = () => {
      if (isLiked) navigate("/liked");
      else if (isPlaylist) navigate(`/playlist/${item.id}`);
      else if (isSong) playWithId(item.id);
      else if (isArtist) handleArtistClick(item.name);
    };

    return (
      <div
        key={item.id}
        onClick={handleClick}
        className={`flex flex-col rounded-lg cursor-pointer transition-all duration-300 group select-none relative
          ${isLarge ? "bg-[#181818] p-2.5 border border-white/5 hover:bg-[#282828] hover:scale-[1.03]" : "p-1 hover:bg-white/5"}`}
      >
        {/* IMAGE / VISUAL CONTAINER */}
        <div className="relative aspect-square w-full rounded-md overflow-hidden flex-shrink-0 shadow-md">
          {isLiked ? (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
              <span className="text-white" style={{ fontSize: isLarge ? "32px" : "20px" }}>♥</span>
            </div>
          ) : isPlaylist ? (
            <div className="w-full h-full bg-[#282828] text-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-inner">
              <ListMusic size={isLarge ? 32 : 24} />
            </div>
          ) : isSong ? (
            <img 
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300
                ${isActive ? "ring-1 ring-emerald-500" : ""}`}
              src={item.image} 
              alt={item.name}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-[#282828] flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-300">
              {item.image ? (
                <img className="w-full h-full object-cover rounded-full" src={item.image} alt={item.name} />
              ) : (
                <User size={isLarge ? 32 : 24} className="text-gray-400" />
              )}
            </div>
          )}

          {/* ACTIVE GLOW OR FLOATING PLAY OVERLAY */}
          {isActive && (
            <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center backdrop-blur-[1px]">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-black shadow-lg">
                <Play size={10} fill="black" className="ml-0.5" />
              </div>
            </div>
          )}
        </div>

        {/* LABELS */}
        <div className={`min-w-0 ${isLarge ? "px-1" : "text-center"}`}>
          <p className={`truncate text-white group-hover:text-emerald-400 transition-colors ${titleSize}`}>
            {item.name}
          </p>
          {isLarge && (
            <p className={subtitleSize}>
              {item.desc}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      animate={{ width: collapsed ? 76 : (leftSidebarExpanded ? "100%" : 280) }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-full flex flex-col text-white select-none overflow-hidden"
    >
      {/* NAVIGATION BOX */}
      <div className="bg-[#121212] rounded-lg p-4 flex flex-col gap-4 flex-shrink-0">
        {/* LOGO & COLLAPSE */}
        <div className="flex items-center justify-center">
          {!collapsed ? (
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 cursor-pointer select-none" 
              onClick={handleLogoClick}
            >
              <img className="w-8 h-8 rounded-full object-contain" src={assets.tunestream_logo} alt="logo" />
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Tunestream
              </span>
            </motion.div>
          ) : (
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="mx-auto cursor-pointer select-none flex items-center justify-center" 
              onClick={handleLogoClick}
            >
              <img className="w-8 h-8 rounded-full object-contain" src={assets.tunestream_logo} alt="logo" />
            </motion.div>
          )}
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
          <div className="flex items-center gap-3 text-gray-400 hover:text-white cursor-pointer transition-colors" onClick={() => setCollapsed(!collapsed)}>
            <Library size={22} className={collapsed ? "" : "text-emerald-400"} />
            {!collapsed && <span className="text-sm font-black">Your Library</span>}
          </div>

          {!collapsed && (
            <div className="flex items-center gap-1.5">
              {/* Search Toggle */}
              <button 
                onClick={() => setShowLibSearch(!showLibSearch)}
                className={`p-1.5 rounded-full hover:bg-[#282828] text-gray-400 hover:text-white transition-colors ${showLibSearch ? "bg-[#282828] text-white" : ""}`}
                title="Search Library"
              >
                <Search size={16} />
              </button>
              
              {/* Add Playlist */}
              <button
                onClick={() => setShowCreateInput(!showCreateInput)}
                className={`p-1.5 rounded-full hover:bg-[#282828] text-gray-400 hover:text-white transition-colors ${showCreateInput ? "bg-emerald-500 text-black hover:text-black" : ""}`}
                title="Create Playlist"
              >
                <Plus size={16} />
              </button>

              {/* Full Width / Expand Toggle */}
              <button
                onClick={() => setLeftSidebarExpanded(!leftSidebarExpanded)}
                className="p-1.5 rounded-full hover:bg-[#282828] text-gray-400 hover:text-white transition-colors"
                title={leftSidebarExpanded ? "Collapse Sidebar Width" : "Expand Sidebar Width"}
              >
                {leftSidebarExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>

              {/* Collapse Sidebar Entirely Toggle */}
              <button
                onClick={() => setCollapsed(true)}
                className="p-1.5 rounded-full hover:bg-[#282828] text-gray-400 hover:text-white transition-colors"
                title="Collapse Library"
              >
                <ChevronLeft size={16} />
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

        {/* SORT & LAYOUT CONTROLS HEADER */}
        {!collapsed && (
          <div className="flex items-center justify-between px-2 py-1.5 text-xs text-gray-400 select-none border-t border-white/5 mt-1 pt-2">
            {/* Search Icon / Active Query indicator */}
            <div className="flex items-center gap-1">
              <Search size={14} className="text-gray-400 cursor-pointer hover:text-white" onClick={() => setShowLibSearch(!showLibSearch)} />
              {libSearchQuery && (
                <span className="text-[10px] text-emerald-400 font-bold max-w-[80px] truncate">
                  "{libSearchQuery}"
                </span>
              )}
            </div>

            {/* Sort Toggle Trigger */}
            <div 
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1.5 hover:text-white cursor-pointer font-bold tracking-wide select-none relative pr-1"
            >
              <span>
                {sortBy === "recents" && "Recents"}
                {sortBy === "recently-added" && "Recently Added"}
                {sortBy === "alphabetical" && "Alphabetical"}
                {sortBy === "creator" && "Creator"}
              </span>
              <span className="text-[14px] leading-none">≡</span>

              {/* PREMIUM DROPDOWN FLOATING POPUP */}
              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-6 z-40 w-56 bg-[#282828] border border-white/5 rounded-lg shadow-2xl p-1.5 text-white flex flex-col gap-1 text-[11px] font-semibold"
                  >
                    <p className="text-[9px] font-black uppercase text-gray-400 px-2 py-1 tracking-widest border-b border-white/5 mb-1 select-none">Sort by</p>
                    
                    {[
                      { key: "recents", label: "Recents" },
                      { key: "recently-added", label: "Recently Added" },
                      { key: "alphabetical", label: "Alphabetical" },
                      { key: "creator", label: "Creator" }
                    ].map(opt => (
                      <div
                        key={opt.key}
                        onClick={() => {
                          setSortBy(opt.key);
                          setShowSortDropdown(false);
                        }}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-white/10 cursor-pointer transition ${sortBy === opt.key ? "text-emerald-400" : "text-gray-200"}`}
                      >
                        <span>{opt.label}</span>
                        {sortBy === opt.key && <Check size={12} className="text-emerald-400" />}
                      </div>
                    ))}

                    <div className="h-[1px] bg-white/5 my-1" />

                    <p className="text-[9px] font-black uppercase text-gray-400 px-2 py-1 tracking-widest border-b border-white/5 mb-1 select-none">View as</p>
                    
                    {/* View options horizontal block layout row */}
                    <div className="flex items-center justify-between px-1.5 py-1 gap-1">
                      {[
                        { key: "compact", icon: List, label: "Compact" },
                        { key: "list", icon: ListMusic, label: "List" },
                        { key: "grid", icon: Grid3X3, label: "Grid" },
                        { key: "grid-large", icon: LayoutGrid, label: "Large Grid" }
                      ].map(opt => {
                        const Icon = opt.icon;
                        const isSel = viewAs === opt.key;
                        return (
                          <button
                            key={opt.key}
                            onClick={() => {
                              setViewAs(opt.key);
                              setShowSortDropdown(false);
                            }}
                            className={`flex-1 py-2 px-1.5 rounded flex flex-col items-center justify-center gap-1 transition active:scale-95
                              ${isSel 
                                ? "bg-emerald-500 text-black font-black" 
                                : "bg-[#181818] text-gray-400 hover:bg-white/10 hover:text-white"}`}
                            title={opt.label}
                          >
                            <Icon size={14} />
                            <span className="text-[8px] tracking-tighter truncate max-w-full leading-none">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* LIBRARY LIST CONTAINER */}
        <div className="flex-1 overflow-y-auto mt-2 px-1 custom-scrollbar">
          {loading ? (
            <SidebarSkeleton />
          ) : unifiedItems.length === 0 ? (
            <div className="text-center py-8 opacity-40 flex flex-col items-center justify-center gap-2">
              <span className="text-xl">🔍</span>
              <p className="text-xs font-bold uppercase tracking-wider">No items found</p>
            </div>
          ) : (
            <>
              {leftSidebarExpanded && !collapsed ? (
                <div className="flex flex-col w-full mt-2">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 px-4 py-2 border-b border-white/5 font-bold tracking-wider text-[10px] uppercase text-gray-400">
                    <div className="col-span-6 md:col-span-7">Title</div>
                    <div className="col-span-4 md:col-span-3">Date Added</div>
                    <div className="col-span-2 text-right">Played</div>
                  </div>
                  {/* Table Rows */}
                  <div className="flex flex-col gap-1 mt-2">
                    {unifiedItems.map(item => renderTableRowItem(item))}
                  </div>
                </div>
              ) : viewAs === "grid" && !collapsed ? (
                <div className="grid grid-cols-3 gap-2.5 p-1 mt-2">
                  {unifiedItems.map(item => renderGridItem(item, false))}
                </div>
              ) : viewAs === "grid-large" && !collapsed ? (
                <div className="grid grid-cols-2 gap-3.5 p-1 mt-2">
                  {unifiedItems.map(item => renderGridItem(item, true))}
                </div>
              ) : (
                <div className="space-y-1.5 mt-2">
                  {unifiedItems.map(item => renderListItem(item, viewAs === "compact"))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
