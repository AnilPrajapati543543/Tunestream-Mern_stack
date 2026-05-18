import React, { useContext } from 'react';
import Navbar from './Navbar';
import { PlayerContext } from '../context/PlayerContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Play, Clock, Sparkles } from 'lucide-react';
import { assets } from '../assets/assets.js';
import { toast } from 'react-toastify';
import { AlbumHeaderSkeleton, TrackRowsSkeleton } from './SkeletonLoaders';

const DisplayLiked = () => {
  const {
    songsData,
    likedSongs,
    toggleLikeSong,
    playWithId,
    track: currentSong,
    playStatus,
    loading
  } = useContext(PlayerContext);

  // Filter songs that are currently liked
  const favoriteSongs = songsData.filter(song => likedSongs.includes(song._id));

  const handlePlayLiked = (songId) => {
    playWithId(songId, favoriteSongs);
  };

  const handleUnlike = (e, songId) => {
    e.stopPropagation();
    toggleLikeSong(songId);
    toast.info("Removed from Liked Songs");
  };

  if (loading) {
    return (
      <div className='text-white pb-32 min-h-screen relative bg-gradient-to-b from-[#1b1e36] via-[#121212] to-[#121212] p-6 md:p-10 space-y-10'>
        <AlbumHeaderSkeleton />
        <TrackRowsSkeleton />
      </div>
    );
  }

  return (
    <div className='text-white pb-32 min-h-screen relative bg-gradient-to-b from-[#1b1e36] via-[#121212] to-[#121212]'>
      <Navbar />

      {/* HEADER BANNER */}
      <div 
        className='relative px-4 md:px-6 pt-10 md:pt-16 pb-6 md:pb-8 bg-gradient-to-b from-[#4f46e5]/40 to-[#121212]'
      >
        <div className='flex flex-col md:flex-row items-end gap-6 relative z-10'>
          {/* Big Purple Heart Badge */}
          <div className='w-28 h-28 md:w-40 md:h-40 bg-gradient-to-br from-[#4f46e5] via-[#6366f1] to-[#818cf8] rounded-2xl shadow-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden group border border-white/10'>
            <Heart size={48} fill="white" className='text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] group-hover:scale-110 transition duration-500 md:w-[72px] md:h-[72px]' />
            <div className='absolute -right-6 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-xl' />
          </div>

          <div className='flex-1'>
            <p className='text-[10px] md:text-xs text-[#a5b4fc] font-black uppercase tracking-widest'>
              Playlist
            </p>
            <h1 className='text-2xl md:text-7xl font-black leading-tight mt-1 md:mt-2 mb-2 md:mb-3 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent'>
              Liked Songs
            </h1>
            
            <div className='flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-400 font-medium'>
              <div className='flex items-center gap-1.5'>
                <img className='w-4 md:w-5 shadow' src={assets.tunestream_logo} alt="logo" />
                <span className='text-white font-bold'>TuneStream</span>
              </div>
              <span>•</span>
              <span className='text-indigo-300 font-bold'>{favoriteSongs.length} songs</span>
            </div>
          </div>
        </div>
      </div>

      {/* SONGS GRID LIST */}
      <div className='px-3 md:px-6 mt-4 md:mt-6'>
        
        {/* TABLE HEADERS */}
        <div className='grid grid-cols-3 md:grid-cols-4 mt-4 md:mt-6 mb-3 md:mb-4 px-2 md:px-3 text-gray-400 text-[10px] uppercase font-bold tracking-widest border-b border-white/5 pb-3'>
          <p className="col-span-3 sm:col-span-1"><b className='mr-4'>#</b>Title</p>
          <p className="hidden sm:block">Album</p>
          <p className='hidden sm:block'>Date Liked</p>
          <div className="flex justify-end pr-4">
             <Clock size={14} className="opacity-50" />
          </div>
        </div>

        {favoriteSongs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='text-center py-20 bg-[#181818]/30 border border-white/5 rounded-2xl p-6 mt-4 backdrop-blur-sm'
          >
            <Heart size={44} className='mx-auto text-indigo-400/30 mb-4 animate-pulse' />
            <h3 className='text-lg font-bold text-white mb-1'>Songs you like will appear here</h3>
            <p className='text-xs text-gray-400 max-w-sm mx-auto leading-relaxed mt-2'>
              Save songs by clicking the heart icon on any player, album page, or playlist.
            </p>
          </motion.div>
        ) : (
          <div className='mt-2 space-y-1'>
            <AnimatePresence>
              {favoriteSongs.map((item, index) => {
                const isPlaying = currentSong?._id === item._id;

                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => handlePlayLiked(item._id)}
                    className={`
                      grid grid-cols-3 md:grid-cols-4 gap-1 md:gap-2 p-2 md:p-3 items-center rounded-xl cursor-pointer transition-all duration-200 group
                      ${isPlaying ? "bg-white/10 shadow-lg shadow-black/10 border border-white/5" : "hover:bg-white/5"}
                    `}
                  >
                    {/* Title Column */}
                    <div className='flex items-center col-span-3 sm:col-span-1 overflow-hidden'>
                      <div className='mr-4 w-4 text-gray-500 font-bold text-xs flex items-center justify-center flex-shrink-0'>
                        <span className='group-hover:hidden'>
                          {index + 1}
                        </span>
                        <Play size={10} className='hidden group-hover:block text-emerald-400 fill-emerald-400 scale-125' />
                      </div>

                      <div className='relative flex-shrink-0 shadow shadow-black/40 rounded-lg overflow-hidden border border-white/5 mr-4'>
                        <img
                          className='w-10 h-10 object-cover'
                          src={item.image}
                          alt=""
                        />
                      </div>

                      <div className="flex flex-col overflow-hidden">
                        <span className={`truncate font-bold text-sm ${isPlaying ? "text-emerald-400" : "text-white"}`}>
                          {item.name}
                        </span>
                        <span className="text-[10px] text-gray-500 truncate sm:hidden">
                          {item.desc || 'Unknown Artist'}
                        </span>
                      </div>
                    </div>

                    {/* Album Column */}
                    <p className='text-xs text-gray-400 truncate hidden sm:block font-medium'>
                      {item.album || 'Tunestream Single'}
                    </p>

                    {/* Date Liked Column */}
                    <p className='text-xs text-gray-500 hidden sm:block font-semibold'>
                      Just now
                    </p>

                    {/* Like heart indicator / Duration Column */}
                    <div className='text-xs text-gray-400 flex items-center justify-end gap-4 pr-4'>
                      <button 
                        onClick={(e) => handleUnlike(e, item._id)}
                        className='p-1 rounded-full text-indigo-400 hover:text-red-400 transition hover:scale-110'
                        title="Unlike Song"
                      >
                        <Heart size={14} fill="#10b981" className='text-emerald-500' />
                      </button>

                      <div className='w-10 text-right font-mono font-semibold'>
                        {isPlaying && playStatus ? (
                          <div className="flex gap-[2px] h-3 items-end justify-end">
                            <div className="w-[2px] h-full bg-emerald-500 animate-bounce" style={{ animationDuration: '0.6s' }} />
                            <div className="w-[2px] h-[60%] bg-emerald-500 animate-bounce" style={{ animationDuration: '0.4s' }} />
                            <div className="w-[2px] h-[80%] bg-emerald-500 animate-bounce" style={{ animationDuration: '0.5s' }} />
                          </div>
                        ) : (
                          item.duration
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayLiked;
