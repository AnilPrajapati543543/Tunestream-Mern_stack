import React from "react";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ darkMode, isOpen, setIsOpen }) => {
  const { user } = useAuth();

  const menuItems = [
    { to: "/add-song", icon: assets.add_song, text: "Add Song" },
    { to: "/list-songs", icon: assets.song_icon, text: "List Songs" },
    { to: "/add-album", icon: assets.add_album, text: "Add Album" },
    { to: "/list-albums", icon: assets.album_icon, text: "List Album" },
    ...(user?.role === 'admin' ? [{ to: "/linked-users", icon: assets.album_icon, text: "Linked Users" }] : []),
    { to: "/report", icon: assets.song_icon, text: "Report" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`
          fixed md:static inset-y-0 left-0 w-[260px] md:w-[240px] p-6 transition-all duration-300 transform
          bg-[var(--surface-color)] border-r border-[var(--border-color)]
          flex flex-col gap-8 shadow-2xl md:shadow-sm z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-4 right-4 p-2 rounded-xl hover:bg-[var(--bg-color)] text-[var(--text-secondary)]"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 px-2"
      >
        <img src={assets.logo} className="w-9" alt="Logo" />
        <h1 className="font-bold text-xl tracking-tight text-[var(--text-primary)]">
          Tune<span className="text-[var(--accent-color)]">Stream</span>
        </h1>
      </motion.div>


      {/* Navigation */}
      <nav className="flex flex-col gap-1.5 flex-1 mt-4">
        <p className="px-3 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-3 opacity-40">
          Management
        </p>
        {menuItems.map((item, i) => (
          <NavLink key={i} to={item.to} className="group rounded-full">
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 4 }}
                className={`
                  flex items-center gap-4 px-5 py-4 rounded-full text-[14px] font-bold
                  transition-all duration-300 relative overflow-hidden
                  ${isActive
                    ? "text-white shadow-lg shadow-emerald-500/20"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-color)] hover:text-[var(--text-primary)]"
                  }
                `}
                style={isActive ? { background: 'var(--accent-gradient)' } : {}}
              >
                <img
                  src={item.icon}
                  className={`w-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'brightness-0 invert' : 'opacity-70'}`}
                  alt={item.text}
                />
                <span className="relative z-10">{item.text}</span>
              </motion.div>
            )}
          </NavLink>
        ))}


      </nav>

      {/* Invite Code Card */}
      {user?.role === 'admin' && user?.inviteCode && (
        <div className="mt-auto">
          <div className="p-6 rounded-3xl bg-[var(--bg-color)] border border-[var(--border-color)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-150" />

            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3 opacity-60">
              Your Invite Code
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xl font-black tracking-[0.3em] text-[var(--accent-color)]">
                  {user.inviteCode}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(user.inviteCode);
                    toast.success("Code copied to clipboard!");
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-[var(--surface-color)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] transition-all shadow-sm"
                  title="Copy Code"
                >
                  <span className="text-xs">📄</span>
                </button>
              </div>

              <div className="w-full bg-[var(--border-color)] h-1 rounded-full overflow-hidden">
                <div className="bg-[var(--accent-color)] h-full w-[100%]" />
              </div>
            </div>

            <p className="text-[10px] text-[var(--text-secondary)] mt-4 leading-relaxed opacity-60 font-medium">
              Share this code to add users. <br />Max capacity: 6 seats.
            </p>
          </div>
        </div>
      )}

    </aside>
    </>
  );
};

export default Sidebar;