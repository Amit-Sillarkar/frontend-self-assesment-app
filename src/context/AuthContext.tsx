// ─────────────────────────────────────────────
// FILE: src/context/AuthContext.tsx (UPDATED)
//
// WHAT CHANGED:
//   - Removed mock user data
//   - Uses useLoginMutation from RTK Query
//   - login() accepts email + password directly
//   - Persists user in localStorage
// ─────────────────────────────────────────────

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useLoginMutation } from "@/store/api/authApi";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginMutation] = useLoginMutation();

  // On mount: restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // Login: call API → store token + user
  const login = async (email: string, password: string) => {
    const result = await loginMutation({ email, password }).unwrap();
    const { accessToken, user: userData } = result.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Logout: clear everything → redirect
  const logout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};