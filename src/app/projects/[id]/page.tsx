"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useOS } from "@/lib/context/OSContext";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { TaskRow } from "@/components/tasks/TaskRow";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  FolderGit2,
  CheckSquare,
  Clock,
  ShieldAlert,
  FileText,
  Activity as ActivityIcon,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

function ProjectDetailContent() {
  const params = useParams();
  const id = params?.id as string;

  const {
    projects,
    tasks,
    deadlines,
    activities,
    setQuickAddModalType,
  } = useOS();

  const [activeTab, setActiveTab] = useState<
    "overview" | "tasks" | "schedule" | "notes" | "activity"
  >("overview");

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-base font-mono-tech text-[#FF4567]">
          [ERROR] PROJECT SPECIFICATION NOT FOUND
        </h2>
        <Link href="/projects">
          <Button variant="outline">RETURN TO PROJECTS</Button>
        </Link>
      </div>
    );
  }

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const projectDeadlines = deadlines.filter((d) => d.projectId === project.id);
  const projectActivities = activities.filter(
    (a) =>
      a.targetTitle.toLowerCase().includes(project.name.toLowerCase()) ||
      a.details?.toLowerCase().includes(project.name.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Back button & Header */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-[#8B96A3] hover:text-[#00E5FF] mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO ALL PROJECTS</span>
        </Link>

        <div className="p-5 rounded-[8px] bg-[#0F141A] border border-white/[0.08] relative overflow-hidden cyber-corners">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono-tech text-[10px] text-[#00E5FF] px-2 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/20">
                  {project.category.toUpperCase()}
                </span>
                <span className="font-mono-tech text-[10px] text-[#58616B]">
                  ID: {project.id}
                </span>
              </div>
              <h1 className="font-sans-main text-2xl font-bold text-[#F4F7FA]">
                {project.name}
              </h1>
              <p className="font-sans-main text-xs text-[#8B96A3] max-w-2xl">
                {project.description}
              </p>
            </div>

            <div className="w-full md:w-64 space-y-2 bg-[#131A21] p-3 rounded-[6px] border border-white/[0.06]">
              <div className="flex justify-between text-xs font-mono-tech">
                <span className="text-[#8B96A3]">PROGRESS</span>
                <span className="text-[#00E5FF] font-semibold">{project.progress}%</span>
              </div>
              <ProgressBar progress={project.progress} size="sm" color="cyan" />
              <div className="text-[10px] font-mono-tech text-[#58616B] text-right">
                {project.completedTasks} / {project.totalTasks} TASKS RESOLVED
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Navigation Tabs */}
      <div className="flex items-center gap-1 bg-[#0F141A] p-1 rounded-[6px] border border-white/[0.06] overflow-x-auto">
        {[
          { key: "overview", label: "Overview", icon: FolderGit2 },
          { key: "tasks", label: `Tasks (${projectTasks.length})`, icon: CheckSquare },
          { key: "schedule", label: "Schedule", icon: Clock },
          { key: "notes", label: "Notes", icon: FileText },
          { key: "activity", label: "Activity", icon: ActivityIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] text-xs font-mono-tech uppercase transition-colors shrink-0 cursor-pointer",
                isActive
                  ? "bg-[#131A21] text-[#00E5FF] border border-[#00E5FF]/30 font-medium"
                  : "text-[#8B96A3] hover:text-[#F4F7FA] border border-transparent"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-5 bg-[#0F141A] space-y-4">
            <h3 className="font-sans-main text-sm font-semibold tracking-wider uppercase text-[#F4F7FA] flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#00E5FF]" />
              ACTIVE PROJECT TASKS
            </h3>
            <div className="space-y-2">
              {projectTasks.slice(0, 3).map((task) => (
                <TaskRow key={task.id} task={task} showProject={false} />
              ))}
            </div>
            {projectTasks.length > 3 && (
              <button
                onClick={() => setActiveTab("tasks")}
                className="text-xs font-mono-tech text-[#00E5FF] hover:underline cursor-pointer"
              >
                View all {projectTasks.length} tasks →
              </button>
            )}
          </Card>

          <Card className="p-5 bg-[#0F141A] space-y-4">
            <h3 className="font-sans-main text-sm font-semibold tracking-wider uppercase text-[#F4F7FA] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#FF4567]" />
              PROJECT DEADLINES
            </h3>
            <div className="space-y-2">
              {projectDeadlines.length > 0 ? (
                projectDeadlines.map((dl) => (
                  <div
                    key={dl.id}
                    className="p-3 rounded bg-[#131A21] border border-white/10 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-sans-main font-semibold text-[#F4F7FA]">
                        {dl.title}
                      </div>
                      <div className="font-mono-tech text-[10px] text-[#FF4567] mt-0.5">
                        {dl.dueDate}
                      </div>
                    </div>
                    <span className="font-mono-tech text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#8B96A3]">
                      {dl.category}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs font-mono-tech text-[#58616B] py-4 text-center">
                  // No specific hard deadlines registered for this workstream.
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setQuickAddModalType("task")}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              + ADD PROJECT TASK
            </Button>
          </div>
          <div className="space-y-2">
            {projectTasks.map((task) => (
              <TaskRow key={task.id} task={task} showProject={false} />
            ))}
          </div>
        </div>
      )}

      {activeTab === "schedule" && (
        <Card className="p-6 bg-[#0F141A] text-center space-y-2">
          <Clock className="w-8 h-8 text-[#00E5FF] mx-auto opacity-70" />
          <div className="font-sans-main text-sm font-semibold text-[#F4F7FA]">
            WORKSTREAM SCHEDULE TIMELINE
          </div>
          <p className="font-mono-tech text-xs text-[#8B96A3] max-w-md mx-auto">
            Events tied to {project.name} appear in the central operating schedule. Next sync scheduled for tomorrow.
          </p>
        </Card>
      )}

      {activeTab === "notes" && (
        <Card className="p-5 bg-[#0F141A] space-y-3">
          <div className="font-mono-tech text-xs text-[#00E5FF] uppercase">
            // ARCHITECTURAL NOTES & SPECIFICATIONS
          </div>
          <textarea
            defaultValue={`- Primary focus on low latency and resilient state persistence.
- Review async connection pools before final tag release.
- Maintain Pydantic validation schema consistency.`}
            rows={5}
            className="w-full bg-[#07090D] border border-white/10 rounded p-3 text-xs font-mono-tech text-[#F4F7FA] outline-none focus:border-[#00E5FF]"
          />
          <div className="text-right">
            <Button variant="secondary" size="sm">
              SAVE SPECIFICATION NOTE
            </Button>
          </div>
        </Card>
      )}

      {activeTab === "activity" && (
        <Card className="p-5 bg-[#0F141A] space-y-3">
          <div className="font-mono-tech text-xs text-[#8B96A3] uppercase">
            // AUDIT & RECENT TELEMETRY
          </div>
          <div className="space-y-2">
            {projectActivities.length > 0 ? (
              projectActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-2.5 rounded bg-[#131A21] border border-white/10 flex items-center justify-between text-xs font-mono-tech"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                    <span className="text-[#F4F7FA] font-medium">{act.action}</span>
                    <span className="text-[#8B96A3]">{act.targetTitle}</span>
                  </div>
                  <span className="text-[#58616B] text-[10px]">{act.timestamp}</span>
                </div>
              ))
            ) : (
              <div className="text-xs font-mono-tech text-[#58616B] py-4 text-center">
                // No logged activities specifically targeting this project.
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

export default function ProjectDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs font-mono-tech text-[#58616B]">Loading project...</div>}>
      <ProjectDetailContent />
    </Suspense>
  );
}
