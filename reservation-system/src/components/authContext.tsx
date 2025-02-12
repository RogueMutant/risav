import React, { createContext, useContext, useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { User } from "../types/custom";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  // Fetch user data when the app loads
  const { data, error } = useFetch<{ user: User }>(
    "/auth/me",
    true,
    "get"
  );

  useEffect(() => {
    if (data) {
      setUser(data.user);
    }
  }, [data]);

  // Login function using a separate useFetch
  const { fetchData: loginRequest, error: loginError } = useFetch<{
    user: User;
  }>("/auth/login");

  const login = async (email: string, password: string) => {
    const response = await loginRequest({ email, password }, "post"); // ✅ Now using "/auth/login"
    if (response) {
      setUser(response.user);
    }
    if (loginError) {
      console.error("Login Error", loginError);
    }
  };

  // Logout function using a separate useFetch
  const { fetchData: logoutRequest, error: logoutError } =
    useFetch("/auth/logout");

  const logout = async () => {
    await logoutRequest(undefined, "post"); // ✅ Now using "/auth/logout"
    setUser(null);
    if (logoutError) {
      console.error("Logout Error", logoutError);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
