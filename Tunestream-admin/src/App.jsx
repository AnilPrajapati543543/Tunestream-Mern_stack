import React, { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddSong from './pages/AddSong/AddSong';
import ListSong from './pages/ListSong/ListSong';
import AddAlbum from './pages/AddAlbum/AddAlbum';
import ListAlbum from './pages/ListAlbum/ListAlbum';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';

export const url = import.meta.env.VITE_API_URL || "http://localhost:4000";

const App = () => {

  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved) setDarkMode(saved === 'true')
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  return (
    <div className='flex min-h-screen'>
      <ToastContainer />

      <Sidebar darkMode={darkMode} />

      <div className={`flex-1 transition-all duration-300 ${darkMode ? 'bg-[#0f0f1a]' : 'bg-gray-100'}`}>
        
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <div className="p-6 glow-bg">

          <div className={`
            rounded-2xl p-6 border shadow-xl animate-float
            transition-all duration-300 hover:scale-[1.01]
            ${darkMode 
              ? 'bg-white/5 border-white/10 text-white' 
              : 'bg-white border-gray-200 text-gray-800'
            }
          `}>

            <div className="animate-page">
              <Routes>
                <Route path="/add-song" element={<AddSong />} />
                <Route path="/list-songs" element={<ListSong />} />
                <Route path="/add-album" element={<AddAlbum />} />
                <Route path="/list-albums" element={<ListAlbum />} />
              </Routes>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default App