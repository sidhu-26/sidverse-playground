"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useOS } from "@/lib/context/OSContext";
import {
  Search,
  CheckSquare,
  Calendar,
  Clock,
  FolderGit2,
  Target,
  Bell,
  ArrowRight,
  PlusCircle,
  ShieldAlert,
  Sliders,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const router = useRouter();
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setQuickAddModalType,
    setSelectedTaskForDrawer,
    tasks,
    projects,
    goals,
    deadlines,
    events,
  } = useOS();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Base navigation and creation commands
  const baseCommands = [
    {
      id: "cmd-add-task",
      title: "Add Task",
      category: "ACTIONS",
      shortcut: "N",
      icon: <PlusCircle className="w-4 h-4 text-[#00E5FF]" />,
      action: () => setQuickAddModalType("task"),
    },
    {
      id: "cmd-add-event",
      title: "Add Event",
      category: "ACTIONS",
      shortcut: "E",
      icon: <Calendar className="w-4 h-4 text-[#B7FF3C]" />,
      action: () => setQuickAddModalType("event"),
    },
    {
      id: "cmd-add-duty",
      title: "Add Duty",
      category: "ACTIONS",
      shortcut: "",
      icon: <Clock className="w-4 h-4 text-[#FFB020]" />,
      action: () => setQuickAddModalType("duty"),
    },
    {
      id: "cmd-add-deadline",
      title: "Add Deadline",
      category: "ACTIONS",
      shortcut: "",
      icon: <ShieldAlert className="w-4 h-4 text-[#FF4567]" />,
      action: () => setQuickAddModalType("deadline"),
    },
    {
      id: "cmd-open-today",
      title: "Open Today",
      category: "NAVIGATION",
      shortcut: "D",
      icon: <Clock className="w-4 h-4 text-[#00E5FF]" />,
      action: () => router.push("/today"),
    },
    {
      id: "cmd-open-schedule",
      title: "Open Schedule",
      category: "NAVIGATION",
      shortcut: "S",
      icon: <Calendar className="w-4 h-4 text-[#8B96A3]" />,
      action: () => router.push("/schedule"),
    },
    {
      id: "cmd-open-tasks",
      title: "Open Tasks",
      category: "NAVIGATION",
      shortcut: "T",
      icon: <CheckSquare className="w-4 h-4 text-[#8B96A3]" />,
      action: () => router.push("/tasks"),
    },
    {
      id: "cmd-open-projects",
      title: "Open Projects",
      category: "NAVIGATION",
      shortcut: "P",
      icon: <FolderGit2 className="w-4 h-4 text-[#8B96A3]" />,
      action: () => router.push("/projects"),
    },
    {
      id: "cmd-open-goals",
      title: "Open Goals",
      category: "NAVIGATION",
      shortcut: "G",
      icon: <Target className="w-4 h-4 text-[#8B96A3]" />,
      action: () => router.push("/goals"),
    },
    {
      id: "cmd-open-notifications",
      title: "Open Notifications",
      category: "NAVIGATION",
      shortcut: "",
      icon: <Bell className="w-4 h-4 text-[#8B96A3]" />,
      action: () => router.push("/notifications"),
    },
    {
      id: "cmd-open-history",
      title: "Open History Stream",
      category: "NAVIGATION",
      shortcut: "H",
      icon: <History className="w-4 h-4 text-[#8B96A3]" />,
      action: () => router.push("/history"),
    },
    {
      id: "cmd-open-settings",
      title: "Open Settings",
      category: "NAVIGATION",
      shortcut: ",",
      icon: <Sliders className="w-4 h-4 text-[#8B96A3]" />,
      action: () => router.push("/settings"),
    },
  ];

  // Search items across stores if user entered query
  const q = query.trim().toLowerCase();

  const searchResults = q
    ? [
        ...tasks
          .filter((t) => t.title.toLowerCase().includes(q) || t.tags?.some((tag) => tag.toLowerCase().includes(q)))
          .map((t) => ({
            id: `task-${t.id}`,
            title: t.title,
            category: "TASKS",
            shortcut: t.priority.toUpperCase(),
            icon: <CheckSquare className="w-4 h-4 text-[#00E5FF]" />,
            action: () => {
              setSelectedTaskForDrawer(t);
            },
          })),
        ...projects
          .filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
          .map((p) => ({
            id: `proj-${p.id}`,
            title: p.name,
            category: "PROJECTS",
            shortcut: `${p.progress}%`,
            icon: <FolderGit2 className="w-4 h-4 text-[#B7FF3C]" />,
            action: () => router.push(`/projects/${p.id}`),
          })),
        ...goals
          .filter((g) => g.title.toLowerCase().includes(q))
          .map((g) => ({
            id: `goal-${g.id}`,
            title: g.title,
            category: "GOALS",
            shortcut: `${g.progress}%`,
            icon: <Target className="w-4 h-4 text-[#00E5FF]" />,
            action: () => router.push("/goals"),
          })),
        ...deadlines
          .filter((d) => d.title.toLowerCase().includes(q))
          .map((d) => ({
            id: `dl-${d.id}`,
            title: d.title,
            category: "DEADLINES",
            shortcut: d.category,
            icon: <ShieldAlert className="w-4 h-4 text-[#FF4567]" />,
            action: () => router.push("/deadlines"),
          })),
      ]
    : [];

  const displayedItems = q
    ? [...searchResults, ...baseCommands.filter((c) => c.title.toLowerCase().includes(q))]
    : baseCommands;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, displayedItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + displayedItems.length) % Math.max(1, displayedItems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (displayedItems[selectedIndex]) {
        displayedItems[selectedIndex].action();
        setIsCommandPaletteOpen(false);
      }
    }
  };

  const handleExecute = (item: (typeof displayedItems)[0]) => {
    item.action();
    setIsCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-[6px] transition-opacity animate-in fade-in duration-150"
        onClick={() => setIsCommandPaletteOpen(false)}
      />

      {/* Palette Container */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-xl bg-[#0F141A] border border-white/20 rounded-[8px] shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden z-10 animate-in zoom-in-95 duration-150 cyber-corners"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-[#131A21]/80">
          <Search className="w-4 h-4 text-[#00E5FF] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search tasks, projects, goals..."
            className="w-full bg-transparent text-sm text-[#F4F7FA] placeholder-[#58616B] outline-none font-sans-main"
          />
          <span className="font-mono-tech text-[10px] text-[#58616B] border border-white/10 px-1.5 py-0.5 rounded uppercase">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-0.5">
          {displayedItems.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono-tech text-[#58616B]">
              // No matching commands or records found.
            </div>
          ) : (
            displayedItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleExecute(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-[4px] cursor-pointer transition-colors duration-100",
                    isSelected
                      ? "bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30"
                      : "text-[#8B96A3] hover:bg-white/5 border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0">{item.icon}</span>
                    <span
                      className={cn(
                        "font-sans-main text-xs font-medium truncate",
                        isSelected ? "text-[#F4F7FA]" : "text-[#8B96A3]"
                      )}
                    >
                      {item.title}
                    </span>
                    <span className="font-mono-tech text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-[#58616B] uppercase">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.shortcut && (
                      <span className="font-mono-tech text-[10px] text-[#58616B] px-1.5 py-0.5 rounded border border-white/10 uppercase">
                        {item.shortcut}
                      </span>
                    )}
                    {isSelected && (
                      <ArrowRight className="w-3.5 h-3.5 text-[#00E5FF]" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-white/[0.06] bg-[#07090D] flex items-center justify-between text-[10px] font-mono-tech text-[#58616B]">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-[#00E5FF]/70">SID//OS COMMAND TERMINAL</span>
        </div>
      </div>
    </div>
  );
}
