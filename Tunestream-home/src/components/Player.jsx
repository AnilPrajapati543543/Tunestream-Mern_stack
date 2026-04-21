import React, { useContext } from 'react';
import { assets } from '../assets/assets.js';
import { PlayerContext } from '../context/PlayerContext';
import VolumeControl from "./VolumeControl";

const Player = () => {
  const {
    track,
    playStatus,
    play,
    pause,
    time,
    previous,
    next,
    seekSong,
    progress,
    shuffleToggle,
    loopToggle,
    isShuffling,
    isLooping
  } = useContext(PlayerContext);

  if (!track) return null;

  return (
    <div className='fixed bottom-16 md:bottom-0 md:relative h-[auto] min-h-[80px] md:h-[10%] w-full bg-black/95 text-white flex flex-col md:flex-row items-center justify-between px-4 md:px-6 border-t border-[#222] z-40 pb-2 md:pb-0'>
      
      {/* SONG INFO & MOBILE PLAY BUTTON */}
      <div className='flex items-center justify-between w-full md:w-[25%] py-2 md:py-0'>
        <div className='flex items-center gap-3'>
          <img src={track.image} className='w-10 h-10 md:w-12 md:h-12 rounded object-cover' />
          <div className='overflow-hidden'>
            <p className='text-xs md:text-sm font-semibold truncate'>{track.name}</p>
            <p className='text-[10px] md:text-xs text-gray-400 truncate'>{track.desc}</p>
          </div>
        </div>
        
        {/* Mobile-only Play/Pause button next to song info */}
        <div className='flex md:hidden items-center gap-4'>
            <img onClick={previous} className='w-5' src={assets.prev_icon} alt="" />
            <button
                onClick={() => playStatus ? pause() : play()}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
            >
                {playStatus ? (
                <img src={assets.pause_icon} className="w-4 h-4 invert" />
                ) : (
                <img src={assets.play_icon} className="w-4 h-4 invert ml-[2px]" />
                )}
            </button>
            <img onClick={next} className='w-5' src={assets.next_icon} alt="" />
        </div>
      </div>

      {/* CENTER CONTROLS (DESKTOP) & PROGRESS BAR (BOTH) */}
      <div className='flex flex-col items-center w-full md:w-[50%] gap-1'>
        
        {/* Desktop Controls */}
        <div className='hidden md:flex items-center gap-6 mb-1'>
          <img
            onClick={shuffleToggle}
            src={assets.shuffle_icon}
            alt="shuffle"
            className={`w-4 cursor-pointer transition 
              ${isShuffling
                ? "opacity-100 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]"
                : "opacity-50 hover:opacity-80"
              }`}
          />
          <img
            onClick={previous}
            className='w-5 cursor-pointer hover:scale-110 transition'
            src={assets.prev_icon}
            alt="previous"
          />
          <button
            onClick={() => playStatus ? pause() : play()}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition"
          >
            {playStatus ? (
              <img src={assets.pause_icon} className="w-5 h-5 invert" />
            ) : (
              <img src={assets.play_icon} className="w-5 h-5 invert ml-[2px]" />
            )}
          </button>
          <img
            onClick={next}
            className='w-5 cursor-pointer hover:scale-110 transition'
            src={assets.next_icon}
            alt="next"
          />
          <img
            onClick={loopToggle}
            src={assets.loop_icon}
            alt="loop"
            className={`w-4 cursor-pointer transition 
              ${isLooping
                ? "opacity-100 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]"
                : "opacity-50 hover:opacity-80"
              }`}
          />
        </div>

        {/* PROGRESS BAR */}
        <div className='flex items-center gap-2 w-full max-w-[500px]'>
          <p className='text-[10px] md:text-xs text-gray-400 min-w-[30px]'>
            {String(time.currentTime.minute).padStart(2, '0')}:{String(time.currentTime.second).padStart(2, '0')}
          </p>
          <div
            onClick={seekSong}
            className='flex-1 h-[3px] md:h-[4px] bg-gray-600 rounded-full cursor-pointer relative group'
          >
            <div
              className='h-full bg-emerald-500 rounded-full absolute left-0 top-0 transition-all duration-100'
              style={{ width: `${progress}%` }}
            >
              <div className='hidden group-hover:block w-3 h-3 bg-white rounded-full absolute -right-1.5 -top-[4px] md:-top-[4px] shadow-lg' />
            </div>
          </div>
          <p className='text-[10px] md:text-xs text-gray-400 min-w-[30px]'>
            {String(time.totalTime.minute).padStart(2, '0')}:{String(time.totalTime.second).padStart(2, '0')}
          </p>
        </div>
      </div>

      {/* RIGHT (VOLUME) - Hidden on mobile */}
      <div className='hidden md:flex items-center gap-3 w-[25%] justify-end'>
         <VolumeControl />
      </div>

    </div>
  );
};

export default Player;