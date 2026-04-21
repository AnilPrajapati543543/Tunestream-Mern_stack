import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth
  const checkAuth = async () => {
    try {
      const res = await API.get("/user/me");
      setUser(res.data.user);
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error("Auth error:", err);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Run on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Login helper (IMPORTANT)
  const login = async (data) => {
    const res = await API.post("/user/login", data);
    setUser(res.data.user);
  };

  // Logout helper
  const logout = async () => {
    await API.post("/user/logout");
    setUser(null);
  };

    useEffect(() => {
  const loadUser = async () => {
    if (document.cookie.includes("token")) {
      try {
        const res = await API.get("/user/me");
        setUser(res.data);
      } catch (err) {
        setUser(null);
      }
    }
  };

  loadUser();
}, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        checkAuth, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);