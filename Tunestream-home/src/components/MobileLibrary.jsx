import React, { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { assets } from "../assets/assets";

const MobileLibrary = () => {
  const { songsData, playWithId, track } = useContext(PlayerContext);

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="p-4 flex items-center gap-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black font-bold">
            {songsData.length}
        </div>
        <h1 className="text-2xl font-bold">Your Library</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        <div className="flex items-center gap-4 mb-6">
            <div className="bg-[#282828] px-4 py-2 rounded-full text-sm font-medium">Songs</div>
            <div className="bg-transparent border border-white/20 px-4 py-2 rounded-full text-sm font-medium text-gray-400">Playlists</div>
            <div className="bg-transparent border border-white/20 px-4 py-2 rounded-full text-sm font-medium text-gray-400">Artists</div>
        </div>

        <div className="space-y-4">
          {songsData.map((song) => {
            const isActive = track?._id === song._id;
            return (
              <div
                key={song._id}
                onClick={() => playWithId(song._id)}
                className={`flex items-center gap-4 p-2 rounded-lg transition-colors ${isActive ? 'bg-emerald-500/10' : 'active:bg-white/5'}`}
              >
                <div className="relative">
                    <img src={song.image} className="w-14 h-14 rounded shadow-lg object-cover" alt="" />
                    {isActive && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                        </div>
                    )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className={`font-semibold truncate ${isActive ? 'text-emerald-400' : 'text-white'}`}>{song.name}</p>
                  <p className="text-xs text-gray-400 truncate">{song.desc}</p>
                </div>
                <img src={assets.play_icon} className="w-4 opacity-50" alt="" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileLibrary;
