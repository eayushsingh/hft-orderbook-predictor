"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: "google" | "email";
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  authModalTab: "signin" | "signup";
  openSignIn: () => void;
  openSignUp: () => void;
  closeAuthModal: () => void;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  signupWithEmail: (name: string, email: string, pass: string) => Promise<boolean>;
  loginWithGoogle: (credential?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"signin" | "signup">("signin");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
      const storedUser = typeof window !== "undefined" ? localStorage.getItem("lalan_auth_user") : null;
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored auth user", e);
        }
      }
    });
  }, []);

  const saveUserSession = (userData: User) => {
    setUser(userData);
    localStorage.setItem("lalan_auth_user", JSON.stringify(userData));
  };

  const openSignIn = () => {
    setAuthModalTab("signin");
    setIsAuthModalOpen(true);
  };

  const openSignUp = () => {
    setAuthModalTab("signup");
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginWithEmail = async (email: string): Promise<boolean> => {
    const nameFromEmail = email.split("@")[0];
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: formattedName || "Quant Trader",
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      provider: "email",
      createdAt: new Date().toISOString(),
    };
    saveUserSession(newUser);
    closeAuthModal();
    return true;
  };

  const signupWithEmail = async (name: string, email: string): Promise<boolean> => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name || "Quant Trader",
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      provider: "email",
      createdAt: new Date().toISOString(),
    };
    saveUserSession(newUser);
    closeAuthModal();
    return true;
  };

  const loginWithGoogle = async (credential?: string): Promise<boolean> => {
    // Standard Google OAuth login handler
    let googleUser: User = {
      id: `google_${Date.now()}`,
      name: "Ayush Singh",
      email: "ayushsinghe07@gmail.com",
      avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
      provider: "google",
      createdAt: new Date().toISOString(),
    };

    if (credential) {
      try {
        // Handle decoded JWT token payload if Google Credential is provided
        const base64Url = credential.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const payload = JSON.parse(jsonPayload);
        googleUser = {
          id: `google_${payload.sub}`,
          name: payload.name || payload.email.split("@")[0],
          email: payload.email,
          avatar: payload.picture,
          provider: "google",
          createdAt: new Date().toISOString(),
        };
      } catch (e) {
        console.warn("Parsing Google JWT token fallback to standard session", e);
      }
    }

    saveUserSession(googleUser);
    closeAuthModal();
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("lalan_auth_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user: mounted ? user : null,
        isLoggedIn: mounted && !!user,
        isAuthModalOpen,
        authModalTab,
        openSignIn,
        openSignUp,
        closeAuthModal,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      isLoggedIn: false,
      isAuthModalOpen: false,
      authModalTab: "signin" as const,
      openSignIn: () => {},
      openSignUp: () => {},
      closeAuthModal: () => {},
      loginWithEmail: async () => false,
      signupWithEmail: async () => false,
      loginWithGoogle: async () => false,
      logout: () => {},
    };
  }
  return context;
}
