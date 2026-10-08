"use client";

import React, { useState, useEffect } from "react";
import { useOS } from "@/lib/context/OSContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PriorityBadge } from "@/components/ui/Badge";
import { ShieldAlert, Plus, FolderGit2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DeadlinesPage() {
  const { deadlines, setQuickAddModalType } = useOS();
  const [now, setNow] = useState<number>(1791462000000);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format countdown into Days, Hours, Minutes, Seconds
  const getCountdown = (targetTs: number) => {
    const diff = targetTs - now;
    if (diff <= 0) {
      return { isOverdue: true, text: "OVERDUE / EXPIRED" };
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return {
      isOverdue: false,
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
  };

  const categories: ("OVERDUE" | "TODAY" | "THIS WEEK" | "UPCOMING")[] = [
    "OVERDUE",
    "TODAY",
    "THIS WEEK",
    "UPCOMING",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-[8px] bg-[#0F141A] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-[6px] bg-[#FF4567]/10 text-[#FF4567] border border-[#FF4567]/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans-main text-base font-semibold text-[#F4F7FA]">
              CRITICAL DEADLINES & COUNTDOWN
            </h2>
            <p className="font-mono-tech text-xs text-[#8B96A3]">
              HARD CUT-OFF TARGET TIMELINES
            </p>
          </div>
        </div>

        <Button
          variant="danger"
          size="sm"
          onClick={() => setQuickAddModalType("deadline")}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          SET DEADLINE
        </Button>
      </div>

      {/* Category Groups */}
      <div className="space-y-6">
        {categories.map((category) => {
          const list = deadlines.filter((d) => d.category === category);
          if (list.length === 0) return null;

          return (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-white/[0.06]">
                <span
                  className={cn(
                    "w-2 h-2 rounded-[1px]",
                    category === "OVERDUE"
                      ? "bg-[#FF4567]"
                      : category === "TODAY"
                      ? "bg-[#FFB020]"
                      : "bg-[#00E5FF]"
                  )}
                />
                <h3 className="font-sans-main text-xs font-semibold tracking-wider uppercase text-[#F4F7FA]">
                  {category}
                </h3>
                <span className="font-mono-tech text-[10px] text-[#58616B]">
                  ({list.length})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {list.map((item) => {
                  const countdown = getCountdown(item.targetTimestamp);

                  return (
                    <Card
                      key={item.id}
                      withCorners
                      className={cn(
                        "p-5 bg-[#0F141A] border flex flex-col justify-between transition-all",
                        item.isOverdue || countdown.isOverdue
                          ? "border-[#FF4567]/30 hover:border-[#FF4567]/60"
                          : "border-white/[0.08] hover:border-white/20"
                      )}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <PriorityBadge priority={item.priority} />
                          {item.projectName && (
                            <span className="font-mono-tech text-[10px] text-[#8B96A3] flex items-center gap-1">
                              <FolderGit2 className="w-3 h-3 text-[#58616B]" />
                              {item.projectName}
                            </span>
                          )}
                        </div>

                        <h4 className="font-sans-main text-base font-bold text-[#F4F7FA]">
                          {item.title}
                        </h4>

                        <div className="font-mono-tech text-xs text-[#58616B]">
                          TARGET: {new Date(item.dueDate).toLocaleString()}
                        </div>
                      </div>

                      {/* Large Orbitron Countdown Numbers */}
                      <div className="pt-4 mt-4 border-t border-white/[0.06]">
                        {countdown.isOverdue ? (
                          <div className="font-display text-sm font-bold text-[#FF4567] tracking-wider uppercase flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#FF4567] animate-pulse" />
                            CRITICAL: DEADLINE EXPIRED
                          </div>
                        ) : (
                          <div>
                            <div className="text-[10px] font-mono-tech text-[#58616B] uppercase mb-1">
                              TIME REMAINING
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-center">
                              <div className="bg-[#0B0F14] p-2 rounded border border-white/5">
                                <div className="font-display text-xl font-bold text-[#F4F7FA]">
                                  {countdown.days}
                                </div>
                                <div className="font-mono-tech text-[9px] text-[#58616B]">
                                  DAYS
                                </div>
                              </div>
                              <div className="bg-[#0B0F14] p-2 rounded border border-white/5">
                                <div className="font-display text-xl font-bold text-[#F4F7FA]">
                                  {countdown.hours}
                                </div>
                                <div className="font-mono-tech text-[9px] text-[#58616B]">
                                  HOURS
                                </div>
                              </div>
                              <div className="bg-[#0B0F14] p-2 rounded border border-white/5">
                                <div className="font-display text-xl font-bold text-[#00E5FF]">
                                  {countdown.minutes}
                                </div>
                                <div className="font-mono-tech text-[9px] text-[#58616B]">
                                  MINS
                                </div>
                              </div>
                              <div className="bg-[#0B0F14] p-2 rounded border border-white/5">
                                <div className="font-display text-xl font-bold text-[#8B96A3]">
                                  {countdown.seconds}
                                </div>
                                <div className="font-mono-tech text-[9px] text-[#58616B]">
                                  SECS
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
