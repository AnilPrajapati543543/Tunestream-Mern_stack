import React, { useState, useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Music, Play, X, Headphones, Info } from "lucide-react";
import { toast } from "react-toastify";

// Curated metadata of trends by country
const countryData = {
  IN: {
    name: "India",
    genre: "Bollywood / Sufi / Classical",
    instrument: "Sitar & Tabla",
    description: "Deep, rhythmic ragas mixed with high-tempo modern Bollywood beats. Indian music is rich in history and utilizes complex acoustic meters.",
    songs: [
      { name: "Let's Nacho", desc: "Badshah & Vishal Dadlani", id: "IN_1" },
      { name: "Despacito Remix", desc: "Sitar Fusion Remix", id: "IN_2" }
    ]
  },
  US: {
    name: "United States",
    genre: "Hip-Hop / Pop / Rock",
    instrument: "Electric Guitar",
    description: "Global chart-topping hip-hop and electronic pop records. Synonymous with punchy basslines, autotune vocals, and polished production values.",
    songs: [
      { name: "Despacito", desc: "Luis Fonsi ft. Daddy Yankee", id: "US_1" }
    ]
  },
  JP: {
    name: "Japan",
    genre: "J-Pop / City Pop / Shamisen",
    instrument: "Shamisen & Koto",
    description: "Incredibly melodic arrangements, rich chord progressions, and bright electronic synthesisers matching the urban neon soundscape.",
    songs: [
      { name: "Lomberghini", desc: "Electronic Synth Cover", id: "JP_1" }
    ]
  },
  BR: {
    name: "Brazil",
    genre: "Bossa Nova / Samba / Funk",
    instrument: "Pandeiro & Acoustic Guitar",
    description: "Warm, syncopated chord transitions and infectious dance beats. Brazil streams a diverse array of carnival samba and urban funk music.",
    songs: [
      { name: "Despacito", desc: "Latino Dance Mix", id: "BR_1" }
    ]
  },
  ES: {
    name: "Spain / Latin America",
    genre: "Reggaeton / Flamenco",
    instrument: "Spanish Guitar",
    description: "Acoustic flamenco picking and dembow dance rhythms. Spanish and Latin American music drives high-energy global streaming charts.",
    songs: [
      { name: "Despacito", desc: "Original Luis Fonsi", id: "ES_1" }
    ]
  }
};

