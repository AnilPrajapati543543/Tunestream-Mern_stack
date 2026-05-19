import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, MessageSquare, User } from 'lucide-react';
import { toast } from 'react-toastify';

const FeedbackModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.warning("Please click a star to give a rating!");
      return;
    }

    setLoading(true);
    try {
      await API.post("/user/submit-feedback", {
        name: name || user?.name || "Anonymous",
        rating,
        comment: comment || "Excellent audio experience!"
      });
      toast.success("Thank you for your rating!");
      onSuccess(); // Complete the logout callback
    } catch (error) {
      console.error("Failed to submit feedback", error);
      toast.error("Feedback submission failed");
      onSuccess(); // Complete logout anyway so session does not get stuck
    } finally {
      setLoading(false);
    }
  };

  // Define unique dynamic animations for each star index (0 to 4)
  const getStarAnimation = (index) => {
    switch (index) {
      case 0: // Star 1: Simple float lift
        return {
          whileHover: { y: -4, scale: 1.1, transition: { type: "spring", stiffness: 400 } }
        };
      case 1: // Star 2: Dynamic double pulse
        return {
          whileHover: { 
            scale: [1, 1.25, 1.1, 1.25, 1],
            transition: { duration: 0.6, repeat: Infinity }
          }
        };
      case 2: // Star 3: Dynamic 360-degree rotation spin
        return {
          whileHover: { rotate: 360, scale: 1.25, transition: { duration: 0.5, ease: "easeInOut" } }
        };
      case 3: // Star 4: Rubberband visual stretch
        return {
          whileHover: { 
            scaleX: [1, 1.45, 0.75, 1.15, 1],
            scaleY: [1, 0.65, 1.35, 0.85, 1],
            transition: { duration: 0.6, ease: "easeInOut" }
          }
        };
      case 4: // Star 5: Massive explosive pop, color morph, and drop-shadow glow!
        return {
          whileHover: { 
            scale: 1.5,
            rotate: [0, -15, 15, -15, 0],
            filter: "drop-shadow(0 0 10px rgba(245, 158, 11, 0.95))",
            transition: { duration: 0.4 }
          }
        };
      default:
        return { whileHover: { scale: 1.2 } };
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
        {/* Backdrop Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="relative w-full max-w-md bg-[#0b0b0f] border border-white/10 rounded-[2.5rem] p-5 sm:p-6 text-white text-center flex flex-col items-center gap-4 sm:gap-6 shadow-[0_30px_70px_rgba(0,0,0,0.85)] z-10 max-h-[92vh] overflow-y-auto no-scrollbar"
        >
          {/* Header */}
          <div className="w-full flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-[10px] font-black uppercase text-amber-500 tracking-[0.25em] pl-1">TuneStream Ratings</span>
            <button 
              onClick={() => onSuccess()}
              className="p-1.5 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition active:scale-95"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-black tracking-tight text-white">How was your session?</h2>
            <p className="text-xs text-gray-400 font-medium">Your reviews are saved directly in our admin records.</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            {/* User Name input (Prepopulated) */}
            <div className="flex flex-col gap-1.5 text-left">
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest pl-1">Reviewer Name</span>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your display name"
                  className="w-full bg-[#121218] border border-white/5 focus:border-amber-500/50 rounded-2xl py-3 px-10 text-xs font-bold text-white placeholder-gray-600 outline-none transition duration-300"
                  required
                />
                <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Dynamic Star Rating Block */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest pl-1 text-left">Rating Level</span>
              <div className="flex items-center justify-center gap-3 py-2 bg-[#121218]/40 border border-white/5 rounded-2xl shadow-inner">
                {[...Array(5)].map((_, i) => {
                  const ratingValue = i + 1;
                  const isHighlighted = ratingValue <= (hoverRating || rating);
                  return (
                    <motion.button
                      key={i}
                      type="button"
                      onClick={() => setRating(ratingValue)}
                      onMouseEnter={() => setHoverRating(ratingValue)}
                      onMouseLeave={() => setHoverRating(0)}
                      {...getStarAnimation(i)}
                      className="p-1 rounded-full outline-none select-none cursor-pointer"
                    >
                      <Star
                        size={28}
                        fill={isHighlighted ? "#f59e0b" : "none"}
                        stroke={isHighlighted ? "#f59e0b" : "#4b5563"}
                        className={`transition-colors duration-250 ${isHighlighted ? "text-amber-500" : "text-gray-600"}`}
                      />
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Optional Comment textarea */}
            <div className="flex flex-col gap-1.5 text-left">
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest pl-1">Write a Review (Optional)</span>
              <div className="relative">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="e.g. Incredible high-fidelity acoustics, beautiful visual scroll effects!"
                  className="w-full bg-[#121218] border border-white/5 focus:border-amber-500/50 rounded-2xl py-3 px-10 text-xs font-medium text-white placeholder-gray-600 outline-none transition duration-300 resize-none h-20"
                />
                <MessageSquare size={14} className="absolute left-4 top-4 text-gray-500" />
              </div>
            </div>

            {/* Submit Action buttons */}
            <div className="flex flex-col gap-2.5 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-500/10 active:scale-95 transition-all"
              >
                {loading ? "SUBMITTING REVIEW..." : "SUBMIT REVIEW & LOGOUT"}
              </motion.button>

              <button
                type="button"
                onClick={() => onSuccess()}
                className="text-[10px] text-gray-500 hover:text-white uppercase font-bold tracking-widest hover:underline pt-1 active:scale-95 transition"
              >
                Skip Feedback & Logout
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FeedbackModal;
