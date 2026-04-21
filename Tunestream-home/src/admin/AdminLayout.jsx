import React, { useState, useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddSong from './pages/AddSong/AddSong';
import ListSong from './pages/ListSong/ListSong';
import AddAlbum from './pages/AddAlbum/AddAlbum';
import ListAlbum from './pages/ListAlbum/ListAlbum';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';

const AdminLayout = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved) setDarkMode(saved === 'true')
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  return (
    <div className={`flex min-h-screen w-full ${darkMode ? 'bg-[#0f0f1a] text-white' : 'bg-gray-100 text-gray-800'}`}>
      <ToastContainer />

      <Sidebar darkMode={darkMode} />

      <div className='flex-1 flex flex-col overflow-hidden'>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <div className="p-6 overflow-y-auto h-full">
          <div className={`
            rounded-2xl p-6 border shadow-xl
            transition-all duration-300
            ${darkMode 
              ? 'bg-white/5 border-white/10' 
              : 'bg-white border-gray-200'
            }
          `}>
            <Routes>
              <Route path="/" element={<Navigate to="list-songs" />} />
              <Route path="add-song" element={<AddSong />} />
              <Route path="list-songs" element={<ListSong />} />
              <Route path="add-album" element={<AddAlbum />} />
              <Route path="list-albums" element={<ListAlbum />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout;
