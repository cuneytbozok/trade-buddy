"use client";

import { createContext, useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwt.decode(token);

        if (!decoded || typeof decoded !== "object") {
          console.error("Invalid token structure.");
          localStorage.removeItem("token");
          setUser(null);
        } else {
          const isExpired = decoded.exp * 1000 < Date.now();
          if (isExpired) {
            console.warn("Token is expired.");
            localStorage.removeItem("token");
            setUser(null);
          } else {
            setUser({
              ...decoded,
              userId: decoded.id, // Explicitly set `userId` for easy access
            });
          }
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);