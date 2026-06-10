import React, { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { PlayerContext } from "../context/PlayerContext";
import { motion } from "framer-motion";
import { Users, Headphones, Plus, Activity, Volume2, UserPlus, Play, Check, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

const SocialHub = () => {
  const { user } = useAuth();
  const { playWithId, track, playStatus, progress, songsData } = useContext(PlayerContext);
  
  const [feed, setFeed] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [roomNameInput, setRoomNameInput] = useState("");
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [loading, setLoading] = useState(true);

  // Poll intervals
  useEffect(() => {
    let interval;
    const loadSocial = async () => {
      try {
        const [feedRes, roomsRes] = await Promise.all([
          API.get("/social/feed"),
          API.get("/social/rooms")
        ]);

        if (feedRes.data.success) setFeed(feedRes.data.feed);
        if (roomsRes.data.success) setRooms(roomsRes.data.rooms);
      } catch (err) {
        console.error("Failed to load social hub:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadSocial();
      interval = setInterval(loadSocial, 5000); // Poll every 5s for real-time synchronization
    } else {
      setLoading(false);
    }

    return () => clearInterval(interval);
  }, [user]);

  // Host playback sync loop
  useEffect(() => {
    let syncInterval;
    if (activeRoom && activeRoom.hostId._id === (user?.id || user?._id) && track) {
      const syncPlayState = async () => {
        try {
          await API.post(`/social/rooms/sync/${activeRoom._id}`, {
            currentSongId: track._id,
            isPlaying: playStatus,
            progress: Math.round(progress)
          });
        } catch (_) {}
      };
      syncPlayState();
      syncInterval = setInterval(syncPlayState, 4000); // Sync play state every 4s
    }
    return () => clearInterval(syncInterval);
  }, [activeRoom, track, playStatus, progress, user]);

  const handleCreateRoom = async () => {
    if (!roomNameInput.trim()) return;
    try {
      const res = await API.post("/social/rooms/create", { name: roomNameInput });
      if (res.data.success) {
        setActiveRoom(res.data.room);
        setRoomNameInput("");
        setShowCreateRoom(false);
        toast.success(`Listening Room "${res.data.room.name}" created! You are the host.`);
      }
    } catch (err) {
      toast.error("Failed to create room");
    }
  };

  const handleJoinRoom = async (room) => {
    try {
      const res = await API.post(`/social/rooms/join/${room._id}`);
      if (res.data.success) {
        setActiveRoom(res.data.room);
        toast.info(`Joined Room "${room.name}". Synced play state!`);
        
        // Sync player if host is playing something
        if (res.data.room.currentSongId) {
          const songId = typeof res.data.room.currentSongId === "object" 
            ? res.data.room.currentSongId._id 
            : res.data.room.currentSongId;
          playWithId(songId);
        }
      }
    } catch (err) {
      toast.error("Failed to join room");
    }
  };

  const handleSyncWithHost = () => {
    if (!activeRoom || !activeRoom.currentSongId) {
      toast.warn("Host is not playing anything right now");
      return;
    }
    const hostSong = activeRoom.currentSongId;
    const songId = typeof hostSong === "object" ? hostSong._id : hostSong;
    playWithId(songId);
    toast.success("Synchronized player with host!");
  };

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#121212] rounded-lg">
        <span className="text-4xl animate-bounce mb-4">👥</span>
        <h3 className="text-xl font-bold text-white mb-2">Login to enjoy Social Music</h3>
        <p className="text-gray-400 max-w-sm text-xs">Join active listening rooms with other users, follow friends, and synchronize playbacks to listen together in real-time.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden text-white select-none">
      
      {/* LEFT COLUMN: ACTIVE LISTENING ROOMS */}
      <div className="flex-1 flex flex-col border-r border-white/5 p-4 lg:p-6 overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
              <span>Listening Rooms</span>
              <Headphones className="text-emerald-500" size={20} />
            </h2>
            <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">Listen in real-time with other users</p>
          </div>
          
          {!activeRoom ? (
            <button
              onClick={() => setShowCreateRoom(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-full flex items-center gap-1.5 shadow-lg transition active:scale-95"
            >
              <Plus size={14} className="stroke-[3]" />
              Host Room
            </button>
          ) : (
            <button
              onClick={() => {
                setActiveRoom(null);
                toast.info("Left listening room session");
              }}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 font-black text-xs rounded-full flex items-center gap-1.5 transition active:scale-95"
            >
              Leave Session
            </button>
          )}
        </div>

        {/* CREATE ROOM DRAWER */}
        {showCreateRoom && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col gap-3"
          >
            <p className="text-xs font-black uppercase text-emerald-400 tracking-widest">Host a new room</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Room Name (e.g. Study Lo-Fi Sync)..."
                value={roomNameInput}
                onChange={(e) => setRoomNameInput(e.target.value)}
                className="flex-1 bg-[#282828] text-xs px-3.5 py-2 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 text-white"
                onKeyDown={(e) => e.key === "Enter" && handleCreateRoom()}
              />
              <button
                onClick={handleCreateRoom}
                disabled={!roomNameInput.trim()}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-black text-xs rounded-xl transition"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateRoom(false)}
                className="px-3 py-2 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* ACTIVE SESSION STATUS */}
        {activeRoom && (
          <div className="mb-6 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 p-5 rounded-3xl relative overflow-hidden">
            <div className="absolute right-4 top-4 animate-ping w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <p className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Active room session</p>
            <h3 className="text-lg font-black text-white mt-1">{activeRoom.name}</h3>
            <p className="text-xs text-gray-400 font-medium mt-1">Host: {activeRoom.hostId.name}</p>

            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
              <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
                <Users size={14} />
                <span>{activeRoom.participants?.length || 1} listening together</span>
              </div>

              {activeRoom.hostId._id !== (user.id || user._id) && (
                <button
                  onClick={handleSyncWithHost}
                  className="px-3.5 py-1.5 bg-emerald-500 text-black text-xs font-black rounded-full shadow hover:bg-emerald-400 flex items-center gap-1 transition active:scale-95"
                >
                  <RefreshCw size={12} className="stroke-[3]" />
                  Sync Audio
                </button>
              )}
            </div>
          </div>
        )}

        {/* ROOMS BOARD */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-1">Available Rooms</h3>
          {rooms.length === 0 ? (
            <div className="text-center py-10 opacity-40 flex flex-col items-center justify-center gap-2">
              <span className="text-2xl">🔇</span>
              <p className="text-xs font-bold uppercase tracking-wider">No active rooms right now</p>
            </div>
          ) : (
            rooms.map((room) => {
              const isHost = room.hostId._id === (user.id || user._id);
              const isActive = activeRoom?._id === room._id;
              return (
                <div 
                  key={room._id} 
                  className={`flex items-center justify-between p-4 rounded-2xl bg-white/5 border transition hover:bg-white/10
                    ${isActive ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/5"}`}
                >
                  <div className="min-w-0 pr-4">
                    <h4 className="text-sm font-black text-white truncate">{room.name}</h4>
                    <p className="text-xs text-gray-400 truncate mt-1">Host: {room.hostId.name} • {room.participants?.length || 1} members</p>
                  </div>
                  
                  {isHost ? (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">Hosting</span>
                  ) : isActive ? (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">Connected</span>
                  ) : (
                    <button
                      onClick={() => handleJoinRoom(room)}
                      className="px-4 py-1.5 bg-white text-black font-black text-xs rounded-full hover:scale-105 transition active:scale-95"
                    >
                      Join
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: FRIEND ACTIVITY FEED */}
      <div className="w-full lg:w-[350px] flex flex-col p-4 lg:p-6 bg-white/[0.02] overflow-y-auto custom-scrollbar">
        <div className="mb-6">
          <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
            <span>Friend Activity</span>
            <Activity className="text-emerald-500" size={16} />
          </h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">See what your friends are streaming</p>
        </div>

        <div className="flex flex-col gap-4">
          {feed.length === 0 ? (
            <div className="text-center py-10 opacity-30">
              <p className="text-xs font-bold uppercase tracking-wider">Feed is quiet...</p>
            </div>
          ) : (
            feed.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center font-bold text-black text-xs flex-shrink-0">
                  {item.user.name[0].toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex justify-between items-baseline gap-1.5">
                    <span className="text-xs font-black text-white truncate hover:underline cursor-pointer">
                      {item.user.name}
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold flex-shrink-0">
                      Lv.{item.user.level || 1}
                    </span>
                  </div>

                  <p className="text-[11px] text-emerald-400 font-extrabold truncate mt-1 leading-tight flex items-center gap-1 group-hover:text-emerald-300 transition-colors">
                    <Play size={8} fill="currentColor" />
                    {item.songName}
                  </p>
                  
                  <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">
                    {item.artistName}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default SocialHub;
