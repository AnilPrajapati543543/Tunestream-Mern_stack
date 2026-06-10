import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { motion } from "framer-motion";
import { Award, Flame, CheckCircle2, Circle, Target, Trophy } from "lucide-react";

const GamificationHub = () => {
  const { user, checkAuth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/user/me");
      if (res.data.success) {
        setProfile(res.data.user);
      }
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#121212] rounded-lg">
        <span className="text-4xl animate-bounce mb-4">🏆</span>
        <h3 className="text-xl font-bold text-white mb-2">Login to enter Quest Board</h3>
        <p className="text-gray-400 max-w-sm text-xs">Complete daily listening challenges, level up, and collect rare achievements by logging into your Tunestream account.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#121212]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Loading Quests...</p>
        </div>
      </div>
    );
  }

  const activeUser = profile || user;

  // Mock challenges if none exist on the user object yet
  const defaultQuests = [
    { id: "quest_1", title: "Listen to 3 Songs", target: 3, current: 2, completed: false, xpReward: 50 },
    { id: "quest_2", title: "Explore 2 Different Artists", target: 2, current: 1, completed: false, xpReward: 60 },
    { id: "quest_3", title: "Stream for 2 minutes", target: 120, current: 120, completed: true, xpReward: 80 }
  ];

  const activeQuests = activeUser.dailyChallenges && activeUser.dailyChallenges.length > 0 
    ? activeUser.dailyChallenges 
    : defaultQuests;

  // XP calculation
  const currentXp = activeUser.xp || 0;
  const level = activeUser.level || 1;
  const nextLevelXp = Math.pow(level, 2) * 100;
  const prevLevelXp = Math.pow(level - 1, 2) * 100;
  const xpRange = nextLevelXp - prevLevelXp;
  const xpProgress = Math.min(((currentXp - prevLevelXp) / xpRange) * 100, 100);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 custom-scrollbar text-white select-none">
      
      {/* Header Info */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-3xl font-black tracking-tight flex items-center gap-2">
            <span>Quest Board & Achievements</span>
            <Trophy className="text-yellow-500 animate-bounce" size={24} />
          </h2>
          <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">Complete quests to level up and earn badges</p>
        </div>
      </div>

      {/* LEVEL STATUS PANEL */}
      <div className="mb-8 bg-gradient-to-br from-emerald-500/10 via-indigo-500/5 to-transparent border border-white/5 p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 shadow-xl">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-600 flex flex-col items-center justify-center text-black shadow-2xl flex-shrink-0">
          <span className="text-[10px] font-black uppercase tracking-wider leading-none">LEVEL</span>
          <span className="text-3xl font-black leading-tight">{level}</span>
        </div>

        <div className="flex-1 w-full text-center md:text-left">
          <h3 className="text-lg font-black text-white">Music Explorer Rank</h3>
          <p className="text-xs text-gray-400 mt-0.5">Stream tracks to gain experience points (XP). You receive +10 XP per song listen.</p>

          <div className="mt-4 bg-white/5 rounded-full h-3 overflow-hidden border border-white/5 relative">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: `${xpProgress}%` }} />
          </div>
          <div className="mt-1.5 flex justify-between text-[11px] text-gray-400 font-bold">
            <span>{currentXp} XP accumulated</span>
            <span>Next Level: {nextLevelXp} XP ({nextLevelXp - currentXp} XP to go)</span>
          </div>
        </div>
      </div>

      {/* DAILY CHALLENGES BOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Quests Column */}
        <div className="lg:col-span-7 bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest border-b border-white/5 pb-2 flex items-center gap-1.5">
            <Target size={16} className="text-emerald-400" />
            Daily Listening Quests
          </h3>

          <div className="flex flex-col gap-3">
            {activeQuests.map((quest) => {
              const progressPct = Math.min((quest.current / quest.target) * 100, 100);
              return (
                <div 
                  key={quest.id} 
                  className={`flex flex-col p-4 rounded-2xl bg-[#181818]/60 border transition-all duration-300
                    ${quest.completed ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/5"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {quest.completed ? (
                        <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={18} />
                      ) : (
                        <Circle className="text-gray-600 flex-shrink-0" size={18} />
                      )}
                      <span className={`text-xs font-black truncate ${quest.completed ? "text-gray-400 line-through" : "text-white"}`}>
                        {quest.title}
                      </span>
                    </div>

                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
                      +{quest.xpReward} XP
                    </span>
                  </div>

                  {/* Quest progress slider */}
                  <div className="mt-3 bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
                  </div>
                  <div className="mt-1 flex justify-between text-[9px] text-gray-400 font-bold">
                    <span>
                      {quest.id === "quest_3" 
                        ? `${Math.round(quest.current / 60)} / ${Math.round(quest.target / 60)} min` 
                        : `${quest.current} / ${quest.target}`}
                    </span>
                    <span>{quest.completed ? "Completed" : "In Progress"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges Drawer Column */}
        <div className="lg:col-span-5 bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest border-b border-white/5 pb-2 flex items-center gap-1.5">
            <Award size={16} className="text-emerald-400" />
            Exploration Badges
          </h3>

          <div className="grid grid-cols-2 gap-3.5">
            {[
              { name: "First Discovery", desc: "Listened to first song", unlocked: activeUser.badges?.includes("First Discovery") },
              { name: "Melomanic Listener", desc: "Listened to 10+ tracks", unlocked: activeUser.badges?.includes("Melomanic Listener") },
              { name: "Genre Explorer", desc: "Streamed 3+ unique artists", unlocked: activeUser.badges?.includes("Genre Explorer") }
            ].map((badge) => (
              <div 
                key={badge.name} 
                className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all duration-300
                  ${badge.unlocked 
                    ? "bg-white/5 border-yellow-500/20" 
                    : "bg-[#181818]/40 border-white/5 opacity-40 select-none"}`}
              >
                <div className={`p-3 rounded-xl mb-2.5 
                  ${badge.unlocked 
                    ? "bg-yellow-500/10 border border-yellow-500/30 text-yellow-500" 
                    : "bg-white/5 text-gray-500"}`}
                >
                  <Award size={22} fill={badge.unlocked ? "currentColor" : "none"} />
                </div>
                <h4 className="text-[10px] font-black text-white leading-tight">{badge.name}</h4>
                <p className="text-[8px] text-gray-400 mt-1 font-bold leading-normal">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default GamificationHub;
