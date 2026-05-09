import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const LinkedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/user/linked");
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch linked users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const removeUser = async (id) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    try {
      const response = await axios.delete(`/user/linked/${id}`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove user");
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return "0s";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    let parts = [];
    if (hrs > 0) parts.push(`${hrs}h`);
    if (mins > 0) parts.push(`${mins}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
    return parts.join(" ");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-4 border-[var(--accent-color)]/20 border-t-[var(--accent-color)] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Linked <span className="text-[var(--accent-color)]">Users</span></h2>
        <p className="text-sm text-[var(--text-secondary)]">Manage the members who joined using your invite code.</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.length === 0 ? (
            <div className="col-span-full text-center py-20 text-[var(--text-secondary)] opacity-50">
              <p className="text-4xl mb-4">👥</p>
              <p>No users have joined using your code yet.</p>
            </div>
          ) : (
            users.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[var(--surface-color)] border border-[var(--border-color)] p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--accent-color)]/5 rounded-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150" />

                <button
                  onClick={() => removeUser(user._id)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white shadow-lg"
                  title="Remove User"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--accent-gradient)] flex items-center justify-center text-white text-lg font-black shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)] leading-tight">{user.name}</h3>
                    <p className="text-xs text-[var(--text-secondary)] opacity-60">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-color)]/50 border border-[var(--border-color)]">
                    <span className="text-xs opacity-40">👤</span>
                    <span className="text-[13px] font-medium text-[var(--text-secondary)] truncate">{user.email}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex flex-col gap-1 p-3 rounded-2xl bg-[var(--bg-color)]/30 border border-[var(--border-color)]/50">
                      <span className="text-[10px] uppercase font-black opacity-30 tracking-tighter">Login</span>
                      <span className="text-[11px] font-bold text-[var(--text-primary)]">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 p-3 rounded-2xl bg-[var(--bg-color)]/30 border border-[var(--border-color)]/50">
                      <span className="text-[10px] uppercase font-black opacity-30 tracking-tighter">Logout</span>
                      <span className="text-[11px] font-bold text-[var(--text-primary)]">
                        {user.lastLogout ? new Date(user.lastLogout).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[var(--accent-color)]/5 border border-[var(--accent-color)]/10 mt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">⏱️</span>
                      <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Time Spent</span>
                    </div>
                    <span className="text-[13px] font-black text-[var(--accent-color)]">
                      {formatTime(user.totalSessionTime)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border-color)] opacity-40">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
                    Seat {index + 1} of 6
                  </p>
                </div>
              </motion.div>
            ))
          )}

          {users.length > 0 && users.length < 6 && (
            <div className="border-2 border-dashed border-[var(--border-color)] p-6 rounded-[2rem] flex flex-col items-center justify-center text-center opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
              <p className="text-2xl mb-2">₊</p>
              <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-tighter">Available Slot</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkedUsers;
