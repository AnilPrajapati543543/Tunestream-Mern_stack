import React, { useState, useEffect, useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import API from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Music, Users, ShieldCheck, Heart } from 'lucide-react';
import { toast } from 'react-toastify';

const ArtistProfileModal = () => {
  const { 
    artistProfileOpen, 
    setArtistProfileOpen, 
    activeArtistName, 
    playWithId,
    likedSongs,
    toggleLikeSong
  } = useContext(PlayerContext);

  const [artistData, setArtistData] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (artistProfileOpen && activeArtistName) {
      const fetchArtistProfile = async () => {
        setLoading(true);
        try {
          const res = await API.get(`/user/artist/${encodeURIComponent(activeArtistName)}`);
          if (res.data.success) {
            setArtistData(res.data.artist);
            setSongs(res.data.songs);
          }
        } catch (error) {
          toast.error("Failed to load artist profile");
        } finally {
          setLoading(false);
        }
      };
      fetchArtistProfile();
    }
  }, [artistProfileOpen, activeArtistName]);

  if (!artistProfileOpen) return null;

  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <AnimatePresence>
      {artistProfileOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setArtistProfileOpen(false)}
            className="absolute inset-0 bg-black/85 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-2xl bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.85)] flex flex-col max-h-[85vh] text-white"
          >
            {loading ? (
              <div className="h-[400px] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-emerald-500 uppercase tracking-widest animate-pulse">Loading Stage Profile...</p>
              </div>
            ) : (
              artistData && (
                <>
                  {/* Hero Banner Header */}
                  <div className="relative h-64 md:h-72 w-full overflow-hidden flex-shrink-0 flex items-end p-6 md:p-8 select-none">
                    {/* Immersive background art wash */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-35 scale-110 z-0 pointer-events-none"
                      style={{ backgroundImage: `url(${artistData.artistImage || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=60"})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-black/40 to-transparent z-10" />

                    {/* Close button */}
                    <button
                      onClick={() => setArtistProfileOpen(false)}
                      className="absolute top-6 right-6 p-2.5 rounded-full bg-black/40 hover:bg-white/10 text-gray-400 hover:text-white transition-all active:scale-90 z-20"
                    >
                      <X size={18} />
                    </button>

                    {/* Content inside banner */}
                    <div className="relative z-20 flex items-center gap-5 md:gap-6 w-full">
                      <img 
                        src={artistData.artistImage || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=60"}
                        className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover border-2 border-emerald-500 shadow-2xl flex-shrink-0"
                        alt={artistData.name}
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=60";
                        }}
                      />
                      <div className="min-w-0">
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full select-none mb-2">
                          <ShieldCheck size={12} className="stroke-[3]" />
                          Verified Artist
                        </span>
                        <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight truncate leading-tight drop-shadow-md">
                          {artistData.name}
                        </h1>

                        {/* Banner Quick Stats */}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Users size={14} className="text-emerald-500" />
                            <b className="text-white font-black">{formatNumber(artistData.monthlyListeners)}</b> listeners
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body Content (Scrollable) */}
                  <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-8 space-y-6 custom-scrollbar">
                    
                    {/* Biography */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 md:p-6 shadow-inner">
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">Biography</h3>
                      <p className="text-sm text-gray-300 leading-relaxed font-normal whitespace-pre-line">
                        {artistData.artistBio || "No biography provided by this artist."}
                      </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#121212] border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-20 shadow-md">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Listeners (Monthly)</span>
                        <span className="text-xl font-black text-white tracking-tight">{formatNumber(artistData.monthlyListeners)}</span>
                      </div>
                      <div className="bg-[#121212] border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-20 shadow-md">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Followers</span>
                        <span className="text-xl font-black text-emerald-400 tracking-tight">{formatNumber(artistData.followersCount)}</span>
                      </div>
                    </div>

                    {/* popular Songs shelf */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Popular Tracks ({songs.length})</h3>
                      <div className="space-y-2">
                        {songs.map((song, index) => (
                          <motion.div
                            key={song._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.04 }}
                            onClick={() => playWithId(song._id, songs)}
                            className="group flex items-center justify-between p-3 bg-white/[0.02] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/20 rounded-2xl cursor-pointer transition-all active:scale-[0.99]"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <span className="text-xs text-gray-500 group-hover:text-emerald-400 font-black min-w-[16px] text-center">
                                {index + 1}
                              </span>
                              <img 
                                src={song.image} 
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform" 
                                alt={song.name} 
                              />
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                                  {song.name}
                                </h4>
                                <p className="text-[10px] text-gray-500 mt-0.5 truncate uppercase tracking-tighter">
                                  {song.album || "Single"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Like button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleLikeSong(song._id);
                                }}
                                className="p-1.5 rounded-full hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Heart 
                                  size={14} 
                                  fill={likedSongs.includes(song._id) ? "#10b981" : "none"} 
                                  stroke={likedSongs.includes(song._id) ? "#10b981" : "currentColor"} 
                                  className={likedSongs.includes(song._id) ? "text-emerald-500" : "text-gray-400"}
                                />
                              </button>
                              <div className="w-7 h-7 rounded-full bg-emerald-500 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md group-hover:scale-105 active:scale-95">
                                <Play size={10} fill="currentColor" className="ml-[1px]" />
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        {songs.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-10 opacity-30">
                            <Music size={32} className="mb-2" />
                            <p className="text-xs font-medium">No popular tracks found for this artist</p>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Footer */}
                  <div className="p-6 md:p-8 pt-0 flex-shrink-0 text-center border-t border-white/5 bg-[#0a0a0a]">
                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.25em]">TuneStream Immersive Artist Network</p>
                  </div>
                </>
              )
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ArtistProfileModal;
