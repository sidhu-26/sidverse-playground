"use client";

import React, { useState } from "react";
import { useOS } from "@/lib/context/OSContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CalendarPage() {
  const { events, deadlines, setQuickAddModalType } = useOS();
  const [selectedDay, setSelectedDay] = useState(8);

  // October 2026 starts on Thursday (Oct 1) and has 31 days.
  // 3 blank days before Oct 1: Mon, Tue, Wed (Sep 28, 29, 30)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const leadingBlanks = [28, 29, 30]; // previous month placeholders

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[8px] bg-[#0F141A] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-[6px] bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans-main text-base font-semibold text-[#F4F7FA]">
              MASTER CALENDAR
            </h2>
            <p className="font-mono-tech text-xs text-[#8B96A3]">
              OCTOBER 2026 // SYSTEM SCHEDULE MATRIX
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 font-mono-tech text-xs text-[#8B96A3] bg-[#07090D] p-1 rounded-[6px] border border-white/10">
            <button className="p-1 hover:text-[#00E5FF]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-semibold text-[#F4F7FA]">OCTOBER 2026</span>
            <button className="p-1 hover:text-[#00E5FF]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setQuickAddModalType("event")}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            ADD EVENT
          </Button>
        </div>
      </div>

      {/* Calendar Month Grid */}
      <Card className="p-4 bg-[#0F141A]">
        {/* Days of week headers */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center font-mono-tech text-[11px] text-[#58616B] uppercase border-b border-white/[0.06] pb-2">
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
          <div>SUN</div>
        </div>

        {/* Days cells */}
        <div className="grid grid-cols-7 gap-2">
          {/* Previous month blanks */}
          {leadingBlanks.map((b) => (
            <div
              key={`prev-${b}`}
              className="min-h-[90px] p-2 rounded-[6px] bg-[#07090D]/50 border border-white/[0.02] opacity-30 select-none text-right font-mono-tech text-xs text-[#58616B]"
            >
              {b}
            </div>
          ))}

          {/* Current month days */}
          {daysInMonth.map((day) => {
            const isToday = day === 8;
            const isSelected = day === selectedDay;
            const dayEvents = isToday ? events : [];
            const dayDeadlines = day === 8 ? deadlines.filter((d) => d.category === "TODAY") : [];

            return (
              <div
                key={day}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "min-h-[90px] p-2 rounded-[6px] border transition-all cursor-pointer flex flex-col justify-between group",
                  isToday
                    ? "bg-[#131A21] border-[#00E5FF]/40 shadow-[0_0_12px_rgba(0,229,255,0.06)]"
                    : isSelected
                    ? "bg-[#131A21]/80 border-white/30"
                    : "bg-[#0B0F14] border-white/[0.05] hover:border-white/15"
                )}
              >
                <div className="flex items-center justify-between">
                  {isToday ? (
                    <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
                  ) : (
                    <span />
                  )}
                  <span
                    className={cn(
                      "font-mono-tech text-xs",
                      isToday
                        ? "text-[#00E5FF] font-bold"
                        : "text-[#8B96A3] group-hover:text-[#F4F7FA]"
                    )}
                  >
                    {day < 10 ? `0${day}` : day}
                  </span>
                </div>

                {/* Badges preview inside cell */}
                <div className="space-y-1 my-1">
                  {dayEvents.slice(0, 2).map((ev) => (
                    <div
                      key={ev.id}
                      className="px-1.5 py-0.5 rounded-[3px] bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[10px] font-mono-tech text-[#00E5FF] truncate"
                    >
                      {ev.startTime} {ev.title}
                    </div>
                  ))}
                  {dayDeadlines.map((dl) => (
                    <div
                      key={dl.id}
                      className="px-1.5 py-0.5 rounded-[3px] bg-[#FF4567]/10 border border-[#FF4567]/30 text-[10px] font-mono-tech text-[#FF4567] truncate"
                    >
                      DL: {dl.title}
                    </div>
                  ))}
                </div>

                <div className="text-[9px] font-mono-tech text-[#58616B] text-right">
                  {dayEvents.length > 0 ? `${dayEvents.length} items` : ""}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
