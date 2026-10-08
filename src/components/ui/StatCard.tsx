"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  accent?: "cyan" | "acid" | "warning" | "danger" | "muted";
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  label,
  value,
  sublabel,
  accent = "muted",
  className,
  onClick,
}: StatCardProps) {
  const accentBorder = {
    cyan: "hover:border-[#00E5FF]/40 group-hover:text-[#00E5FF]",
    acid: "hover:border-[#B7FF3C]/40 group-hover:text-[#B7FF3C]",
    warning: "hover:border-[#FFB020]/40 group-hover:text-[#FFB020]",
    danger: "hover:border-[#FF4567]/40 group-hover:text-[#FF4567]",
    muted: "hover:border-white/20",
  };

  const accentColor = {
    cyan: "text-[#00E5FF]",
    acid: "text-[#B7FF3C]",
    warning: "text-[#FFB020]",
    danger: "text-[#FF4567]",
    muted: "text-[#F4F7FA]",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group bg-[#0F141A] border border-white/[0.08] rounded-[8px] p-4 transition-all duration-200 select-none",
        accentBorder[accent],
        onClick && "cursor-pointer hover:bg-[#131A21]",
        className
      )}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono-tech text-[11px] uppercase tracking-wider text-[#8B96A3]">
          {label}
        </span>
        {accent === "cyan" && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
        )}
        {accent === "danger" && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4567] shadow-[0_0_6px_#FF4567]" />
        )}
      </div>

      <div className={cn("font-display text-2xl font-semibold tracking-tight", accentColor[accent])}>
        {typeof value === "number" && value < 10 && value >= 0
          ? `0${value}`
          : value}
      </div>

      {sublabel && (
        <div className="font-mono-tech text-[10px] text-[#58616B] mt-1 truncate">
          {sublabel}
        </div>
      )}
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between mb-4 pb-2 border-b border-white/[0.06]", className)}>
      <div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-3.5 bg-[#00E5FF] rounded-[1px]" />
          <h2 className="font-sans-main text-sm font-semibold tracking-wider uppercase text-[#F4F7FA]">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="font-mono-tech text-[11px] text-[#8B96A3] mt-0.5 ml-3.5">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function EmptyState({
  title = "NO ITEMS",
  description = "Your schedule is clear.",
  action,
  className,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[8px] border border-dashed border-white/10 bg-[#0F141A]/50 p-8 text-center flex flex-col items-center justify-center my-4",
        className
      )}
    >
      <div className="w-10 h-10 rounded-[6px] border border-white/10 flex items-center justify-center mb-3 bg-[#131A21]/60 text-[#8B96A3]">
        <span className="font-mono-tech text-xs">// 00</span>
      </div>
      <h3 className="font-sans-main text-sm font-semibold tracking-wider uppercase text-[#F4F7FA] mb-1">
        {title}
      </h3>
      <p className="font-mono-tech text-xs text-[#8B96A3] max-w-sm mb-4">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
