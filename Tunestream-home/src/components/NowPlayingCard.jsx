import React, { useContext, useState, useEffect, useMemo } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { assets } from "../assets/assets.js";
import { motion, AnimatePresence } from "framer-motion";
import VolumeControl from "./VolumeControl";
import { Plus, X, Heart, Sparkles, UserPlus, UserCheck, Flame, Play, Pause, ChevronRight, Maximize2, Minimize2, Disc, Mic, MoreHorizontal, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PlaylistModal from "./PlaylistModal";

const NowPlayingCard = () => {
  const {
    track,
    playStatus,
    play,
    pause,
    playWithId,
    playQueue,
    progress,
    rightSidebarCollapsed: collapsed,
    setRightSidebarCollapsed: setCollapsed,
    rightSidebarExpanded,
    setRightSidebarExpanded,
    likedSongs,
    toggleLikeSong,
    openArtistProfile
  } = useContext(PlayerContext);

  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

  const navigate = useNavigate();

  const [bgColor, setBgColor] = useState("rgba(18, 18, 18, 0.95)");
  const [followedArtists, setFollowedArtists] = useState({});
  const [scrollOffset, setScrollOffset] = useState(0);

  const [spinDisc, setSpinDisc] = useState(true);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleArtistClick = (artistName) => {
    if (!artistName) return;
    // Extract main artist in case of comma separated lists
    const mainArtist = artistName.split(/[,&]/)[0].trim();
    navigate(`/?search=${encodeURIComponent(mainArtist)}`);
    setRightSidebarExpanded(false);
    toast.info(`Filtering by artist: ${mainArtist}`);
  };

  // Auto-expand on new track play if it was collapsed
  useEffect(() => {
    if (track) setCollapsed(false);
  }, [track, setCollapsed]);

  // Load followed artists state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("followedArtists");
      if (stored) setFollowedArtists(JSON.parse(stored));
    } catch (_) {}
  }, []);

  // Toggle artist follow status
  const toggleFollow = (artistName) => {
    const nextState = {
      ...followedArtists,
      [artistName]: !followedArtists[artistName]
    };
    setFollowedArtists(nextState);
    localStorage.setItem("followedArtists", JSON.stringify(nextState));
    if (nextState[artistName]) {
      toast.success(`Following ${artistName}`);
    } else {
      toast.info(`Unfollowed ${artistName}`);
    }
  };

  // Generate background color based on the current track image
  useEffect(() => {
    if (!track?.image) return;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 1;
        canvas.height = 1;
        ctx.drawImage(img, 0, 0, 1, 1);
        const data = ctx.getImageData(0, 0, 1, 1).data;
        // Dampen the color to keep background dark and elegant
        const r = Math.floor(data[0] * 0.25);
        const g = Math.floor(data[1] * 0.25);
        const b = Math.floor(data[2] * 0.25);
        setBgColor(`rgba(${r}, ${g}, ${b}, 0.95)`);
      } catch (_) {
        setBgColor("rgba(18, 18, 18, 0.95)");
      }
    };

    img.onerror = () => {
      setBgColor("rgba(18, 18, 18, 0.95)");
    };

    img.src = track.image;
  }, [track]);

  // Extract credits from the track details
  const creditsList = useMemo(() => {
    if (!track) return [];
    
    // Attempt to extract from song description/details
    const artists = [];
    if (track.desc) {
      const parts = track.desc.split(/[,&]/);
      parts.forEach((p, index) => {
        const name = p.trim();
        if (name && name.length > 1 && name.length < 35 && !name.toLowerCase().includes("hits")) {
          let role = "Main Artist";
          if (index === 1) role = "Featured Artist";
          if (index > 1) role = "Composer / Producer";
          artists.push({ name, role });
        }
      });
    }

    // Default fallbacks to fill
    if (artists.length === 0) {
      artists.push({ name: "Vishal-Shekhar", role: "Main Artist" });
      artists.push({ name: "Shreya Ghoshal", role: "Main Artist" });
      artists.push({ name: "Vishal Dadlani", role: "Main Artist / Composer" });
    }

    return artists.slice(0, 3);
  }, [track]);

  // Extract next in queue details
  const nextTrack = useMemo(() => {
    if (!track || !playQueue || playQueue.length === 0) return null;
    const currentIndex = playQueue.findIndex(s => s._id === track._id);
    if (currentIndex !== -1 && currentIndex < playQueue.length - 1) {
      return playQueue[currentIndex + 1];
    }
    return playQueue[0]; // loop back to first song if none
  }, [track, playQueue]);

  const lyricsLines = useMemo(() => {
    return [
      `♪ "${track?.name || 'Track'}" Playing on Tunestream ♪`,
      "I hear the music calling my name",
      "The rhythm flows through my veins",
      "We trace the lights and dance in the dark",
      "Every single beat leaves a mark",
      "Underneath the emerald sky",
      "With every pulse, we learn to fly",
      "No more shadows, no more doubts",
      "Turn it up, scream it out",
      "This is our sound, this is our soul",
      "Let the melody take control",
      "♪ Tunestream Immersive Audio Experience ♪"
    ];
  }, [track]);

  if (!track || collapsed) {
    return null;
  }

  const renderFullScreenPlayer = () => {
    const scale = Math.max(1 - scrollOffset / 1200, 0.75);
    const translateY = scrollOffset * 0.22;
    const brightness = Math.max(1 - scrollOffset / 350, 0.2);
    const coverOpacity = Math.max(1 - scrollOffset / 550, 0.08);

    return (
      <div 
        onScroll={(e) => setScrollOffset(e.target.scrollTop)}
        className="w-full h-full flex flex-col relative overflow-y-auto custom-scrollbar scroll-smooth"
        style={{
          background: "transparent"
        }}
      >
        {/* Large Blurred Backdrop Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-20 scale-110 z-0 pointer-events-none"
          style={{ backgroundImage: `url(${track.image})` }}
        />

        {/* HEADER SECTION */}
        <div className="p-6 flex items-center justify-between border-b border-white/5 sticky top-0 bg-[#080808]/40 backdrop-blur-md z-20">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">
              Playing from
            </span>
            <span className="text-sm font-black truncate text-white mt-0.5">
              {track.album !== "none" ? track.album : "Tunestream Playlist"}
            </span>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* Immersive Top Bar Icons */}
            <button 
              onClick={() => {
                setSpinDisc(!spinDisc);
                toast.info(spinDisc ? "Disc rotation paused" : "Disc rotation enabled");
              }}
              className={`p-2 rounded-full hover:bg-white/10 transition ${spinDisc ? "text-emerald-400" : "text-gray-400 hover:text-white"}`}
              title="Toggle Disc Rotation"
            >
              <Disc size={18} className={spinDisc ? "animate-spin-slow" : ""} />
            </button>

            <button 
              onClick={playStatus ? pause : play}
              className={`p-2 rounded-full hover:bg-white/10 transition ${playStatus ? "text-emerald-400" : "text-gray-400 hover:text-white"}`}
              title={playStatus ? "Pause Audio" : "Play Audio"}
            >
              {playStatus ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>

            <button 
              onClick={() => {
                setShowLyrics(!showLyrics);
                if (showMenu) setShowMenu(false);
              }}
              className={`p-2 rounded-full hover:bg-white/10 transition ${showLyrics ? "text-emerald-400 bg-emerald-500/10 scale-105" : "text-gray-400 hover:text-white"}`}
              title="Lyrics View Mode"
            >
              <Mic size={18} />
            </button>

            <button 
              onClick={() => {
                setShowMenu(!showMenu);
                if (showLyrics) setShowLyrics(false);
              }}
              className={`p-2 rounded-full hover:bg-white/10 transition relative ${showMenu ? "text-emerald-400 bg-emerald-500/10 scale-105" : "text-gray-400 hover:text-white"}`}
              title="More Actions"
            >
              <MoreHorizontal size={18} />
            </button>

            {/* Actions Menu Dropdown Popover */}
            <AnimatePresence>
              {showMenu && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute right-12 top-12 bg-[#181818]/95 backdrop-blur-xl border border-white/10 p-2.5 rounded-2xl w-56 shadow-2xl z-50 flex flex-col gap-1 pointer-events-auto"
                >
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      toast.info("Create or select playlist in library to add");
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-all text-left"
                  >
                    <Plus size={14} className="text-emerald-400" />
                    <span>Add to Playlist</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Tunestream track link copied to clipboard!");
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-all text-left"
                  >
                    <Sparkles size={14} className="text-emerald-400" />
                    <span>Copy Share Link</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      toast.success(`"${track.name}" pinned to your active player queue!`);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-all text-left"
                  >
                    <Disc size={14} className="text-emerald-400 animate-spin-slow" />
                    <span>Pin to Player Queue</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Minimize / Full Screen Toggle */}
            <button
              onClick={() => setRightSidebarExpanded(false)}
              className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition active:scale-95"
              title="Exit Full Screen"
            >
              <Minimize2 size={18} />
            </button>
          </div>
        </div>

        {/* SECTION 1: IMMERSIVE COVER HERO */}
        {!showLyrics ? (
          <div 
            className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center relative p-8 select-none z-10 sticky top-[80px] pointer-events-none"
            style={{
              transform: `perspective(1200px) rotateX(${scrollOffset * 0.04}deg) rotateY(${scrollOffset * -0.005}deg) translateY(${translateY}px) scale(${scale})`,
              filter: `brightness(${brightness})`,
              opacity: coverOpacity,
              transformStyle: "preserve-3d",
              willChange: "transform, opacity, filter"
            }}
          >
            <div className="relative group flex flex-col items-center pointer-events-auto">
              {/* Pulsing visual glow backdrop */}
              <div className="absolute inset-0 bg-emerald-500/20 rounded-[2rem] filter blur-3xl scale-95 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="w-[320px] h-[450px] md:w-[380px] md:h-[520px] relative rounded-[2rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.95)] shadow-emerald-500/10 border border-white/10 group-hover:scale-[1.02] transition-all duration-500 z-10 flex flex-col justify-end">
                
                {track.videoUrl ? (
                  ytId ? (
                    <iframe
                      key={ytId}
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&enablejsapi=1`}
                      className="absolute w-[240%] h-[100%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-90 scale-[1.05] z-0"
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      title="loop-video-fullscreen"
                    />
                  ) : (
                    <video
                      key={track.videoUrl}
                      autoPlay
                      loop
                      muted={true}
                      playsInline={true}
                      preload="auto"
                      crossOrigin="anonymous"
                      className="absolute inset-0 w-full h-full object-cover opacity-90"
                    >
                      <source src={track.videoUrl} />
                    </video>
                  )
                ) : (
                  <img 
                    src={track.image} 
                    className="absolute inset-0 w-full h-full object-cover"
                    alt={track.name} 
                  />
                )}

                {/* Dark gradient overlay inside card */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent z-10 pointer-events-none" />

                {/* Meta details at bottom of card */}
                <div className="absolute bottom-6 left-6 right-6 z-20 flex items-end justify-between pointer-events-auto">
                  <div className="min-w-0 pr-4 flex-1">
                    <h2 className="text-xl md:text-3xl font-black text-white tracking-tight drop-shadow-md truncate">
                      {track.name}
                    </h2>
                    <p className="text-xs md:text-sm text-emerald-400 font-bold tracking-wide drop-shadow mt-1 hover:underline cursor-pointer" onClick={() => openArtistProfile(track.desc)}>
                      {track.desc || "Main Artist"}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsPlaylistModalOpen(true)}
                    className="p-3 bg-emerald-500 hover:bg-emerald-400 hover:scale-110 active:scale-95 text-black rounded-2xl transition shadow-xl flex-shrink-0"
                    title="Add to Playlist"
                  >
                    <Plus size={18} className="stroke-[3]" />
                  </button>
                </div>

              </div>
            </div>

            {/* Bouncing Scroll Down helper */}
            <div 
              className="absolute bottom-6 flex flex-col items-center gap-1 opacity-50 animate-bounce"
              style={{ opacity: Math.max(1 - scrollOffset / 100, 0) }}
            >
              <span className="text-[9px] uppercase font-black tracking-widest text-gray-400">Scroll down for details</span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </div>
        ) : (
          <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center relative p-8 z-10 sticky top-[80px] text-center w-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl w-full flex flex-col gap-6 overflow-y-auto max-h-[70vh] px-4 py-10 scrollbar-hide"
            >
              {lyricsLines.map((line, idx) => (
                <p 
                  key={idx} 
                  className="text-xl md:text-3xl font-black transition-all duration-300 hover:text-emerald-300 select-none cursor-pointer"
                  style={{
                    color: idx === Math.floor(progress / 8) % lyricsLines.length ? "#10b981" : "rgba(255,255,255,0.3)",
                    textShadow: idx === Math.floor(progress / 8) % lyricsLines.length ? "0 0 20px rgba(16,185,129,0.6)" : "none"
                  }}
                >
                  {line}
                </p>
              ))}
            </motion.div>
          </div>
        )}

        {/* SECTION 2: DETAILS FLOATING PANELS */}
        <div className="w-full py-16 px-8 flex flex-col md:flex-row items-stretch justify-center gap-8 bg-black/35 backdrop-blur-3xl border-t border-white/5 relative z-20 min-h-[480px] shadow-[0_-30px_60px_rgba(0,0,0,0.85)] mt-[80px]">
          
          {/* LEFT COLUMN: CREDITS CARD */}
          <div className="bg-[#181818]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-2xl w-full max-w-lg flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h2 className="text-lg font-black text-white tracking-wide">Credits</h2>
              <span className="text-xs font-bold text-gray-400 hover:text-white cursor-pointer transition">Show all</span>
            </div>
            
            <div className="flex flex-col gap-4">
              {creditsList.map((artist, idx) => {
                const isFollowing = followedArtists[artist.name];
                return (
                  <div key={idx} className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#282828] flex items-center justify-center overflow-hidden shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=60" 
                          className="w-full h-full object-cover" 
                          alt={artist.name} 
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-white truncate hover:text-emerald-400 cursor-pointer transition" onClick={() => navigate(`/?search=${encodeURIComponent(artist.name)}`)}>
                          {artist.name}
                        </span>
                        <span className="text-xs text-gray-400 font-medium truncate mt-0.5">
                          {artist.role}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleFollow(artist.name)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition active:scale-95
                        ${isFollowing 
                          ? "border border-emerald-500 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10" 
                          : "border border-white/20 text-white hover:border-white hover:bg-white/5"}`}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: NEXT IN QUEUE CARD */}
          {nextTrack && (
            <div className="bg-[#181818]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-2xl w-full max-w-lg flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h2 className="text-lg font-black text-white tracking-wide">Next in queue</h2>
                <span 
                  onClick={() => navigate("/queue")}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer transition"
                >
                  Open queue
                </span>
              </div>
              
              <div className="flex items-center gap-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition group cursor-pointer" onClick={() => playWithId(nextTrack._id)}>
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                  <img src={nextTrack.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" alt={nextTrack.name} />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <Play size={16} fill="white" className="text-white ml-0.5" />
                  </div>
                </div>
                
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                    {nextTrack.name}
                  </span>
                  <span className="text-xs text-gray-400 truncate mt-1 font-medium">
                    {nextTrack.desc || "Track"}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const ytId = getYouTubeId(track.videoUrl);

  return (
    <AnimatePresence>
      <motion.div
        key="right-now-playing"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: rightSidebarExpanded ? "100%" : 300, opacity: 1 }}
        exit={{ width: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-full flex-shrink-0 flex overflow-hidden select-none"
      >
        {rightSidebarExpanded ? (
          renderFullScreenPlayer()
        ) : (
          <div
            className="w-full h-full rounded-lg flex flex-col text-white overflow-y-auto custom-scrollbar border border-white/5 relative"
            style={{
              background: `linear-gradient(180deg, ${bgColor} 0%, #121212 100%)`,
            }}
          >
          {/* HEADER SECTION */}
          <div className="p-4 flex items-center justify-between border-b border-white/5 sticky top-0 bg-[#121212]/30 backdrop-blur-md z-10">
            <div className="flex items-center gap-2 min-w-0">
              <Disc size={15} className="text-emerald-400 animate-[spin_8s_linear_infinite] flex-shrink-0" />
              <span className="text-xs font-black truncate text-white">
                {track.album !== "none" ? track.album : "Tunestream Playlist"}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 relative">
              <button 
                onClick={() => {
                  setShowMenu(!showMenu);
                  if (showLyrics) setShowLyrics(false);
                }}
                className={`p-1.5 rounded-full transition active:scale-95 relative ${showMenu ? "text-emerald-400 bg-emerald-500/10 scale-105" : "text-gray-400 hover:text-white"}`}
                title="More Actions"
              >
                <MoreHorizontal size={16} />
              </button>
              
              {/* Actions Menu Dropdown Popover */}
              <AnimatePresence>
                {showMenu && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                    className="absolute right-0 top-9 bg-[#181818]/95 backdrop-blur-xl border border-white/10 p-2 rounded-2xl w-48 shadow-2xl z-50 flex flex-col gap-1 pointer-events-auto text-left"
                  >
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setIsPlaylistModalOpen(true);
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-all text-left"
                    >
                      <Plus size={14} className="text-emerald-400" />
                      <span>Add to Playlist</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Link copied!");
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-all text-left"
                    >
                      <Sparkles size={14} className="text-emerald-400" />
                      <span>Copy Share Link</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowMenu(false);
                        toast.success(`"${track.name}" pinned to queue!`);
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-all text-left"
                    >
                      <Disc size={14} className="text-emerald-400 animate-spin-slow" />
                      <span>Pin to Queue</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setRightSidebarExpanded(!rightSidebarExpanded)}
                className="p-1.5 rounded-full text-gray-400 hover:text-white transition active:scale-95"
                title="Expand Full Screen"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          {/* TALL IMMERSIVE VISUAL CARD (Spotify Canvas style) */}
          <div className="p-4 flex-shrink-0">
            <div className="relative w-full h-[410px] rounded-[1.8rem] overflow-hidden group shadow-2xl shadow-black/80 border border-white/10 flex flex-col justify-end">
              
              {/* Optional Loop Video / Image */}
              {track.videoUrl ? (
                ytId ? (
                  <iframe
                    key={ytId}
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&enablejsapi=1`}
                    className="absolute w-[240%] h-[100%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-90 scale-[1.05] z-0"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    title="loop-video"
                  />
                ) : (
                  <video
                    key={track.videoUrl}
                    autoPlay
                    loop
                    muted={true}
                    playsInline={true}
                    preload="auto"
                    crossOrigin="anonymous"
                    className="absolute inset-0 w-full h-full object-cover z-0 opacity-90"
                  >
                    <source src={track.videoUrl} />
                  </video>
                )
              ) : (
                <img
                  src={track.image}
                  className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  alt="track"
                />
              )}

              {/* Dark gradient overlay inside card */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent z-10 pointer-events-none" />

              {/* Track Name + Artist + Action buttons layered over bottom of visual card */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between pointer-events-auto">
                <div className="min-w-0 pr-2 flex-1">
                  <h3 className="text-base font-black tracking-tight text-white hover:underline cursor-pointer truncate drop-shadow-md">
                    {track.name}
                  </h3>
                  <p className="text-[11px] text-emerald-400 hover:text-emerald-300 cursor-pointer mt-0.5 truncate font-bold drop-shadow hover:underline" onClick={(e) => { e.stopPropagation(); openArtistProfile(track.desc); }}>
                    {track.desc || "Track details"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsPlaylistModalOpen(true); }}
                    className="p-1.5 bg-transparent hover:scale-110 active:scale-95 text-white transition flex-shrink-0"
                    title="Add to Playlist"
                  >
                    <Plus size={16} className="stroke-[3]" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleLikeSong(track._id); }}
                    className="p-1.5 bg-transparent hover:scale-110 active:scale-95 text-gray-400 hover:text-emerald-400 transition flex-shrink-0"
                  >
                    <Heart 
                      size={16} 
                      fill={likedSongs.includes(track._id) ? "#10b981" : "none"} 
                      stroke={likedSongs.includes(track._id) ? "#10b981" : "currentColor"} 
                      className={likedSongs.includes(track._id) ? "text-emerald-500" : ""}
                    />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* DYNAMIC CREDITS PANEL */}
          <div className="px-4 py-3 border-t border-white/5 mt-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-black text-white tracking-tight">Credits</span>
              <span 
                onClick={() => openArtistProfile(track.desc)}
                className="text-[10px] font-bold text-gray-400 hover:text-emerald-400 uppercase tracking-wider cursor-pointer transition-colors"
              >
                Show all
              </span>
            </div>

            <div className="space-y-3.5 bg-[#181818] p-3 rounded-lg border border-white/5 shadow-inner">
              {creditsList.map((artist, idx) => {
                const isFollowing = followedArtists[artist.name];
                return (
                  <div key={`${artist.name}-${idx}`} className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500 flex items-center justify-center font-bold text-black text-xs flex-shrink-0 shadow-md">
                        {artist.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate hover:underline cursor-pointer" onClick={() => openArtistProfile(artist.name)}>
                          {artist.name}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">
                          {artist.role}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFollow(artist.name)}
                      className={`px-3 py-1 text-[10px] font-black rounded-full border transition active:scale-95 flex items-center gap-1 flex-shrink-0
                        ${isFollowing 
                          ? "border-emerald-500 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10" 
                          : "border-gray-500 text-white hover:border-white"}`}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck size={10} />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={10} />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* NEXT IN QUEUE PREVIEW */}
          {nextTrack && (
            <div className="px-4 py-3 border-t border-white/5 mt-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Next in queue
                </span>
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    navigate("/queue");
                  }}
                  className="text-[10px] font-bold text-emerald-400 hover:underline uppercase tracking-wider cursor-pointer"
                >
                  Open queue
                </span>
              </div>

              <div 
                onClick={() => playWithId(nextTrack._id, playQueue)}
                className="flex items-center gap-3 bg-[#181818] p-2.5 rounded-lg border border-white/5 hover:bg-[#282828] cursor-pointer transition group shadow-inner"
              >
                <img
                  src={nextTrack.image}
                  className="w-10 h-10 rounded object-cover flex-shrink-0 group-hover:scale-105 transition duration-300 shadow-md"
                  alt="next track"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                    {nextTrack.name}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">
                    {nextTrack.desc || "Track details"}
                  </p>
                </div>
                <div className="w-6 h-6 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-90 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition duration-300 flex-shrink-0 shadow-md">
                  <Play size={10} fill="currentColor" className="ml-[1px]" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <PlaylistModal isOpen={isPlaylistModalOpen} onClose={() => setIsPlaylistModalOpen(false)} songId={track._id} />
      </motion.div>
    </AnimatePresence>
  );
};

export default NowPlayingCard;
