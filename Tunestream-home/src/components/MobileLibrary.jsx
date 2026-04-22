import React, { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { assets } from "../assets/assets";

const MobileLibrary = () => {
  const { songsData, playWithId, track } = useContext(PlayerContext);

  return (
    <div className="flex flex-col h-full bg-transparent">

      {/* HEADER */}
      <div className="px-5 py-4 flex items-center gap-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black font-semibold text-sm">
          {songsData.length}
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Your Library</h1>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 pb-28">

        {/* FILTER TABS */}
        <div className="flex items-center gap-3">
          <div className="bg-[#282828] px-4 py-1.5 rounded-full text-sm font-medium">
            Songs
          </div>
          <div className="border border-white/20 px-4 py-1.5 rounded-full text-sm text-gray-400">
            Playlists
          </div>
          <div className="border border-white/20 px-4 py-1.5 rounded-full text-sm text-gray-400">
            Artists
          </div>
        </div>

        {/* SONG LIST */}
        <div className="space-y-3">
          {songsData.map((song) => {
            const isActive = track?._id === song._id;

            return (
              <div
                key={song._id}
                onClick={() => playWithId(song._id)}
                className={`
                  flex items-center gap-3 px-2.5 py-2 rounded-lg 
                  transition-all duration-200
                  ${isActive ? 'bg-emerald-500/10' : 'active:bg-white/5'}
                `}
              >
                {/* IMAGE */}
                <div className="relative shrink-0">
                  <img
                    src={song.image}
                    className="w-12 h-12 rounded-md object-cover shadow"
                    alt=""
                  />

                  {isActive && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-md">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                    </div>
                  )}
                </div>

                {/* TEXT */}
                <div className="flex-1 overflow-hidden">
                  <p className={`text-sm font-medium truncate ${isActive ? 'text-emerald-400' : 'text-white'}`}>
                    {song.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-[2px]">
                    {song.desc}
                  </p>
                </div>

                {/* ICON */}
                <img
                  src={assets.play_icon}
                  className="w-4 opacity-40 shrink-0"
                  alt=""
                />
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default MobileLibrary;
