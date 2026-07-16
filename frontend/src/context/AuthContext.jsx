import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);

  const playLoginSound = () => {
    const hasPlayed = localStorage.getItem("hasPlayedLoginSound");
    if (audioRef.current && !hasPlayed) {
      audioRef.current.volume = 0.5;
      audioRef.current.play();
      localStorage.setItem("hasPlayedLoginSound", "true");
    }
  };

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        // Don't play sound on page refresh if user was already logged in
      } catch (e) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post("http://localhost:3000/api/v1/auth/login", {
      email,
      password,
    });
    
    const { user: userData, accessToken } = res.data.data;
    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    // Reset hasPlayed to make sure sound plays on new login
    localStorage.removeItem("hasPlayedLoginSound");
    playLoginSound(); // Play sound when logging in
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("hasPlayedLoginSound"); // Reset for next login
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {/* Audio element for login sound */}
      <audio ref={audioRef} src="/login-sound.mp3" />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
