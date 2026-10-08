"use client";

import React from "react";
import { useOS } from "@/lib/context/OSContext";
import { Card } from "@/components/ui/Card";
import { History as HistoryIcon, CheckCircle2, Play, Clock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const { activities } = useOS();

  const getActionBadge = (action: string) => {
    switch (action) {
      case "Completed":
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#B7FF3C]" />,
          color: "text-[#B7FF3C] bg-[#B7FF3C]/10 border-[#B7FF3C]/30",
        };
      case "Started":
        return {
          icon: <Play className="w-3.5 h-3.5 text-[#00E5FF]" />,
          color: "text-[#00E5FF] bg-[#00E5FF]/10 border-[#00E5FF]/30",
        };
      case "Rescheduled":
        return {
          icon: <Clock className="w-3.5 h-3.5 text-[#FFB020]" />,
          color: "text-[#FFB020] bg-[#FFB020]/10 border-[#FFB020]/30",
        };
      default:
        return {
          icon: <Plus className="w-3.5 h-3.5 text-[#8B96A3]" />,
          color: "text-[#8B96A3] bg-white/5 border-white/10",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-[8px] bg-[#0F141A] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-[6px] bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
            <HistoryIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans-main text-base font-semibold text-[#F4F7FA]">
              ACTIVITY HISTORY STREAM
            </h2>
            <p className="font-mono-tech text-xs text-[#8B96A3]">
              AUDIT RECORD & OPERATIONAL STATE CHRONICLE
            </p>
          </div>
        </div>

        <span className="font-mono-tech text-xs text-[#8B96A3] bg-white/5 px-3 py-1.5 rounded-[6px] border border-white/10">
          PERSISTENT LOGS // IMMUTABLE
        </span>
      </div>

      {/* Activities Timeline */}
      <Card className="p-5 bg-[#0F141A]">
        <div className="space-y-4">
          <div className="font-mono-tech text-xs text-[#00E5FF] pb-2 border-b border-white/[0.06]">
            TODAY — OCT 08, 2026
          </div>

          <div className="space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
            {activities.map((act) => {
              const badge = getActionBadge(act.action);

              return (
                <div
                  key={act.id}
                  className="relative p-3 rounded-[6px] bg-[#131A21]/50 border border-white/[0.06] flex items-center justify-between hover:bg-[#131A21] transition-colors"
                >
                  {/* Dot on line */}
                  <div className="absolute -left-[23px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#07090D] border border-white/40" />

                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "font-mono-tech text-[10px] px-2 py-0.5 rounded border uppercase flex items-center gap-1",
                        badge.color
                      )}
                    >
                      {badge.icon}
                      {act.action}
                    </span>

                    <div>
                      <span className="font-sans-main text-xs font-semibold text-[#F4F7FA]">
                        {act.targetTitle}
                      </span>
                      {act.details && (
                        <span className="font-mono-tech text-[11px] text-[#8B96A3] ml-2">
                          — {act.details}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="font-mono-tech text-xs text-[#58616B] shrink-0">
                    {act.timestamp}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
