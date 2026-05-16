import { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await axios.get("/user/me");
      if (res.data.user && res.data.user.role === 'admin') {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password, otp) => {
    const res = await axios.post("/user/login", { email, password, otp });
    if (res.data.success) {
      if (res.data.user.role !== 'admin') {
        throw new Error("Access denied. Admin role required.");
      }
      setUser(res.data.user);
      return res.data;
    }
    throw new Error("Login failed");
  };

  const signup = async (data) => {
    const res = await axios.post("/user/register", { ...data, role: 'admin' });
    if (res.data.success) {
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || "Signup failed");
  };

  const logout = async () => {
    try {
      await axios.post("/user/logout");
    } catch (err) {
      // Silently handle logout errors
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
