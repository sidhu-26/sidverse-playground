"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Priority, TaskStatus, EventStatus } from "@/lib/types";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "cyan" | "acid" | "warning" | "danger" | "muted" | "default";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    cyan: "bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30",
    acid: "bg-[#B7FF3C]/10 text-[#B7FF3C] border-[#B7FF3C]/30",
    warning: "bg-[#FFB020]/10 text-[#FFB020] border-[#FFB020]/30",
    danger: "bg-[#FF4567]/10 text-[#FF4567] border-[#FF4567]/30",
    muted: "bg-white/5 text-[#8B96A3] border-white/10",
    default: "bg-[#131A21] text-[#F4F7FA] border-white/10",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-mono-tech tracking-wider uppercase border",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const configs: Record<Priority, { label: string; variant: "danger" | "warning" | "cyan" | "muted" }> = {
    urgent: { label: "URGENT", variant: "danger" },
    high: { label: "HIGH", variant: "warning" },
    medium: { label: "MED", variant: "cyan" },
    low: { label: "LOW", variant: "muted" },
  };

  const c = configs[priority] || configs.medium;
  return <Badge variant={c.variant}>{c.label}</Badge>;
}

export function StatusBadge({ status }: { status: TaskStatus | EventStatus }) {
  if (status === "completed") {
    return <Badge variant="acid">COMPLETED</Badge>;
  }
  if (status === "in_progress" || status === "current") {
    return <Badge variant="cyan">IN PROGRESS</Badge>;
  }
  if (status === "overdue") {
    return <Badge variant="danger">OVERDUE</Badge>;
  }
  if (status === "snoozed") {
    return <Badge variant="muted">SNOOZED</Badge>;
  }
  return <Badge variant="muted">UPCOMING</Badge>;
}
