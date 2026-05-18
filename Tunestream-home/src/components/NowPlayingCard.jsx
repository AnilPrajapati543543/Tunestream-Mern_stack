import React, { useContext, useState, useEffect, useMemo } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { assets } from "../assets/assets.js";
import { motion, AnimatePresence } from "framer-motion";
import VolumeControl from "./VolumeControl";
import { Plus, X, Heart, Sparkles, UserPlus, UserCheck, Flame } from "lucide-react";
import { toast } from "react-toastify";

const NowPlayingCard = () => {
  const {
    track,
    playStatus,
    playWithId,
    playQueue,
  } = useContext(PlayerContext);

  const [collapsed, setCollapsed] = useState(false);
  const [bgColor, setBgColor] = useState("rgba(18, 18, 18, 0.95)");
  const [followedArtists, setFollowedArtists] = useState({});

  // Auto-expand on new track play if it was collapsed
  useEffect(() => {
    if (track) setCollapsed(false);
  }, [track]);

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

  if (!track || collapsed) {
    // If collapsed, show a elegant floating expand handle on the right or hidden
    if (collapsed && track) {
      return (
        <button 
          onClick={() => setCollapsed(false)}
          className="fixed right-4 top-24 z-30 p-2.5 bg-[#121212] border border-white/10 hover:bg-[#282828] text-emerald-400 rounded-full hover:scale-105 active:scale-95 transition shadow-2xl flex items-center justify-center gap-1.5"
        >
          <Sparkles size={16} className="animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider pr-1">Playing</span>
        </button>
      );
    }
    return null;
  }

  // Parse YouTube video ID if YouTube link is supplied
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
        animate={{ width: 300, opacity: 1 }}
        exit={{ width: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-full flex-shrink-0 flex overflow-hidden select-none"
      >
        <div
          className="w-full h-full rounded-lg flex flex-col text-white overflow-y-auto custom-scrollbar border border-white/5 relative"
          style={{
            background: `linear-gradient(180deg, ${bgColor} 0%, #121212 100%)`,
          }}
        >
          {/* HEADER SECTION */}
          <div className="p-4 flex items-center justify-between border-b border-white/5 sticky top-0 bg-[#121212]/30 backdrop-blur-md z-10">
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">
                Playing from
              </span>
              <span className="text-xs font-black truncate text-white mt-0.5">
                {track.album !== "none" ? track.album : "Tunestream Playlist"}
              </span>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* MAIN CANVAS VISUAL (Loop Video or pulsing Image) */}
          <div className="p-4 flex-shrink-0">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden group shadow-lg shadow-black/40 border border-white/5">
              
              {/* Optional 10s Loop Video */}
              {track.videoUrl ? (
                ytId ? (
                  <iframe
                    key={ytId}
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&enablejsapi=1`}
                    className="absolute inset-0 w-full h-full object-cover scale-150 z-0 pointer-events-none opacity-90"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    title="loop-video"
                  />
                ) : (
                  <video
                    key={track.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0 opacity-90"
                  >
                    <source src={track.videoUrl} type="video/mp4" />
                  </video>
                )
              ) : (
                /* Static Image visual with micro zoom hover */
                <img
                  src={track.image}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  alt="track"
                />
              )}

              {/* Dynamic canvas visualizer overlay when playing */}
              {playStatus && (
                <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full flex items-center gap-1.5 border border-white/10 shadow-lg">
                  <Flame size={12} className="text-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider">Canvas Visualizer</span>
                </div>
              )}
            </div>
          </div>

          {/* DETAIL DESCRIPTION */}
          <div className="px-4 pb-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-lg font-black tracking-tight text-white hover:underline cursor-pointer truncate">
                  {track.name}
                </h3>
                <p className="text-xs text-gray-400 hover:text-white cursor-pointer mt-0.5 truncate font-medium">
                  {track.desc || "Track details"}
                </p>
              </div>
              <button 
                onClick={() => toast.success("Added to Liked Songs")}
                className="p-1 rounded-full text-emerald-400 hover:text-emerald-300 hover:scale-110 transition flex-shrink-0"
              >
                <Heart size={18} fill="#10b981" />
              </button>
            </div>
          </div>

          {/* DYNAMIC CREDITS PANEL */}
          <div className="px-4 py-3 border-t border-white/5 mt-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-black text-white tracking-tight">Credits</span>
              <span className="text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-wider cursor-pointer">
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
                        <p className="text-xs font-bold text-white truncate hover:underline cursor-pointer">
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
                <span className="text-[10px] font-bold text-emerald-400 hover:underline uppercase tracking-wider cursor-pointer">
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
                <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 pr-1 transition duration-300">
                  ▶
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NowPlayingCard;
