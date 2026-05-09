import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

const Navbar = ({ darkMode, setDarkMode, setSidebarOpen }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center px-4 md:px-8 py-4 bg-[var(--surface-color)] border-b border-[var(--border-color)] shadow-sm z-10">
      
      <div className="flex items-center gap-2 md:gap-3">
        {/* Mobile Hamburger */}
        <button 
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 rounded-xl hover:bg-[var(--bg-color)] text-[var(--text-primary)] transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* User Profile */}
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 bg-emerald-500 text-white font-bold text-base md:text-lg uppercase flex-shrink-0">
          {user?.name ? user.name[0] : '👨‍💼'}
        </div>
        <div className="flex flex-col">
          <h2 className="font-extrabold text-sm md:text-lg leading-tight tracking-tight text-[var(--text-primary)] truncate max-w-[100px] md:max-w-none">
            {user?.name || 'Admin'}
          </h2>
          <span className="text-[8px] md:text-[10px] font-bold text-[var(--accent-color)] uppercase tracking-wider">Admin</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setDarkMode(!darkMode)}
          className="
            flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl
            bg-[var(--bg-color)] border border-[var(--border-color)]
            text-[var(--text-primary)] transition-all shadow-sm hover:border-[var(--accent-color)]
          "
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <span className="text-base md:text-lg">{darkMode ? '🌙' : '☀️'}</span>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="
            flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-xl
            bg-red-500/10 text-red-500 border border-red-500/20
            text-[12px] md:text-[13px] font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm
          "
        >
          <span className="hidden sm:inline">Logout</span>
          <span className="sm:hidden text-lg">🚪</span>
        </motion.button>
      </div>

    </nav>
  )
}

export default Navbar

