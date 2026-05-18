import React, { useContext, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Player from "./components/Player.jsx";
import Display from "./components/Display.jsx";
import NowPlayingCard from "./components/NowPlayingCard.jsx";
import AuthModal from "./components/AuthModal.jsx";
import BottomNav from "./components/BottomNav.jsx";
import { PlayerContext } from "./context/PlayerContext";
import { useAuth } from "./context/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ResetPassword from "./pages/ResetPassword.jsx";
import OnboardingGesture from "./components/OnboardingGesture.jsx";

export const url = import.meta.env.VITE_API_URL || "https://tunestream-backend.vercel.app";

const ArtistRedirect = () => {
  React.useEffect(() => {
    window.location.href = import.meta.env.VITE_ADMIN_URL || "https://www-tunestream-admin.vercel.app";
  }, []);
  return null;
};

const App = () => {
  const { audioRef, track, loading: playerLoading, isAuthModalOpen, setIsAuthModalOpen } = useContext(PlayerContext);
  const { user, loading: authLoading } = useAuth();

  if (authLoading) return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xl font-medium text-emerald-500">Initializing Tunestream...</p>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-black overflow-hidden selection:bg-emerald-500/30">
      <Routes>
        <Route path="/artist" element={<ArtistRedirect />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Home App Route */}
        <Route path="*" element={
          <div className="h-screen flex flex-col bg-gradient-to-br from-black via-[#121212] to-black overflow-hidden">
            <AuthModal 
              isOpen={isAuthModalOpen} 
              onClose={() => setIsAuthModalOpen(false)} 
            />
            <ToastContainer theme="dark" position="bottom-right" />
            
            <OnboardingGesture />

            <div className="flex h-[90%] overflow-hidden relative">
              <div className="hidden md:flex h-full">
                <Sidebar />
              </div>
              <Display />
              <div className="hidden lg:flex h-full">
                <NowPlayingCard />
              </div>
            </div>

            <Player />
            <BottomNav />

            {track && <audio ref={audioRef} src={track.file} preload="auto" />}
          </div>
        } />
      </Routes>
    </div>
  );
};

export default App;