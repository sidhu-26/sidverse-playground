"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  icon,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium font-sans-main transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none rounded-[6px] text-xs tracking-wider uppercase";

  const sizeStyles = {
    sm: "px-2.5 py-1.5 gap-1.5 text-[11px]",
    md: "px-3.5 py-2 gap-2 text-xs",
    lg: "px-5 py-2.5 gap-2.5 text-sm",
  };

  const variantStyles = {
    primary:
      "bg-[#0B151F] text-[#00E5FF] border border-[#00E5FF]/40 hover:bg-[#00E5FF]/15 hover:border-[#00E5FF] hover:shadow-[0_0_12px_rgba(0,229,255,0.25)] active:scale-[0.98]",
    secondary:
      "bg-[#0F141A] text-[#F4F7FA] border border-white/10 hover:bg-[#131A21] hover:border-white/20 active:scale-[0.98]",
    outline:
      "bg-transparent text-[#8B96A3] border border-white/10 hover:text-[#F4F7FA] hover:border-white/30",
    danger:
      "bg-[#210D12] text-[#FF4567] border border-[#FF4567]/40 hover:bg-[#FF4567]/15 hover:border-[#FF4567] active:scale-[0.98]",
    ghost:
      "bg-transparent text-[#8B96A3] hover:text-[#F4F7FA] hover:bg-white/5",
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

export function IconButton({
  className,
  variant = "ghost",
  size = "md",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}) {
  const sizeStyles = {
    sm: "w-7 h-7 p-1 text-xs",
    md: "w-8 h-8 p-1.5 text-sm",
    lg: "w-10 h-10 p-2 text-base",
  };

  const variantStyles = {
    primary:
      "bg-[#0B151F] text-[#00E5FF] border border-[#00E5FF]/40 hover:bg-[#00E5FF]/20 hover:border-[#00E5FF]",
    secondary:
      "bg-[#0F141A] text-[#8B96A3] border border-white/10 hover:text-[#F4F7FA] hover:bg-[#131A21]",
    outline:
      "bg-transparent text-[#8B96A3] border border-white/10 hover:text-[#F4F7FA] hover:border-white/25",
    danger:
      "bg-[#210D12] text-[#FF4567] border border-[#FF4567]/40 hover:bg-[#FF4567]/20",
    ghost: "bg-transparent text-[#8B96A3] hover:text-[#F4F7FA] hover:bg-white/5",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-[6px] transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
