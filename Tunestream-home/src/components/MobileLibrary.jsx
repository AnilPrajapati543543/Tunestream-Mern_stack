import React, { useContext, useState, useMemo } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Plus, 
  ArrowUpDown, 
  LayoutGrid, 
  List, 
  Heart,
  Music2,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MobileLibrary = () => {
  const { songsData, albumsData, playlists, track, playWithId } = useContext(PlayerContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState("All");
  const [isGridView, setIsGridView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filters = ["All", "Playlists", "Albums", "Artists"];

  const libraryItems = useMemo(() => {
    let items = [];
    
    // Add Liked Songs Placeholder
    items.push({
      id: "liked",
      name: "Liked Songs",
      desc: "Playlist • 48 songs",
      image: "https://misc.scdn.co/happier-than-ever-gradient.png",
      type: "Playlist",
      isLiked: true
    });

    // Add Playlists
    playlists.forEach(p => items.push({
      id: p._id,
      name: p.name,
      desc: `Playlist • ${p.songs.length} songs`,
      image: null,
      type: "Playlist"
    }));

    // Add Albums
    albumsData.forEach(a => items.push({
      id: a._id,
      name: a.name,
      desc: `Album • ${a.desc}`,
      image: a.image,
      type: "Album"
    }));

    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (activeFilter === "All" || item.type === activeFilter)
    );
  }, [playlists, albumsData, searchQuery, activeFilter]);

  return (
    <div className="flex flex-col h-full bg-[#121212] text-white">
      {/* HEADER */}
      <div className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-black shadow-lg">
              {user?.name?.[0] || "T"}
            </div>
            <h1 className="text-2xl font-black tracking-tight">Your Library</h1>
          </div>
          <div className="flex items-center gap-4">
            <Search className="w-6 h-6 text-gray-400" />
            <Plus className="w-7 h-7 text-gray-400" />
          </div>
        </div>

        {/* FILTER CHIPS */}
        <div className="flex gap-2 overflow-x-auto pb-4 spotify-scroll">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap
                ${activeFilter === filter 
                  ? "bg-emerald-500 text-black" 
                  : "bg-white/10 text-white hover:bg-white/20"}
              `}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="px-4 py-2 flex items-center justify-between text-gray-400">
        <button className="flex items-center gap-1.5 text-xs font-bold hover:text-white transition-colors">
          <ArrowUpDown className="w-4 h-4" />
          Recents
        </button>
        <button 
          onClick={() => setIsGridView(!isGridView)}
          className="p-1.5 hover:text-white transition-colors"
        >
          {isGridView ? <List className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
        </button>
      </div>

      {/* CONTENT */}
      <div className={`flex-1 overflow-y-auto px-4 pb-32 pt-2 ${isGridView ? "grid grid-cols-2 gap-4" : "space-y-4"}`}>
        <AnimatePresence mode="popLayout">
          {libraryItems.map((item, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              key={item.id}
              onClick={() => item.type === "Album" ? navigate(`/album/${item.id}`) : navigate(`/playlist/${item.id}`)}
              className={`group flex ${isGridView ? "flex-col" : "items-center gap-3"} cursor-pointer`}
            >
              <div className={`relative flex-shrink-0 ${isGridView ? "w-full aspect-square mb-2" : "w-16 h-16"} rounded-lg overflow-hidden shadow-xl`}>
                {item.image ? (
                  <img src={item.image} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${item.isLiked ? "bg-gradient-to-br from-indigo-700 via-purple-700 to-emerald-400" : "bg-[#282828]"}`}>
                    {item.isLiked ? <Heart className="w-8 h-8 fill-white" /> : <Music2 className="w-8 h-8 text-gray-500" />}
                  </div>
                )}
                
                {track?.album === item.name && (
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                     <div className="flex gap-[2px] h-4 items-end">
                        <div className="w-[3px] h-full bg-emerald-500 animate-bounce" style={{animationDuration: '0.6s'}} />
                        <div className="w-[3px] h-[60%] bg-emerald-500 animate-bounce" style={{animationDuration: '0.4s'}} />
                        <div className="w-[3px] h-[80%] bg-emerald-500 animate-bounce" style={{animationDuration: '0.5s'}} />
                     </div>
                   </div>
                )}
              </div>

              <div className="flex-1 overflow-hidden">
                <p className={`font-bold truncate ${isGridView ? "text-sm" : "text-base"} ${track?.album === item.name ? "text-emerald-400" : "text-white"}`}>
                  {item.name}
                </p>
                <p className={`text-gray-400 truncate ${isGridView ? "text-xs" : "text-sm"}`}>
                  {item.desc}
                </p>
              </div>

              {!isGridView && <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-gray-400 transition-colors" />}
            </motion.div>
          ))}
          
          {/* Add Item Card */}
          <motion.div
            layout
            className={`flex ${isGridView ? "flex-col" : "items-center gap-3"} cursor-pointer opacity-60 hover:opacity-100 transition-opacity`}
          >
             <div className={`${isGridView ? "w-full aspect-square mb-2" : "w-16 h-16"} bg-[#1a1a1a] border-2 border-dashed border-white/5 rounded-lg flex items-center justify-center`}>
                <Plus className="w-8 h-8 text-gray-500" />
             </div>
             <div className="flex-1">
                <p className={`font-bold ${isGridView ? "text-sm" : "text-base"}`}>Add artists</p>
                {!isGridView && <p className="text-gray-400 text-sm">Follow your favorites</p>}
             </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MobileLibrary;
