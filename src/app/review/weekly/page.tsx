"use client";

import React from "react";
import { useOS } from "@/lib/context/OSContext";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CalendarRange, FolderGit2, Target, Calendar } from "lucide-react";

export default function WeeklyReviewPage() {
  const { weeklyReview, projects, goals } = useOS();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-[8px] bg-[#0F141A] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-[6px] bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
            <CalendarRange className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans-main text-base font-semibold text-[#F4F7FA]">
              WEEKLY REVIEW & SYNTHESIS
            </h2>
            <p className="font-mono-tech text-xs text-[#8B96A3]">
              CYCLE: {weeklyReview.weekRange}
            </p>
          </div>
        </div>

        <span className="font-mono-tech text-xs text-[#00E5FF] bg-[#00E5FF]/10 px-3 py-1.5 rounded-[6px] border border-[#00E5FF]/30">
          HEALTH STATUS // OPTIMAL
        </span>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="TASKS COMPLETED"
          value={weeklyReview.tasksCompleted}
          sublabel="Resolved in cycle"
          accent="acid"
        />
        <StatCard
          label="POSTPONED"
          value={weeklyReview.tasksPostponed}
          sublabel="Rescheduled"
          accent="muted"
        />
        <StatCard
          label="DEADLINES MET"
          value={weeklyReview.deadlinesMet}
          sublabel="On-time delivery"
          accent="cyan"
        />
        <StatCard
          label="OVERDUE"
          value={weeklyReview.overdueTasks}
          sublabel="Require escalation"
          accent="danger"
        />
      </div>

      {/* Projects and Goals synthesis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Active Projects */}
        <Card className="p-5 bg-[#0F141A] space-y-4">
          <h3 className="font-sans-main text-xs font-semibold tracking-wider uppercase text-[#F4F7FA] flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-[#00E5FF]" />
            MOST ACTIVE WORKSTREAMS
          </h3>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex justify-between text-xs font-mono-tech">
                  <span className="text-[#F4F7FA]">{proj.name}</span>
                  <span className="text-[#00E5FF]">{proj.progress}%</span>
                </div>
                <ProgressBar progress={proj.progress} size="sm" color="cyan" />
              </div>
            ))}
          </div>
        </Card>

        {/* Goals Progress */}
        <Card className="p-5 bg-[#0F141A] space-y-4">
          <h3 className="font-sans-main text-xs font-semibold tracking-wider uppercase text-[#F4F7FA] flex items-center gap-2">
            <Target className="w-4 h-4 text-[#B7FF3C]" />
            GOAL ADVANCEMENT
          </h3>
          <div className="space-y-3">
            {goals.map((g) => (
              <div key={g.id} className="space-y-1">
                <div className="flex justify-between text-xs font-mono-tech">
                  <span className="text-[#F4F7FA]">{g.title}</span>
                  <span className="text-[#B7FF3C]">{g.progress}%</span>
                </div>
                <ProgressBar progress={g.progress} size="sm" color="acid" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Next Week Commitments */}
      <Card className="p-5 bg-[#0F141A] space-y-3">
        <h3 className="font-sans-main text-xs font-semibold tracking-wider uppercase text-[#F4F7FA] flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#FFB020]" />
          NEXT WEEK KEY COMMITMENTS
        </h3>
        <div className="space-y-2">
          {weeklyReview.upcomingCommitments.map((com, i) => (
            <div
              key={i}
              className="p-3 rounded-[6px] bg-[#131A21] border border-white/10 flex items-center gap-3 text-xs font-mono-tech text-[#F4F7FA]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB020]" />
              <span>{com}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