const GlobalMap = () => {
  const { playWithId, songsData } = useContext(PlayerContext);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const handleCountryClick = (code) => {
    setSelectedCountry(countryData[code] || null);
  };

  const handlePlaySong = (songName) => {
    // Find matching song in the main songsData list if possible
    const match = songsData.find(s => s.name.toLowerCase().includes(songName.toLowerCase().split(" ")[0]));
    if (match) {
      playWithId(match._id);
      toast.success(`Playing trend from ${selectedCountry.name}: ${match.name}`);
    } else if (songsData.length > 0) {
      playWithId(songsData[0]._id);
      toast.success(`Playing fallback track: ${songsData[0].name}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden text-white select-none relative bg-[#0e0e0e]">
      
      {/* MAP VIEW PANEL */}
      <div className="flex-1 flex flex-col p-4 lg:p-6 justify-between relative min-h-[400px]">
        <div>
          <h2 className="text-xl md:text-3xl font-black tracking-tight flex items-center gap-2">
            <span>Global Music Discovery Map</span>
            <Globe className="text-emerald-500 animate-spin-slow" size={24} />
          </h2>
          <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">
            Click on highlighted countries to discover native instruments and trends
          </p>
        </div>

        {/* HIGH-QUALITY INTERACTIVE STYLIZED SVG WORLD MAP */}
        <div className="flex-1 flex items-center justify-center py-6 px-4">
          <svg 
            viewBox="0 0 1000 500" 
            className="w-full max-w-[800px] h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            {/* Background grids */}
            <g opacity="0.03">
              <line x1="0" y1="100" x2="1000" y2="100" stroke="white" strokeWidth="1" />
              <line x1="0" y1="200" x2="1000" y2="200" stroke="white" strokeWidth="1" />
              <line x1="0" y1="300" x2="1000" y2="300" stroke="white" strokeWidth="1" />
              <line x1="0" y1="400" x2="1000" y2="400" stroke="white" strokeWidth="1" />
              <line x1="200" y1="0" x2="200" y2="500" stroke="white" strokeWidth="1" />
              <line x1="400" y1="0" x2="400" y2="500" stroke="white" strokeWidth="1" />
              <line x1="600" y1="0" x2="600" y2="500" stroke="white" strokeWidth="1" />
              <line x1="800" y1="0" x2="800" y2="500" stroke="white" strokeWidth="1" />
            </g>

            {/* Stylized world country nodes */}
            {/* North America (US Node) */}
            <path 
              d="M 150 120 L 280 120 L 280 220 L 200 250 L 120 200 Z" 
              fill={hoveredCountry === "US" ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.03)"} 
              stroke={hoveredCountry === "US" ? "#10b981" : "rgba(255,255,255,0.08)"} 
              strokeWidth="2.5"
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHoveredCountry("US")}
              onMouseLeave={() => setHoveredCountry(null)}
              onClick={() => handleCountryClick("US")}
            />
            <text x="200" y="180" fill="white" opacity={hoveredCountry === "US" ? 1 : 0.6} fontSize="12" fontWeight="black" textAnchor="middle" className="pointer-events-none">United States</text>

            {/* South America (Brazil Node) */}
            <path 
              d="M 280 280 L 380 320 L 360 440 L 290 420 L 270 340 Z" 
              fill={hoveredCountry === "BR" ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.03)"} 
              stroke={hoveredCountry === "BR" ? "#10b981" : "rgba(255,255,255,0.08)"} 
              strokeWidth="2.5"
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHoveredCountry("BR")}
              onMouseLeave={() => setHoveredCountry(null)}
              onClick={() => handleCountryClick("BR")}
            />
            <text x="325" y="370" fill="white" opacity={hoveredCountry === "BR" ? 1 : 0.6} fontSize="12" fontWeight="black" textAnchor="middle" className="pointer-events-none">Brazil</text>

            {/* Europe / Spain Node */}
            <path 
              d="M 430 140 L 520 140 L 540 220 L 460 250 Z" 
              fill={hoveredCountry === "ES" ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.03)"} 
              stroke={hoveredCountry === "ES" ? "#10b981" : "rgba(255,255,255,0.08)"} 
              strokeWidth="2.5"
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHoveredCountry("ES")}
              onMouseLeave={() => setHoveredCountry(null)}
              onClick={() => handleCountryClick("ES")}
            />
            <text x="485" y="190" fill="white" opacity={hoveredCountry === "ES" ? 1 : 0.6} fontSize="12" fontWeight="black" textAnchor="middle" className="pointer-events-none">Spain</text>

            {/* India Node */}
            <path 
              d="M 640 200 L 730 200 L 710 300 L 670 320 Z" 
              fill={hoveredCountry === "IN" ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.03)"} 
              stroke={hoveredCountry === "IN" ? "#10b981" : "rgba(255,255,255,0.08)"} 
              strokeWidth="2.5"
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHoveredCountry("IN")}
              onMouseLeave={() => setHoveredCountry(null)}
              onClick={() => handleCountryClick("IN")}
            />
            <text x="685" y="255" fill="white" opacity={hoveredCountry === "IN" ? 1 : 0.6} fontSize="12" fontWeight="black" textAnchor="middle" className="pointer-events-none">India</text>

            {/* Japan Node */}
            <path 
              d="M 830 150 L 900 150 L 890 230 L 820 210 Z" 
              fill={hoveredCountry === "JP" ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.03)"} 
              stroke={hoveredCountry === "JP" ? "#10b981" : "rgba(255,255,255,0.08)"} 
              strokeWidth="2.5"
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHoveredCountry("JP")}
              onMouseLeave={() => setHoveredCountry(null)}
              onClick={() => handleCountryClick("JP")}
            />
            <text x="860" y="190" fill="white" opacity={hoveredCountry === "JP" ? 1 : 0.6} fontSize="12" fontWeight="black" textAnchor="middle" className="pointer-events-none">Japan</text>
          </svg>
        </div>

        {/* Instruction footer */}
        <div className="flex justify-center items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest pb-2">
          <Info size={12} className="text-emerald-500" />
          Hover and click highlight boxes to explore the culture's audio signature.
        </div>
      </div>

      {/* SIDEBAR DETAIL DRAWER */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 250 }}
            className="w-full lg:w-[400px] bg-[#121212] border-l border-white/5 p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar z-20 shadow-2xl relative"
          >
            {/* Header close */}
            <button 
              onClick={() => setSelectedCountry(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition"
              title="Close Panel"
            >
              <X size={18} />
            </button>

            <div>
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Global Discovery</p>
              <h3 className="text-2xl font-black text-white mt-1 border-b border-white/5 pb-3 pr-8">{selectedCountry.name}</h3>

              <div className="mt-6 flex flex-col gap-5">
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Trending Genres</h4>
                  <p className="text-sm font-black text-white mt-1">{selectedCountry.genre}</p>
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Traditional Instrument</h4>
                  <p className="text-sm font-black text-emerald-400 mt-1">{selectedCountry.instrument}</p>
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Acoustic Heritage</h4>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed mt-1">{selectedCountry.description}</p>
                </div>
              </div>
            </div>

            {/* Curated list */}
            <div className="mt-10">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                <Music size={12} className="text-emerald-500" />
                Trending Tracks in region
              </h4>

              <div className="flex flex-col gap-2.5">
                {selectedCountry.songs.map((song) => (
                  <div 
                    key={song.id} 
                    onClick={() => handlePlaySong(song.name)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition cursor-pointer group"
                  >
                    <div className="min-w-0 pr-4">
                      <p className="text-xs font-black text-white truncate group-hover:text-emerald-400 transition-colors">{song.name}</p>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">{song.desc}</p>
                    </div>

                    <button className="p-2 bg-emerald-500 text-black rounded-full shadow hover:scale-105 transition active:scale-95">
                      <Play size={12} fill="black" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default GlobalMap;
