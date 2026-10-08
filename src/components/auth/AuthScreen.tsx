"use client";

import React, { useState } from "react";
import { useOS } from "@/lib/context/OSContext";
import { Button } from "@/components/ui/Button";
import { Terminal, Shield, ArrowRight, Lock, Mail, User as UserIcon, AlertCircle } from "lucide-react";

export function AuthScreen() {
  const { login, register } = useOS();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isRegisterMode) {
        await register({
          email: email.trim(),
          password,
          display_name: displayName.trim() || undefined,
        });
      } else {
        await login({
          email: email.trim(),
          password,
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#07090D] relative overflow-hidden select-none">
      <div className="fixed inset-0 pointer-events-none cyber-radial-spotlight" />

      <div className="w-full max-w-md bg-[#0F141A] border border-white/15 rounded-[12px] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative z-10 cyber-corners">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-[8px] bg-[#00E5FF]/10 border border-[#00E5FF]/40 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)] mb-2">
            <Terminal className="w-6 h-6" />
          </div>
          <h1 className="font-display text-xl font-bold tracking-wider text-[#F4F7FA]">
            SID//OS MISSION CONTROL
          </h1>
          <p className="font-mono-tech text-xs text-[#8B96A3]">
            {isRegisterMode ? "// INITIALIZE COMMANDER NODE" : "// AUTHENTICATE COMMANDER ACCESS"}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-[6px] bg-[#FF4567]/10 border border-[#FF4567]/40 text-[#FF4567] text-xs font-mono-tech flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div className="space-y-1.5">
              <label className="font-mono-tech text-[11px] text-[#8B96A3] uppercase tracking-wider">
                Display Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#58616B] absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Commander Sid"
                  className="w-full bg-[#131A21] border border-white/10 rounded-[6px] pl-9 pr-3 py-2 text-xs text-[#F4F7FA] font-sans-main outline-none focus:border-[#00E5FF] transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-mono-tech text-[11px] text-[#8B96A3] uppercase tracking-wider">
              Commander Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#58616B] absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="commander@sidos.internal"
                className="w-full bg-[#131A21] border border-white/10 rounded-[6px] pl-9 pr-3 py-2 text-xs text-[#F4F7FA] font-sans-main outline-none focus:border-[#00E5FF] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono-tech text-[11px] text-[#8B96A3] uppercase tracking-wider">
              Passkey / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#58616B] absolute left-3 top-2.5" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#131A21] border border-white/10 rounded-[6px] pl-9 pr-3 py-2 text-xs text-[#F4F7FA] font-sans-main outline-none focus:border-[#00E5FF] transition-colors"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            size="lg"
            className="w-full mt-2"
            icon={loading ? undefined : <ArrowRight className="w-4 h-4" />}
          >
            {loading ? "AUTHENTICATING..." : isRegisterMode ? "INITIALIZE NODE" : "AUTHENTICATE"}
          </Button>
        </form>

        {/* Footer switch */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] text-center font-mono-tech text-xs">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setErrorMsg(null);
            }}
            className="text-[#8B96A3] hover:text-[#00E5FF] transition-colors cursor-pointer"
          >
            {isRegisterMode
              ? "Already registered? [ SIGN IN ]"
              : "Need a new command node? [ REGISTER ]"}
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1 text-[10px] font-mono-tech text-[#58616B]">
          <Shield className="w-3 h-3 text-[#00E5FF]" />
          <span>ARGON2ID SECURE ENCLAVE // HTTPONLY ENCRYPTED</span>
        </div>
      </div>
    </div>
  );
}
