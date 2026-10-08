"use client";

import React, { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { useOS } from "@/lib/context/OSContext";
import { PriorityBadge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  Clock,
  FolderGit2,
  Tag,
  Paperclip,
  RotateCw,
  Bell,
  CheckCircle2,
  Trash2,
  CalendarRange,
  History,
} from "lucide-react";
import { formatDateDisplay } from "@/lib/utils";

export function TaskDetailDrawer() {
  const {
    selectedTaskForDrawer,
    setSelectedTaskForDrawer,
    toggleTaskComplete,
    deleteTask,
    rescheduleTask,
    activities,
  } = useOS();

  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  if (!selectedTaskForDrawer) return null;

  const task = selectedTaskForDrawer;
  const isCompleted = task.status === "completed";

  // Filter activities related to this task
  const taskActivities = activities.filter(
    (a) => a.targetTitle.toLowerCase() === task.title.toLowerCase()
  );

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;
    await rescheduleTask(task.id, newDate, newTime || task.dueTime);
    setIsRescheduling(false);
  };


  return (
    <Drawer
      isOpen={!!selectedTaskForDrawer}
      onClose={() => setSelectedTaskForDrawer(null)}
      title="TASK SPECIFICATION"
      subtitle={`ID: ${task.id}`}
      width="lg"
    >
      <div className="space-y-6">
        {/* Title & Status */}
        <div className="space-y-3 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            {task.projectName && (
              <span className="font-mono-tech text-[11px] text-[#00E5FF] px-2 py-0.5 rounded-[3px] bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center gap-1">
                <FolderGit2 className="w-3 h-3" />
                {task.projectName}
              </span>
            )}
          </div>

          <h1 className="font-sans-main text-lg font-medium text-[#F4F7FA] leading-snug">
            {task.title}
          </h1>

          {task.description && (
            <p className="text-sm text-[#8B96A3] leading-relaxed font-sans-main bg-[#131A21]/50 p-3 rounded-[6px] border border-white/[0.04]">
              {task.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={isCompleted ? "secondary" : "primary"}
            size="sm"
            onClick={() => toggleTaskComplete(task.id)}
            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
          >
            {isCompleted ? "REOPEN" : "COMPLETE"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRescheduling((prev) => !prev)}
            icon={<CalendarRange className="w-3.5 h-3.5" />}
          >
            RESCHEDULE
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteTask(task.id)}
            icon={<Trash2 className="w-3.5 h-3.5" />}
          >
            DELETE
          </Button>
        </div>

        {/* Reschedule inline form if toggled */}
        {isRescheduling && (
          <form
            onSubmit={handleRescheduleSubmit}
            className="p-3 bg-[#131A21] border border-white/10 rounded-[6px] space-y-3 animate-in fade-in"
          >
            <div className="text-[11px] font-mono-tech text-[#00E5FF] uppercase">
              {"// Reschedule Target"}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                defaultValue={task.dueDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="bg-[#0B0F14] border border-white/10 text-xs text-[#F4F7FA] rounded px-2 py-1.5 focus:border-[#00E5FF] outline-none font-mono-tech"
                required
              />
              <input
                type="time"
                defaultValue={task.dueTime || "12:00"}
                onChange={(e) => setNewTime(e.target.value)}
                className="bg-[#0B0F14] border border-white/10 text-xs text-[#F4F7FA] rounded px-2 py-1.5 focus:border-[#00E5FF] outline-none font-mono-tech"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsRescheduling(false)}
              >
                CANCEL
              </Button>
              <Button type="submit" variant="primary" size="sm">
                SAVE
              </Button>
            </div>
          </form>
        )}

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-[#0F141A] p-4 rounded-[8px] border border-white/[0.06]">
          <div className="space-y-1">
            <span className="font-mono-tech text-[10px] text-[#58616B] uppercase flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#8B96A3]" /> Due Date
            </span>
            <div className="font-mono-tech text-xs text-[#F4F7FA]">
              {formatDateDisplay(task.dueDate)}
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-mono-tech text-[10px] text-[#58616B] uppercase flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#8B96A3]" /> Due Time
            </span>
            <div className="font-mono-tech text-xs text-[#00E5FF]">
              {task.dueTime || "End of Day"}
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-mono-tech text-[10px] text-[#58616B] uppercase flex items-center gap-1">
              <Bell className="w-3 h-3 text-[#8B96A3]" /> Reminder
            </span>
            <div className="font-mono-tech text-xs text-[#8B96A3]">
              {task.reminder || "None"}
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-mono-tech text-[10px] text-[#58616B] uppercase flex items-center gap-1">
              <RotateCw className="w-3 h-3 text-[#8B96A3]" /> Repeat
            </span>
            <div className="font-mono-tech text-xs text-[#8B96A3]">
              {task.repeat || "Never"}
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-mono-tech text-[10px] text-[#58616B] uppercase flex items-center gap-1">
              <Paperclip className="w-3 h-3 text-[#8B96A3]" /> Attachments
            </span>
            <div className="font-mono-tech text-xs text-[#8B96A3]">
              {task.attachmentsCount ? `${task.attachmentsCount} files attached` : "None"}
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-mono-tech text-[10px] text-[#58616B] uppercase flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#8B96A3]" /> Duration
            </span>
            <div className="font-mono-tech text-xs text-[#8B96A3]">
              {task.durationMinutes ? `${task.durationMinutes} min` : "Unspecified"}
            </div>
          </div>
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="space-y-2">
            <div className="font-mono-tech text-[11px] text-[#8B96A3] uppercase flex items-center gap-1.5">
              <Tag className="w-3 h-3" /> Tags
            </div>
            <div className="flex flex-wrap gap-1.5">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono-tech text-[10px] px-2 py-0.5 rounded-[4px] bg-white/5 border border-white/10 text-[#8B96A3]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* System Timestamps */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono-tech text-[#58616B]">
          <span>CREATED: {new Date(task.createdAt).toLocaleDateString()}</span>
          <span>UPDATED: {new Date(task.updatedAt).toLocaleTimeString()}</span>
        </div>

        {/* Activity Stream for this task */}
        <div className="space-y-2 pt-2 border-t border-white/[0.06]">
          <div className="font-mono-tech text-[11px] text-[#8B96A3] uppercase flex items-center gap-1.5">
            <History className="w-3 h-3" /> Audit History
          </div>
          <div className="space-y-2 bg-[#0F141A] p-3 rounded-[6px] border border-white/[0.04]">
            {taskActivities.length > 0 ? (
              taskActivities.map((act) => (
                <div key={act.id} className="flex items-start justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]/60" />
                    <span className="font-medium text-[#F4F7FA]">{act.action}</span>
                    <span className="text-[#8B96A3] text-[11px]">{act.details}</span>
                  </div>
                  <span className="font-mono-tech text-[10px] text-[#58616B]">
                    {act.timestamp}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-[11px] font-mono-tech text-[#58616B]">
                No recorded state changes yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
