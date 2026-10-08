"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOS } from "@/lib/context/OSContext";
import {
  LayoutDashboard,
  CalendarDays,
  Calendar,
  CheckSquare,
  FolderGit2,
  Target,
  Clock,
  ShieldAlert,
  History,
  FileCheck2,
  CalendarRange,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar, notifications } = useOS();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navSections = [
    {
      category: "CORE",
      items: [
        { label: "Today", path: "/today", icon: LayoutDashboard },
        { label: "Schedule", path: "/schedule", icon: CalendarDays },
        { label: "Tasks", path: "/tasks", icon: CheckSquare },
        { label: "Calendar", path: "/calendar", icon: Calendar },
      ],
    },
    {
      category: "MANAGEMENT",
      items: [
        { label: "Projects", path: "/projects", icon: FolderGit2 },
        { label: "Goals", path: "/goals", icon: Target },
        { label: "Duties", path: "/duties", icon: Clock },
        { label: "Deadlines", path: "/deadlines", icon: ShieldAlert },
      ],
    },
    {
      category: "REVIEW",
      items: [
        { label: "Daily Review", path: "/review/daily", icon: FileCheck2 },
        { label: "Weekly Review", path: "/review/weekly", icon: CalendarRange },
        { label: "History", path: "/history", icon: History },
      ],
    },
    {
      category: "SYSTEM",
      items: [
        {
          label: "Notifications",
          path: "/notifications",
          icon: Bell,
          badge: unreadCount > 0 ? unreadCount : undefined,
        },
        { label: "Settings", path: "/settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-[#07090D] border-r border-white/[0.08] h-screen sticky top-0 z-30 transition-[width] duration-250 ease-in-out select-none",
        isSidebarCollapsed ? "w-[72px]" : "w-[250px]"
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-white/[0.08] justify-between">
        <Link
          href="/today"
          className="flex items-center gap-3 overflow-hidden group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-[6px] bg-[#0F141A] border border-[#00E5FF]/40 flex items-center justify-center shrink-0 group-hover:border-[#00E5FF] group-hover:shadow-[0_0_10px_rgba(0,229,255,0.3)] transition-all">
            <Terminal className="w-4 h-4 text-[#00E5FF]" />
          </div>

          {!isSidebarCollapsed && (
            <div className="truncate">
              <div className="font-display text-sm font-semibold tracking-wider text-[#F4F7FA] group-hover:text-[#00E5FF] transition-colors">
                SID//OS
              </div>
              <div className="font-mono-tech text-[9px] text-[#58616B] uppercase tracking-wider">
                PERSONAL COMMAND
              </div>
            </div>
          )}
        </Link>

        {/* Sidebar Collapse Toggle Button */}
        <button
          onClick={toggleSidebar}
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-1.5 rounded-[4px] text-[#8B96A3] hover:text-[#00E5FF] hover:bg-white/5 transition-colors cursor-pointer"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
        {navSections.map((section) => (
          <div key={section.category}>
            {!isSidebarCollapsed && (
              <div className="px-3 mb-1.5 text-[10px] font-mono-tech text-[#58616B] uppercase tracking-widest">
                {section.category}
              </div>
            )}

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.path ||
                  (item.path !== "/today" && pathname?.startsWith(item.path));

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2 rounded-[6px] text-xs font-sans-main transition-all duration-150 relative",
                      isActive
                        ? "bg-[#0F141A] text-[#00E5FF] font-medium shadow-[0_0_12px_rgba(0,229,255,0.06)]"
                        : "text-[#8B96A3] hover:text-[#F4F7FA] hover:bg-white/[0.03]"
                    )}
                  >
                    {/* Active Left Indicator Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#00E5FF] rounded-r shadow-[0_0_6px_#00E5FF]" />
                    )}

                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5",
                        isActive ? "text-[#00E5FF]" : "text-[#8B96A3] group-hover:text-[#F4F7FA]"
                      )}
                    />

                    {!isSidebarCollapsed && (
                      <span className="truncate flex-1 tracking-wide">
                        {item.label}
                      </span>
                    )}

                    {!isSidebarCollapsed && item.badge !== undefined && (
                      <span className="font-mono-tech text-[10px] px-1.5 py-0.2 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 font-medium">
                        {item.badge}
                      </span>
                    )}

                    {isSidebarCollapsed && item.badge !== undefined && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Node Status */}
      <div className="p-3 border-t border-white/[0.08] bg-[#07090D]">
        <div
          className={cn(
            "flex items-center gap-2.5 px-2 py-1.5 rounded-[4px] bg-[#0B0F14] border border-white/[0.04]",
            isSidebarCollapsed && "justify-center"
          )}
        >
          <div className="w-2 h-2 rounded-full bg-[#B7FF3C] shadow-[0_0_6px_#B7FF3C] animate-pulse-subtle shrink-0" />
          {!isSidebarCollapsed && (
            <div className="truncate">
              <div className="font-mono-tech text-[10px] text-[#F4F7FA] leading-tight">
                LOCAL NODE
              </div>
              <div className="font-mono-tech text-[9px] text-[#58616B] leading-tight">
                ACTIVE / ONLINE
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
