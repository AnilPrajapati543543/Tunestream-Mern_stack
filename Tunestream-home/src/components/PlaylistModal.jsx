import React, { useState, useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import API from '../api/axios';
import { toast } from 'react-toastify';

const PlaylistModal = ({ isOpen, onClose, songId }) => {
  const { playlists, setPlaylists } = useContext(PlayerContext);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  if (!isOpen) return null;

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName) return;
    try {
      const res = await API.post('/playlist/create', { name: newPlaylistName });
      if (res.data.success) {
        setPlaylists([...playlists, res.data.playlist]);
        setNewPlaylistName('');
        toast.success("Playlist created");
      }
    } catch (error) {
      toast.error("Failed to create playlist");
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      const res = await API.post('/playlist/add-song', { playlistId, songId });
      if (res.data.success) {
        toast.success("Added to playlist");
        // Update local playlists state
        setPlaylists(playlists.map(p => p._id === playlistId ? res.data.playlist : p));
        onClose();
      }
    } catch (error) {
      toast.error("Failed to add to playlist");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#181818] rounded-xl p-6 w-[90%] max-w-md shadow-2xl border border-white/10 relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">
          &times;
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Add to Playlist</h2>

        <div className="flex gap-2 mb-6">
          <input 
            type="text" 
            placeholder="New Playlist Name" 
            value={newPlaylistName}
            onChange={e => setNewPlaylistName(e.target.value)}
            className="flex-1 bg-[#282828] rounded p-2 text-white outline-none focus:border-emerald-500 border border-transparent"
          />
          <button onClick={handleCreatePlaylist} className="bg-emerald-500 text-black px-4 rounded font-semibold hover:scale-105 transition">
            Create
          </button>
        </div>

        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {playlists.map(playlist => (
            <div 
              key={playlist._id} 
              onClick={() => handleAddToPlaylist(playlist._id)}
              className="p-3 bg-[#282828] rounded cursor-pointer hover:bg-emerald-500 hover:text-black transition flex justify-between items-center text-white font-medium"
            >
              <span>{playlist.name}</span>
              <span className="text-xs opacity-70">{playlist.songs.length} songs</span>
            </div>
          ))}
          {playlists.length === 0 && (
            <p className="text-gray-400 text-center text-sm py-4">No playlists yet. Create one!</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default PlaylistModal;
