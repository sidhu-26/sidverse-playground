"use client";

import React, { useState, useEffect, useRef } from "react";
import { useOS } from "@/lib/context/OSContext";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Priority } from "@/lib/types";

export function QuickAddModal() {
  const {
    quickAddModalType,
    setQuickAddModalType,
    createTask,
    createEvent,
    createDuty,
    createDeadline,
    projects,
  } = useOS();

  // Task form state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskProjectId, setTaskProjectId] = useState(projects[0]?.id || "");
  const [taskPriority, setTaskPriority] = useState<Priority>("medium");
  const [taskDueDate, setTaskDueDate] = useState("2026-10-08");
  const [taskDueTime, setTaskDueTime] = useState("18:00");
  const [taskDuration, setTaskDuration] = useState("45");
  const [taskReminder, setTaskReminder] = useState("15m before");
  const [taskRepeat, setTaskRepeat] = useState("Never");
  const [taskTags, setTaskTags] = useState("");

  // Event form state
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("2026-10-08");
  const [eventStartTime, setEventStartTime] = useState("15:00");
  const [eventEndTime, setEventEndTime] = useState("16:00");
  const [eventDescription, setEventDescription] = useState("");

  // Duty form state
  const [dutyTitle, setDutyTitle] = useState("");
  const [dutyFrequency, setDutyFrequency] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [dutyRecurrenceText, setDutyRecurrenceText] = useState("Every Friday");

  // Deadline form state
  const [deadlineTitle, setDeadlineTitle] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("2026-10-12");
  const [deadlineTime, setDeadlineTime] = useState("18:00");
  const [deadlinePriority, setDeadlinePriority] = useState<Priority>("high");

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (quickAddModalType) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    }
  }, [quickAddModalType]);

  if (!quickAddModalType) return null;

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const selectedProj = projects.find((p) => p.id === taskProjectId);
    const tagsArr = taskTags
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    await createTask({
      title: taskTitle.trim(),
      description: taskDescription.trim() || undefined,
      projectId: taskProjectId,
      projectName: selectedProj?.name,
      priority: taskPriority,
      status: "pending",
      dueDate: taskDueDate,
      dueTime: taskDueTime || undefined,
      durationMinutes: Number(taskDuration) || undefined,
      tags: tagsArr.length > 0 ? tagsArr : undefined,
      reminder: taskReminder,
      repeat: taskRepeat,
    });

    setTaskTitle("");
    setTaskDescription("");
    setQuickAddModalType(null);
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    await createEvent({
      title: eventTitle.trim(),
      date: eventDate,
      startTime: eventStartTime,
      endTime: eventEndTime,
      status: "upcoming",
      description: eventDescription.trim() || undefined,
    });

    setEventTitle("");
    setQuickAddModalType(null);
  };

  const handleDutySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dutyTitle.trim()) return;

    createDuty({
      title: dutyTitle.trim(),
      frequency: dutyFrequency,
      recurrenceText: dutyRecurrenceText,
      nextOccurrence: "Next scheduled cycle",
    });

    setDutyTitle("");
    setQuickAddModalType(null);
  };

  const handleDeadlineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deadlineTitle.trim()) return;

    const targetTs = new Date(`${deadlineDate}T${deadlineTime || "00:00"}`).getTime();
    await createDeadline({
      title: deadlineTitle.trim(),
      dueDate: `${deadlineDate}T${deadlineTime || "00:00"}:00Z`,
      targetTimestamp: targetTs || Date.now() + 86400000,
      priority: deadlinePriority,
      isOverdue: false,
      category: "THIS WEEK",
    });

    setDeadlineTitle("");
    setQuickAddModalType(null);
  };


  return (
    <>
      {/* 1. TASK CREATION MODAL */}
      {quickAddModalType === "task" && (
        <Modal
          isOpen={true}
          onClose={() => setQuickAddModalType(null)}
          title="CREATE NEW TASK"
          subtitle="INITIALIZE WORK UNIT"
          maxWidth="lg"
        >
          <form onSubmit={handleTaskSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono-tech text-[#8B96A3] uppercase mb-1">
                Task Title *
              </label>
              <input
                ref={titleInputRef}
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Implement token bucket rate limiter"
                className="w-full bg-[#07090D] border border-white/10 rounded-[6px] px-3 py-2 text-sm text-[#F4F7FA] placeholder-[#58616B] focus:border-[#00E5FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono-tech text-[#8B96A3] uppercase mb-1">
                Description / Technical Notes
              </label>
              <textarea
                rows={2}
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Specific implementation details, edge cases, or dependencies..."
                className="w-full bg-[#07090D] border border-white/10 rounded-[6px] px-3 py-2 text-xs text-[#F4F7FA] placeholder-[#58616B] focus:border-[#00E5FF] focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono-tech text-[#8B96A3] uppercase mb-1">
                  Project
                </label>
                <select
                  value={taskProjectId}
                  onChange={(e) => setTaskProjectId(e.target.value)}
                  className="w-full bg-[#07090D] border border-white/10 rounded-[6px] px-3 py-2 text-xs text-[#F4F7FA] focus:border-[#00E5FF] focus:outline-none"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono-tech text-[#8B96A3] uppercase mb-1">
                  Priority
                </label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as Priority)}
                  className="w-full bg-[#07090D] border border-white/10 rounded-[6px] px-3 py-2 text-xs text-[#F4F7FA] focus:border-[#00E5FF] focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono-tech text-[#8B96A3] uppercase mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full bg-[#07090D] border border-white/10 rounded-[6px] px-2.5 py-1.5 text-xs text-[#F4F7FA] focus:border-[#00E5FF] focus:outline-none font-mono-tech"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono-tech text-[#8B96A3] uppercase mb-1">
                  Due Time
                </label>
                <input
                  type="time"
                  value={taskDueTime}
                  onChange={(e) => setTaskDueTime(e.target.value)}
                  className="w-full bg-[#07090D] border border-white/10 rounded-[6px] px-2.5 py-1.5 text-xs text-[#F4F7FA] focus:border-[#00E5FF] focus:outline-none font-mono-tech"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono-tech text-[#8B96A3] uppercase mb-1">
                  Duration (Mins)
                </label>
                <input
                  type="number"
                  value={taskDuration}
                  onChange={(e) => setTaskDuration(e.target.value)}
                  className="w-full bg-[#07090D] border border-white/10 rounded-[6px] px-2.5 py-1.5 text-xs text-[#F4F7FA] focus:border-[#00E5FF] focus:outline-none font-mono-tech"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono-tech text-[#8B96A3] uppercase mb-1">
                  Reminder
                </label>
                <select
                  value={taskReminder}
                  onChange={(e) => setTaskReminder(e.target.value)}
                  className="w-full bg-[#07090D] border border-white/10 rounded-[6px] px-3 py-1.5 text-xs text-[#F4F7FA] focus:border-[#00E5FF] focus:outline-none"
                >
                  <option value="None">None</option>
                  <option value="15m before">15m before</option>
                  <option value="30m before">30m before</option>
                  <option value="1h before">1h before</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono-tech text-[#8B96A3] uppercase mb-1">
                  Repeat
                </label>
                <select
                  value={taskRepeat}
                  onChange={(e) => setTaskRepeat(e.target.value)}
                  className="w-full bg-[#07090D] border border-white/10 rounded-[6px] px-3 py-1.5 text-xs text-[#F4F7FA] focus:border-[#00E5FF] focus:outline-none"
                >
                  <option value="Never">Never</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono-tech text-[#8B96A3] uppercase mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={taskTags}
                onChange={(e) => setTaskTags(e.target.value)}
                placeholder="auth, api, performance"
                className="w-full bg-[#07090D] border border-white/10 rounded-[6px] px-3 py-1.5 text-xs text-[#F4F7FA] placeholder-[#58616B] focus:border-[#00E5FF] focus:outline-none font-mono-tech"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setQuickAddModalType(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                + Create Task
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 2. EVENT CREATION MODAL */}
      {quickAddModalType === "event" && (
        <Modal
          isOpen={true}
          onClose={() => setQuickAddModalType(null)}
          title="ADD CALENDAR EVENT"
          subtitle="SCHEDULE TIMELINE BLOCK"
        >
          <form onSubmit={handleEventSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono-tech text-[#8B96A3] uppercase mb-1">
                Event Title *
              </label>
              <input
                ref={titleInputRef}
                type="text"
                required
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="e.g. Architecture Deep Dive"
                className="w-full bg-[#07090D] border border-white/10 rounded-[6px] px-3 py-2 text-sm text-[#F4F7FA] focus:border-[#00E5FF] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-mono-tech text-[#8B96A3] uppercase mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-[#07090D] border border-white/10 rounded px-2 py-1.5 text-xs text-[#F4F7FA] font-mono-tech"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono-tech text-[#8B96A3] uppercase mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={eventStartTime}
                  onChange={(e) => setEventStartTime(e.target.value)}
                  className="w-full bg-[#07090D] border border-white/10 rounded px-2 py-1.5 text-xs text-[#F4F7FA] font-mono-tech"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono-tech text-[#8B96A3] uppercase mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={eventEndTime}
                  onChange={(e) => setEventEndTime(e.target.value)}
                  className="w-full bg-[#07090D] border border-white/10 rounded px-2 py-1.5 text-xs text-[#F4F7FA] font-mono-tech"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono-tech text-[#8B96A3] uppercase mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Agenda or location details..."
                className="w-full bg-[#07090D] border border-white/10 rounded px-3 py-2 text-xs text-[#F4F7FA] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.08]">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setQuickAddModalType(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                + Schedule Event
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 3. DUTY CREATION MODAL */}
      {quickAddModalType === "duty" && (
        <Modal
          isOpen={true}
          onClose={() => setQuickAddModalType(null)}
          title="ADD RECURRING DUTY"
          subtitle="CONTINUOUS RESPONSIBILITY PROTOCOL"
        >
          <form onSubmit={handleDutySubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono-tech text-[#8B96A3] uppercase mb-1">
                Duty Title *
              </label>
              <input
                ref={titleInputRef}
                type="text"
                required
                value={dutyTitle}
                onChange={(e) => setDutyTitle(e.target.value)}
                placeholder="e.g. Weekly systems audit"
                className="w-full bg-[#07090D] border border-white/10 rounded px-3 py-2 text-sm text-[#F4F7FA]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono-tech text-[#8B96A3] uppercase mb-1">
                  Cadence
                </label>
                <select
                  value={dutyFrequency}
                  onChange={(e) => setDutyFrequency(e.target.value as "daily" | "weekly" | "monthly")}
                  className="w-full bg-[#07090D] border border-white/10 rounded px-3 py-2 text-xs text-[#F4F7FA]"
                >

                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono-tech text-[#8B96A3] uppercase mb-1">
                  Schedule Text
                </label>
                <input
                  type="text"
                  value={dutyRecurrenceText}
                  onChange={(e) => setDutyRecurrenceText(e.target.value)}
                  placeholder="e.g. Every Friday at 17:00"
                  className="w-full bg-[#07090D] border border-white/10 rounded px-3 py-2 text-xs text-[#F4F7FA]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.08]">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setQuickAddModalType(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                + Register Duty
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 4. DEADLINE CREATION MODAL */}
      {quickAddModalType === "deadline" && (
        <Modal
          isOpen={true}
          onClose={() => setQuickAddModalType(null)}
          title="ADD HARD DEADLINE"
          subtitle="CRITICAL TARGET COUNTDOWN"
        >
          <form onSubmit={handleDeadlineSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono-tech text-[#8B96A3] uppercase mb-1">
                Deadline Title *
              </label>
              <input
                ref={titleInputRef}
                type="text"
                required
                value={deadlineTitle}
                onChange={(e) => setDeadlineTitle(e.target.value)}
                placeholder="e.g. Release v1.0 Production Binary"
                className="w-full bg-[#07090D] border border-white/10 rounded px-3 py-2 text-sm text-[#F4F7FA]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono-tech text-[#8B96A3] uppercase mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className="w-full bg-[#07090D] border border-white/10 rounded px-2 py-1.5 text-xs text-[#F4F7FA] font-mono-tech"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono-tech text-[#8B96A3] uppercase mb-1">
                  Target Time
                </label>
                <input
                  type="time"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  className="w-full bg-[#07090D] border border-white/10 rounded px-2 py-1.5 text-xs text-[#F4F7FA] font-mono-tech"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono-tech text-[#8B96A3] uppercase mb-1">
                  Priority
                </label>
                <select
                  value={deadlinePriority}
                  onChange={(e) => setDeadlinePriority(e.target.value as Priority)}
                  className="w-full bg-[#07090D] border border-white/10 rounded px-2 py-1.5 text-xs text-[#F4F7FA] font-mono-tech"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>


            <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.08]">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setQuickAddModalType(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="danger">
                + Set Deadline
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
