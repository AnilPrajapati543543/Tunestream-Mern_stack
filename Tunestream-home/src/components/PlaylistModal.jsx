import React, { useState, useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Music, ListMusic } from 'lucide-react';

const PlaylistModal = ({ isOpen, onClose, songId }) => {
  const { playlists, setPlaylists } = useContext(PlayerContext);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName) return;
    setLoading(true);
    try {
      const res = await API.post('/playlist/create', { name: newPlaylistName });
      if (res.data.success) {
        setPlaylists([...playlists, res.data.playlist]);
        setNewPlaylistName('');
        toast.success("Playlist created");
      }
    } catch (error) {
      toast.error("Failed to create playlist");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      const res = await API.post('/playlist/add-song', { playlistId, songId });
      if (res.data.success) {
        toast.success("Added to playlist");
        setPlaylists(playlists.map(p => p._id === playlistId ? res.data.playlist : p));
        onClose();
      }
    } catch (error) {
      toast.error("Failed to add to playlist");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-md bg-[#121212] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="p-8 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <ListMusic className="text-emerald-500" />
                  Your Library
                </h2>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold opacity-60">Add song to playlist</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 text-gray-500 hover:text-white transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Create New Section */}
            <div className="px-8 py-4">
              <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5 focus-within:border-emerald-500/50 transition-all">
                <input
                  type="text"
                  placeholder="Create new playlist..."
                  value={newPlaylistName}
                  onChange={e => setNewPlaylistName(e.target.value)}
                  className="flex-1 bg-transparent px-4 py-2 text-white outline-none placeholder:text-gray-600 text-sm"
                />
                <button
                  onClick={handleCreatePlaylist}
                  disabled={loading || !newPlaylistName}
                  className="p-2 bg-emerald-500 text-black rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* List Section */}
            <div className="flex-1 overflow-y-auto px-8 py-4 space-y-3 custom-scrollbar">
              {playlists.map((playlist, idx) => (
                <motion.div
                  key={playlist._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleAddToPlaylist(playlist._id)}
                  className="group flex items-center justify-between p-4 bg-white/[0.03] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 rounded-2xl cursor-pointer transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Music size={20} className="text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm group-hover:text-emerald-400 transition-colors">
                        {playlist.name}
                      </h3>
                      <p className="text-[10px] text-gray-500 uppercase tracking-tighter font-black">
                        {playlist.songs.length} {playlist.songs.length === 1 ? 'Track' : 'Tracks'}
                      </p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Plus size={16} className="text-black" />
                    </div>
                  </div>
                </motion.div>
              ))}

              {playlists.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 opacity-30">
                  <ListMusic size={48} className="mb-4" />
                  <p className="text-sm font-medium">No playlists found</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-8 pt-0 mt-2 text-center">
               <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.2em]">Tunestream Cloud Library</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PlaylistModal;
