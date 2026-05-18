import React, { useEffect, useState } from 'react'
import axios from "../../utils/axios";

import { toast } from 'react-toastify';
import { motion } from "framer-motion";


const ListSong = () => {

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/song/list");
      if (response.data.success) {
        setData(response.data.songs)
      }
    } catch (error) {
      toast.error("Error occur");
    } finally {
      setLoading(false);
    }
  }

  const removeSong = async (id) => {
    try {
      const response = await axios.post("/song/remove", { id });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchSongs();
      }
    } catch (error) {
      toast.error("Error occur")
    }
  }

  useEffect(() => {
    fetchSongs();
  }, [])

  const filteredSongs = data.filter(song =>
    song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.album.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">All <span className="text-[var(--accent-color)]">Songs</span></h2>
          <p className="text-sm text-[var(--text-secondary)]">Manage your uploaded tracks. View, play, or remove them from the system.</p>
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search songs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="premium-input w-full pl-10 py-2 text-sm"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"></span>
        </div>
      </div>

      <div className="w-full overflow-x-auto flex flex-col flex-1">

        <div className="min-w-[700px]">
          {/* Table Header */}
          <div className="grid grid-cols-[80px_2fr_1.5fr_1fr_80px] items-center gap-4 px-6 py-4 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4">
            <p>Cover</p>
            <p>Title</p>
            <p>Album</p>
            <p>Duration</p>
            <p className="text-center">Action</p>
          </div>

          {/* Table Body - Independent Scroll Area */}
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-320px)] pr-2 custom-scrollbar">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="grid grid-cols-[80px_2fr_1.5fr_1fr_80px] items-center gap-4 px-6 py-3 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl animate-pulse"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-lg" />
                  <div className="h-4 bg-white/10 rounded-full w-2/3" />
                  <div className="h-4 bg-white/5 rounded-full w-1/2" />
                  <div className="h-4 bg-white/5 rounded-full w-1/3" />
                  <div className="flex justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/10" />
                  </div>
                </div>
              ))
            ) : filteredSongs.length === 0 ? (
              <div className="text-center py-20 text-[var(--text-secondary)] opacity-50">
                <p className="text-4xl mb-4">🎵</p>
                <p>{searchTerm ? "No songs match your search." : "No songs found. Start by adding one!"}</p>
              </div>
            ) : (
              filteredSongs.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={item._id}
                  className='
                    grid grid-cols-[80px_2fr_1.5fr_1fr_80px] items-center gap-4 px-6 py-3 
                    bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl
                    hover:border-[var(--accent-color)] hover:shadow-lg hover:shadow-emerald-500/5 transition-all group
                  '
                >

                  <img className='w-12 h-12 object-cover rounded-lg shadow-sm' src={item.image} alt="" />
                  <p className="font-semibold text-[var(--text-primary)] truncate">{item.name}</p>
                  <p className="text-sm text-[var(--text-secondary)] truncate">{item.album === 'none' ? 'Single' : item.album}</p>
                  <p className="text-sm font-mono text-[var(--text-secondary)]">{item.duration}</p>
                  <div className="flex justify-center">
                    <button
                      className='
                        w-8 h-8 flex items-center justify-center rounded-full 
                        bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white 
                        transition-all duration-200 active:scale-90
                      '
                      onClick={() => removeSong(item._id)}
                      title="Delete Song"
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListSong
