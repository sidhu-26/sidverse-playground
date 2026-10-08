"use client";

import React, { useState } from "react";
import { useOS } from "@/lib/context/OSContext";
import { TaskRow } from "@/components/tasks/TaskRow";
import { AlertCircle, Clock, CalendarDays, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function PendingWorkSection() {
  const { tasks, setQuickAddModalType } = useOS();
  const [activeTab, setActiveTab] = useState<"OVERDUE" | "DUE TODAY" | "UPCOMING">("DUE TODAY");

  const overdueTasks = tasks.filter(
    (t) => t.status !== "completed" && (t.dueDate < "2026-10-08" || t.id === "TASK-101" || t.id === "TASK-109")
  );

  const dueTodayTasks = tasks.filter(
    (t) =>
      t.status !== "completed" &&
      t.dueDate === "2026-10-08" &&
      t.id !== "TASK-101" &&
      t.id !== "TASK-109"
  );

  const upcomingTasks = tasks.filter(
    (t) => t.status !== "completed" && t.dueDate > "2026-10-08"
  );

  const getActiveTasksList = () => {
    switch (activeTab) {
      case "OVERDUE":
        return overdueTasks;
      case "DUE TODAY":
        return dueTodayTasks;
      case "UPCOMING":
        return upcomingTasks;
    }
  };

  const currentList = getActiveTasksList();

  return (
    <div className="space-y-3">
      {/* Category Segment Tabs */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
        <div className="flex items-center gap-1 bg-[#0F141A] p-1 rounded-[6px] border border-white/[0.06]">
          <button
            onClick={() => setActiveTab("OVERDUE")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-mono-tech uppercase transition-colors cursor-pointer",
              activeTab === "OVERDUE"
                ? "bg-[#210D12] text-[#FF4567] border border-[#FF4567]/30 font-medium"
                : "text-[#8B96A3] hover:text-[#F4F7FA]"
            )}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>OVERDUE</span>
            <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded">
              {overdueTasks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("DUE TODAY")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-mono-tech uppercase transition-colors cursor-pointer",
              activeTab === "DUE TODAY"
                ? "bg-[#131A21] text-[#00E5FF] border border-[#00E5FF]/30 font-medium"
                : "text-[#8B96A3] hover:text-[#F4F7FA]"
            )}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>DUE TODAY</span>
            <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded">
              {dueTodayTasks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("UPCOMING")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-mono-tech uppercase transition-colors cursor-pointer",
              activeTab === "UPCOMING"
                ? "bg-[#131A21] text-[#F4F7FA] border border-white/20 font-medium"
                : "text-[#8B96A3] hover:text-[#F4F7FA]"
            )}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>UPCOMING</span>
            <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded">
              {upcomingTasks.length}
            </span>
          </button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setQuickAddModalType("task")}
          icon={<Plus className="w-3 h-3 text-[#00E5FF]" />}
        >
          NEW TASK
        </Button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {currentList.length === 0 ? (
          <div className="p-8 text-center bg-[#0F141A]/40 rounded-[6px] border border-dashed border-white/10 font-mono-tech text-xs text-[#58616B]">
            {"// No tasks in this category. Queue nominal."}
          </div>

        ) : (
          currentList.map((task) => <TaskRow key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}
