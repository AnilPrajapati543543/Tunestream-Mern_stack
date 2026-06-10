import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Award, UserCheck, UserPlus, ListMusic, Music, ShieldAlert } from "lucide-react";
import { toast } from "react-toastify";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await API.get(`/social/profile/${id}`);
        if (res.data.success) {
          setProfile(res.data.profile);
          setPlaylists(res.data.playlists || []);
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
        toast.error("User profile not found");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      loadProfile();
    }
  }, [id]);

  const handleFollowToggle = async () => {
    if (!profile) return;
    setFollowLoading(true);
    try {
      const endpoint = profile.isFollowed ? `/social/unfollow/${profile.id}` : `/social/follow/${profile.id}`;
      const res = await API.post(endpoint);
      if (res.data.success) {
        setProfile(prev => ({
          ...prev,
          isFollowed: !prev.isFollowed,
          followersCount: prev.isFollowed ? prev.followersCount - 1 : prev.followersCount + 1
        }));
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#121212]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#121212] rounded-lg">
        <ShieldAlert className="text-red-500 mb-4 animate-bounce" size={40} />
        <h3 className="text-xl font-bold text-white mb-2">Profile Not Found</h3>
        <p className="text-gray-400 max-w-sm text-xs">The requested profile ID is invalid or has been deactivated.</p>
        <button onClick={() => navigate("/")} className="mt-6 px-6 py-2 bg-emerald-500 text-black font-black text-xs rounded-full uppercase tracking-wider transition">
          Return Home
        </button>
      </div>
    );
  }

  const isOwnProfile = profile.id === (currentUser?.id || currentUser?._id);

  // Experience points progress
  const currentXp = profile.xp || 0;
  const nextLevelXp = Math.pow(profile.level, 2) * 100;
  const prevLevelXp = Math.pow(profile.level - 1, 2) * 100;
  const xpRange = nextLevelXp - prevLevelXp;
  const xpProgress = Math.min(((currentXp - prevLevelXp) / xpRange) * 100, 100);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 custom-scrollbar text-white select-none">
      
      {/* HERO SECTION */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-6 border-b border-white/5">
        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-600 to-indigo-600 flex items-center justify-center font-black text-black text-3xl md:text-5xl shadow-2xl relative">
          {profile.name[0].toUpperCase()}
          <span className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-xs font-black px-2 py-0.5 rounded-full border-2 border-black shadow">
            Lv. {profile.level}
          </span>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">{profile.name}</h2>
          
          <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold text-gray-400">
            <div><span className="text-white font-black">{profile.followersCount}</span> Followers</div>
            <div><span className="text-white font-black">{profile.followingCount}</span> Following</div>
            <div><span className="text-white font-black">{playlists.length}</span> Public Playlists</div>
          </div>

          {/* XP Progress Bar (Gamification status) */}
          <div className="mt-5 max-w-md bg-white/5 rounded-full h-2 overflow-hidden border border-white/5 relative">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-gray-400 font-bold max-w-md">
            <span>{currentXp} XP</span>
            <span>Next Level: {nextLevelXp} XP</span>
          </div>
        </div>

        {/* Action Button */}
        {!isOwnProfile && currentUser && (
          <button
            onClick={handleFollowToggle}
            disabled={followLoading}
            className={`px-6 py-2.5 rounded-full text-xs font-black flex items-center gap-2 shadow-lg transition active:scale-95
              ${profile.isFollowed 
                ? "bg-white/10 hover:bg-white/15 text-white border border-white/10" 
                : "bg-emerald-500 hover:bg-emerald-400 text-black"}`}
          >
            {profile.isFollowed ? (
              <>
                <UserCheck size={14} className="stroke-[3]" />
                Following
              </>
            ) : (
              <>
                <UserPlus size={14} className="stroke-[3]" />
                Follow
              </>
            )}
          </button>
        )}
      </div>

      {/* BADGES & PLAYLISTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Badges Cabinet */}
        <div className="lg:col-span-5 bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest border-b border-white/5 pb-2">Unlocked Badges</h3>
          
          {profile.badges?.length === 0 ? (
            <div className="text-center py-8 opacity-40 flex flex-col items-center justify-center gap-2">
              <Award size={28} className="text-gray-500" />
              <p className="text-[10px] font-bold uppercase tracking-wider">No badges unlocked yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {profile.badges?.map((badge) => (
                <div key={badge} className="flex flex-col items-center text-center p-2 rounded-2xl bg-white/5 border border-white/5 hover:scale-105 transition">
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 rounded-2xl mb-2">
                    <Award size={20} fill="currentColor" className="opacity-90" />
                  </div>
                  <span className="text-[9px] font-black leading-tight text-white/95">{badge}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Public Playlists list */}
        <div className="lg:col-span-7 bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest border-b border-white/5 pb-2">Public Playlists</h3>
          
          {playlists.length === 0 ? (
            <div className="text-center py-8 opacity-40 flex flex-col items-center justify-center gap-2">
              <ListMusic size={28} className="text-gray-500" />
              <p className="text-[10px] font-bold uppercase tracking-wider">No public playlists</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {playlists.map((playlist) => (
                <div 
                  key={playlist._id} 
                  onClick={() => navigate(`/playlist/${playlist._id}`)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition cursor-pointer border border-transparent hover:border-white/5"
                >
                  <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
                    <ListMusic size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">{playlist.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">{playlist.songs?.length || 0} tracks</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default UserProfile;
