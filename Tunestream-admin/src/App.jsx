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
import Report from './pages/Report/Report';
import LinkedUsers from './pages/LinkedUsers/LinkedUsers';
import AdminLogin from './pages/Login/Login';
import AdminSignup from './pages/Signup/Signup';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import { useAuth } from './context/AuthContext';

export const url = import.meta.env.VITE_API_URL || "https://tunestream-backend.vercel.app";

const App = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, loading } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved) setDarkMode(saved === 'true')
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a]">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <>
        <ToastContainer position="top-center" autoClose={3000} />
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/signup" element={<AdminSignup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </>
    );
  }

  return (
    <div className={`h-screen flex transition-colors duration-300 overflow-hidden ${darkMode ? 'dark' : ''}`}>
      <ToastContainer theme={darkMode ? "dark" : "light"} position="top-center" autoClose={3000} />

      <Sidebar darkMode={darkMode} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-color)] h-full">
        
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-4 md:p-8 overflow-hidden glow-bg relative">

          <div className="glass-panel p-4 sm:p-6 md:p-10 h-full flex flex-col overflow-hidden">

            <div className="animate-page flex-1 h-full overflow-y-auto">
              <Routes>
                <Route path="/" element={<ListSong />} />
                <Route path="/add-song" element={<AddSong />} />
                <Route path="/list-songs" element={<ListSong />} />
                <Route path="/add-album" element={<AddAlbum />} />
                <Route path="/list-albums" element={<ListAlbum />} />
                <Route path="/linked-users" element={<LinkedUsers />} />
                <Route path="/report" element={<Report />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>

          </div>

        </main>

      </div>
    </div>

  )
}

export default App