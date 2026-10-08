"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  withCorners?: boolean;
  glow?: boolean;
}

export function Card({
  className,
  elevated = false,
  withCorners = false,
  glow = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[8px] border transition-colors",
        elevated
          ? "bg-[#131A21] border-white/10"
          : "bg-[#0F141A] border-white/[0.08]",
        withCorners && "cyber-corners",
        glow && "border-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,229,255,0.08)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "p-4 border-b border-white/[0.06] flex items-center justify-between",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4", className)} {...props}>
      {children}
    </div>
  );
}
