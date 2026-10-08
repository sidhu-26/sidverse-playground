"use client";

import React from "react";
import Link from "next/link";
import { useOS } from "@/lib/context/OSContext";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { FolderGit2, ArrowRight, ShieldAlert } from "lucide-react";

export default function ProjectsPage() {
  const { projects } = useOS();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-[8px] bg-[#0F141A] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-[6px] bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans-main text-base font-semibold text-[#F4F7FA]">
              STRATEGIC PROJECTS
            </h2>
            <p className="font-mono-tech text-xs text-[#8B96A3]">
              MISSION-CRITICAL WORKSTREAMS & SYSTEM NODES
            </p>
          </div>
        </div>

        <span className="font-mono-tech text-xs text-[#00E5FF] bg-[#00E5FF]/10 px-3 py-1.5 rounded-[6px] border border-[#00E5FF]/30">
          {projects.length} ACTIVE INITIATIVES
        </span>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="group block"
          >
            <Card
              withCorners
              className="p-5 bg-[#0F141A] hover:bg-[#131A21] hover:border-[#00E5FF]/40 transition-all duration-200 h-full flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
                    <span className="font-mono-tech text-[10px] text-[#58616B] uppercase">
                      {project.category}
                    </span>
                  </div>
                  <span className="font-mono-tech text-[11px] text-[#8B96A3]">
                    {project.lastActivity}
                  </span>
                </div>

                <h3 className="font-sans-main text-lg font-bold text-[#F4F7FA] group-hover:text-[#00E5FF] transition-colors flex items-center justify-between">
                  <span>{project.name}</span>
                  <ArrowRight className="w-4 h-4 text-[#8B96A3] group-hover:text-[#00E5FF] group-hover:translate-x-1 transition-all" />
                </h3>

                <p className="font-sans-main text-xs text-[#8B96A3] leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                {/* Progress Bar & Stats */}
                <div className="pt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono-tech">
                    <span className="text-[#8B96A3]">
                      {project.completedTasks} / {project.totalTasks} TASKS
                    </span>
                    <span className="text-[#00E5FF] font-semibold">
                      {project.progress}%
                    </span>
                  </div>
                  <ProgressBar
                    progress={project.progress}
                    color={project.progress > 75 ? "acid" : "cyan"}
                    size="sm"
                  />
                </div>
              </div>

              {/* Footer info: upcoming deadline */}
              {project.upcomingDeadline && (
                <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono-tech text-[#8B96A3]">
                  <span className="flex items-center gap-1.5 text-[#FFB020]">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    NEXT: {project.upcomingDeadline}
                  </span>
                  <span className="text-[#58616B] group-hover:text-[#F4F7FA] transition-colors">
                    VIEW DETAILS →
                  </span>
                </div>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
