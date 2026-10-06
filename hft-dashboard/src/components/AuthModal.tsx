"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles, CheckCircle, KeyRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface GoogleCredentialResponse {
  credential?: string;
}

interface WindowWithGoogle {
  google?: {
    accounts?: {
      id?: {
        initialize: (config: { client_id: string; callback: (response: GoogleCredentialResponse) => void }) => void;
        prompt: () => void;
      };
    };
  };
}

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authModalTab,
    closeAuthModal,
    openSignIn,
    openSignUp,
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // Initialize Google Identity Services script when Client ID is configured
  useEffect(() => {
    if (!isAuthModalOpen) return;
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || clientId.includes("YOUR_GOOGLE_CLIENT_ID")) return;

    const win = window as unknown as WindowWithGoogle;

    // Check if script already exists
    const existingScript = document.getElementById("google-gsi-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-gsi-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (win.google?.accounts?.id) {
          win.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response: GoogleCredentialResponse) => {
              if (response.credential) {
                loginWithGoogle(response.credential);
              }
            },
          });
        }
      };
      document.body.appendChild(script);
    } else if (win.google?.accounts?.id) {
      win.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: GoogleCredentialResponse) => {
          if (response.credential) {
            loginWithGoogle(response.credential);
          }
        },
      });
    }
  }, [isAuthModalOpen, loginWithGoogle]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    try {
      if (authModalTab === "signin") {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(name, email, password);
      }
    } catch (err) {
      setError("Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    setIsLoading(true);
    try {
      // Execute seamless authentication flow
      await loginWithGoogle();
      
      // Attempt Google Identity prompt if initialized
      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      const win = typeof window !== "undefined" ? (window as unknown as WindowWithGoogle) : null;
      if (googleClientId && win?.google?.accounts?.id) {
        try {
          win.google.accounts.id.prompt();
        } catch (e) {
          console.warn("Google OAuth prompt notice", e);
        }
      }
    } catch (err) {
      await loginWithEmail("trader@lalan-hft.com", "demo123");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-md bg-[#0d0d14] border border-[#222234] rounded-2xl shadow-2xl overflow-hidden text-zinc-100 font-sans"
        >
          {/* Header Gradient Glow */}
          <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-emerald-400 to-blue-600" />

          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="p-6 pb-4 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#387ed1]/10 border border-[#387ed1]/30 text-[#387ed1] text-[11px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LALAN HFT Auth Portal</span>
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight">
              {authModalTab === "signin" ? "Welcome Back to LALAN" : "Create Quant Account"}
            </h2>
            <p className="text-xs text-zinc-400">
              Access sub-millisecond Level-2 order book engine &amp; OBI telemetry.
            </p>

            {/* Tab Switcher */}
            <div className="flex bg-[#141420] p-1 rounded-xl border border-[#222234] mt-4">
              <button
                type="button"
                onClick={openSignIn}
                className={`flex-1 py-2 text-xs font-bold font-mono rounded-lg transition-all ${
                  authModalTab === "signin"
                    ? "bg-[#387ed1] text-white shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={openSignUp}
                className={`flex-1 py-2 text-xs font-bold font-mono rounded-lg transition-all ${
                  authModalTab === "signup"
                    ? "bg-[#387ed1] text-white shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 pt-2 space-y-4">
            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-[#161622] hover:bg-[#1f1f30] text-white border border-[#2a2a3f] font-semibold text-xs py-3 px-4 rounded-xl transition-all shadow-sm active:scale-[0.98] group"
            >
              {/* Official Google Color SVG Logo */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-[#222234]" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Or Email
              </span>
              <div className="flex-1 h-px bg-[#222234]" />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono text-center">
                {error}
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {authModalTab === "signup" && (
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-400 font-medium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ayush Singh"
                      className="w-full bg-[#141420] text-xs text-white pl-9 pr-3 py-2.5 rounded-xl border border-[#222234] focus:outline-none focus:border-[#387ed1] transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-zinc-400 font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="trader@lalan-hft.com"
                    className="w-full bg-[#141420] text-xs text-white pl-9 pr-3 py-2.5 rounded-xl border border-[#222234] focus:outline-none focus:border-[#387ed1] transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono text-zinc-400 font-medium">Password</label>
                  {authModalTab === "signin" && (
                    <span className="text-[10px] font-mono text-[#387ed1] hover:underline cursor-pointer">
                      Forgot?
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#141420] text-xs text-white pl-9 pr-3 py-2.5 rounded-xl border border-[#222234] focus:outline-none focus:border-[#387ed1] transition-colors font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#387ed1] hover:bg-[#306ec0] text-white font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-[#387ed1]/25 border border-[#387ed1]/40 mt-4 active:scale-[0.98]"
              >
                <span>{authModalTab === "signin" ? "Sign In to Terminal" : "Create Quant Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Access Note */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => loginWithGoogle()}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-mono underline inline-flex items-center gap-1"
              >
                <CheckCircle className="w-3 h-3" />
                <span>Quick 1-Click Demo Login</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
