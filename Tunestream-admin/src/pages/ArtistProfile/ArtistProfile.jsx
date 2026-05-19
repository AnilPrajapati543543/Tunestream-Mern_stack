import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import axios from "../../utils/axios";
import { motion } from "framer-motion";

const ArtistProfile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState("");
  const [artistBio, setArtistBio] = useState("");
  const [artistImage, setArtistImage] = useState("");
  const [monthlyListeners, setMonthlyListeners] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setArtistBio(user.artistBio || "");
      setArtistImage(user.artistImage || "");
      setMonthlyListeners(user.monthlyListeners || 0);
      setFollowersCount(user.followersCount || 0);
    }
  }, [user]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(`/user/artist-profile`, {
        name,
        artistBio,
        artistImage,
        monthlyListeners,
        followersCount
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success("Artist Profile Updated successfully!");
        // Update user state inside AuthContext
        setUser(response.data.user);
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred saving profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          Artist <span className="text-[var(--accent-color)]">Profile</span>
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Manage your public stage identity, branding, and stats displayed to users globally.
        </p>
      </div>

      <form onSubmit={onSubmitHandler} className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar pb-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Avatar Preview */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Profile Avatar</p>
            <div className="w-36 h-36 rounded-[2rem] bg-[var(--bg-color)] border-2 border-dashed border-[var(--border-color)] overflow-hidden flex items-center justify-center group relative shadow-md">
              {artistImage ? (
                <img className="w-full h-full object-cover" src={artistImage} alt="Avatar Preview" onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=60";
                }} />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-[var(--text-secondary)] opacity-40">
                  <span className="text-2xl">🎤</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider">No Avatar</span>
                </div>
              )}
            </div>
          </div>

          {/* Core Info Inputs */}
          <div className="flex-1 w-full grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Stage Name</p>
              <input
                className="premium-input w-full"
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="e.g. Vishal-Shekhar"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Avatar Image URL</p>
              <input
                className="premium-input w-full"
                onChange={(e) => setArtistImage(e.target.value)}
                value={artistImage}
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Monthly Listeners</p>
              <input
                className="premium-input w-full"
                onChange={(e) => setMonthlyListeners(Number(e.target.value))}
                value={monthlyListeners}
                type="number"
                min="0"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Followers Count</p>
              <input
                className="premium-input w-full"
                onChange={(e) => setFollowersCount(Number(e.target.value))}
                value={followersCount}
                type="number"
                min="0"
                required
              />
            </div>
          </div>
        </div>

        {/* Biography */}
        <div className="flex flex-col gap-2 max-w-5xl">
          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Artist Biography</p>
          <textarea
            className="premium-input min-h-[140px] resize-none leading-relaxed"
            onChange={(e) => setArtistBio(e.target.value)}
            value={artistBio}
            placeholder="Tell your musical journey, musical style, achievements..."
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="premium-button px-16 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          {loading ? "SAVING CHANGES..." : "SAVE ARTIST PROFILE"}
        </motion.button>
      </form>
    </div>
  );
};

export default ArtistProfile;
