import React, { useEffect, useRef, useContext, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Minimize2, Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

const AudioVisualizer = () => {
  const { track, playStatus, play, pause, previous, next, audioRef, progress, time } = useContext(PlayerContext);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [visualizerMode, setVisualizerMode] = useState("circular"); // circular, bars, wave

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = canvas.parentElement.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement.clientHeight || 500);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // Set up particles
    const particles = [];
    const particleCount = 60;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 1.5 - 0.75,
        speedY: Math.random() * -1.5 - 0.5,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    // Dynamic wave settings
    let angle = 0;

    const render = () => {
      if (!ctx || !canvas) return;

      // Premium Dark/Reactive Background Glow
      const grad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, Math.max(width, height) / 1.5);
      if (track?.bgColour) {
        grad.addColorStop(0, `${track.bgColour}25`); // Translucent song color
      } else {
        grad.addColorStop(0, "rgba(16, 185, 129, 0.15)"); // Translucent emerald
      }
      grad.addColorStop(1, "#080808");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Pulse speed depending on play status
      const pulseSpeed = playStatus ? 0.08 : 0.015;
      angle += pulseSpeed;
      const pulseScale = 1 + Math.sin(angle) * 0.04;

      // Draw Floating Particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (playStatus ? pulseScale : 1), 0, Math.PI * 2);
        ctx.fillStyle = track?.bgColour 
          ? `${track.bgColour}${Math.floor(p.alpha * 255).toString(16).padStart(2, '0')}`
          : `rgba(16, 185, 129, ${p.alpha})`;
        ctx.fill();

        // Particle dynamics
        if (playStatus) {
          p.y += p.speedY * 1.5;
          p.x += p.speedX;
        } else {
          p.y += p.speedY * 0.2;
        }

        // Reset particles at borders
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
      });

      // RENDER SPECIFIC VISUALIZER LAYOUTS
      if (visualizerMode === "circular") {
        // Concentric Wave Visualizer
        const centerX = width / 2;
        const centerY = height / 2;
        const baseRadius = Math.min(width, height) * 0.25;

        // Reactive Aura Glow
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * pulseScale * 1.1, 0, Math.PI * 2);
        ctx.fillStyle = track?.bgColour ? `${track.bgColour}05` : "rgba(16, 185, 129, 0.03)";
        ctx.fill();

        // Draw frequency ring
        const barCount = 90;
        ctx.lineWidth = 2.5;
        for (let i = 0; i < barCount; i++) {
          const theta = (i / barCount) * Math.PI * 2;
          
          // Simulated frequency frequencies
          const freqMultiplier = playStatus ? (Math.sin(i * 0.3 + angle * 2) * 15 + Math.cos(i * 0.7 - angle) * 8 + 25) : 5;
          const r = baseRadius * pulseScale + freqMultiplier;

          const startX = centerX + Math.cos(theta) * (baseRadius * pulseScale - 5);
          const startY = centerY + Math.sin(theta) * (baseRadius * pulseScale - 5);
          const endX = centerX + Math.cos(theta) * r;
          const endY = centerY + Math.sin(theta) * r;

          const gradLine = ctx.createLinearGradient(startX, startY, endX, endY);
          gradLine.addColorStop(0, "rgba(255, 255, 255, 0.8)");
          gradLine.addColorStop(0.5, track?.bgColour || "#10b981");
          gradLine.addColorStop(1, "rgba(255, 255, 255, 0.05)");

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = gradLine;
          ctx.stroke();
        }

        // Center Album Disc
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 0.85, 0, Math.PI * 2);
        ctx.clip();

        // Album photo
        if (track?.image) {
          const img = new Image();
          img.src = track.image;
          ctx.drawImage(img, centerX - baseRadius * 0.85, centerY - baseRadius * 0.85, baseRadius * 1.7, baseRadius * 1.7);
        } else {
          ctx.fillStyle = "#1e1e1e";
          ctx.fillRect(centerX - baseRadius * 0.85, centerY - baseRadius * 0.85, baseRadius * 1.7, baseRadius * 1.7);
        }
        ctx.restore();

        // Vinyl grooves lines
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 0.85, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Center spindle hole
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#090909";
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.stroke();

      } else if (visualizerMode === "bars") {
        // Vertical Audio Frequency Bars
        const barWidth = Math.max(2, (width / 40) - 4);
        const barCount = 45;
        const startX = (width - (barCount * (barWidth + 4))) / 2;

        for (let i = 0; i < barCount; i++) {
          // Calculate simulated height
          const freqVal = playStatus ? (Math.sin(i * 0.25 + angle * 3) * 110 + Math.cos(i * 0.5 - angle) * 45 + 160) : 12;
          const h = (freqVal * (height * 0.0025));
          const x = startX + i * (barWidth + 4);
          const y = height - h - 60;

          const gradBar = ctx.createLinearGradient(x, y, x, height - 60);
          gradBar.addColorStop(0, "rgba(255, 255, 255, 0.95)");
          gradBar.addColorStop(0.3, track?.bgColour || "#10b981");
          gradBar.addColorStop(1, "rgba(16, 185, 129, 0.05)");

          ctx.fillStyle = gradBar;
          // Round bar corners
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, h, 4);
          ctx.fill();
        }

      } else if (visualizerMode === "wave") {
        // Sine Waveform Audio Animation
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = track?.bgColour || "#10b981";

        for (let x = 0; x < width; x++) {
          const freqVal = playStatus ? (Math.sin(x * 0.008 + angle * 3.5) * 65 + Math.cos(x * 0.004 - angle * 2) * 35) : 5;
          const y = height / 2 + freqVal * Math.sin(x * 0.002);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // Draw secondary translucent wave for 3D depth
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = track?.bgColour ? `${track.bgColour}60` : "rgba(16, 185, 129, 0.35)";
        for (let x = 0; x < width; x++) {
          const freqVal = playStatus ? (Math.sin(x * 0.006 - angle * 2.5) * 45 + Math.cos(x * 0.009 + angle * 1.5) * 25) : 2;
          const y = height / 2 + freqVal * Math.cos(x * 0.003);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [track, playStatus, visualizerMode]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!track) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#121212] rounded-lg">
        <span className="text-4xl animate-bounce mb-4">🎵</span>
        <h3 className="text-xl font-bold text-white mb-2">No song playing</h3>
        <p className="text-gray-400 max-w-sm text-xs">Select a song from your library or search for tracks to launch the audio visualizer.</p>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col overflow-hidden transition-all duration-500 rounded-lg ${isFullscreen ? "fixed inset-0 z-[100] bg-black" : "flex-1 min-h-[450px]"}`}>
      {/* Dynamic Title / Options */}
      <div className="absolute top-4 left-6 right-6 z-10 flex items-center justify-between pointer-events-auto bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/5 shadow-lg select-none">
        <div className="flex items-center gap-3">
          <img src={track.image} className="w-8 h-8 rounded object-cover shadow border border-white/15" />
          <div className="min-w-0">
            <p className="text-xs font-black text-white truncate max-w-[150px] sm:max-w-xs">{track.name}</p>
            <p className="text-[10px] text-gray-400 truncate mt-0.5">{track.desc}</p>
          </div>
        </div>

        {/* Layout Modes */}
        <div className="flex items-center gap-1 sm:gap-2">
          {["circular", "bars", "wave"].map(mode => (
            <button
              key={mode}
              onClick={() => setVisualizerMode(mode)}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all
                ${visualizerMode === mode 
                  ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/25" 
                  : "bg-white/5 hover:bg-white/10 text-white"}`}
            >
              {mode}
            </button>
          ))}

          {/* Fullscreen Trigger */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white transition active:scale-95 ml-1"
            title={isFullscreen ? "Exit Immersive View" : "Enter Immersive View"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Render Canvas */}
      <div className="flex-1 w-full h-full relative">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Fullscreen Player HUD overlay at bottom of screen */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-6 left-6 right-6 z-20 pointer-events-auto bg-black/75 backdrop-blur-xl border border-white/10 px-8 py-5 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 select-none"
          >
            {/* Meta */}
            <div className="flex items-center gap-4 w-full md:w-[30%]">
              <img src={track.image} className="w-14 h-14 rounded-2xl shadow-xl object-cover" />
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-black text-white truncate">{track.name}</h3>
                <p className="text-xs text-emerald-400 font-bold truncate mt-1">{track.desc}</p>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex flex-col items-center w-full md:w-[45%] gap-2">
              <div className="flex items-center gap-6">
                <button onClick={previous} className="p-2 text-white hover:opacity-80 active:scale-90 transition">
                  <SkipBack size={20} fill="white" />
                </button>
                <button
                  onClick={playStatus ? pause : play}
                  className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition"
                >
                  {playStatus ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-0.5" />}
                </button>
                <button onClick={next} className="p-2 text-white hover:opacity-80 active:scale-90 transition">
                  <SkipForward size={20} fill="white" />
                </button>
              </div>

              {/* Progress Slider */}
              <div className="flex items-center gap-3 w-full text-[10px] font-mono text-white/50">
                <span>{String(time.currentTime.minute).padStart(2, '0')}:{String(time.currentTime.second).padStart(2, '0')}</span>
                <div className="flex-1 h-1 bg-white/15 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${progress}%` }} />
                </div>
                <span>{String(time.totalTime.minute).padStart(2, '0')}:{String(time.totalTime.second).padStart(2, '0')}</span>
              </div>
            </div>

            {/* Immersive HUD action */}
            <div className="hidden md:flex items-center gap-3 w-[20%] justify-end text-white/40">
              <Volume2 size={18} />
              <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white/60" style={{ width: "70%" }} />
              </div>
              <button 
                onClick={toggleFullscreen}
                className="ml-4 px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-white text-xs font-bold transition-all active:scale-95"
              >
                Exit Show
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioVisualizer;
