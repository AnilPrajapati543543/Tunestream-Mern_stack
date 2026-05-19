import React, { useContext, useState, useMemo } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import { 
  Search, 
  Plus, 
  ArrowUpDown, 
  LayoutGrid, 
  List, 
  Heart,
  Music2,
  ChevronRight,
  Pin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MobileLibrary = () => {
  const { albumsData, playlists, setPlaylists, track, songsData, openArtistProfile } = useContext(PlayerContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState("All");
  const [isGridView, setIsGridView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const filters = ["All", "Playlists", "Albums", "Artists"];

  const handleCreatePlaylist = async () => {
    const name = window.prompt("Enter new playlist name:");
    if (!name) return;
    try {
      const res = await API.post("/playlist/create", { name });
      if (res.data.success) {
        toast.success("Playlist created!");
        setPlaylists([...playlists, res.data.playlist]);
      }
    } catch (error) {
      toast.error("Failed to create playlist");
    }
  };

  const libraryItems = useMemo(() => {
    let items = [];
    
    // Liked Songs (only if filter is All or Playlists)
    if (activeFilter === "All" || activeFilter === "Playlists") {
      // Find liked songs count dynamically
      const storedLiked = localStorage.getItem("tunestream_liked_songs");
      const likedCount = storedLiked ? JSON.parse(storedLiked).length : 0;
      
      items.push({
        id: "liked",
        name: "Liked Songs",
        desc: `Playlist • ${likedCount} ${likedCount === 1 ? 'song' : 'songs'}`,
        image: null, // Resolves the broken image URL glitch and triggers gorgeous gradient fallback!
        type: "Playlist",
        isLiked: true,
        isPinned: true
      });
    }

    // Playlists (only if filter is All or Playlists)
    if (activeFilter === "All" || activeFilter === "Playlists") {
      playlists.forEach(p => items.push({
        id: p._id,
        name: p.name,
        desc: `Playlist • ${user?.name || "TuneStream User"}`,
        image: null,
        type: "Playlist",
        isPinned: false
      }));
    }

    // Albums (only if filter is All or Albums)
    if (activeFilter === "All" || activeFilter === "Albums") {
      albumsData.forEach(a => items.push({
        id: a._id,
        name: a.name,
        desc: `Album • ${a.desc || "Official Album"}`,
        image: a.image,
        type: "Album",
        isPinned: false
      }));
    }

    // Artists (only if filter is All or Artists)
    if (activeFilter === "All" || activeFilter === "Artists") {
      const artists = [...new Set(songsData.map(s => {
        if (!s.desc) return null;
        const parts = s.desc.split(/[,&]/);
        return parts[0].trim();
      }).filter(Boolean))];

      artists.forEach(artistName => {
        const artistSong = songsData.find(s => s.desc && s.desc.includes(artistName));
        items.push({
          id: `artist-${artistName}`,
          name: artistName,
          desc: "Artist Profile",
          image: artistSong?.image || null,
          type: "Artist",
          isPinned: false
        });
      });
    }

    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => (b.isPinned ? 1 : -1) - (a.isPinned ? 1 : -1));
  }, [playlists, albumsData, songsData, searchQuery, activeFilter, user]);

  return (
    <div className="flex flex-col h-full bg-[#121212] text-white select-none">
      {/* STICKY HEADER */}
      <div className="sticky top-0 z-30 bg-[#121212]/80 backdrop-blur-xl px-4 pt-6 pb-2 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center font-black text-black shadow-lg ring-4 ring-emerald-500/10">
                {user?.name?.[0]?.toUpperCase() || "T"}
             </div>
             <h1 className="text-2xl font-black tracking-tight">Your Library</h1>
          </div>
          <div className="flex items-center gap-5">
             <Search onClick={() => setShowSearch(!showSearch)} className="w-6 h-6 text-gray-400 active:scale-90 transition-transform cursor-pointer" />
             <Plus onClick={handleCreatePlaylist} className="w-7 h-7 text-gray-400 active:scale-90 transition-transform cursor-pointer" />
          </div>
        </div>

        {/* Collapsible search field */}
        <AnimatePresence>
          {showSearch && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 overflow-hidden"
            >
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in your library..."
                className="w-full bg-[#242424] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-emerald-500/50 transition"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* FILTER CHIPS */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex-shrink-0
                ${activeFilter === filter 
                  ? "bg-emerald-500 text-black shadow-[0_4px_15px_rgba(16,185,129,0.3)]" 
                  : "bg-white/10 text-white active:bg-white/20"}
              `}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-400 active:text-white transition-colors">
          <ArrowUpDown className="w-4 h-4" />
          <span>Recently Played</span>
        </div>
        <button 
          onClick={() => setIsGridView(!isGridView)}
          className="p-1 text-gray-400 active:text-white"
        >
          {isGridView ? <List className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
        </button>
      </div>

      {/* CONTENT LIST / GRID */}
      <div className={`flex-1 overflow-y-auto px-4 pb-32 ${isGridView ? "grid grid-cols-2 gap-x-4 gap-y-6" : "space-y-4"}`}>
        <AnimatePresence mode="popLayout">
          {libraryItems.map((item, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02, type: "spring", stiffness: 200, damping: 25 }}
              key={item.id}
              onClick={() => {
                if (item.id === "liked") {
                  navigate("/liked");
                } else if (item.type === "Artist") {
                  openArtistProfile(item.name);
                } else if (item.type === "Album") {
                  navigate(`/album/${item.id}`);
                } else {
                  navigate(`/playlist/${item.id}`);
                }
              }}
              className={`group relative flex ${isGridView ? "flex-col" : "items-center gap-4"} active:scale-[0.98] transition-transform cursor-pointer`}
            >
              {/* Image Container */}
              <div className={`relative flex-shrink-0 ${isGridView ? "w-full aspect-square mb-3" : "w-16 h-16"} ${item.type === "Artist" ? "rounded-full" : "rounded-lg"} overflow-hidden shadow-2xl`}>
                {item.image ? (
                  <img src={item.image} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${item.isLiked ? "bg-gradient-to-br from-[#450af5] via-[#8e07ee] to-[#10b981]" : "bg-[#282828]"}`}>
                    {item.isLiked ? <Heart className="w-8 h-8 fill-white text-white" /> : <Music2 className="w-8 h-8 text-gray-500" />}
                  </div>
                )}
                
                {/* Playing Indicator */}
                {track?.album === item.name && (
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="flex gap-[3px] h-4 items-end">
                        {[0.6, 0.4, 0.5, 0.7].map((d, i) => (
                           <div key={i} className="w-[3px] h-full bg-emerald-500 animate-bounce" style={{animationDuration: `${d}s`}} />
                        ))}
                      </div>
                   </div>
                )}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                   {item.isPinned && <Pin className="w-3 h-3 text-emerald-500 fill-emerald-500 animate-pulse" />}
                   <p className={`font-bold truncate leading-tight ${isGridView ? "text-sm" : "text-base"} ${track?.album === item.name ? "text-emerald-400" : "text-white"}`}>
                    {item.name}
                  </p>
                </div>
                <p className={`text-gray-400 truncate font-medium ${isGridView ? "text-[11px]" : "text-sm"}`}>
                  {item.desc}
                </p>
              </div>

              {!isGridView && <ChevronRight className="w-5 h-5 text-gray-800" />}
            </motion.div>
          ))}
          
          {/* Action Card */}
          <motion.div
            layout
            onClick={handleCreatePlaylist}
            className={`flex ${isGridView ? "flex-col" : "items-center gap-4"} opacity-40 hover:opacity-100 transition-opacity cursor-pointer`}
          >
             <div className={`${isGridView ? "w-full aspect-square mb-3" : "w-16 h-16"} bg-[#1a1a1a] border-2 border-dashed border-white/5 rounded-lg flex items-center justify-center`}>
                <Plus className="w-8 h-8 text-gray-600" />
             </div>
             <div className="flex-1">
                <p className={`font-bold ${isGridView ? "text-sm" : "text-base"}`}>Add items</p>
                {!isGridView && <p className="text-gray-500 text-xs font-medium">Customize your collection</p>}
             </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* FLOATING ACTION BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCreatePlaylist}
        className="fixed bottom-24 right-6 w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-black shadow-2xl shadow-emerald-500/40 z-40"
      >
        <Plus className="w-8 h-8 stroke-[3]" />
      </motion.button>
    </div>
  );
};

export default MobileLibrary;
