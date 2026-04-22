import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

import AddSong from "./pages/AddSong/AddSong";
import ListSong from "./pages/ListSong/ListSong";
import AddAlbum from "./pages/AddAlbum/AddAlbum";
import ListAlbum from "./pages/ListAlbum/ListAlbum";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import AdminLogin from "./pages/AdminLogin";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  /* ================= LOADING SCREEN ================= */
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm tracking-wide animate-pulse">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  /* ================= AUTH GATE ================= */
  if (!user || user.role !== "admin") {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AdminLogin />
        </motion.div>
      </AnimatePresence>
    );
  }

  /* ================= MAIN DASHBOARD ================= */
  return (
    <div
      className={`flex min-h-screen w-full transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-[#0f0f0f] via-[#0a0a0a] to-black text-white"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      <ToastContainer position="top-right" autoClose={2500} />

      <Sidebar darkMode={darkMode} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Page Content */}
        <div className="p-6 overflow-y-auto h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className={`
                rounded-2xl p-6 border shadow-xl
                transition-all duration-300
                ${
                  darkMode
                    ? "bg-white/5 border-white/10 backdrop-blur-xl"
                    : "bg-white border-gray-200"
                }
              `}
            >
              <Routes location={location}>
                <Route path="/" element={<Navigate to="list-songs" />} />
                <Route path="add-song" element={<AddSong />} />
                <Route path="list-songs" element={<ListSong />} />
                <Route path="add-album" element={<AddAlbum />} />
                <Route path="list-albums" element={<ListAlbum />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
