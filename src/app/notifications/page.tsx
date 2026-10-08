"use client";

import React, { useState } from "react";
import { useOS } from "@/lib/context/OSContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Bell, Clock, ShieldAlert, Cpu, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const {
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
  } = useOS();

  const [activeTab, setActiveTab] = useState<"ALL" | "REMINDERS" | "DEADLINES" | "SYSTEM">("ALL");

  const filtered = notifications.filter((n) => {
    if (activeTab === "ALL") return true;
    return n.category === activeTab;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return <Clock className="w-4 h-4 text-[#00E5FF]" />;
      case "deadline":
        return <ShieldAlert className="w-4 h-4 text-[#FF4567]" />;
      case "system":
        return <Cpu className="w-4 h-4 text-[#B7FF3C]" />;
      default:
        return <Bell className="w-4 h-4 text-[#8B96A3]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[8px] bg-[#0F141A] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-[6px] bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans-main text-base font-semibold text-[#F4F7FA]">
              SYSTEM NOTIFICATION LOG
            </h2>
            <p className="font-mono-tech text-xs text-[#8B96A3]">
              AUDIT ALERTS & BACKGROUND STATUS MESSAGES
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={markAllNotificationsRead}
          icon={<CheckCheck className="w-4 h-4" />}
        >
          MARK ALL AS READ
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-[#0F141A] p-1.5 rounded-[6px] border border-white/[0.06] w-fit">
        {(["ALL", "REMINDERS", "DEADLINES", "SYSTEM"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-3.5 py-1.5 text-xs font-mono-tech uppercase rounded-[4px] transition-colors cursor-pointer",
              activeTab === tab
                ? "bg-[#131A21] text-[#00E5FF] font-medium border border-[#00E5FF]/30"
                : "text-[#8B96A3] hover:text-[#F4F7FA]"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-[#0F141A]/40 rounded-[8px] border border-dashed border-white/10 font-mono-tech text-xs text-[#58616B]">
            // No notifications found in this stream.
          </div>
        ) : (
          filtered.map((item) => (
            <Card
              key={item.id}
              onClick={() => markNotificationRead(item.id)}
              className={cn(
                "p-4 bg-[#0F141A] cursor-pointer transition-all relative",
                item.read
                  ? "border-white/[0.06] opacity-75"
                  : "border-[#00E5FF]/30 bg-[#131A21] shadow-[0_0_15px_rgba(0,229,255,0.05)]"
              )}
            >
              {!item.read && (
                <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
              )}

              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-white/5 shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div className="space-y-1 pr-6">
                  <div className="flex items-center gap-2">
                    <span className="font-sans-main text-sm font-semibold text-[#F4F7FA]">
                      {item.title}
                    </span>
                    <span className="font-mono-tech text-xs text-[#58616B]">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="font-sans-main text-xs text-[#8B96A3]">
                    {item.message}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
