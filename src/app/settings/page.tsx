"use client";

import React, { useState } from "react";
import { useOS } from "@/lib/context/OSContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Settings as SettingsIcon, Monitor, Bell, Clock, Keyboard, Database, Shield, Download, Upload, Check } from "lucide-react";

export default function SettingsPage() {
  const { tasks, projects, goals, duties, deadlines } = useOS();

  const [timeFormat, setTimeFormat] = useState("24h");
  const [weekStart, setWeekStart] = useState("Monday");
  const [defaultReminder, setDefaultReminder] = useState("15m");
  const [exported, setExported] = useState(false);

  const handleExportData = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      system: "SID//OS v1.0",
      tasks,
      projects,
      goals,
      duties,
      deadlines,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sidos-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  const shortcuts = [
    { key: "⌘ + K / Ctrl + K", desc: "Open Command Palette & Global Search" },
    { key: "N", desc: "Fast Task Registration" },
    { key: "E", desc: "Fast Event Schedule" },
    { key: "D", desc: "Navigate to Today Command Center" },
    { key: "S", desc: "Navigate to Schedule Timeline" },
    { key: "T", desc: "Navigate to Task Inventory" },
    { key: "ESC", desc: "Dismiss Active Modals & Drawers" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-[8px] bg-[#0F141A] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-[6px] bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans-main text-base font-semibold text-[#F4F7FA]">
              SYSTEM PREFERENCES
            </h2>
            <p className="font-mono-tech text-xs text-[#8B96A3]">
              NODE CONFIGURATION // OPERATIONAL DEFAULTS
            </p>
          </div>
        </div>

        <span className="font-mono-tech text-xs text-[#00E5FF] bg-[#00E5FF]/10 px-3 py-1.5 rounded-[6px] border border-[#00E5FF]/30">
          NODE CONFIG: ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance & Interface */}
        <Card className="p-5 bg-[#0F141A] space-y-4">
          <h3 className="font-sans-main text-xs font-semibold tracking-wider uppercase text-[#F4F7FA] flex items-center gap-2">
            <Monitor className="w-4 h-4 text-[#00E5FF]" />
            APPEARANCE & THEME
          </h3>
          <div className="space-y-3 font-mono-tech text-xs">
            <div className="flex items-center justify-between p-3 rounded bg-[#131A21] border border-white/5">
              <div>
                <div className="text-[#F4F7FA]">Visual Identity</div>
                <div className="text-[10px] text-[#58616B]">Cybercore Dark OS</div>
              </div>
              <span className="text-[#00E5FF] text-[11px] px-2 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30">
                ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded bg-[#131A21] border border-white/5">
              <div>
                <div className="text-[#F4F7FA]">Background Geometry</div>
                <div className="text-[10px] text-[#58616B]">48px Technical Grid</div>
              </div>
              <span className="text-[#B7FF3C] text-[11px] px-2 py-0.5 rounded bg-[#B7FF3C]/10 border border-[#B7FF3C]/30">
                ENABLED
              </span>
            </div>
          </div>
        </Card>

        {/* Scheduling Defaults */}
        <Card className="p-5 bg-[#0F141A] space-y-4">
          <h3 className="font-sans-main text-xs font-semibold tracking-wider uppercase text-[#F4F7FA] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#00E5FF]" />
            SCHEDULING & CHRONO
          </h3>
          <div className="space-y-3 font-mono-tech text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#8B96A3]">Time Format</span>
              <select
                value={timeFormat}
                onChange={(e) => setTimeFormat(e.target.value)}
                className="bg-[#131A21] border border-white/10 rounded px-2.5 py-1 text-xs text-[#F4F7FA] outline-none"
              >
                <option value="24h">24-Hour (18:42)</option>
                <option value="12h">12-Hour (06:42 PM)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8B96A3]">Week Starting Day</span>
              <select
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
                className="bg-[#131A21] border border-white/10 rounded px-2.5 py-1 text-xs text-[#F4F7FA] outline-none"
              >
                <option value="Monday">Monday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8B96A3]">Default Reminder Buffer</span>
              <select
                value={defaultReminder}
                onChange={(e) => setDefaultReminder(e.target.value)}
                className="bg-[#131A21] border border-white/10 rounded px-2.5 py-1 text-xs text-[#F4F7FA] outline-none"
              >
                <option value="15m">15 minutes before</option>
                <option value="30m">30 minutes before</option>
                <option value="1h">1 hour before</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Keyboard Shortcuts Sheet (Section 47) */}
        <Card className="p-5 bg-[#0F141A] space-y-4 md:col-span-2">
          <h3 className="font-sans-main text-xs font-semibold tracking-wider uppercase text-[#F4F7FA] flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-[#00E5FF]" />
            KEYBOARD SHORTCUT PROTOCOLS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {shortcuts.map((sc, i) => (
              <div
                key={i}
                className="p-2.5 rounded bg-[#131A21] border border-white/5 flex items-center justify-between text-xs"
              >
                <span className="text-[#8B96A3] font-sans-main">{sc.desc}</span>
                <span className="font-mono-tech text-[11px] text-[#00E5FF] px-2 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30">
                  {sc.key}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Data Management & FastAPI Ready */}
        <Card className="p-5 bg-[#0F141A] space-y-4 md:col-span-2">
          <h3 className="font-sans-main text-xs font-semibold tracking-wider uppercase text-[#F4F7FA] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#00E5FF]" />
            DATA ARCHITECTURE & BACKUP
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded bg-[#131A21] border border-white/10">
            <div className="space-y-1">
              <div className="font-sans-main text-sm font-semibold text-[#F4F7FA]">
                Export Local Command Center Snapshot
              </div>
              <p className="font-mono-tech text-xs text-[#8B96A3]">
                Full JSON payload ready for migration or FastAPI sync.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleExportData}
              icon={exported ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            >
              {exported ? "EXPORTED JSON" : "EXPORT SNAPSHOT"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
