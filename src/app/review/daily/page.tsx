"use client";

import React, { useState } from "react";
import { useOS } from "@/lib/context/OSContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileCheck2, CheckCircle2, AlertCircle, Clock, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";

export default function DailyReviewPage() {
  const { dailyReview, tasks, setQuickAddModalType } = useOS();

  const [wentWell, setWentWell] = useState(dailyReview.wentWellNotes);
  const [remains, setRemains] = useState(dailyReview.remainsNotes);
  const [tomorrow, setTomorrow] = useState(dailyReview.tomorrowNotes);
  const [saved, setSaved] = useState(false);

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const pendingCount = tasks.filter((t) => t.status === "pending").length;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-[8px] bg-[#0F141A] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-[6px] bg-[#B7FF3C]/10 text-[#B7FF3C] border border-[#B7FF3C]/20">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans-main text-base font-semibold text-[#F4F7FA]">
              DAILY REVIEW PROTOCOL
            </h2>
            <p className="font-mono-tech text-xs text-[#8B96A3]">
              CLOSING ASSESSMENT // OCTOBER 08, 2026
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setQuickAddModalType("task")}
          icon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          PLAN TOMORROW
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="COMPLETED"
          value={completedCount}
          sublabel="Resolved today"
          accent="acid"
        />
        <StatCard
          label="INCOMPLETE"
          value={pendingCount}
          sublabel="In flight"
          accent="warning"
        />
        <StatCard
          label="POSTPONED"
          value={dailyReview.postponedTasks}
          sublabel="Rescheduled units"
          accent="muted"
        />
        <StatCard
          label="OVERDUE"
          value={dailyReview.overdueTasks}
          sublabel="Carryover units"
          accent="danger"
        />
      </div>

      {/* Review Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* WHAT WENT WELL */}
        <Card className="p-5 bg-[#0F141A] space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B7FF3C]" />
            <h3 className="font-sans-main text-xs font-semibold tracking-wider uppercase text-[#F4F7FA]">
              WHAT WENT WELL
            </h3>
          </div>
          <textarea
            value={wentWell}
            onChange={(e) => setWentWell(e.target.value)}
            rows={5}
            className="w-full bg-[#07090D] border border-white/10 rounded-[6px] p-3 text-xs font-sans-main text-[#F4F7FA] outline-none focus:border-[#B7FF3C]"
            placeholder="Key victories, smooth deployments, breakthroughs..."
          />
        </Card>

        {/* WHAT REMAINS */}
        <Card className="p-5 bg-[#0F141A] space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB020]" />
            <h3 className="font-sans-main text-xs font-semibold tracking-wider uppercase text-[#F4F7FA]">
              WHAT REMAINS
            </h3>
          </div>
          <textarea
            value={remains}
            onChange={(e) => setRemains(e.target.value)}
            rows={5}
            className="w-full bg-[#07090D] border border-white/10 rounded-[6px] p-3 text-xs font-sans-main text-[#F4F7FA] outline-none focus:border-[#FFB020]"
            placeholder="Unresolved blockers, open questions, pending PRs..."
          />
        </Card>

        {/* TOMORROW */}
        <Card className="p-5 bg-[#0F141A] space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
            <h3 className="font-sans-main text-xs font-semibold tracking-wider uppercase text-[#F4F7FA]">
              TOMORROW'S FOCUS
            </h3>
          </div>
          <textarea
            value={tomorrow}
            onChange={(e) => setTomorrow(e.target.value)}
            rows={5}
            className="w-full bg-[#07090D] border border-white/10 rounded-[6px] p-3 text-xs font-sans-main text-[#F4F7FA] outline-none focus:border-[#00E5FF]"
            placeholder="Priority targets, scheduled syncs, primary outcomes..."
          />
        </Card>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={handleSave}>
          {saved ? "SAVED TO LOCAL OS" : "SAVE DAILY REVIEW"}
        </Button>
      </div>
    </div>
  );
}
