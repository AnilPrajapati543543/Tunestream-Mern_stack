import React, { useContext, useEffect, useState } from 'react'
import Navbar from './Navbar'
import { useParams, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets.js'
import { PlayerContext } from '../context/PlayerContext'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Plus, Search, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import API from '../api/axios'
import { AlbumHeaderSkeleton, TrackRowsSkeleton } from './SkeletonLoaders'

const DisplayPlaylist = () => {

  const { id } = useParams()
  const navigate = useNavigate()
  const [playlistData, setPlaylistData] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [removingId, setRemovingId] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const { playWithId, playlists, setPlaylists, songsData, track: currentSong, playStatus } = useContext(PlayerContext)

  const handleAddSong = async (songId) => {
    try {
      const res = await API.post('/playlist/add-song', { playlistId: id, songId })
      if (res.data.success) {
        setPlaylists(prev =>
          prev.map(p => p._id === id ? res.data.playlist : p)
        )
        toast.success("Song added to playlist!")
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add song")
    }
  }

  // Keep local playlist in sync with context
  useEffect(() => {
    if (playlists.length > 0) {
      const found = playlists.find(item => item._id === id)
      setPlaylistData(found || null)
    }
  }, [id, playlists])

  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 200], [0, 1])
  const titleOpacity  = useTransform(scrollY, [0, 150], [1, 0])

  // ── Get full song objects for this playlist ──────────────────────────────
  const playlistSongs = playlistData
    ? songsData.filter(s =>
        playlistData.songs.some(idObj =>
          (typeof idObj === 'object' && idObj !== null ? idObj._id : idObj) === s._id
        )
      )
    : []

  // ── DELETE PLAYLIST ──────────────────────────────────────────────────────
  const handleDeletePlaylist = async () => {
    setDeleting(true)
    try {
      const res = await API.delete(`/playlist/${id}`)
      if (res.data.success) {
        setPlaylists(prev => prev.filter(p => p._id !== id))
        toast.success('Playlist deleted')
        navigate('/')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete playlist')
    } finally {
      setDeleting(false)
      setShowConfirm(false)
    }
  }

  // ── REMOVE SONG FROM PLAYLIST ───────────────────────────────────────────
  const handleRemoveSong = async (e, songId) => {
    e.stopPropagation()
    setRemovingId(songId)
    try {
      const res = await API.post('/playlist/remove-song', { playlistId: id, songId })
      if (res.data.success) {
        // Update context so sidebar + this page stay in sync
        setPlaylists(prev =>
          prev.map(p => p._id === id ? res.data.playlist : p)
        )
        toast.success('Song removed from playlist')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove song')
    } finally {
      setRemovingId(null)
    }
  }

  if (!playlistData) {
    return (
      <div className="p-6 md:p-10 space-y-10">
        <AlbumHeaderSkeleton />
        <TrackRowsSkeleton />
      </div>
    );
  }

  return (
    <div className='text-white pb-32'>

      {/* Scrolled navbar backdrop */}
      <motion.div
        style={{ opacity: headerOpacity }}
        className='fixed top-0 left-0 w-full h-20 bg-[#121212] z-20'
      />

      <Navbar />

      {/* ── HEADER ── */}
      <div
        className='relative px-4 md:px-6 pt-10 md:pt-20 pb-6 md:pb-10'
        style={{ background: `linear-gradient(to bottom, #166230, #121212)` }}
      >
        <div className='flex flex-col items-center md:items-end md:flex-row gap-4 md:gap-6'>

          <div className='w-32 h-32 md:w-44 md:h-44 bg-emerald-600 rounded-lg shadow-2xl flex items-center justify-center flex-shrink-0'>
            <span className='text-4xl md:text-6xl'>🎶</span>
          </div>

          <motion.div style={{ opacity: titleOpacity }} className='flex-1'>
            <p className='text-sm text-gray-300'>Custom Playlist</p>

            <h2 className='text-2xl md:text-7xl font-bold leading-tight truncate text-center md:text-left'>
              {playlistData.name}
            </h2>

            <p className='mt-2 text-sm text-gray-400 flex items-center gap-1'>
              <img className='w-5' src={assets.tunestream_logo} alt="" />
              <span className='text-white font-semibold'>TuneStream</span>
              • {playlistSongs.length} songs
            </p>

            {/* ── DELETE PLAYLIST BUTTON ── */}
            <motion.button
              onClick={() => setShowConfirm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='mt-4 flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/40 text-red-400 hover:text-red-300 rounded-full text-sm font-medium transition-all'
            >
              <span>🗑</span> Delete Playlist
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* ── CONFIRM DELETE MODAL ── */}
      {showConfirm && (
        <div className='fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center'>
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className='bg-[#181818] border border-white/10 rounded-2xl p-8 max-w-sm w-[90%] shadow-2xl text-center'
          >
            <div className='text-4xl mb-4'>🗑️</div>
            <h3 className='text-xl font-bold text-white mb-2'>Delete Playlist?</h3>
            <p className='text-gray-400 text-sm mb-6'>
              "<span className='text-white font-semibold'>{playlistData.name}</span>" will be permanently deleted. This action cannot be undone.
            </p>
            <div className='flex gap-3 justify-center'>
              <button
                onClick={() => setShowConfirm(false)}
                className='px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition'
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePlaylist}
                disabled={deleting}
                className='px-5 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition disabled:opacity-50'
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── SONG TABLE HEADER ── */}
      <div className='grid grid-cols-4 mt-6 mb-4 px-6 text-gray-400 text-[10px] uppercase font-bold tracking-widest'>
        <p className="col-span-2 sm:col-span-1"><b className='mr-4'>#</b>Title</p>
        <p className="hidden sm:block">Album</p>
        <p className='hidden sm:block'>Date Added</p>
        <div className="flex justify-end pr-4">
           <span className="opacity-50">Duration</span>
        </div>
      </div>

      <hr className='border-gray-700 mx-6' />

      {/* ── SONG ROWS ── */}
      <div className='px-4 mt-2'>
        {playlistSongs.length === 0 ? (
          <p className="text-gray-400 p-8 text-center text-sm font-medium">No songs in this playlist yet. Use the recommender below to add some!</p>
        ) : (
          playlistSongs.map((item, index) => {
            const isPlaying  = currentSong?._id === item._id
            const isRemoving = removingId === item._id

            return (
              <motion.div
                key={item._id}
                onClick={() => playWithId(item._id, playlistSongs)}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.03 }}
                className={`
                  grid grid-cols-4 gap-2 p-3 items-center rounded-xl cursor-pointer transition-all group
                  ${isPlaying ? "bg-white/10 shadow-lg" : "hover:bg-white/5"}
                `}
              >
                {/* Title col */}
                <div className='flex items-center col-span-3 sm:col-span-1 overflow-hidden'>
                  <span className='mr-4 w-4 text-gray-500 font-bold text-xs hidden sm:inline'>{index + 1}</span>
                  <div className='relative flex-shrink-0'>
                    <img className='w-10 h-10 rounded mr-4 object-cover' src={item.image} alt="" />
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

                <p className='text-xs text-gray-400 truncate hidden sm:block'>{item.album || 'Unknown'}</p>

                <p className='text-xs text-gray-500 hidden sm:block font-semibold'>Just now</p>

                {/* Remove button and Duration col */}
                <div className='text-xs text-gray-400 flex items-center justify-end gap-3 pr-4'>
                  <motion.button
                    onClick={(e) => handleRemoveSong(e, item._id)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={isRemoving}
                    className='opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition flex-shrink-0'
                    title="Remove from playlist"
                  >
                    {isRemoving
                      ? <span className='text-xs animate-pulse'>…</span>
                      : <Trash2 size={13} />
                    }
                  </motion.button>

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
            )
          })
        )}

        {/* ── ADD SONGS RECOMMENDATIONS DRAWER ── */}
        <div className='mt-12 pt-8 border-t border-white/5'>
          <div className='mb-6'>
            <h3 className='text-xl font-black text-white'>Let's add some songs to your playlist</h3>
            <p className='text-xs text-gray-400 font-medium mt-1 uppercase tracking-wider'>Search and expand your customized playlist layout</p>
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
              const playlistSongIds = playlistSongs.map(s => s._id);
              const availableSongs = songsData
                .filter(song => !playlistSongIds.includes(song._id) && song.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
                    onClick={() => handleAddSong(song._id)}
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

      </div>
    </div>
  )
}

export default DisplayPlaylist
