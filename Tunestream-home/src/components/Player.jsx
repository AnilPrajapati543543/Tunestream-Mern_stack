import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets.js';
import { PlayerContext } from '../context/PlayerContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ListMusic, Tv, Library, Sparkles, Activity } from 'lucide-react';
import VolumeControl from "./VolumeControl";
import API from "../api/axios";
import { toast } from "react-toastify";

const Player = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
    isLooping,
    leftSidebarCollapsed,
    setLeftSidebarCollapsed,
    rightSidebarCollapsed,
    setRightSidebarCollapsed,
    setMobileNowPlayingActive
  } = useContext(PlayerContext);

  const [isAIDJEnabled, setIsAIDJEnabled] = useState(false);

  // Log track play for analytics on database
  useEffect(() => {
    if (track) {
      const logPlayToDB = async () => {
        try {
          const artist = track.desc ? track.desc.split(/[,&]/)[0].trim() : "various";
          await API.post("/history/log-play", {
            songId: track._id,
            songName: track.name,
            artistName: artist,
            duration: 30 // logs standard 30s playback trigger
          });
        } catch (_) {}
      };
      logPlayToDB();
    }
  }, [track]);

  // AI DJ speech synthesis hook
  useEffect(() => {
    if (isAIDJEnabled && track && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const artist = track.desc ? track.desc.split(/[,&]/)[0].trim() : "various artists";
      const phrases = [
        `Hey there! You're locked into TuneStream AI DJ. Up next, we have a premium cut: ${track.name} by the talented ${artist}. Check this one out!`,
        `TuneStream AI DJ in the mix. Transitioning now into ${track.name} from the album ${track.album !== 'none' ? track.album : 'Hits Playlist'}. Enjoy the vibe!`,
        `This is your AI DJ. Spicing up your listening feed with a record named ${track.name} by ${artist}. Let's tune in.`
      ];
      const phrase = phrases[Math.floor(Math.random() * phrases.length)];
      const utterance = new SpeechSynthesisUtterance(phrase);
      
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.includes("en-US") && v.name.includes("Google")) || voices.find(v => v.lang.includes("en"));
      if (englishVoice) utterance.voice = englishVoice;
      utterance.pitch = 0.95;
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  }, [track, isAIDJEnabled]);

  if (!track) return null;

  return (
    <div 
      onClick={() => {
        if (window.innerWidth <= 768) {
          setMobileNowPlayingActive(true);
        }
      }}
      className='fixed bottom-[70px] md:bottom-0 md:relative h-auto min-h-[56px] md:min-h-[70px] md:h-[10%] w-full bg-black/95 backdrop-blur-lg text-white flex flex-col md:flex-row items-center justify-between px-3 md:px-6 border-t border-white/5 z-40 transition-all duration-300 cursor-pointer md:cursor-default'
    >
      
      {/* SONG INFO & MOBILE PLAY BUTTON */}
      <div className='flex items-center justify-between w-full md:w-[30%] py-1 md:py-0'>
        <div className='flex items-center gap-2.5 md:gap-3'>
          <img src={track.image} className='w-10 h-10 md:w-12 md:h-12 rounded-md shadow-lg object-cover' />
          <div className='overflow-hidden max-w-[120px] sm:max-w-[180px] md:max-w-none'>
            <p className='text-[11px] md:text-sm font-bold truncate tracking-tight'>{track.name}</p>
            <p className='text-[9px] md:text-xs text-gray-400 truncate opacity-80'>{track.desc}</p>
          </div>
        </div>
        
        {/* Mobile-only Play/Pause button next to song info */}
        <div className='flex md:hidden items-center gap-3 sm:gap-4'>
            <img onClick={(e) => { e.stopPropagation(); previous(); }} className='w-4 sm:w-5 opacity-60 hover:opacity-100 cursor-pointer active:scale-75 transition' src={assets.prev_icon} alt="prev" />
            <button
                onClick={(e) => { e.stopPropagation(); playStatus ? pause() : play(); }}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90"
            >
                {playStatus ? (
                <img src={assets.pause_icon} className="w-4 h-4 invert" alt="pause" />
                ) : (
                <img src={assets.play_icon} className="w-4 h-4 invert ml-[2px]" alt="play" />
                )}
            </button>
            <img onClick={(e) => { e.stopPropagation(); next(); }} className='w-4 sm:w-5 opacity-60 hover:opacity-100 cursor-pointer active:scale-75 transition' src={assets.next_icon} alt="next" />
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
            className='w-5 cursor-pointer hover:scale-110 transition opacity-80 hover:opacity-100'
            src={assets.prev_icon}
            alt="previous"
          />
          <button
            onClick={() => playStatus ? pause() : play()}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition shadow-xl shadow-black/20"
          >
            {playStatus ? (
              <img src={assets.pause_icon} className="w-5 h-5 invert" />
            ) : (
              <img src={assets.play_icon} className="w-5 h-5 invert ml-[2px]" />
            )}
          </button>
          <img
            onClick={next}
            className='w-5 cursor-pointer hover:scale-110 transition opacity-80 hover:opacity-100'
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
        <div className='flex items-center gap-2 w-full max-w-[500px] pb-1 md:pb-0'>
          <p className='text-[10px] md:text-xs text-gray-300 min-w-[35px] font-mono'>
            {String(time.currentTime.minute).padStart(2, '0')}:{String(time.currentTime.second).padStart(2, '0')}
          </p>
          <div
            onClick={(e) => { e.stopPropagation(); seekSong(e); }}
            className='flex-1 h-[3px] md:h-[4px] bg-white/10 rounded-full cursor-pointer relative group overflow-hidden'
          >
            <div
              className='h-full bg-emerald-500 rounded-full absolute left-0 top-0 transition-all duration-100'
              style={{ width: `${progress}%` }}
            >
              <div className='hidden group-hover:block w-3 h-3 bg-white rounded-full absolute -right-1.5 -top-[4px] md:-top-[4px] shadow-lg' />
            </div>
          </div>
          <p className='text-[10px] md:text-xs text-gray-300 min-w-[35px] font-mono'>
            {String(time.totalTime.minute).padStart(2, '0')}:{String(time.totalTime.second).padStart(2, '0')}
          </p>
        </div>
      </div>

      {/* RIGHT (VOLUME & CONTROLS) - Hidden on mobile */}
      <div className='hidden md:flex items-center gap-4 w-[30%] justify-end'>
         {/* Left Library Sidebar collapse toggle */}
         <button 
           onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
           className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${!leftSidebarCollapsed ? "text-emerald-400" : "text-gray-400 hover:text-white"}`}
           title="Toggle Your Library"
         >
           <Library size={18} />
         </button>

         {/* Queue button */}
         <button 
           onClick={() => navigate(location.pathname === "/queue" ? "/" : "/queue")}
           className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${location.pathname === "/queue" ? "text-emerald-400" : "text-gray-400 hover:text-white"}`}
           title="Play Queue"
         >
           <ListMusic size={18} />
         </button>

         {/* Right Sidebar collapse toggle */}
         <button 
           onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
           className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${!rightSidebarCollapsed ? "text-emerald-400" : "text-gray-400 hover:text-white"}`}
           title="Now Playing View"
         >
           <Tv size={18} />
         </button>

         {/* AI DJ toggle button */}
         <button 
           onClick={() => {
             setIsAIDJEnabled(!isAIDJEnabled);
             toast.success(!isAIDJEnabled ? "AI DJ Mode Activated!" : "AI DJ Mode Deactivated");
           }}
           className={`p-1.5 rounded-full hover:bg-white/10 transition-all ${isAIDJEnabled ? "text-yellow-400 drop-shadow-[0_0_6px_rgba(234,179,8,0.6)] animate-pulse" : "text-gray-400 hover:text-white"}`}
           title="Toggle AI DJ Voice Assistant"
         >
           <Sparkles size={18} />
         </button>

         {/* Visualizer toggle button */}
         <button 
           onClick={() => {
             if (location.pathname === "/visualizer") {
               navigate("/");
             } else {
               navigate("/visualizer");
             }
           }}
           className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${location.pathname === "/visualizer" ? "text-emerald-400" : "text-gray-400 hover:text-white"}`}
           title="Toggle Audio Visualizer"
         >
           <Activity size={18} />
         </button>

         <div className="w-[120px] flex items-center">
           <VolumeControl />
         </div>
      </div>

    </div>
  );
};

export default Player;