"use client";

import React from "react";
import { useOS } from "@/lib/context/OSContext";
import { StatCard, SectionHeader } from "@/components/ui/StatCard";
import { NextUpCard } from "@/components/today/NextUpCard";
import { TodayTimeline } from "@/components/today/TodayTimeline";
import { PendingWorkSection } from "@/components/today/PendingWorkSection";
import { ProgressBar } from "@/components/ui/ProgressBar";


export default function TodayPage() {
  const {
    currentTime,
    dayProgressPercent,
    tasks,
  } = useOS();

  // Compute live counts
  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const pendingCount = tasks.filter((t) => t.status === "pending" || t.status === "in_progress").length;
  const overdueCount = tasks.filter(
    (t) => t.status !== "completed" && (t.dueDate < "2026-10-08" || t.id === "TASK-101" || t.id === "TASK-109")
  ).length;
  const upcomingCount = tasks.filter(
    (t) => t.status !== "completed" && t.dueDate > "2026-10-08"
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner: Greeting + Large Orbitron Clock + Day Progress */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-5 md:p-6 rounded-[8px] bg-[#0F141A] border border-white/[0.08] relative overflow-hidden cyber-corners">
        {/* Left greeting and contextual progress */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] animate-pulse" />
            <span className="font-mono-tech text-[11px] text-[#00E5FF] uppercase tracking-widest">
              SYSTEM ONLINE // COMMAND READY
            </span>
          </div>

          <h2 className="font-sans-main text-xl md:text-2xl font-bold tracking-tight text-[#F4F7FA]">
            GOOD EVENING, SIDDARTH
          </h2>

          <p className="font-mono-tech text-xs text-[#8B96A3] flex items-center gap-2">
            <span>Your day is {dayProgressPercent}% complete.</span>
            <span className="text-[#58616B]">•</span>
            <span className="text-[#B7FF3C]">{completedCount} tasks accomplished</span>
          </p>

          <div className="max-w-xs pt-1">
            <ProgressBar progress={dayProgressPercent} color="cyan" size="sm" showLabel />
          </div>
        </div>

        {/* Right: Large Display / Numeric Time in Orbitron */}
        <div className="flex items-baseline lg:flex-col lg:items-end justify-between border-t lg:border-t-0 pt-4 lg:pt-0 border-white/[0.06]">
          <div className="text-[10px] font-mono-tech text-[#58616B] uppercase tracking-widest lg:mb-1">
            STANDARD LOCAL TIME
          </div>
          <div className="font-display text-4xl md:text-5xl font-bold text-[#F4F7FA] tracking-wider text-shadow">
            {currentTime}
          </div>
          <div className="font-mono-tech text-[11px] text-[#00E5FF] mt-1">
            ZONE: IST (GMT+5:30)
          </div>
        </div>
      </div>

      {/* Summary KPI Cards (Section 12) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="TODAY TASKS"
          value={totalTasks}
          sublabel={`${completedCount} completed`}
          accent="cyan"
        />
        <StatCard
          label="PENDING"
          value={pendingCount}
          sublabel="Active queue"
          accent="warning"
        />
        <StatCard
          label="OVERDUE"
          value={overdueCount}
          sublabel="Immediate triage"
          accent="danger"
        />
        <StatCard
          label="UPCOMING"
          value={upcomingCount}
          sublabel="Next 48h horizon"
          accent="muted"
        />
      </div>

      {/* Primary Action Card: Next Up Focus (Section 14) */}
      <div>
        <NextUpCard />
      </div>

      {/* Dual Column Layout: Today Timeline & Pending Work Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Vertical Timeline (Section 13) */}
        <div className="lg:col-span-6 space-y-4">
          <SectionHeader
            title="TODAY TIMELINE"
            subtitle="CHRONOLOGICAL DISPATCH SEQUENCE"
          />
          <TodayTimeline />
        </div>

        {/* Right Column: Pending Work Section (Section 15) */}
        <div className="lg:col-span-6 space-y-4">
          <SectionHeader
            title="PENDING WORK"
            subtitle="TRIAGE & QUEUED EXECUTION"
          />
          <PendingWorkSection />
        </div>
      </div>
    </div>
  );
}
