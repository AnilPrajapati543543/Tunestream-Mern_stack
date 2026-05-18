import React, { useContext } from 'react';
import Navbar from './Navbar';
import { PlayerContext } from '../context/PlayerContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Trash2, ListMusic, Music, Volume2, Sparkles, Pause } from 'lucide-react';
import { toast } from 'react-toastify';
import { TrackRowsSkeleton } from './SkeletonLoaders';

const DisplayQueue = () => {
  const {
    track: currentSong,
    playQueue,
    playWithId,
    playStatus,
    removeFromQueue,
    play,
    pause,
    loading
  } = useContext(PlayerContext);

  // Find index of currently playing song
  const currentIndex = currentSong ? playQueue.findIndex(s => s._id === currentSong._id) : -1;

  // Filter next songs in queue
  const nextSongs = currentIndex !== -1 ? playQueue.slice(currentIndex + 1) : playQueue;

  const handlePlaySong = (songId) => {
    playWithId(songId, playQueue);
  };

  const handleRemove = (e, songId) => {
    e.stopPropagation();
    removeFromQueue(songId);
    toast.info("Removed song from active queue");
  };

  if (loading) {
    return (
      <div className='text-white pb-32 min-h-screen relative bg-gradient-to-b from-[#193220] via-[#121212] to-[#121212] p-6 md:p-10 space-y-10'>
        <Navbar />
        <div className='flex items-center gap-4 mb-8 mt-4 animate-pulse'>
          <div className='w-14 h-14 bg-white/10 rounded-xl' />
          <div className='space-y-2'>
            <div className='h-6 bg-white/10 rounded-full w-48' />
            <div className='h-3 bg-white/5 rounded-full w-32' />
          </div>
        </div>
        <TrackRowsSkeleton />
      </div>
    );
  }

  return (
    <div className='text-white pb-32 min-h-screen relative overflow-hidden bg-gradient-to-b from-[#193220] via-[#121212] to-[#121212]'>
      <Navbar />

      <div className='px-3 md:px-6 pt-6 md:pt-10 relative z-10'>
        {/* PAGE HEADER */}
        <div className='flex items-center gap-4 mb-8 mt-4'>
          <div className='w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center shadow-xl shadow-emerald-500/20'>
            <ListMusic size={28} className='text-black' />
          </div>
          <div>
            <h1 className='text-2xl md:text-4xl font-black tracking-tight'>Play Queue</h1>
            <p className='text-xs text-gray-400 font-medium mt-1 uppercase tracking-wider'>
              Manage your active session stream
            </p>
          </div>
        </div>

        {/* NOW PLAYING SECTION */}
        <div className='mb-10'>
          <h2 className='text-sm font-bold text-gray-400 uppercase tracking-widest mb-4'>
            Now playing
          </h2>

          {currentSong ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => playStatus ? pause() : play()}
              className='flex items-center justify-between p-3 md:p-4 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-md relative overflow-hidden group cursor-pointer transition'
            >
              <div className='flex items-center gap-4 min-w-0 z-10'>
                <div className='relative flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden shadow-lg shadow-black/40 border border-white/10'>
                  <img src={currentSong.image} className='w-full h-full object-cover' alt="" />
                  
                  {playStatus && (
                    <div className='absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center gap-1.5'>
                      <div className="w-[3px] h-6 bg-emerald-400 animate-bounce" style={{ animationDuration: '0.6s' }} />
                      <div className="w-[3px] h-4 bg-emerald-400 animate-bounce" style={{ animationDuration: '0.4s' }} />
                      <div className="w-[3px] h-5 bg-emerald-400 animate-bounce" style={{ animationDuration: '0.5s' }} />
                    </div>
                  )}
                </div>

                <div className='min-w-0'>
                  <h3 className='text-base md:text-lg font-black text-white truncate tracking-tight group-hover:text-emerald-400 transition-colors'>
                    {currentSong.name}
                  </h3>
                  <p className='text-xs md:text-sm text-gray-300 truncate mt-0.5 opacity-90 font-medium'>
                    {currentSong.desc || "No details available"}
                  </p>
                </div>
              </div>

              {/* Aesthetic visual track info */}
              <div className='flex items-center gap-6 text-xs text-gray-400 z-10 pr-2'>
                <p className='truncate font-medium max-w-[150px] hidden md:block'>{currentSong.album || 'Tunestream Single'}</p>
                
                <div className={`flex items-center gap-1.5 px-3 py-1 border rounded-full font-bold uppercase tracking-wider text-[9px] transition-colors
                  ${playStatus 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : "bg-white/5 border-white/10 text-gray-400"}`}
                >
                  <Volume2 size={10} className={playStatus ? 'animate-pulse' : ''} />
                  <span>{playStatus ? 'Playing' : 'Paused'}</span>
                </div>

                <p className='font-mono font-bold hidden sm:block'>{currentSong.duration}</p>

                {/* Big premium play/pause toggle button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playStatus ? pause() : play();
                  }}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-lg transition"
                >
                  {playStatus ? (
                    <Pause size={18} fill="black" className="text-black" />
                  ) : (
                    <Play size={18} fill="black" className="text-black ml-[2px]" />
                  )}
                </button>
              </div>

              {/* Glowing mesh background */}
              <div className='absolute right-0 top-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none' />
            </motion.div>
          ) : (
            <p className='text-gray-400 p-6 bg-[#181818] rounded-xl border border-white/5 text-center'>
              No song is currently active.
            </p>
          )}
        </div>

        {/* NEXT UP SECTION */}
        <div>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-sm font-bold text-gray-400 uppercase tracking-widest'>
              Next Up
            </h2>
            {nextSongs.length > 0 && (
              <span className='text-xs font-semibold text-gray-500 uppercase tracking-widest'>
                {nextSongs.length} tracks remaining
              </span>
            )}
          </div>

          <div className='space-y-1.5'>
            {nextSongs.length === 0 ? (
              <p className='text-gray-500 p-8 bg-[#181818]/40 border border-white/5 rounded-2xl text-center text-sm font-medium'>
                Your play queue is empty. Tracks will play dynamically from your collection!
              </p>
            ) : (
              <AnimatePresence>
                {nextSongs.map((item, index) => {
                  return (
                    <motion.div
                      key={`${item._id}-${index}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handlePlaySong(item._id)}
                      className='flex items-center justify-between p-3 bg-[#181818]/60 hover:bg-white/5 rounded-xl border border-white/5 transition-all duration-200 cursor-pointer group shadow-sm'
                    >
                      <div className='flex items-center gap-4 min-w-0'>
                        {/* Interactive Play / Number indicator */}
                        <div className='w-6 flex items-center justify-center flex-shrink-0'>
                          <span className='text-xs font-bold text-gray-500 group-hover:hidden'>
                            {index + 1}
                          </span>
                          <div className="hidden group-hover:flex w-6 h-6 rounded-full bg-emerald-500 hover:bg-emerald-400 items-center justify-center shadow-lg transition active:scale-90">
                            <Play size={10} fill="black" className="text-black ml-[1px]" />
                          </div>
                        </div>

                        {/* Image & details */}
                        <img 
                          src={item.image} 
                          className='w-11 h-11 rounded-lg object-cover flex-shrink-0 shadow shadow-black/20 border border-white/5' 
                          alt="" 
                        />

                        <div className='min-w-0'>
                          <p className='text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate'>
                            {item.name}
                          </p>
                          <p className='text-xs text-gray-400 truncate mt-0.5 font-medium'>
                            {item.desc || "Track details"}
                          </p>
                        </div>
                      </div>

                      {/* Right controls */}
                      <div className='flex items-center gap-5 pr-2'>
                        <span className='text-xs text-gray-500 hidden sm:block truncate max-w-[120px] font-medium'>
                          {item.album || 'Tunestream Single'}
                        </span>
                        
                        <span className='text-xs text-gray-400 font-mono font-semibold hidden sm:block'>
                          {item.duration}
                        </span>

                        {/* Trash remove on hover */}
                        <button
                          onClick={(e) => handleRemove(e, item._id)}
                          className='opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition flex-shrink-0'
                          title="Remove from queue"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DisplayQueue;
