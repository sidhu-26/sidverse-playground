"use client";

import React, { useState } from "react";
import { useOS } from "@/lib/context/OSContext";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileNav } from "./MobileNav";
import { CommandPalette } from "./CommandPalette";
import { NotificationsDrawer } from "./NotificationsDrawer";
import { TaskDetailDrawer } from "@/components/tasks/TaskDetailDrawer";
import { QuickAddModal } from "@/components/modals/QuickAddModal";
import { AuthScreen } from "@/components/auth/AuthScreen";
import Link from "next/link";
import {
  Target,
  Clock,
  ShieldAlert,
  Calendar,
  FileCheck2,
  CalendarRange,
  History,
  Settings,
  X,
  Terminal,
} from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { authState } = useOS();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const moreLinks = [
    { label: "Calendar", path: "/calendar", icon: Calendar },
    { label: "Goals", path: "/goals", icon: Target },
    { label: "Duties", path: "/duties", icon: Clock },
    { label: "Deadlines", path: "/deadlines", icon: ShieldAlert },
    { label: "Daily Review", path: "/review/daily", icon: FileCheck2 },
    { label: "Weekly Review", path: "/review/weekly", icon: CalendarRange },
    { label: "History", path: "/history", icon: History },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  if (authState === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#07090D] text-[#F4F7FA]">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#00E5FF]/20 border-t-[#00E5FF] animate-spin" />
          <Terminal className="w-5 h-5 text-[#00E5FF] absolute" />
        </div>
        <div className="font-mono-tech text-xs text-[#00E5FF] tracking-widest animate-pulse uppercase">
          {"// INITIALIZING SID//OS CORE..."}
        </div>
      </div>
    );
  }


  if (authState === "unauthenticated") {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen flex bg-[#07090D] text-[#F4F7FA] cyber-grid-bg relative selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
      {/* Background radial spotlight */}
      <div className="fixed inset-0 pointer-events-none cyber-radial-spotlight" />

      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0 z-10">
        <TopBar onOpenMobileMenu={() => setMobileDrawerOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Drawer (Menu) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-72 bg-[#0B0F14] border-r border-white/10 h-full p-4 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-[4px] bg-[#00E5FF]/10 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF]">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div className="font-display text-sm font-semibold text-[#F4F7FA]">
                    SID//OS
                  </div>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded text-[#8B96A3]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {moreLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMobileDrawerOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-xs font-sans-main text-[#8B96A3] hover:text-[#00E5FF] hover:bg-white/5"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="font-mono-tech text-[10px] text-[#58616B] pt-4 border-t border-white/[0.08]">
              SID//OS MOBILE NODE v1.0
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav on Mobile */}
      <MobileNav onOpenMenu={() => setMobileDrawerOpen(true)} />

      {/* Global Modals & Drawers */}
      <CommandPalette />
      <NotificationsDrawer />
      <TaskDetailDrawer />
      <QuickAddModal />
    </div>
  );
}
