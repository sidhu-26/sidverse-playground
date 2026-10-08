"use client";

import React, { useState } from "react";
import { useOS } from "@/lib/context/OSContext";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Target, CheckCircle2, Circle, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GoalsPage() {
  const { goals, toggleGoalMilestone } = useOS();
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(goals[0]?.id || null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-[8px] bg-[#0F141A] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-[6px] bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans-main text-base font-semibold text-[#F4F7FA]">
              PERSONAL GOALS & MILESTONES
            </h2>
            <p className="font-mono-tech text-xs text-[#8B96A3]">
              STRATEGIC SELF-ACTUALIZATION BENCHMARKS
            </p>
          </div>
        </div>

        <span className="font-mono-tech text-xs text-[#B7FF3C] bg-[#B7FF3C]/10 px-3 py-1.5 rounded-[6px] border border-[#B7FF3C]/30">
          {goals.length} ACTIVE ASPIRATIONS
        </span>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const isExpanded = expandedGoalId === goal.id;

          return (
            <Card
              key={goal.id}
              withCorners
              className="p-5 bg-[#0F141A] hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono-tech text-[10px] text-[#00E5FF] px-2 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/20 uppercase">
                    {goal.category}
                  </span>
                  <span className="font-mono-tech text-[11px] text-[#8B96A3] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#58616B]" />
                    TARGET: {goal.targetDate}
                  </span>
                </div>

                <h3 className="font-sans-main text-base font-bold text-[#F4F7FA]">
                  {goal.title}
                </h3>

                <p className="font-sans-main text-xs text-[#8B96A3] leading-relaxed">
                  {goal.description}
                </p>

                {/* Progress bar */}
                <div className="pt-2 space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-mono-tech">
                    <span className="text-[#8B96A3]">OBJECTIVE PROGRESS</span>
                    <span className="text-[#00E5FF] font-semibold">{goal.progress}%</span>
                  </div>
                  <ProgressBar
                    progress={goal.progress}
                    color={goal.progress > 70 ? "acid" : "cyan"}
                    size="sm"
                  />
                </div>
              </div>

              {/* Milestones toggle section */}
              <div className="pt-4 mt-4 border-t border-white/[0.06]">
                <button
                  onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
                  className="w-full flex items-center justify-between text-xs font-mono-tech text-[#8B96A3] hover:text-[#00E5FF] transition-colors cursor-pointer"
                >
                  <span>
                    MILESTONES ({goal.milestones.filter((m) => m.completed).length} /{" "}
                    {goal.milestones.length})
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-3 space-y-2 animate-in fade-in">
                    {goal.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        onClick={() => toggleGoalMilestone(goal.id, milestone.id)}
                        className={cn(
                          "p-2.5 rounded-[4px] border flex items-center gap-2.5 cursor-pointer text-xs transition-colors",
                          milestone.completed
                            ? "bg-[#131A21] border-[#B7FF3C]/30 text-[#8B96A3] line-through"
                            : "bg-[#0B0F14] border-white/10 text-[#F4F7FA] hover:border-[#00E5FF]/40"
                        )}
                      >
                        {milestone.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-[#B7FF3C] shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-[#58616B] shrink-0" />
                        )}
                        <span className="font-sans-main truncate">
                          {milestone.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
