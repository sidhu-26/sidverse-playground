"use client";

import React, { useState } from "react";
import { useOS } from "@/lib/context/OSContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { Play, Check, Clock, FolderGit2, AlertTriangle } from "lucide-react";

export function NextUpCard() {
  const {
    tasks,
    startTask,
    toggleTaskComplete,
    setSelectedTaskForDrawer,
  } = useOS();

  const [confirmComplete, setConfirmComplete] = useState(false);

  // Find next urgent/in_progress or pending task
  const inProgressTask = tasks.find((t) => t.status === "in_progress");
  const nextPendingTask = tasks.find(
    (t) => t.status === "pending" && (t.dueDate === "2026-10-08" || t.dueTime)
  );
  const activeTask = inProgressTask || nextPendingTask || tasks.find((t) => t.status === "pending");

  if (!activeTask) {
    return (
      <Card className="p-5 border-dashed border-white/10 text-center">
        <div className="font-mono-tech text-xs text-[#58616B] uppercase mb-1">
          {"// CURRENT FOCUS STATUS"}
        </div>
        <div className="font-sans-main text-sm text-[#F4F7FA]">
          All immediate tasks completed. Command queue clear.
        </div>
      </Card>
    );
  }

  const isInProgress = activeTask.status === "in_progress";

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInProgress) {
      startTask(activeTask.id);
    } else {
      if (!confirmComplete) {
        setConfirmComplete(true);
      } else {
        toggleTaskComplete(activeTask.id);
        setConfirmComplete(false);
      }
    }
  };

  return (
    <Card
      withCorners
      glow={isInProgress}
      onClick={() => setSelectedTaskForDrawer(activeTask)}
      className="p-5 cursor-pointer relative overflow-hidden group hover:border-[#00E5FF]/40 transition-all bg-[#0F141A]"
    >
      {/* Background technical watermarks */}
      <div className="absolute right-3 top-3 text-[10px] font-mono-tech text-[#58616B] tracking-wider uppercase flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
        TARGET FOCUS
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Task details */}
        <div className="space-y-2 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono-tech text-[10px] text-[#00E5FF] tracking-wider uppercase">
              {"// NEXT UP"}
            </span>
            <StatusBadge status={activeTask.status} />
            <PriorityBadge priority={activeTask.priority} />

            {activeTask.projectName && (
              <span className="font-mono-tech text-[10px] text-[#8B96A3] flex items-center gap-1">
                <FolderGit2 className="w-3 h-3 text-[#58616B]" />
                {activeTask.projectName}
              </span>
            )}
          </div>

          <h3 className="font-sans-main text-base sm:text-lg font-semibold text-[#F4F7FA] group-hover:text-[#00E5FF] transition-colors truncate">
            {activeTask.title}
          </h3>

          <div className="flex items-center gap-4 text-xs font-mono-tech text-[#8B96A3]">
            <span className="flex items-center gap-1.5 text-[#00E5FF]">
              <Clock className="w-3.5 h-3.5" />
              {activeTask.dueTime || "18:30 — 20:00"}
            </span>
            {activeTask.durationMinutes && (
              <span className="text-[#58616B]">
                EST. {activeTask.durationMinutes} MIN
              </span>
            )}
          </div>

          {activeTask.description && (
            <p className="text-xs text-[#8B96A3] line-clamp-2 font-sans-main pt-1">
              {activeTask.description}
            </p>
          )}
        </div>

        {/* Right: State Transition Buttons */}
        <div className="shrink-0 flex items-center gap-2">
          {!isInProgress ? (
            <Button
              variant="primary"
              size="md"
              onClick={handleActionClick}
              icon={<Play className="w-3.5 h-3.5 fill-current" />}
            >
              START
            </Button>
          ) : !confirmComplete ? (
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-[11px] text-[#00E5FF] px-2 py-1 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30 animate-pulse">
                IN PROGRESS
              </span>
              <Button
                variant="secondary"
                size="md"
                onClick={handleActionClick}
                icon={<Check className="w-3.5 h-3.5 text-[#B7FF3C]" />}
              >
                COMPLETE
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 animate-in fade-in">
              <span className="text-[11px] font-mono-tech text-[#FFB020] flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Confirm?
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={handleActionClick}
              >
                YES, COMPLETE
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmComplete(false);
                }}
              >
                CANCEL
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
