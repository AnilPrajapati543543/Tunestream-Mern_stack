import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

const Navbar = ({ darkMode, setDarkMode }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-[var(--surface-color)] border-b border-[var(--border-color)] shadow-sm z-10">
      
      <div className="flex items-center gap-3">
        {/* User Profile instead of "T" */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 bg-emerald-500 text-white font-bold text-lg uppercase">
          {user?.name ? user.name[0] : '👨‍💼'}
        </div>
        <div className="flex flex-col">
          <h2 className="font-extrabold text-lg leading-tight tracking-tight text-[var(--text-primary)]">
            {user?.name || 'Admin'}
          </h2>
          <span className="text-[10px] font-bold text-[var(--accent-color)] uppercase tracking-wider">System Administrator</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setDarkMode(!darkMode)}
          className="
            flex items-center justify-center w-10 h-10 rounded-xl
            bg-[var(--bg-color)] border border-[var(--border-color)]
            text-[var(--text-primary)] transition-all shadow-sm hover:border-[var(--accent-color)]
          "
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <span className="text-lg">{darkMode ? '🌙' : '☀️'}</span>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="
            flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-red-500/10 text-red-500 border border-red-500/20
            text-[13px] font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm
          "
        >
          <span>Logout</span>
          <span className="text-xs"></span>
        </motion.button>
      </div>

    </nav>
  )
}

export default Navbar

