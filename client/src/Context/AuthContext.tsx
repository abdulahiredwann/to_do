import React, { createContext, useState, useEffect, ReactNode } from "react";
import api from "../services/api";

// Define types for the user and context
interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/auth/validate");
        if (response.data.status === "success" && response.data.data) {
          const { _id, name, email } = response.data.data;
          setUser({ _id, name, email });
        }
      } catch (error: any) {
        console.error(
          "Failed to fetch user data:",
          error.response?.data || error.message
        );
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
