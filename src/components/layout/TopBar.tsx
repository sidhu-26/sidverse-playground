"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useOS } from "@/lib/context/OSContext";
import {
  Search,
  Plus,
  Bell,
  CheckSquare,
  Calendar,
  Clock,
  ShieldAlert,
  Target,
  FileText,
  Menu,
} from "lucide-react";


export function TopBar({ onOpenMobileMenu }: { onOpenMobileMenu: () => void }) {
  const pathname = usePathname();
  const {
    currentUser,
    logout,
    currentDateFormatted,
    setIsCommandPaletteOpen,
    notifications,
    setIsNotificationsDrawerOpen,
    setQuickAddModalType,
  } = useOS();


  const [quickAddMenuOpen, setQuickAddMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Resolve section title from pathname
  const getSectionTitle = () => {
    if (pathname === "/" || pathname === "/today") return "TODAY";
    if (pathname?.startsWith("/schedule")) return "SCHEDULE";
    if (pathname?.startsWith("/tasks")) return "TASKS";
    if (pathname?.startsWith("/calendar")) return "CALENDAR";
    if (pathname?.startsWith("/projects")) return "PROJECTS";
    if (pathname?.startsWith("/goals")) return "GOALS";
    if (pathname?.startsWith("/duties")) return "DUTIES";
    if (pathname?.startsWith("/deadlines")) return "DEADLINES";
    if (pathname?.startsWith("/review/daily")) return "DAILY REVIEW";
    if (pathname?.startsWith("/review/weekly")) return "WEEKLY REVIEW";
    if (pathname?.startsWith("/history")) return "HISTORY";
    if (pathname?.startsWith("/notifications")) return "NOTIFICATIONS";
    if (pathname?.startsWith("/settings")) return "SETTINGS";
    return "COMMAND CENTER";
  };

  const quickAddOptions = [
    {
      id: "task",
      title: "TASK",
      description: "Something you need to complete",
      icon: <CheckSquare className="w-4 h-4 text-[#00E5FF]" />,
      action: () => setQuickAddModalType("task"),
    },
    {
      id: "event",
      title: "EVENT",
      description: "Something happening at a specific time",
      icon: <Calendar className="w-4 h-4 text-[#B7FF3C]" />,
      action: () => setQuickAddModalType("event"),
    },
    {
      id: "duty",
      title: "DUTY",
      description: "A recurring responsibility",
      icon: <Clock className="w-4 h-4 text-[#FFB020]" />,
      action: () => setQuickAddModalType("duty"),
    },
    {
      id: "deadline",
      title: "DEADLINE",
      description: "Must be completed by a hard cut-off",
      icon: <ShieldAlert className="w-4 h-4 text-[#FF4567]" />,
      action: () => setQuickAddModalType("deadline"),
    },
    {
      id: "goal",
      title: "GOAL",
      description: "Long-term objective milestone",
      icon: <Target className="w-4 h-4 text-[#00E5FF]" />,
      action: () => setQuickAddModalType("task"), // creates goal-linked task or navigates
    },
    {
      id: "note",
      title: "NOTE",
      description: "Quick operational memo",
      icon: <FileText className="w-4 h-4 text-[#8B96A3]" />,
      action: () => setQuickAddModalType("task"),
    },
  ];

  return (
    <header className="h-16 px-4 md:px-6 bg-[#07090D]/90 backdrop-blur-md border-b border-white/[0.08] flex items-center justify-between sticky top-0 z-20 select-none">
      {/* Left: Mobile Menu + Section Title & Date */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-1.5 rounded-[4px] text-[#8B96A3] hover:text-[#F4F7FA] hover:bg-white/5"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
            <h1 className="font-sans-main text-sm md:text-base font-semibold tracking-wider uppercase text-[#F4F7FA]">
              {getSectionTitle()}
            </h1>
          </div>
          <div className="font-mono-tech text-[10px] md:text-[11px] text-[#8B96A3] tracking-wider mt-0.5 ml-3.5">
            {currentDateFormatted}
          </div>
        </div>
      </div>

      {/* Right Utility Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Global Search Button */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] bg-[#0F141A] border border-white/10 hover:border-[#00E5FF]/40 text-[#8B96A3] hover:text-[#F4F7FA] transition-all text-xs cursor-pointer group"
          title="Command Palette (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 text-[#8B96A3] group-hover:text-[#00E5FF]" />
          <span className="hidden sm:inline font-sans-main text-xs">Search</span>
          <span className="hidden sm:inline font-mono-tech text-[10px] bg-white/5 border border-white/10 px-1 py-0.2 rounded text-[#58616B] ml-1">
            ⌘K
          </span>
        </button>

        {/* Quick Add Menu Trigger */}
        <div className="relative">
          <button
            onClick={() => setQuickAddMenuOpen(!quickAddMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#00E5FF]/10 border border-[#00E5FF]/40 hover:bg-[#00E5FF]/20 hover:border-[#00E5FF] text-[#00E5FF] transition-all text-xs font-mono-tech font-medium cursor-pointer shadow-[0_0_10px_rgba(0,229,255,0.15)] active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">QUICK ADD</span>
          </button>

          {/* Quick Add Dropdown Menu */}
          {quickAddMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setQuickAddMenuOpen(false)}
              />
              <div className="absolute right-0 top-10 z-50 w-72 bg-[#0F141A] border border-white/15 rounded-[8px] shadow-[0_15px_40px_rgba(0,0,0,0.8)] py-1.5 overflow-hidden animate-in zoom-in-95 duration-100 cyber-corners">
                <div className="px-3 py-1 border-b border-white/[0.06] font-mono-tech text-[10px] text-[#58616B] uppercase">
                  {"// FAST REGISTRATION PROTOCOL"}
                </div>

                <div className="divide-y divide-white/[0.04]">
                  {quickAddOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setQuickAddMenuOpen(false);
                        opt.action();
                      }}
                      className="w-full px-3 py-2 text-left flex items-start gap-2.5 hover:bg-[#131A21] transition-colors group cursor-pointer"
                    >
                      <div className="p-1 rounded-[4px] bg-white/5 group-hover:bg-white/10 mt-0.5 shrink-0">
                        {opt.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="font-sans-main text-xs font-medium text-[#F4F7FA] group-hover:text-[#00E5FF]">
                          + {opt.title}
                        </div>
                        <div className="font-mono-tech text-[10px] text-[#8B96A3] leading-tight">
                          {opt.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Notifications Bell Button */}
        <button
          onClick={() => setIsNotificationsDrawerOpen(true)}
          className="relative p-2 rounded-[6px] bg-[#0F141A] border border-white/10 text-[#8B96A3] hover:text-[#00E5FF] hover:border-white/20 transition-colors cursor-pointer"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
          )}
        </button>

        {/* User / Node Status Profile */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-[6px] bg-[#0F141A] border border-white/10 hover:border-white/25 transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded-[4px] bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] font-mono-tech text-xs uppercase">
              {currentUser?.display_name ? currentUser.display_name.charAt(0) : currentUser?.email ? currentUser.email.charAt(0) : "S"}
            </div>
          </button>

          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 top-10 z-50 w-64 bg-[#0F141A] border border-white/15 rounded-[8px] shadow-2xl p-3 text-xs space-y-2 cyber-corners">
                <div className="pb-2 border-b border-white/[0.08]">
                  <div className="font-sans-main font-semibold text-[#F4F7FA] truncate">
                    {currentUser?.display_name || "COMMANDER"}
                  </div>
                  <div className="font-mono-tech text-[10px] text-[#00E5FF] truncate">
                    {currentUser?.email || "COMMANDER // ROOT ACCESS"}
                  </div>
                </div>
                <div className="space-y-1 font-mono-tech text-[11px] text-[#8B96A3]">
                  <div className="flex items-center justify-between py-1">
                    <span>STATUS</span>
                    <span className="text-[#B7FF3C]">ONLINE</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>SECURITY</span>
                    <span className="text-[#00E5FF]">ARGON2ID</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/[0.08]">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full py-1.5 px-2 rounded-[4px] bg-[#FF4567]/10 hover:bg-[#FF4567]/20 border border-[#FF4567]/30 text-[#FF4567] text-xs font-mono-tech transition-colors text-center cursor-pointer"
                  >
                    [ TERMINATE SESSION / LOGOUT ]
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>

  );
}
