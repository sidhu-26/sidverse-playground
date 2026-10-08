"use client";

import React from "react";
import { useOS } from "@/lib/context/OSContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Clock, Check, Flame, Calendar, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DutiesPage() {
  const { duties, toggleDutyComplete, setQuickAddModalType } = useOS();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-[8px] bg-[#0F141A] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-[6px] bg-[#FFB020]/10 text-[#FFB020] border border-[#FFB020]/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans-main text-base font-semibold text-[#F4F7FA]">
              RECURRING DUTIES & CADENCE
            </h2>
            <p className="font-mono-tech text-xs text-[#8B96A3]">
              ROUTINE COMMITMENTS & REPETITIVE OPERATING PROCEDURES
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setQuickAddModalType("duty")}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          NEW DUTY
        </Button>
      </div>

      {/* Duties List */}
      <div className="space-y-3">
        {duties.map((duty) => (
          <Card
            key={duty.id}
            className="p-5 bg-[#0F141A] hover:bg-[#131A21]/50 border-white/[0.08] transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left Info */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono-tech text-[10px] text-[#FFB020] px-2 py-0.5 rounded bg-[#FFB020]/10 border border-[#FFB020]/20 uppercase">
                    {duty.frequency}
                  </span>
                  <span className="font-mono-tech text-[11px] text-[#8B96A3]">
                    {duty.recurrenceText}
                  </span>
                </div>

                <h3 className="font-sans-main text-base font-semibold text-[#F4F7FA]">
                  {duty.title}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono-tech text-[#8B96A3]">
                  <span className="flex items-center gap-1.5 text-[#00E5FF]">
                    <Calendar className="w-3.5 h-3.5" />
                    NEXT: {duty.nextOccurrence}
                  </span>
                  {duty.lastCompleted && (
                    <span className="text-[#58616B]">
                      LAST COMPLETED: {duty.lastCompleted}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[#FFB020]">
                    <Flame className="w-3.5 h-3.5" />
                    STREAK: {duty.completionStreak} CYCLES
                  </span>
                </div>

                {/* History dots */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="font-mono-tech text-[10px] text-[#58616B] mr-1">
                    RECENT:
                  </span>
                  {duty.history.map((h, i) => (
                    <span
                      key={i}
                      title={`${h.date}: ${h.completed ? "Completed" : "Missed"}`}
                      className={cn(
                        "w-2.5 h-2.5 rounded-[2px] transition-colors",
                        h.completed ? "bg-[#B7FF3C]" : "bg-[#FF4567]/50"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Right Action */}
              <div className="shrink-0 flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => toggleDutyComplete(duty.id)}
                  icon={<Check className="w-3.5 h-3.5" />}
                >
                  EXECUTE & LOG
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
