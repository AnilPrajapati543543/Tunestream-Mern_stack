import React from 'react'

const Navbar = ({ darkMode, setDarkMode }) => {
  return (
    <div className={`
      flex justify-between items-center px-6 py-4 border-b
      ${darkMode ? 'border-white/10 text-white' : 'bg-white text-gray-800'}
    `}>

      <h2 className="font-semibold text-lg">Admin Panel</h2>

      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="px-3 py-1 rounded-md bg-gray-200 text-gray-800 text-sm
        transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-gray-300"
      >
        {darkMode ? 'Dark' : 'Light'}
      </button>

    </div>
  )
}

export default Navbar
