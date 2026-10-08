"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOS } from "@/lib/context/OSContext";
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  FolderGit2,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();
  const { setQuickAddModalType } = useOS();

  const navItems = [
    { label: "Today", path: "/today", icon: LayoutDashboard },
    { label: "Schedule", path: "/schedule", icon: CalendarDays },
    { label: "Tasks", path: "/tasks", icon: CheckSquare },
    { label: "Projects", path: "/projects", icon: FolderGit2 },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07090D]/95 backdrop-blur-lg border-t border-white/[0.08] px-3 py-1 flex items-center justify-around select-none">
      {navItems.slice(0, 2).map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex flex-col items-center justify-center py-1.5 px-3 rounded-[6px] transition-colors",
              isActive ? "text-[#00E5FF]" : "text-[#8B96A3] hover:text-[#F4F7FA]"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="font-sans-main text-[10px] mt-1">{item.label}</span>
          </Link>
        );
      })}

      {/* Floating Center Quick Add Button */}
      <button
        onClick={() => setQuickAddModalType("task")}
        className="w-11 h-11 -mt-4 rounded-full bg-[#00E5FF] text-[#07090D] flex items-center justify-center shadow-[0_0_16px_rgba(0,229,255,0.4)] active:scale-90 transition-transform"
        aria-label="Quick add task"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {navItems.slice(2, 4).map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex flex-col items-center justify-center py-1.5 px-3 rounded-[6px] transition-colors",
              isActive ? "text-[#00E5FF]" : "text-[#8B96A3] hover:text-[#F4F7FA]"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="font-sans-main text-[10px] mt-1">{item.label}</span>
          </Link>
        );
      })}

      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center py-1.5 px-3 rounded-[6px] text-[#8B96A3] hover:text-[#F4F7FA]"
      >
        <MoreHorizontal className="w-5 h-5" />
        <span className="font-sans-main text-[10px] mt-1">More</span>
      </button>
    </nav>
  );
}
