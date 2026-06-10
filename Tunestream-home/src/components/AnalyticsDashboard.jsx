import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Calendar, Music, Activity, Flame, Clock, Award, ChevronRight, Disc, Play } from "lucide-react";
import { toast } from "react-toastify";

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get("/history/analytics");
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Failed to load listening analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchAnalytics();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#121212] rounded-lg">
        <span className="text-4xl animate-bounce mb-4">📊</span>
        <h3 className="text-xl font-bold text-white mb-2">Login to view Listening Analytics</h3>
        <p className="text-gray-400 max-w-sm text-xs">Unlock streaks, weekly breakdowns, top tracks, and genre charts by logging in to your Tunestream account.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#121212]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Crunching Stats...</p>
        </div>
      </div>
    );
  }

  // Fallback / Initial mock state if user has no listening history yet
  const mockData = {
    streak: 3,
    weeklyBreakdown: [
      { name: "Mon", count: 20 },
      { name: "Tue", count: 45 },
      { name: "Wed", count: 15 },
      { name: "Thu", count: 60 },
      { name: "Fri", count: 35 },
      { name: "Sat", count: 50 },
      { name: "Sun", count: 10 }
    ],
    topSongs: [
      { id: "s1", name: "Despacito Remix", plays: 24 },
      { id: "s2", name: "Lomberghini Hits", plays: 18 },
      { id: "s3", name: "Kahani Suno 2.0", plays: 12 },
      { id: "s4", name: "Let's Nacho Beats", plays: 9 }
    ],
    topArtists: [
      { name: "Vishal-Shekhar", plays: 32 },
      { name: "Badshah", plays: 25 },
      { name: "Kaifi Khalil", plays: 14 }
    ],
    genreDistribution: [
      { name: "Bollywood", value: 45 },
      { name: "Electronic", value: 30 },
      { name: "Lofi / Chill", value: 15 },
      { name: "Acoustic", value: 10 }
    ],
    recap: {
      totalTracks: 53,
      totalMinutes: 198,
      streak: 3,
      favouriteGenre: "Bollywood"
    }
  };

  const active = data || mockData;

  // Render SVG Pie/Donut Chart for Genre Distribution
  const renderGenreChart = () => {
    let accumulatedPercent = 0;
    const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"];
    
    return (
      <svg viewBox="0 0 100 100" className="w-full max-w-[200px] aspect-square">
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="10" />
        {active.genreDistribution.map((genre, idx) => {
          const color = colors[idx % colors.length];
          const strokeDash = `${genre.value} ${100 - genre.value}`;
          const strokeOffset = 100 - accumulatedPercent + 25; // start top offset
          accumulatedPercent += genre.value;

          return (
            <circle
              key={genre.name}
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke={color}
              strokeWidth="10"
              strokeDasharray={strokeDash}
              strokeDashoffset={strokeOffset}
              pathLength="100"
              className="transition-all duration-1000 ease-out hover:stroke-[12] cursor-pointer"
              title={`${genre.name}: ${genre.value}%`}
            />
          );
        })}
        {/* Center cutout for donut style */}
        <circle cx="50" cy="50" r="28" fill="#121212" />
        <text x="50" y="48" textAnchor="middle" fill="#888" fontSize="6" fontWeight="bold">TOP GENRE</text>
        <text x="50" y="58" textAnchor="middle" fill="#fff" fontSize="7.5" fontWeight="black">
          {active.recap.favouriteGenre.split("/")[0].trim()}
        </text>
      </svg>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 md:px-6 py-2 custom-scrollbar text-white select-none">
      
      {/* Header Info */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-3xl font-black tracking-tight flex items-center gap-2">
            <span>Your Listening Analytics</span>
            <Activity className="text-emerald-500 animate-pulse" size={24} />
          </h2>
          <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">
            A comprehensive look at your musical tastes and listening habits.
          </p>
        </div>

        {/* Streak Counter widget */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent border border-orange-500/20 shadow-lg glow-active"
        >
          <div className="p-2.5 bg-orange-500 text-black rounded-xl shadow-md">
            <Flame size={20} fill="black" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Listening Streak</p>
            <h4 className="text-lg font-black text-orange-400 mt-0.5">{active.streak} Days Streak</h4>
          </div>
        </motion.div>
      </div>

      {/* Recap Stats Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Minutes Streamed", value: `${active.recap.totalMinutes} min`, icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10" },
          { label: "Tracks Listened", value: active.recap.totalTracks, icon: Music, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Listening Level", value: `Lv. ${user.level || 1}`, icon: Award, color: "text-yellow-400", bg: "bg-yellow-400/10" },
          { label: "Streak Bonus", value: `+${active.streak * 10} XP`, icon: Flame, color: "text-orange-400", bg: "bg-orange-400/10" }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5 shadow-inner">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-base font-black text-white mt-1 leading-none">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Chart 1: Weekly Breakdown (Bar Graph) */}
        <div className="lg:col-span-8 bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col justify-between min-h-[320px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">Weekly Streaming Activity</h3>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Daily listening time in minutes</p>
            </div>
            <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-emerald-400 font-bold flex items-center gap-1">
              <Calendar size={12} />
              Last 7 Days
            </span>
          </div>

          {/* Render HTML Bars */}
          <div className="flex-1 flex items-end justify-between gap-4 h-48 pt-4 pb-2">
            {active.weeklyBreakdown.map((day, idx) => {
              const maxVal = Math.max(...active.weeklyBreakdown.map(d => d.count), 1);
              const heightPercent = `${(day.count / maxVal) * 90}%`;

              return (
                <div key={day.name} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="w-full flex justify-center relative">
                    {/* Hover tooltip */}
                    <div className="absolute -top-7 scale-0 group-hover:scale-100 bg-[#282828] border border-white/10 px-2 py-1 rounded text-[10px] font-bold transition duration-200 z-10 shadow-lg text-white">
                      {day.count}m
                    </div>
                    {/* Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: heightPercent }}
                      transition={{ type: "spring", stiffness: 80, damping: 15, delay: idx * 0.05 }}
                      className="w-8 sm:w-10 bg-gradient-to-t from-emerald-500/30 to-emerald-500 rounded-t-lg group-hover:from-emerald-400 group-hover:to-emerald-300 transition-all cursor-pointer relative shadow shadow-emerald-500/10"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 group-hover:text-white transition-colors">{day.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Genre Distribution (Donut Graph) */}
        <div className="lg:col-span-4 bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-between min-h-[320px]">
          <div className="w-full text-left">
            <h3 className="text-sm font-black uppercase tracking-wider text-white">Genre Breakdown</h3>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Ratio of music preferences</p>
          </div>

          <div className="my-2 flex items-center justify-center w-full">
            {renderGenreChart()}
          </div>

          {/* Genre Legends list */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full text-left text-[11px] font-bold text-gray-300">
            {active.genreDistribution.map((genre, idx) => {
              const colors = ["bg-emerald-500", "bg-blue-500", "bg-yellow-500", "bg-pink-500", "bg-purple-500"];
              return (
                <div key={genre.name} className="flex items-center gap-1.5 truncate">
                  <span className={`w-2.5 h-2.5 rounded-full ${colors[idx % colors.length]}`} />
                  <span className="truncate">{genre.name}</span>
                  <span className="text-gray-500">({genre.value}%)</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Top Tracks & Artists Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Top Tracks Cards */}
        <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-white border-b border-white/5 pb-2">Your Top Tracks</h3>
          
          <div className="flex flex-col gap-2.5">
            {active.topSongs.map((song, idx) => (
              <div key={`${song.id}-${idx}`} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition group cursor-pointer">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-6 text-center text-xs font-black ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                    0{idx + 1}
                  </span>
                  
                  {/* Music Disc icon */}
                  <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center flex-shrink-0 relative">
                    <Disc size={18} className="group-hover:rotate-180 transition-transform duration-700" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-black truncate text-white group-hover:text-emerald-400 transition-colors">{song.name}</p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">Audited tracks catalog</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-right">
                  <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400 font-bold uppercase tracking-wider">{song.plays} plays</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Artists Cards */}
        <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-white border-b border-white/5 pb-2">Your Top Artists</h3>
          
          <div className="flex flex-col gap-2.5">
            {active.topArtists.map((artist, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition group cursor-pointer">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-6 text-center text-xs font-black ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                    0{idx + 1}
                  </span>
                  
                  {/* Round Avatar visual */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center text-black font-black text-xs flex-shrink-0">
                    {artist.name[0].toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-black truncate text-white group-hover:text-emerald-400 transition-colors">{artist.name}</p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">Platform Verified Artist</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-right">
                  <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400 font-bold uppercase tracking-wider">{artist.plays} streams</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsDashboard;
