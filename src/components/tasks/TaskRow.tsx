"use client";

import React, { useState } from "react";
import { Task } from "@/lib/types";
import { useOS } from "@/lib/context/OSContext";
import { PriorityBadge } from "@/components/ui/Badge";

import { Check, MoreHorizontal, Clock, FolderGit2, Play, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskRowProps {
  task: Task;
  showProject?: boolean;
}

export function TaskRow({ task, showProject = true }: TaskRowProps) {
  const {
    toggleTaskComplete,
    setSelectedTaskForDrawer,
    startTask,
    deleteTask,
  } = useOS();

  const [menuOpen, setMenuOpen] = useState(false);
  const isCompleted = task.status === "completed";
  const isInProgress = task.status === "in_progress";

  const handleRowClick = (e: React.MouseEvent) => {
    // Prevent triggering if clicked directly on checkbox or menu button
    const target = e.target as HTMLElement;
    if (target.closest("[data-no-drawer]")) return;
    setSelectedTaskForDrawer(task);
  };

  return (
    <div
      onClick={handleRowClick}
      className={cn(
        "group relative flex items-center justify-between p-3 rounded-[6px] border transition-all duration-150 cursor-pointer select-none",
        isCompleted
          ? "bg-[#090D12]/40 border-white/[0.04] opacity-60 hover:opacity-80"
          : isInProgress
          ? "bg-[#0E1722] border-[#00E5FF]/30 hover:border-[#00E5FF]/60 hover:shadow-[0_0_12px_rgba(0,229,255,0.08)]"
          : "bg-[#0F141A] border-white/[0.06] hover:bg-[#131A21] hover:border-white/15"
      )}
    >
      {/* Left side: Checkbox + Title + Meta */}
      <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
        {/* Animated Checkbox */}
        <button
          data-no-drawer="true"
          onClick={(e) => {
            e.stopPropagation();
            toggleTaskComplete(task.id);
          }}
          className={cn(
            "w-5 h-5 rounded-[4px] border flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer",
            isCompleted
              ? "bg-[#00E5FF] border-[#00E5FF] text-[#07090D] shadow-[0_0_8px_rgba(0,229,255,0.4)]"
              : isInProgress
              ? "border-[#00E5FF] bg-[#00E5FF]/10 text-transparent hover:border-[#00E5FF]"
              : "border-white/20 bg-black/20 hover:border-[#00E5FF]/60"
          )}
          aria-label={isCompleted ? "Mark task pending" : "Mark task complete"}
        >
          <Check
            className={cn(
              "w-3.5 h-3.5 transition-transform duration-150",
              isCompleted ? "scale-100" : "scale-0"
            )}
          />
        </button>

        {/* Task Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-sans-main text-xs font-medium tracking-wide truncate transition-colors",
                isCompleted
                  ? "line-through text-[#58616B]"
                  : isInProgress
                  ? "text-[#F4F7FA] font-semibold"
                  : "text-[#F4F7FA] group-hover:text-[#00E5FF]"
              )}
            >
              {task.title}
            </span>

            {isInProgress && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-3 mt-1 text-[11px] font-mono-tech text-[#8B96A3]">
            {showProject && task.projectName && (
              <span className="flex items-center gap-1 text-[#8B96A3] hover:text-[#00E5FF]">
                <FolderGit2 className="w-3 h-3 text-[#58616B]" />
                {task.projectName}
              </span>
            )}

            {task.dueTime && (
              <span className="flex items-center gap-1 text-[#58616B]">
                <Clock className="w-3 h-3" />
                {task.dueTime}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right side: Priority + Status + Action Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <PriorityBadge priority={task.priority} />

        {/* Hover Action controls */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isCompleted && !isInProgress && (
            <button
              data-no-drawer="true"
              onClick={(e) => {
                e.stopPropagation();
                startTask(task.id);
              }}
              title="Start task"
              className="p-1 rounded text-[#8B96A3] hover:text-[#00E5FF] hover:bg-white/5 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="relative">
            <button
              data-no-drawer="true"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1 rounded text-[#8B96A3] hover:text-[#F4F7FA] hover:bg-white/5 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                  }}
                />
                <div
                  data-no-drawer="true"
                  className="absolute right-0 top-7 z-50 w-36 bg-[#131A21] border border-white/10 rounded-[6px] shadow-xl py-1 text-xs font-mono-tech"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      toggleTaskComplete(task.id);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-white/5 text-[#F4F7FA] flex items-center gap-2"
                  >
                    <Check className="w-3 h-3 text-[#00E5FF]" />
                    {isCompleted ? "Reopen" : "Complete"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      deleteTask(task.id);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#FF4567]/15 text-[#FF4567] flex items-center gap-2"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
