"use client";

import React from "react";
import { useOS } from "@/lib/context/OSContext";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { CalendarEvent } from "@/lib/types";
import { Clock, FolderGit2, CheckCircle2, PlayCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export function TodayTimeline() {
  const { events, setSelectedTaskForDrawer, tasks } = useOS();

  // Match event with task or create mock detail
  const handleItemClick = (event: CalendarEvent) => {
    // If event has corresponding task or title match
    const matchedTask = tasks.find((t) =>
      t.title.toLowerCase().includes(event.title.toLowerCase().slice(0, 8))
    );
    if (matchedTask) {
      setSelectedTaskForDrawer(matchedTask);
    }
  };

  const getStatusIcon = (status: CalendarEvent["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-[#B7FF3C]" />;
      case "current":
        return <PlayCircle className="w-4 h-4 text-[#00E5FF] animate-pulse" />;
      default:
        return <Circle className="w-3.5 h-3.5 text-[#58616B]" />;
    }
  };

  return (
    <Card className="p-5 bg-[#0F141A]">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#00E5FF]" />
          <h3 className="font-sans-main text-xs font-semibold tracking-wider uppercase text-[#F4F7FA]">
            TODAY’S SCHEDULE TIMELINE
          </h3>
        </div>
        <span className="font-mono-tech text-[10px] text-[#58616B]">
          TIMEZONE: UTC+05:30 (LOCAL)
        </span>
      </div>

      <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
        {events.map((event) => {
          const isCurrent = event.status === "current";
          const isCompleted = event.status === "completed";

          return (
            <div
              key={event.id}
              onClick={() => handleItemClick(event)}
              className={cn(
                "relative flex items-start justify-between p-3 rounded-[6px] border transition-all duration-150 cursor-pointer group",
                isCurrent
                  ? "bg-[#0E1722] border-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,229,255,0.08)] scale-[1.01]"
                  : isCompleted
                  ? "bg-[#0B0F14]/60 border-white/[0.04] opacity-70 hover:opacity-90"
                  : "bg-[#131A21]/40 border-white/[0.06] hover:border-white/15 hover:bg-[#131A21]"
              )}
            >
              {/* Bullet Node on Timeline Line */}
              <div
                className={cn(
                  "absolute -left-[27px] top-4 p-0.5 rounded-full bg-[#07090D] border",
                  isCurrent
                    ? "border-[#00E5FF] shadow-[0_0_8px_#00E5FF]"
                    : isCompleted
                    ? "border-[#B7FF3C]"
                    : "border-white/20"
                )}
              >
                {getStatusIcon(event.status)}
              </div>

              {/* Event Content */}
              <div className="space-y-1 min-w-0 flex-1 mr-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono-tech text-xs text-[#00E5FF] font-semibold">
                    {event.startTime} — {event.endTime}
                  </span>
                  {event.projectName && (
                    <span className="font-mono-tech text-[10px] text-[#8B96A3] flex items-center gap-1">
                      <FolderGit2 className="w-3 h-3 text-[#58616B]" />
                      {event.projectName}
                    </span>
                  )}
                </div>

                <div
                  className={cn(
                    "font-sans-main text-sm font-medium tracking-wide truncate transition-colors",
                    isCurrent
                      ? "text-[#F4F7FA] font-semibold"
                      : isCompleted
                      ? "text-[#8B96A3]"
                      : "text-[#F4F7FA] group-hover:text-[#00E5FF]"
                  )}
                >
                  {event.title}
                </div>

                {event.description && (
                  <div className="font-sans-main text-xs text-[#58616B] line-clamp-1">
                    {event.description}
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="shrink-0 pt-0.5">
                <StatusBadge status={event.status} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
