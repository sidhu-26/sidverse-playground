"use client";

import React, { useState } from "react";
import { useOS } from "@/lib/context/OSContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/Badge";
import { CalendarDays, Clock, Plus, ChevronLeft, ChevronRight, FolderGit2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SchedulePage() {
  const { events, tasks, setQuickAddModalType } = useOS();
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [selectedDayOffset, setSelectedDayOffset] = useState(0);

  const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 08:00 to 22:00

  const daysOfWeek = [
    { name: "MON", date: "Oct 05" },
    { name: "TUE", date: "Oct 06" },
    { name: "WED", date: "Oct 07" },
    { name: "THU", date: "Oct 08", isToday: true },
    { name: "FRI", date: "Oct 09" },
    { name: "SAT", date: "Oct 10" },
    { name: "SUN", date: "Oct 11" },
  ];

  return (
    <div className="space-y-6">
      {/* Schedule Header with Day/Week switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[8px] bg-[#0F141A] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-[6px] bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans-main text-base font-semibold text-[#F4F7FA]">
              OPERATIONAL SCHEDULE
            </h2>
            <p className="font-mono-tech text-xs text-[#8B96A3]">
              {viewMode === "day"
                ? "OCTOBER 08, 2026 — THURSDAY"
                : "OCTOBER 05 — OCTOBER 11, 2026 (WEEK 41)"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Day / Week Switcher */}
          <div className="flex bg-[#07090D] p-1 rounded-[6px] border border-white/10 font-mono-tech text-xs">
            <button
              onClick={() => setViewMode("day")}
              className={cn(
                "px-3 py-1 rounded-[4px] uppercase transition-colors cursor-pointer",
                viewMode === "day"
                  ? "bg-[#131A21] text-[#00E5FF] font-medium"
                  : "text-[#8B96A3] hover:text-[#F4F7FA]"
              )}
            >
              DAY
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={cn(
                "px-3 py-1 rounded-[4px] uppercase transition-colors cursor-pointer",
                viewMode === "week"
                  ? "bg-[#131A21] text-[#00E5FF] font-medium"
                  : "text-[#8B96A3] hover:text-[#F4F7FA]"
              )}
            >
              WEEK
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setQuickAddModalType("event")}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            SCHEDULE EVENT
          </Button>
        </div>
      </div>

      {/* DAY VIEW */}
      {viewMode === "day" ? (
        <Card className="p-5 bg-[#0F141A] relative overflow-hidden">
          {/* Current Time Horizontal Indicator (at approx 18:42 -> between 18:00 and 19:00) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono-tech text-[#8B96A3] pb-2 border-b border-white/[0.06]">
              <span>HOURLY TIMELINE</span>
              <span className="text-[#00E5FF] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
                CURRENT TIME: 18:42
              </span>
            </div>

            <div className="relative divide-y divide-white/[0.04]">
              {hours.map((hour) => {
                const hourStr = `${String(hour).padStart(2, "0")}:00`;
                const isCurrentHour = hour === 18;

                // Match events starting around this hour
                const matchingEvents = events.filter((e) => {
                  const evHour = parseInt(e.startTime.split(":")[0], 10);
                  return evHour === hour;
                });

                // Match tasks due around this hour
                const matchingTasks = tasks.filter((t) => {
                  if (!t.dueTime) return false;
                  const tHour = parseInt(t.dueTime.split(":")[0], 10);
                  return tHour === hour;
                });

                return (
                  <div
                    key={hour}
                    onClick={() => setQuickAddModalType("event")}
                    className={cn(
                      "min-h-[64px] flex items-start gap-4 py-2 hover:bg-white/[0.02] cursor-pointer transition-colors relative group",
                      isCurrentHour && "bg-[#00E5FF]/[0.02]"
                    )}
                  >
                    {/* Time Label */}
                    <span className="w-14 shrink-0 font-mono-tech text-xs text-[#58616B] group-hover:text-[#8B96A3]">
                      {hourStr}
                    </span>

                    {/* Current time horizontal indicator line if 18:00 */}
                    {isCurrentHour && (
                      <div className="absolute left-14 right-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                        <div className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
                        <div className="flex-1 h-[1.5px] bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
                        <span className="font-mono-tech text-[10px] text-[#00E5FF] bg-[#07090D] px-1.5 py-0.5 rounded border border-[#00E5FF]/40 ml-2">
                          NOW 18:42
                        </span>
                      </div>
                    )}

                    {/* Events & Tasks slots */}
                    <div className="flex-1 space-y-1.5">
                      {matchingEvents.map((ev) => (
                        <div
                          key={ev.id}
                          onClick={(e) => e.stopPropagation()}
                          className={cn(
                            "p-2.5 rounded-[6px] border flex items-center justify-between text-xs transition-all",
                            ev.status === "completed"
                              ? "bg-[#131A21]/60 border-white/10 opacity-70"
                              : ev.status === "current"
                              ? "bg-[#0B151F] border-[#00E5FF]/50 shadow-[0_0_12px_rgba(0,229,255,0.15)]"
                              : "bg-[#131A21] border-white/15"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono-tech text-[#00E5FF] font-medium">
                              {ev.startTime} — {ev.endTime}
                            </span>
                            <span className="font-sans-main font-semibold text-[#F4F7FA]">
                              {ev.title}
                            </span>
                            {ev.projectName && (
                              <span className="font-mono-tech text-[10px] text-[#8B96A3] bg-white/5 px-1.5 py-0.5 rounded">
                                {ev.projectName}
                              </span>
                            )}
                          </div>
                          <StatusBadge status={ev.status} />
                        </div>
                      ))}

                      {matchingTasks.map((t) => (
                        <div
                          key={t.id}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-[4px] bg-[#07090D] border border-white/10 flex items-center justify-between text-xs text-[#8B96A3]"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono-tech text-[10px] text-[#FFB020]">
                              TASK DUE
                            </span>
                            <span className="font-sans-main text-[#F4F7FA] font-medium">
                              {t.title}
                            </span>
                          </div>
                          <span className="font-mono-tech text-[10px] text-[#8B96A3]">
                            {t.dueTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      ) : (
        /* WEEK VIEW */
        <Card className="p-4 bg-[#0F141A] overflow-x-auto">
          <div className="min-w-[700px] grid grid-cols-7 gap-2">
            {daysOfWeek.map((day) => (
              <div
                key={day.name}
                className={cn(
                  "p-3 rounded-[6px] border min-h-[400px] flex flex-col justify-between",
                  day.isToday
                    ? "bg-[#131A21] border-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,229,255,0.05)]"
                    : "bg-[#0B0F14] border-white/[0.06]"
                )}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
                    <span className="font-mono-tech text-xs font-semibold text-[#F4F7FA]">
                      {day.name}
                    </span>
                    <span
                      className={cn(
                        "font-mono-tech text-[10px]",
                        day.isToday ? "text-[#00E5FF] font-bold" : "text-[#58616B]"
                      )}
                    >
                      {day.date}
                    </span>
                  </div>

                  {/* Sample scheduled blocks */}
                  <div className="space-y-2">
                    {day.isToday && (
                      <>
                        <div className="p-2 rounded bg-[#07090D] border border-white/10 text-xs">
                          <div className="font-mono-tech text-[10px] text-[#B7FF3C]">
                            09:00 - 09:30
                          </div>
                          <div className="font-sans-main text-xs text-[#F4F7FA] truncate">
                            Team Standup
                          </div>
                        </div>
                        <div className="p-2 rounded bg-[#07090D] border border-[#00E5FF]/30 text-xs">
                          <div className="font-mono-tech text-[10px] text-[#00E5FF]">
                            18:30 - 20:00
                          </div>
                          <div className="font-sans-main text-xs text-[#F4F7FA] truncate">
                            Workout & Prep
                          </div>
                        </div>
                      </>
                    )}
                    {day.name === "FRI" && (
                      <div className="p-2 rounded bg-[#07090D] border border-white/10 text-xs">
                        <div className="font-mono-tech text-[10px] text-[#FFB020]">
                          16:00 - 17:00
                        </div>
                        <div className="font-sans-main text-xs text-[#F4F7FA] truncate">
                          Team Weekly Review
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setQuickAddModalType("event")}
                  className="w-full mt-3 py-1 rounded border border-dashed border-white/10 text-[10px] font-mono-tech text-[#58616B] hover:text-[#00E5FF] hover:border-[#00E5FF]/40 text-center transition-colors"
                >
                  + Add Event
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
