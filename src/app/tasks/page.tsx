"use client";

import React, { useState } from "react";
import { useOS } from "@/lib/context/OSContext";
import { TaskRow } from "@/components/tasks/TaskRow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, Search, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";


export function TasksPage() {
  const { tasks, projects, setQuickAddModalType } = useOS();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [projectFilter, setProjectFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = tasks.filter((task) => {
    // Status filter
    if (statusFilter === "PENDING" && task.status !== "pending") return false;
    if (statusFilter === "IN_PROGRESS" && task.status !== "in_progress") return false;
    if (statusFilter === "COMPLETED" && task.status !== "completed") return false;

    // Project filter
    if (projectFilter !== "ALL" && task.projectId !== projectFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      const matchTag = task.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-[8px] bg-[#0F141A] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-[6px] bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans-main text-base font-semibold text-[#F4F7FA]">
              TASK INVENTORY
            </h2>
            <p className="font-mono-tech text-xs text-[#8B96A3]">
              {filteredTasks.length} UNITS FILTERED // {tasks.length} TOTAL IN QUEUE
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={() => setQuickAddModalType("task")}
          icon={<Plus className="w-4 h-4" />}
        >
          CREATE TASK
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-3 bg-[#0F141A] flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Status Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto">
          {["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={cn(
                "px-3 py-1.5 rounded-[4px] text-xs font-mono-tech uppercase transition-colors shrink-0 cursor-pointer",
                statusFilter === st
                  ? "bg-[#131A21] text-[#00E5FF] border border-[#00E5FF]/30 font-medium"
                  : "text-[#8B96A3] hover:text-[#F4F7FA] border border-transparent"
              )}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Project Selector & Search */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="bg-[#07090D] border border-white/10 rounded-[6px] px-2.5 py-1.5 text-xs text-[#8B96A3] focus:border-[#00E5FF] outline-none font-mono-tech"
          >
            <option value="ALL">ALL PROJECTS</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name.toUpperCase()}
              </option>
            ))}
          </select>

          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-[#58616B] absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tasks..."
              className="w-full bg-[#07090D] border border-white/10 rounded-[6px] pl-8 pr-3 py-1.5 text-xs text-[#F4F7FA] placeholder-[#58616B] focus:border-[#00E5FF] outline-none font-sans-main"
            />
          </div>
        </div>
      </Card>

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-[#0F141A]/40 rounded-[8px] border border-dashed border-white/10 font-mono-tech text-xs text-[#58616B]">
            {"// No matching tasks found. Adjust filters or register a new task."}
          </div>
        ) : (

          filteredTasks.map((task) => <TaskRow key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}

export default TasksPage;
