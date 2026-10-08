"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: "md" | "lg" | "xl";
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = "md",
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthStyles = {
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-[3px] transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex pl-10 max-w-full">
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            "w-screen bg-[#0B0F14] border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col justify-between animate-in slide-in-from-right duration-200",
            widthStyles[width]
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-[#0F141A]">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-[1px] bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
                <h2 className="font-sans-main text-sm font-semibold tracking-wider uppercase text-[#F4F7FA]">
                  {title}
                </h2>
              </div>
              {subtitle && (
                <p className="font-mono-tech text-[11px] text-[#8B96A3] mt-0.5 ml-4">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-[4px] text-[#8B96A3] hover:text-[#F4F7FA] hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
