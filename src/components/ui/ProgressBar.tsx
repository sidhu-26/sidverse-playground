"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number; // 0 - 100
  color?: "cyan" | "acid" | "warning" | "danger";
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  progress,
  color = "cyan",
  size = "md",
  showLabel = false,
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, progress));

  const colorStyles = {
    cyan: "bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.4)]",
    acid: "bg-[#B7FF3C] shadow-[0_0_8px_rgba(183,255,60,0.4)]",
    warning: "bg-[#FFB020] shadow-[0_0_8px_rgba(255,176,32,0.4)]",
    danger: "bg-[#FF4567] shadow-[0_0_8px_rgba(255,69,103,0.4)]",
  };

  const heightStyles = {
    sm: "h-1.5",
    md: "h-2",
  };

  return (
    <div className={cn("w-full flex items-center gap-3", className)}>
      <div className={cn("flex-1 bg-white/5 rounded-full overflow-hidden border border-white/5", heightStyles[size])}>
        <div
          className={cn("h-full transition-all duration-300 rounded-full", colorStyles[color])}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="font-mono-tech text-xs text-[#8B96A3] shrink-0 min-w-[36px] text-right">
          {clamped}%
        </span>
      )}
    </div>
  );
}
