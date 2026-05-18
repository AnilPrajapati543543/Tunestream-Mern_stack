import React, { useContext, useEffect, useState } from 'react'
import Navbar from './Navbar'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets.js'
import { PlayerContext } from '../context/PlayerContext'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Plus, Trash2, Search, Check } from 'lucide-react'
import { toast } from 'react-toastify'
import { AlbumHeaderSkeleton, TrackRowsSkeleton } from './SkeletonLoaders'

const DisplayAlbum = ({ album }) => {

  const { id } = useParams()
  const [albumData, setAlbumData] = useState(null)
  const [bgColor, setBgColor] = useState('#121212')

  // Album virtualization states
  const [excludedIds, setExcludedIds] = useState(() => {
    try {
      const stored = localStorage.getItem(`tunestream_album_exclude_${id}`);
      return stored ? JSON.parse(stored) : [];
    } catch (_) { return []; }
  });

  const [addedIds, setAddedIds] = useState(() => {
    try {
      const stored = localStorage.getItem(`tunestream_album_add_${id}`);
      return stored ? JSON.parse(stored) : [];
    } catch (_) { return []; }
  });

  const [searchQuery, setSearchQuery] = useState("");

  const handleRemoveTrack = (e, songId) => {
    e.stopPropagation();
    const nextExcluded = [...excludedIds, songId];
    setExcludedIds(nextExcluded);
    localStorage.setItem(`tunestream_album_exclude_${id}`, JSON.stringify(nextExcluded));
    
    // Also clean up from added if it was virtually added
    if (addedIds.includes(songId)) {
      const nextAdded = addedIds.filter(x => x !== songId);
      setAddedIds(nextAdded);
      localStorage.setItem(`tunestream_album_add_${id}`, JSON.stringify(nextAdded));
    }
    toast.success("Song virtually removed from album");
  };

  const handleAddTrack = (songId) => {
    const nextAdded = [...addedIds, songId];
    setAddedIds(nextAdded);
    localStorage.setItem(`tunestream_album_add_${id}`, JSON.stringify(nextAdded));

    // Also clean up from excluded if it was virtually excluded
    if (excludedIds.includes(songId)) {
      const nextExcluded = excludedIds.filter(x => x !== songId);
      setExcludedIds(nextExcluded);
      localStorage.setItem(`tunestream_album_exclude_${id}`, JSON.stringify(nextExcluded));
    }
    toast.success("Song added to album!");
  };

  const { playWithId, albumsData, songsData, track: currentSong, playStatus } = useContext(PlayerContext)

  useEffect(() => {
    if (albumsData.length > 0) {
      const found = albumsData.find(item => item._id === id)
      setAlbumData(found)
    }
  }, [id, albumsData])

  useEffect(() => {
    if (!albumData?.image) return

    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      canvas.width = img.width
      canvas.height = img.height

      ctx.drawImage(img, 0, 0)

      const data = ctx.getImageData(0, 0, 1, 1).data
      const color = `rgb(${data[0]}, ${data[1]}, ${data[2]})`

      setBgColor(color)
    }

    img.onerror = () => {
      setBgColor('#121212')
    }

    img.src = albumData.image
  }, [albumData])

  const { scrollY } = useScroll()

  const headerOpacity = useTransform(scrollY, [0, 200], [0, 1])
  const titleOpacity = useTransform(scrollY, [0, 150], [1, 0])
  const imageScale = useTransform(scrollY, [0, 200], [1, 0.8])
  const imageY = useTransform(scrollY, [0, 200], [0, -30])

  if (!albumData) {
    return (
      <div className="p-6 md:p-10 space-y-10">
        <AlbumHeaderSkeleton />
        <TrackRowsSkeleton />
      </div>
    );
  }

  return (
    <div className='text-white pb-32'>

      {/*Navbar Background on Scroll */}
      <motion.div
        style={{ opacity: headerOpacity }}
        className='fixed top-0 left-0 w-full h-20 bg-[#121212] z-20'
      />

      <Navbar />

      {/* HEADER */}
      <div
        className='relative px-4 md:px-6 pt-10 md:pt-20 pb-6 md:pb-10'
        style={{
          background: `linear-gradient(to bottom, ${bgColor}, #121212)`
        }}
      >
        <div className='flex flex-col items-center md:items-end md:flex-row gap-4 md:gap-6'>

          {/* Album Image */}
          <motion.img
            style={{ scale: imageScale, y: imageY }}
            className='w-32 md:w-44 rounded-lg shadow-2xl'
            src={albumData.image}
            alt=""
          />

          {/* Text */}
          <motion.div style={{ opacity: titleOpacity }} className='flex-1'>
            <p className='text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-widest'>Album</p>

            <h2 className='text-2xl md:text-7xl font-black leading-tight mt-1 md:mt-2 mb-1 md:mb-2 text-center md:text-left'>
              {albumData.name}
            </h2>

            <p className='text-gray-400 text-xs md:text-sm mt-1 max-w-[500px] line-clamp-2 md:line-clamp-none text-center md:text-left'>
              {albumData.desc}
            </p>

            <div className='mt-4 flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-400'>
              <div className='flex items-center gap-1'>
                <img className='w-4 md:w-5' src={assets.tunestream_logo} alt="" />
                <span className='text-white font-bold'>TuneStream</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <span>1.3M likes</span>
              <span className="hidden sm:inline">•</span>
              <span className='font-medium text-white'>10 songs</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* TABLE HEADER */}
      <div className='grid grid-cols-3 md:grid-cols-4 mt-4 md:mt-6 mb-3 md:mb-4 px-4 md:px-6 text-gray-400 text-[10px] uppercase font-bold tracking-widest'>
        <p className="col-span-2 sm:col-span-1"><b className='mr-4'>#</b>Title</p>
        <p className="hidden sm:block">Album</p>
        <p className='hidden sm:block'>Date Added</p>
        <div className="flex justify-end pr-4">
           <img className='w-4 opacity-50' src={assets.clock_icon} alt="" />
        </div>
      </div>

      <hr className='border-gray-700 mx-4 md:mx-6' />      {/* SONG LIST */}
      <div className='px-2 md:px-4 mt-2'>
        {(() => {
          const albumSongs = songsData
            .filter((item) => (item.album === albumData.name || addedIds.includes(item._id)) && !excludedIds.includes(item._id));

          if (albumSongs.length === 0) {
            return <p className="text-gray-400 p-8 text-center text-sm font-medium">No songs in this album.</p>;
          }

          return (
            <>
              {albumSongs.map((item, index) => {
                const isPlaying = currentSong?._id === item._id;

                return (
                  <motion.div
                    key={item._id}
                    onClick={() => playWithId(item._id, albumSongs)}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`
                      grid grid-cols-3 md:grid-cols-4 gap-1 md:gap-2 p-2 md:p-3 items-center rounded-xl cursor-pointer transition-all group
                      ${isPlaying
                        ? "bg-white/10 shadow-lg"
                        : "hover:bg-white/5"}
                    `}
                  >
                    {/* Title */}
                    <div className='flex items-center col-span-2 md:col-span-1 overflow-hidden'>
                      <span className='mr-4 w-4 text-gray-500 font-bold text-xs hidden sm:inline'>
                        {index + 1}
                      </span>

                      <div className='relative flex-shrink-0'>
                        <img
                          className='w-10 h-10 rounded-md mr-4 object-cover shadow-md'
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

                    <p className='text-xs text-gray-400 truncate hidden sm:block'>{albumData.name}</p>

                    <p className='text-xs text-gray-500 hidden sm:block'>5 days ago</p>

                    <div className='text-xs text-gray-400 flex items-center justify-end gap-3 pr-4'>
                      {/* Remove song from Album button */}
                      <button
                        onClick={(e) => handleRemoveTrack(e, item._id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition flex-shrink-0"
                        title="Remove from album"
                      >
                        <Trash2 size={13} />
                      </button>

                      <div className="w-10 text-right">
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

              {/* ── ADD SONGS RECOMMENDATIONS DRAWER ── */}
              <div className='mt-12 pt-8 border-t border-white/5'>
                <div className='mb-6'>
                  <h3 className='text-xl font-black text-white'>Let's add some songs to your album</h3>
                  <p className='text-xs text-gray-400 font-medium mt-1 uppercase tracking-wider'>Search and expand your customized album layout</p>
                </div>

                {/* Search Input Box */}
                <div className='relative w-full max-w-md mb-6'>
                  <Search size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500' />
                  <input 
                    type="text"
                    placeholder="Search for available songs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full bg-[#181818] border border-white/5 rounded-full pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-gray-500'
                  />
                </div>

                {/* Recommended list */}
                <div className='space-y-1.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-2'>
                  {(() => {
                    const albumSongIds = albumSongs.map(s => s._id);
                    const availableSongs = songsData
                      .filter(song => !albumSongIds.includes(song._id) && song.name.toLowerCase().includes(searchQuery.toLowerCase()));

                    if (availableSongs.length === 0) {
                      return <p className='text-xs text-gray-500 italic p-4'>No matching songs found in Tunestream library.</p>;
                    }

                    return availableSongs.map(song => (
                      <div 
                        key={song._id}
                        className='flex items-center justify-between p-2.5 bg-[#181818]/40 hover:bg-[#181818]/80 border border-white/5 rounded-xl transition duration-150'
                      >
                        <div className='flex items-center gap-3 min-w-0'>
                          <img src={song.image} className='w-9 h-9 rounded object-cover flex-shrink-0' />
                          <div className='min-w-0'>
                            <p className='text-xs font-bold text-white truncate'>{song.name}</p>
                            <p className='text-[10px] text-gray-400 truncate mt-0.5'>{song.desc || 'Available Track'}</p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleAddTrack(song._id)}
                          className='flex items-center gap-1.5 px-4 py-1.5 bg-[#282828] hover:bg-[#333] border border-white/10 text-white rounded-full text-xs font-black transition active:scale-95'
                        >
                          <Plus size={12} className='text-emerald-400' />
                          <span>Add</span>
                        </button>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  )
}

export default DisplayAlbum